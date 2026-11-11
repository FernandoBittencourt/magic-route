export type Locale = 'pt' | 'en'

export interface PricingConfig {
  ratePerKm: number
  minEnabled: boolean
  minDistanceMeters: number
  minAmount: number
  maxEnabled: boolean
  maxAmount: number
  roundToTenEnabled: boolean
  baseAddress: string
}

export interface LatLon {
  lat: number
  lon: number
  displayName: string
}

export interface RouteResult {
  distanceMeters: number
  durationSeconds: number
  geometry: GeoJSON.LineString
}

export interface QuoteResult {
  distanceMeters: number
  durationSeconds: number
  amount: number
  proportionalAmount: number
  minRuleApplied: boolean
  maxRuleApplied: boolean
  roundToTenApplied: boolean
  amountBeforeRoundToTen: number
  geometry: GeoJSON.LineString
}
