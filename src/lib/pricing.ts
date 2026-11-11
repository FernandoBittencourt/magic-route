import type { PricingConfig } from '../types'

export function calculateQuoteAmount(
  distanceMeters: number,
  config: PricingConfig,
): number {
  let amount = (distanceMeters / 1000) * config.ratePerKm

  if (
    config.minEnabled &&
    distanceMeters < config.minDistanceMeters
  ) {
    amount = config.minAmount
  }

  if (config.maxEnabled && amount > config.maxAmount) {
    amount = config.maxAmount
  }

  return Math.round(amount * 100) / 100
}
