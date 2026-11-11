import { useEffect } from 'react'
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import type { LatLon } from '../types'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

function FitRoute({
  origin,
  destination,
  geometry,
}: {
  origin: LatLon | null
  destination: LatLon | null
  geometry: GeoJSON.LineString | null
}) {
  const map = useMap()

  useEffect(() => {
    if (!geometry && origin && destination) {
      map.fitBounds(
        L.latLngBounds(
          [origin.lat, origin.lon],
          [destination.lat, destination.lon],
        ),
        { padding: [28, 28] },
      )
      return
    }
    if (geometry?.coordinates?.length) {
      const latlngs = geometry.coordinates.map(
        ([lon, lat]) => [lat, lon] as [number, number],
      )
      map.fitBounds(latlngs, { padding: [28, 28] })
    }
  }, [map, origin, destination, geometry])

  return null
}

interface RouteMapProps {
  origin: LatLon | null
  destination: LatLon | null
  geometry: GeoJSON.LineString | null
}

const DEFAULT_CENTER: [number, number] = [-15.793889, -47.882778]

export function RouteMap({ origin, destination, geometry }: RouteMapProps) {
  const center: [number, number] = origin
    ? [origin.lat, origin.lon]
    : DEFAULT_CENTER

  const linePositions =
    geometry?.coordinates.map(([lon, lat]) => [lat, lon] as [number, number]) ??
    []

  return (
    <div className="h-[42vh] min-h-[220px] w-full overflow-hidden rounded-2xl border border-stone-200 shadow-sm">
      <MapContainer
        center={center}
        zoom={origin ? 13 : 4}
        className="h-full w-full"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitRoute origin={origin} destination={destination} geometry={geometry} />
        {origin && <Marker position={[origin.lat, origin.lon]} />}
        {destination && <Marker position={[destination.lat, destination.lon]} />}
        {linePositions.length > 0 && (
          <Polyline positions={linePositions} pathOptions={{ color: '#0d9488', weight: 5 }} />
        )}
      </MapContainer>
    </div>
  )
}
