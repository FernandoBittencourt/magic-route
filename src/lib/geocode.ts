import type { LatLon, Locale } from '../types'

const USER_AGENT = 'MagicRoute/1.0 (GitHub Pages; fernando-bittencourt/magic-route)'
const NOMINATIM = 'https://nominatim.openstreetmap.org/search'

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export class GeocodeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GeocodeError'
  }
}

interface NominatimHit {
  lat: string
  lon: string
  display_name: string
}

export async function geocodeAddress(
  query: string,
  locale: Locale,
): Promise<LatLon> {
  const trimmed = query.trim()
  if (!trimmed) {
    throw new GeocodeError('empty')
  }

  const params = new URLSearchParams({
    format: 'json',
    limit: '1',
    q: trimmed,
  })

  if (locale === 'pt') {
    params.set('accept-language', 'pt-BR,pt')
    params.set('countrycodes', 'br')
  } else {
    params.set('accept-language', 'en')
  }

  const response = await fetch(`${NOMINATIM}?${params.toString()}`, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new GeocodeError('network')
  }

  const data = (await response.json()) as NominatimHit[]
  if (!data.length) {
    throw new GeocodeError('notFound')
  }

  const hit = data[0]
  return {
    lat: Number.parseFloat(hit.lat),
    lon: Number.parseFloat(hit.lon),
    displayName: hit.display_name,
  }
}

/** Use Photon/Nominatim-resolved coords when present; otherwise geocode text on submit. */
export async function resolveLatLon(
  text: string,
  locale: Locale,
  resolved: LatLon | null,
): Promise<LatLon> {
  if (resolved) return resolved
  return geocodeAddress(text, locale)
}

/** Geocode origin then destination with Nominatim rate-limit gap. */
export async function geocodePair(
  origin: string,
  destination: string,
  locale: Locale,
): Promise<{ origin: LatLon; destination: LatLon }> {
  const from = await geocodeAddress(origin, locale)
  await sleep(1100)
  const to = await geocodeAddress(destination, locale)
  return { origin: from, destination: to }
}
