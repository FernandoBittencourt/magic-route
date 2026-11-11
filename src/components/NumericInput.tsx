import { useEffect, useRef, useState, type InputHTMLAttributes } from 'react'

interface NumericInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number
  onValueChange: (value: number) => void
  integer?: boolean
  emptyFallback?: number
}

export function NumericInput({
  value,
  onValueChange,
  integer = false,
  emptyFallback = 0,
  ...rest
}: NumericInputProps) {
  const focused = useRef(false)
  const [draft, setDraft] = useState(() => formatDraft(value, integer))

  useEffect(() => {
    if (!focused.current) {
      setDraft(formatDraft(value, integer))
    }
  }, [value, integer])

  const commit = (raw: string) => {
    const normalized = integer ? raw.trim() : normalizeDecimal(raw)
    if (normalized === '') {
      onValueChange(emptyFallback)
      setDraft(String(emptyFallback))
      return
    }
    const parsed = integer
      ? Number.parseInt(normalized, 10)
      : Number.parseFloat(normalized)
    if (Number.isFinite(parsed)) {
      onValueChange(parsed)
      setDraft(formatDraft(parsed, integer))
    } else {
      onValueChange(emptyFallback)
      setDraft(String(emptyFallback))
    }
  }

  return (
    <input
      {...rest}
      type="text"
      inputMode={integer ? 'numeric' : 'decimal'}
      value={draft}
      onFocus={(e) => {
        focused.current = true
        rest.onFocus?.(e)
      }}
      onChange={(e) => {
        const raw = e.target.value
        if (integer) {
          if (!/^-?\d*$/.test(raw)) return
          setDraft(raw)
          if (/^\d+$/.test(raw)) {
            const parsed = Number.parseInt(raw, 10)
            if (Number.isFinite(parsed)) onValueChange(parsed)
          }
          return
        }
        const normalized = raw.replace(',', '.')
        if (!/^-?\d*\.?\d*$/.test(normalized)) return
        setDraft(raw.includes(',') ? raw : normalized)
        if (/^\d+(\.\d+)?$/.test(normalized)) {
          const parsed = Number.parseFloat(normalized)
          if (Number.isFinite(parsed)) onValueChange(parsed)
        }
      }}
      onBlur={(e) => {
        focused.current = false
        commit(draft)
        rest.onBlur?.(e)
      }}
    />
  )
}

function normalizeDecimal(raw: string): string {
  return raw.trim().replace(',', '.')
}

function formatDraft(value: number, integer: boolean): string {
  if (!Number.isFinite(value)) return ''
  return integer ? String(Math.trunc(value)) : String(value)
}
