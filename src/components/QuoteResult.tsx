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
      className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-4 shadow-sm"
      aria-live="polite"
    >
      <h2 className="mb-3 text-sm font-semibold text-teal-900">
        {t('result.title')}
      </h2>
      <dl className="space-y-2 text-sm text-stone-700">
        <div className="flex justify-between gap-4">
          <dt>{t('result.distance')}</dt>
          <dd className="text-right font-medium">
            {formatDistance(quote.distanceMeters, locale)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>{t('result.duration')}</dt>
          <dd className="text-right font-medium">
            {formatDuration(quote.durationSeconds, locale)}
          </dd>
        </div>
        <div className="flex justify-between gap-4 text-stone-600">
          <dt>{t('result.proportional')}</dt>
          <dd className="text-right">
            {formatMoney(quote.proportionalAmount, locale)}
          </dd>
        </div>
        {quote.minRuleApplied && (
          <p className="rounded-lg bg-white/80 px-2 py-1 text-xs font-medium text-teal-900">
            {t('result.minApplied')}
          </p>
        )}
        {quote.maxRuleApplied && (
          <p className="rounded-lg bg-white/80 px-2 py-1 text-xs font-medium text-teal-900">
            {t('result.maxApplied')}
          </p>
        )}
        {quote.roundToTenApplied && (
          <p className="rounded-lg bg-white/80 px-2 py-1 text-xs font-medium text-teal-900">
            {t('result.roundToTenApplied')} (
            {formatMoney(quote.amountBeforeRoundToTen, locale)} →{' '}
            {formatMoney(quote.amount, locale)})
          </p>
        )}
        <div className="flex justify-between gap-4 border-t border-teal-100 pt-3 text-base">
          <dt className="font-semibold text-stone-900">{t('result.price')}</dt>
          <dd className="text-right text-xl font-bold text-teal-800">
            {formatMoney(quote.amount, locale)}
          </dd>
        </div>
      </dl>
    </section>
  )
}
