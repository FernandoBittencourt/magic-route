import { useEffect, type Dispatch, type SetStateAction } from 'react'
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
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-stone-800"
        aria-expanded={open}
      >
        <span>{t('settings.title')}</span>
        <span className="text-teal-700" aria-hidden>
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <div className="space-y-4 border-t border-stone-100 px-4 py-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-stone-600">
              {t('settings.ratePerKm')} ({currencySuffix})
            </span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              step="0.5"
              value={config.ratePerKm}
              onChange={(e) =>
                onChange((c) => ({
                  ...c,
                  ratePerKm: Number.parseFloat(e.target.value) || 0,
                }))
              }
              className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-base outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-stone-600">
              {t('settings.baseAddress')}
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
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    value={config.minDistanceMeters}
                    onChange={(e) =>
                      onChange((c) => ({
                        ...c,
                        minDistanceMeters:
                          Number.parseInt(e.target.value, 10) || 1000,
                      }))
                    }
                    className="w-full rounded-lg border border-stone-200 px-3 py-2 text-base"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs text-stone-600">
                    {t('settings.min.amount')}
                  </span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.01"
                    value={config.minAmount}
                    onChange={(e) =>
                      onChange((c) => ({
                        ...c,
                        minAmount: Number.parseFloat(e.target.value) || 0,
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
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  value={config.maxAmount}
                  onChange={(e) =>
                    onChange((c) => ({
                      ...c,
                      maxAmount: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-base"
                />
              </label>
            )}
          </fieldset>
        </div>
      )}
    </section>
  )
}
