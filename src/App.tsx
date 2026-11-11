import { useCallback, useState, type Dispatch, type SetStateAction } from 'react'
import { PricingSettings } from './components/PricingSettings'
import { QuoteForm } from './components/QuoteForm'
import { QuoteResult } from './components/QuoteResult'
import { RouteMap } from './components/RouteMap'
import { useI18n } from './i18n/I18nProvider'
import { GeocodeError, geocodePair } from './lib/geocode'
import { calculateQuoteAmount } from './lib/pricing'
import { RouteError, fetchRoute } from './lib/route'
import { loadPricingConfig } from './lib/storage'
import type { LatLon, PricingConfig, QuoteResult as QuoteResultType } from './types'

export default function App() {
  const { t, locale, setLocale } = useI18n()
  const [pricing, setPricing] = useState<PricingConfig>(loadPricingConfig)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const [originInput, setOriginInput] = useState(() => loadPricingConfig().baseAddress)
  const [destinationInput, setDestinationInput] = useState('')
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
          setOriginInput(next.baseAddress)
        }
        return next
      })
    },
    [],
  )

  const handleCalculate = useCallback(async () => {
    setError(null)
    setQuote(null)

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
      const points = await geocodePair(origin, destination, locale)
      setOriginPoint(points.origin)
      setDestinationPoint(points.destination)

      const route = await fetchRoute(points.origin, points.destination)
      const amount = calculateQuoteAmount(route.distanceMeters, pricing)

      setGeometry(route.geometry)
      setQuote({
        distanceMeters: route.distanceMeters,
        durationSeconds: route.durationSeconds,
        amount,
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
  }, [destinationInput, locale, originInput, pricing, t])

  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col gap-4 px-4 py-4 pb-8">
      <header className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-stone-900">
              Magic Route
            </h1>
            <p className="mt-0.5 text-sm text-stone-600">{t('app.subtitle')}</p>
          </div>
          <div
            className="flex shrink-0 rounded-lg border border-stone-200 bg-white p-0.5 text-xs font-semibold"
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
                    ? 'rounded-md bg-teal-600 px-2.5 py-1.5 text-white'
                    : 'rounded-md px-2.5 py-1.5 text-stone-600'
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
        onOriginChange={setOriginInput}
        onDestinationChange={setDestinationInput}
        onSubmit={handleCalculate}
        loading={loading}
        error={error}
      />

      <RouteMap
        origin={originPoint}
        destination={destinationPoint}
        geometry={geometry}
      />

      <QuoteResult quote={quote} />

      <footer className="mt-auto space-y-1 text-center text-xs text-stone-500">
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
      </footer>
    </div>
  )
}
