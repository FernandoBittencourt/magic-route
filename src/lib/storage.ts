import type { Locale, PricingConfig } from '../types'

const STORAGE_VERSION = 1
const KEY = 'magic-route.v1'

export interface StoredState {
  version: number
  locale?: Locale
  pricing: PricingConfig
}

const defaultPricing = (): PricingConfig => ({
  ratePerKm: 5,
  minEnabled: false,
  minDistanceMeters: 1000,
  minAmount: 25,
  maxEnabled: false,
  maxAmount: 100,
  baseAddress: '',
})

export function defaultStoredState(): StoredState {
  return {
    version: STORAGE_VERSION,
    pricing: defaultPricing(),
  }
}

export function loadStoredState(): StoredState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultStoredState()
    const parsed = JSON.parse(raw) as Partial<StoredState>
    if (parsed.version !== STORAGE_VERSION || !parsed.pricing) {
      return defaultStoredState()
    }
    return {
      version: STORAGE_VERSION,
      locale: parsed.locale === 'pt' || parsed.locale === 'en' ? parsed.locale : undefined,
      pricing: { ...defaultPricing(), ...parsed.pricing },
    }
  } catch {
    return defaultStoredState()
  }
}

export function saveStoredState(state: StoredState): void {
  localStorage.setItem(
    KEY,
    JSON.stringify({
      ...state,
      version: STORAGE_VERSION,
    }),
  )
}

export function loadLocalePreference(): Locale | null {
  const state = loadStoredState()
  return state.locale ?? null
}

export function saveLocalePreference(locale: Locale): void {
  const state = loadStoredState()
  saveStoredState({ ...state, locale })
}

export function loadPricingConfig(): PricingConfig {
  return loadStoredState().pricing
}

export function savePricingConfig(pricing: PricingConfig): void {
  const state = loadStoredState()
  saveStoredState({ ...state, pricing })
}
