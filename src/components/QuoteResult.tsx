import { useI18n } from '../i18n/I18nProvider'
import {
  formatDistance,
  formatDuration,
  formatMoney,
} from '../lib/formatMoney'
import type { QuoteResult as QuoteResultType } from '../types'

interface QuoteResultProps {
  quote: QuoteResultType | null
}

export function QuoteResult({ quote }: QuoteResultProps) {
  const { t, locale } = useI18n()

  if (!quote) return null

  return (
    <section
      className="receipt-surface-dashed p-4"
      aria-live="polite"
    >
      <p className="receipt-label mb-3 text-center text-teal-800">
        {t('result.receiptBanner')}
      </p>
      <dl className="space-y-2 text-sm text-stone-800">
        <div className="flex justify-between gap-4">
          <dt className="receipt-label text-stone-700">{t('result.distance')}</dt>
          <dd className="receipt-mono text-right text-sm font-medium">
            {formatDistance(quote.distanceMeters, locale)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="receipt-label text-stone-700">{t('result.duration')}</dt>
          <dd className="receipt-mono text-right text-sm font-medium">
            {formatDuration(quote.durationSeconds, locale)}
          </dd>
        </div>
        <div className="flex justify-between gap-4 text-stone-600">
          <dt className="receipt-label">{t('result.proportional')}</dt>
          <dd className="receipt-mono text-right text-sm">
            {formatMoney(quote.proportionalAmount, locale)}
          </dd>
        </div>
        {quote.minRuleApplied && (
          <p className="border border-teal-100 bg-teal-50/50 px-2 py-1 text-xs text-teal-950">
            {t('result.minApplied')}
          </p>
        )}
        {quote.maxRuleApplied && (
          <p className="border border-teal-100 bg-teal-50/50 px-2 py-1 text-xs text-teal-950">
            {t('result.maxApplied')}
          </p>
        )}
        {quote.roundToTenApplied && (
          <p className="border border-teal-100 bg-teal-50/50 px-2 py-1 text-xs text-teal-950">
            {t('result.roundToTenApplied')} (
            <span className="receipt-mono">
              {formatMoney(quote.amountBeforeRoundToTen, locale)} →{' '}
              {formatMoney(quote.amount, locale)}
            </span>
            )
          </p>
        )}
        <div className="flex justify-between gap-4 border-t border-teal-300 pt-3">
          <dt className="receipt-label text-teal-950">{t('result.price')}</dt>
          <dd className="receipt-mono text-right text-2xl font-extrabold text-teal-700">
            {formatMoney(quote.amount, locale)}
          </dd>
        </div>
      </dl>
    </section>
  )
}
