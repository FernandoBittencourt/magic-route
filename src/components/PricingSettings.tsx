import { useEffect, type Dispatch, type SetStateAction } from 'react'
import { NumericInput } from './NumericInput'
import { useI18n } from '../i18n/I18nProvider'
import { savePricingConfig } from '../lib/storage'
import type { PricingConfig } from '../types'

interface PricingSettingsProps {
  config: PricingConfig
  onChange: Dispatch<SetStateAction<PricingConfig>>
  open: boolean
  onToggle: () => void
}

function useDebouncedSave(config: PricingConfig) {
  useEffect(() => {
    const id = window.setTimeout(() => savePricingConfig(config), 400)
    return () => window.clearTimeout(id)
  }, [config])
}

export function PricingSettings({
  config,
  onChange,
  open,
  onToggle,
}: PricingSettingsProps) {
  const { t, locale } = useI18n()
  useDebouncedSave(config)

  const currencySuffix = locale === 'pt' ? 'R$/km' : '$/km'

  return (
    <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-stone-900">
            {t('header.settings')}
          </span>
          <span className="mt-0.5 block text-xs text-stone-500">
            {t('settings.panelHint')}
          </span>
        </span>
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-lg font-medium text-white"
          aria-hidden
        >
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <div className="space-y-4 border-t border-stone-100 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-800/80">
            {t('settings.title')}
          </p>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-stone-600">
              {t('settings.ratePerKm')} ({currencySuffix})
            </span>
            <NumericInput
              value={config.ratePerKm}
              emptyFallback={0}
              onValueChange={(ratePerKm) =>
                onChange((c) => ({ ...c, ratePerKm: Math.max(0, ratePerKm) }))
              }
              className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-base outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-stone-600">
              {t('settings.baseAddress')}
            </span>
            <span className="block text-xs leading-relaxed text-stone-500">
              {t('settings.baseAddressHint')}
            </span>
            <input
              type="text"
              value={config.baseAddress}
              onChange={(e) =>
                onChange((c) => ({ ...c, baseAddress: e.target.value }))
              }
              className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-base outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </label>

          <fieldset className="space-y-3 rounded-xl bg-stone-50 p-3">
            <legend className="text-xs font-semibold text-stone-700">
              {t('settings.min.title')}
            </legend>
            <label className="flex items-center gap-2 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={config.minEnabled}
                onChange={(e) =>
                  onChange((c) => ({ ...c, minEnabled: e.target.checked }))
                }
                className="size-4 rounded border-stone-300 text-teal-600"
              />
              {t('settings.min.enabled')}
            </label>
            {config.minEnabled && (
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-xs text-stone-600">
                    {t('settings.min.distance')}
                  </span>
                  <NumericInput
                    integer
                    value={config.minDistanceMeters}
                    emptyFallback={1000}
                    onValueChange={(minDistanceMeters) =>
                      onChange((c) => ({
                        ...c,
                        minDistanceMeters: Math.max(1, minDistanceMeters),
                      }))
                    }
                    className="w-full rounded-lg border border-stone-200 px-3 py-2 text-base"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs text-stone-600">
                    {t('settings.min.amount')}
                  </span>
                  <NumericInput
                    value={config.minAmount}
                    emptyFallback={0}
                    onValueChange={(minAmount) =>
                      onChange((c) => ({
                        ...c,
                        minAmount: Math.max(0, minAmount),
                      }))
                    }
                    className="w-full rounded-lg border border-stone-200 px-3 py-2 text-base"
                  />
                </label>
              </div>
            )}
          </fieldset>

          <fieldset className="space-y-3 rounded-xl bg-stone-50 p-3">
            <legend className="text-xs font-semibold text-stone-700">
              {t('settings.max.title')}
            </legend>
            <label className="flex items-center gap-2 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={config.maxEnabled}
                onChange={(e) =>
                  onChange((c) => ({ ...c, maxEnabled: e.target.checked }))
                }
                className="size-4 rounded border-stone-300 text-teal-600"
              />
              {t('settings.max.enabled')}
            </label>
            {config.maxEnabled && (
              <label className="block space-y-1.5">
                <span className="text-xs text-stone-600">
                  {t('settings.max.amount')}
                </span>
                <NumericInput
                  value={config.maxAmount}
                  emptyFallback={0}
                  onValueChange={(maxAmount) =>
                    onChange((c) => ({
                      ...c,
                      maxAmount: Math.max(0, maxAmount),
                    }))
                  }
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-base"
                />
              </label>
            )}
          </fieldset>

          <fieldset className="space-y-3 rounded-xl bg-stone-50 p-3">
            <legend className="text-xs font-semibold text-stone-700">
              {t('settings.roundToTen.title')}
            </legend>
            <label className="flex items-center gap-2 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={config.roundToTenEnabled}
                onChange={(e) =>
                  onChange((c) => ({
                    ...c,
                    roundToTenEnabled: e.target.checked,
                  }))
                }
                className="size-4 rounded border-stone-300 text-teal-600"
              />
              {t('settings.roundToTen.enabled')}
            </label>
          </fieldset>
        </div>
      )}
    </section>
  )
}
