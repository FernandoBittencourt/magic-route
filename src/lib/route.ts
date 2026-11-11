import type { LatLon, RouteResult } from '../types'

const OSRM_BASE =
  'https://routing.openstreetmap.de/routed-car/route/v1/driving'

export class RouteError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RouteError'
  }
}

interface OsrmRouteResponse {
  code: string
  routes?: Array<{
    distance: number
    duration: number
    geometry: GeoJSON.LineString
  }>
}

export async function fetchRoute(
  from: LatLon,
  to: LatLon,
): Promise<RouteResult> {
  const coords = `${from.lon},${from.lat};${to.lon},${to.lat}`
  const params = new URLSearchParams({
    overview: 'full',
    geometries: 'geojson',
    steps: 'false',
  })

  const url = `${OSRM_BASE}/${coords}?${params.toString()}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new RouteError('network')
  }

  const data = (await response.json()) as OsrmRouteResponse
  if (data.code !== 'Ok' || !data.routes?.length) {
    throw new RouteError('noRoute')
  }

  const route = data.routes[0]
  return {
    distanceMeters: route.distance,
    durationSeconds: route.duration,
    geometry: route.geometry,
  }
}
