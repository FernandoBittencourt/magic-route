import type { PricingConfig } from '../types'

export interface PricingBreakdown {
  amount: number
  proportionalAmount: number
  minRuleApplied: boolean
  maxRuleApplied: boolean
}

export function calculateQuote(
  distanceMeters: number,
  config: PricingConfig,
): PricingBreakdown {
  const proportionalAmount =
    Math.round((distanceMeters / 1000) * config.ratePerKm * 100) / 100

  let amount = proportionalAmount
  let minRuleApplied = false
  let maxRuleApplied = false

  if (config.minEnabled && distanceMeters < config.minDistanceMeters) {
    amount = config.minAmount
    minRuleApplied = true
  }

  if (config.maxEnabled && amount > config.maxAmount) {
    amount = config.maxAmount
    maxRuleApplied = true
  }

  return {
    amount: Math.round(amount * 100) / 100,
    proportionalAmount,
    minRuleApplied,
    maxRuleApplied,
  }
}

/** @deprecated use calculateQuote */
export function calculateQuoteAmount(
  distanceMeters: number,
  config: PricingConfig,
): number {
  return calculateQuote(distanceMeters, config).amount
}
