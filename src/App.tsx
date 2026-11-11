import {
  useCallback,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import type { AddressPick } from './components/AddressAutocomplete'
import { PricingSettings } from './components/PricingSettings'
import { QuoteForm } from './components/QuoteForm'
import { QuoteResult } from './components/QuoteResult'
import { RouteMap } from './components/RouteMap'
import { useI18n } from './i18n/I18nProvider'
import { GeocodeError, resolveLatLon } from './lib/geocode'
import { useLocationBias } from './lib/locationBias'
import { calculateQuote } from './lib/pricing'
import { reversePhoton } from './lib/photon'
import { RouteError, fetchRoute } from './lib/route'
import { loadPricingConfig } from './lib/storage'
import type { LatLon, PricingConfig, QuoteResult as QuoteResultType } from './types'

function pickToLatLon(pick: AddressPick): LatLon {
  return {
    lat: pick.lat,
    lon: pick.lon,
    displayName: pick.label,
  }
}

export default function App() {
  const { t, locale, setLocale } = useI18n()
  const initialPricing = loadPricingConfig()
  const [pricing, setPricing] = useState<PricingConfig>(initialPricing)
  const pricingRef = useRef<PricingConfig>(initialPricing)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const { bias, status: locationStatus, requestLocation, disableLocation } =
    useLocationBias()

  const [originInput, setOriginInput] = useState(() => loadPricingConfig().baseAddress)
  const [destinationInput, setDestinationInput] = useState('')
  const [originResolved, setOriginResolved] = useState<LatLon | null>(null)
  const [destinationResolved, setDestinationResolved] = useState<LatLon | null>(null)
  const [useAsOriginLoading, setUseAsOriginLoading] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [originPoint, setOriginPoint] = useState<LatLon | null>(null)
  const [destinationPoint, setDestinationPoint] = useState<LatLon | null>(null)
  const [geometry, setGeometry] = useState<GeoJSON.LineString | null>(null)
  const [quote, setQuote] = useState<QuoteResultType | null>(null)

  const updatePricing: Dispatch<SetStateAction<PricingConfig>> = useCallback(
    (action) => {
      setPricing((prev) => {
        const next = typeof action === 'function' ? action(prev) : action
        if (next.baseAddress !== prev.baseAddress) {
          setOriginInput((origin) =>
            origin === '' || origin === prev.baseAddress
              ? next.baseAddress
              : origin,
          )
          setOriginResolved(null)
        }
        pricingRef.current = next
        return next
      })
    },
    [],
  )

  const handleOriginChange = useCallback((value: string) => {
    setOriginInput(value)
    setOriginResolved(null)
  }, [])

  const handleDestinationChange = useCallback((value: string) => {
    setDestinationInput(value)
    setDestinationResolved(null)
  }, [])

  const handleOriginSelect = useCallback((pick: AddressPick) => {
    setOriginInput(pick.label)
    setOriginResolved(pickToLatLon(pick))
  }, [])

  const handleDestinationSelect = useCallback((pick: AddressPick) => {
    setDestinationInput(pick.label)
    setDestinationResolved(pickToLatLon(pick))
  }, [])

  const handleLocationEnable = useCallback(async () => {
    setError(null)
    await requestLocation()
  }, [requestLocation])

  const handleUseAsOrigin = useCallback(async () => {
    setError(null)
    setUseAsOriginLoading(true)
    try {
      let coords = bias
      if (!coords) {
        coords = await requestLocation()
      }
      if (!coords) return

      const suggestion = await reversePhoton(coords.lat, coords.lon, locale)
      if (!suggestion) {
        setError(t('errors.geocodeNotFound'))
        return
      }
      setOriginInput(suggestion.label)
      setOriginResolved({
        lat: suggestion.lat,
        lon: suggestion.lon,
        displayName: suggestion.label,
      })
    } catch {
      setError(t('errors.geocodeNetwork'))
    } finally {
      setUseAsOriginLoading(false)
    }
  }, [bias, locale, requestLocation, t])

  const handleCalculate = useCallback(async () => {
    setError(null)
    setQuote(null)

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    const origin = originInput.trim()
    const destination = destinationInput.trim()

    if (!origin) {
      setError(t('errors.emptyOrigin'))
      return
    }
    if (!destination) {
      setError(t('errors.emptyDestination'))
      return
    }

    setLoading(true)
    try {
      const from = await resolveLatLon(origin, locale, originResolved)
      const to = await resolveLatLon(destination, locale, destinationResolved)
      setOriginPoint(from)
      setDestinationPoint(to)

      const route = await fetchRoute(from, to)
      const breakdown = calculateQuote(route.distanceMeters, pricingRef.current)

      setGeometry(route.geometry)
      setQuote({
        distanceMeters: route.distanceMeters,
        durationSeconds: route.durationSeconds,
        amount: breakdown.amount,
        proportionalAmount: breakdown.proportionalAmount,
        minRuleApplied: breakdown.minRuleApplied,
        maxRuleApplied: breakdown.maxRuleApplied,
        roundToTenApplied: breakdown.roundToTenApplied,
        amountBeforeRoundToTen: breakdown.amountBeforeRoundToTen,
        geometry: route.geometry,
      })
    } catch (err) {
      if (err instanceof GeocodeError) {
        if (err.message === 'notFound') setError(t('errors.geocodeNotFound'))
        else if (err.message === 'network') setError(t('errors.geocodeNetwork'))
        else setError(t('errors.generic'))
      } else if (err instanceof RouteError) {
        setError(t('errors.routeFailed'))
      } else {
        setError(t('errors.generic'))
      }
    } finally {
      setLoading(false)
    }
  }, [
    destinationInput,
    destinationResolved,
    locale,
    originInput,
    originResolved,
    t,
  ])

  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col gap-3 px-4 py-4 pb-8">
      <header className="header-rule">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-base font-extrabold tracking-[0.14em] text-teal-950">
              MAGIC ROUTE
            </h1>
            <p className="mt-1 text-xs leading-snug text-stone-600">
              {t('app.subtitle')}
            </p>
          </div>
          <div
            className="flex shrink-0 border border-teal-300 bg-white p-0.5 text-[10px] font-bold"
            role="group"
            aria-label="Language"
          >
            {(['pt', 'en'] as const).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setLocale(loc)}
                className={
                  locale === loc
                    ? 'bg-teal-700 px-2.5 py-1.5 text-white'
                    : 'px-2.5 py-1.5 text-stone-600'
                }
              >
                {t(loc === 'pt' ? 'locale.pt' : 'locale.en')}
              </button>
            ))}
          </div>
        </div>
      </header>

      <PricingSettings
        config={pricing}
        onChange={updatePricing}
        open={settingsOpen}
        onToggle={() => setSettingsOpen((v) => !v)}
      />

      <QuoteForm
        origin={originInput}
        destination={destinationInput}
        onOriginChange={handleOriginChange}
        onDestinationChange={handleDestinationChange}
        onOriginSelect={handleOriginSelect}
        onDestinationSelect={handleDestinationSelect}
        locationStatus={locationStatus}
        onLocationEnable={handleLocationEnable}
        onLocationDisable={disableLocation}
        onUseAsOrigin={handleUseAsOrigin}
        useAsOriginLoading={useAsOriginLoading}
        locationBias={bias}
        onSubmit={handleCalculate}
        loading={loading}
        error={error}
      />

      <RouteMap
        origin={originPoint}
        destination={destinationPoint}
        geometry={geometry}
        userLocation={bias}
      />

      <QuoteResult quote={quote} />

      <footer className="mt-auto space-y-1 border-t border-teal-200/80 pt-3 text-center text-[10px] uppercase tracking-wide text-stone-500">
        <p>
          <a
            href="https://www.openstreetmap.org/copyright"
            className="underline-offset-2 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {t('attribution.osm')}
          </a>
        </p>
        <p>{t('attribution.osrm')}</p>
        <p>
          <a
            href="https://photon.komoot.io/"
            className="underline-offset-2 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {t('attribution.photon')}
          </a>
        </p>
      </footer>
    </div>
  )
}
