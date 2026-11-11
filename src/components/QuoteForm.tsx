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
      className="receipt-surface space-y-3 p-4"
    >
      <p className="text-[11px] leading-relaxed text-stone-500">
        {t('form.addressHint')}
      </p>

      <label className="block space-y-1">
        <span className="receipt-label">{t('form.origin')}</span>
        <input
          type="text"
          autoComplete="street-address"
          value={origin}
          onChange={(e) => onOriginChange(e.target.value)}
          className="input-receipt receipt-mono text-sm"
        />
      </label>

      <label className="block space-y-1">
        <span className="receipt-label">{t('form.destination')}</span>
        <input
          type="text"
          autoComplete="street-address"
          value={destination}
          onChange={(e) => onDestinationChange(e.target.value)}
          className="input-receipt receipt-mono text-sm"
        />
      </label>

      {error && (
        <p
          className="border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950"
          role="alert"
        >
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-receipt">
        {loading ? t('form.calculating') : t('form.calculate')}
      </button>
    </form>
  )
}
