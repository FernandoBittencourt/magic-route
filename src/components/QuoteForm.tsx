import type { FormEvent } from 'react'
import { useI18n } from '../i18n/I18nProvider'
import type { LocationBias, LocationBiasStatus } from '../lib/locationBias'
import {
  AddressAutocomplete,
  type AddressPick,
} from './AddressAutocomplete'
import { LocationBiasControls } from './LocationBiasControls'

interface QuoteFormProps {
  origin: string
  destination: string
  onOriginChange: (value: string) => void
  onDestinationChange: (value: string) => void
  onOriginSelect: (pick: AddressPick) => void
  onDestinationSelect: (pick: AddressPick) => void
  locationStatus: LocationBiasStatus
  onLocationEnable: () => void
  onLocationDisable: () => void
  onUseAsOrigin: () => void
  useAsOriginLoading: boolean
  locationBias: LocationBias | null
  onSubmit: () => void
  loading: boolean
  error: string | null
}

export function QuoteForm({
  origin,
  destination,
  onOriginChange,
  onDestinationChange,
  onOriginSelect,
  onDestinationSelect,
  locationStatus,
  onLocationEnable,
  onLocationDisable,
  onUseAsOrigin,
  useAsOriginLoading,
  locationBias,
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
      <LocationBiasControls
        status={locationStatus}
        onEnable={onLocationEnable}
        onDisable={onLocationDisable}
        onUseAsOrigin={onUseAsOrigin}
        useAsOriginLoading={useAsOriginLoading}
      />

      <p className="text-[11px] leading-relaxed text-stone-500">
        {t('form.addressHint')}
      </p>

      <AddressAutocomplete
        label={t('form.origin')}
        value={origin}
        onChange={onOriginChange}
        onSelect={onOriginSelect}
        bias={locationBias}
      />

      <AddressAutocomplete
        label={t('form.destination')}
        value={destination}
        onChange={onDestinationChange}
        onSelect={onDestinationSelect}
        bias={locationBias}
      />

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
