import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { useI18n } from '../i18n/I18nProvider'
import type { LocationBias } from '../lib/locationBias'
import {
  isAbortError,
  searchPhoton,
  type PhotonSuggestion,
} from '../lib/photon'

const DEBOUNCE_MS = 400

export interface AddressPick {
  label: string
  lat: number
  lon: number
}

interface AddressAutocompleteProps {
  id?: string
  label: string
  value: string
  onChange: (value: string) => void
  onSelect: (pick: AddressPick) => void
  bias: LocationBias | null
}

export function AddressAutocomplete({
  id,
  label,
  value,
  onChange,
  onSelect,
  bias,
}: AddressAutocompleteProps) {
  const { t, locale } = useI18n()
  const listId = useId()
  const abortRef = useRef<AbortController | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<PhotonSuggestion[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    if (value.trim().length < 3) {
      abortRef.current?.abort()
      setSuggestions([])
      setOpen(false)
      setLoading(false)
      setFetchError(false)
      return
    }

    const timer = window.setTimeout(async () => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller
      setLoading(true)
      setFetchError(false)

      try {
        const results = await searchPhoton(value, locale, {
          bias,
          signal: controller.signal,
        })
        if (controller.signal.aborted) return
        setSuggestions(results)
        setOpen(true)
        setActiveIndex(results.length > 0 ? 0 : -1)
      } catch (err) {
        if (isAbortError(err)) return
        setFetchError(true)
        setSuggestions([])
        setOpen(false)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [value, locale, bias])

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const pick = useCallback(
    (item: PhotonSuggestion) => {
      onSelect({ label: item.label, lat: item.lat, lon: item.lon })
      setOpen(false)
      setSuggestions([])
    },
    [onSelect],
  )

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) {
      if (e.key === 'Escape') setOpen(false)
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      pick(suggestions[activeIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const showEmpty =
    open && !loading && value.trim().length >= 3 && suggestions.length === 0

  return (
    <div ref={wrapperRef} className="relative block space-y-1">
      <span className="receipt-label">{label}</span>
      <input
        id={id}
        type="text"
        autoComplete="street-address"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        onFocus={() => {
          if (suggestions.length > 0) setOpen(true)
        }}
        onKeyDown={onKeyDown}
        className="input-receipt receipt-mono w-full text-sm"
      />

      {loading && (
        <p className="absolute right-2 top-[calc(100%-2rem)] text-[10px] text-teal-700">
          {t('form.autocomplete.loading')}
        </p>
      )}

      {open && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="receipt-surface absolute z-30 mt-0.5 max-h-48 w-full overflow-y-auto border-teal-600 py-1 shadow-md"
        >
          {suggestions.map((item, index) => (
            <li key={`${item.lat}-${item.lon}-${index}`} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={
                  index === activeIndex
                    ? 'w-full px-3 py-2.5 text-left text-sm bg-teal-50 text-teal-950'
                    : 'w-full px-3 py-2.5 text-left text-sm text-stone-800 hover:bg-teal-50/80'
                }
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(item)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      {showEmpty && !fetchError && (
        <p className="receipt-surface absolute z-30 mt-0.5 w-full px-3 py-2 text-xs text-stone-500">
          {t('form.autocomplete.empty')}
        </p>
      )}

      {fetchError && (
        <p className="text-xs text-amber-900">{t('form.autocomplete.error')}</p>
      )}
    </div>
  )
}
