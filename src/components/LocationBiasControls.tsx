import { useI18n } from '../i18n/I18nProvider'
import type { LocationBiasStatus } from '../lib/locationBias'

interface LocationBiasControlsProps {
  status: LocationBiasStatus
  onEnable: () => void
  onDisable: () => void
  onUseAsOrigin: () => void
  useAsOriginLoading: boolean
}

export function LocationBiasControls({
  status,
  onEnable,
  onDisable,
  onUseAsOrigin,
  useAsOriginLoading,
}: LocationBiasControlsProps) {
  const { t } = useI18n()

  if (status === 'unsupported') return null

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {status === 'ready' ? (
          <>
            <button
              type="button"
              className="text-[11px] font-bold uppercase tracking-wide text-teal-800 underline-offset-2 hover:underline"
              onClick={onEnable}
            >
              {t('form.location.update')}
            </button>
            <span className="text-stone-300">|</span>
            <button
              type="button"
              className="text-[11px] font-bold uppercase tracking-wide text-stone-500 underline-offset-2 hover:underline"
              onClick={onDisable}
            >
              {t('form.location.disable')}
            </button>
          </>
        ) : (
          <button
            type="button"
            className="border border-teal-400 bg-teal-50 px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-teal-900"
            onClick={onEnable}
            disabled={status === 'loading'}
          >
            {status === 'loading'
              ? t('form.location.loading')
              : t('form.location.enable')}
          </button>
        )}

        {status === 'ready' && (
          <button
            type="button"
            className="border border-teal-600 bg-teal-700 px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-white disabled:opacity-60"
            onClick={onUseAsOrigin}
            disabled={useAsOriginLoading}
          >
            {useAsOriginLoading
              ? t('form.location.loading')
              : t('form.location.useAsOrigin')}
          </button>
        )}
      </div>

      {status === 'denied' && (
        <p className="text-xs text-amber-900">{t('form.location.denied')}</p>
      )}

      {status === 'ready' && (
        <p className="text-[11px] leading-snug text-stone-500">
          {t('form.location.hintNearby')}
        </p>
      )}
    </div>
  )
}
