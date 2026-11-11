import type { Locale } from '../types'

export interface PhotonSuggestion {
  label: string
  lat: number
  lon: number
}

interface PhotonProperties {
  name?: string
  street?: string
  housenumber?: string
  city?: string
  state?: string
  country?: string
  postcode?: string
  osm_value?: string
}

interface PhotonFeature {
  geometry: { type: string; coordinates: [number, number] }
  properties: PhotonProperties
}

interface PhotonGeoJson {
  features: PhotonFeature[]
}

/** Photon supports `de`, `en`, `fr`, and default — not `pt`; omit for PT UI. */
function photonLangParam(locale: Locale): string | null {
  return locale === 'en' ? 'en' : null
}

function formatPhotonLabel(properties: PhotonProperties): string {
  const parts: string[] = []
  const streetLine = [properties.street, properties.housenumber]
    .filter(Boolean)
    .join(', ')
  if (streetLine) parts.push(streetLine)
  else if (properties.name) parts.push(properties.name)
  else if (properties.osm_value) parts.push(properties.osm_value)

  const locality = [properties.city, properties.state]
    .filter(Boolean)
    .join(' — ')
  if (locality) parts.push(locality)
  if (properties.country) parts.push(properties.country)

  return parts.length > 0 ? parts.join(', ') : '—'
}

function featureToSuggestion(feature: PhotonFeature): PhotonSuggestion {
  const [lon, lat] = feature.geometry.coordinates
  return {
    label: formatPhotonLabel(feature.properties),
    lat,
    lon,
  }
}

export function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === 'AbortError'
}

export async function searchPhoton(
  query: string,
  locale: Locale,
  options: { bias?: { lat: number; lon: number } | null; signal?: AbortSignal },
): Promise<PhotonSuggestion[]> {
  const trimmed = query.trim()
  if (trimmed.length < 3) return []

  const params = new URLSearchParams({
    q: trimmed,
    limit: '5',
  })
  const lang = photonLangParam(locale)
  if (lang) params.set('lang', lang)

  if (options.bias) {
    params.set('lat', String(options.bias.lat))
    params.set('lon', String(options.bias.lon))
  }

  const response = await fetch(
    `https://photon.komoot.io/api/?${params.toString()}`,
    { signal: options.signal },
  )

  if (!response.ok) {
    throw new Error('photon_network')
  }

  const data = (await response.json()) as PhotonGeoJson
  return (data.features ?? []).map(featureToSuggestion)
}

export async function reversePhoton(
  lat: number,
  lon: number,
  locale: Locale,
  signal?: AbortSignal,
): Promise<PhotonSuggestion | null> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
  })
  const lang = photonLangParam(locale)
  if (lang) params.set('lang', lang)

  const response = await fetch(
    `https://photon.komoot.io/reverse?${params.toString()}`,
    { signal },
  )

  if (!response.ok) {
    throw new Error('photon_network')
  }

  const data = (await response.json()) as PhotonGeoJson
  const feature = data.features?.[0]
  if (!feature) return null
  return featureToSuggestion(feature)
}
