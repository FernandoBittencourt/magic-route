import type { FormEvent } from 'react'
import { useI18n } from '../i18n/I18nProvider'

interface QuoteFormProps {
  origin: string
  destination: string
  onOriginChange: (value: string) => void
  onDestinationChange: (value: string) => void
  onSubmit: () => void
  loading: boolean
  error: string | null
}

export function QuoteForm({
  origin,
  destination,
  onOriginChange,
  onDestinationChange,
  onSubmit,
  loading,
  error,
}: QuoteFormProps) {
  const { t } = useI18n()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
    >
      <p className="text-xs leading-relaxed text-stone-500">{t('form.addressHint')}</p>

      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-stone-600">{t('form.origin')}</span>
        <input
          type="text"
          autoComplete="street-address"
          value={origin}
          onChange={(e) => onOriginChange(e.target.value)}
          className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-base outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-stone-600">
          {t('form.destination')}
        </span>
        <input
          type="text"
          autoComplete="street-address"
          value={destination}
          onChange={(e) => onDestinationChange(e.target.value)}
          className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-base outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
        />
      </label>

      {error && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-teal-600 px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? t('form.calculating') : t('form.calculate')}
      </button>
    </form>
  )
}
