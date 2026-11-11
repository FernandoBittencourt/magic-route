import type { PricingConfig } from '../types'

export interface PricingBreakdown {
  amount: number
  proportionalAmount: number
  minRuleApplied: boolean
  maxRuleApplied: boolean
  roundToTenApplied: boolean
  amountBeforeRoundToTen: number
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
  let roundToTenApplied = false

  if (config.minEnabled && distanceMeters < config.minDistanceMeters) {
    amount = config.minAmount
    minRuleApplied = true
  }

  if (config.maxEnabled && amount > config.maxAmount) {
    amount = config.maxAmount
    maxRuleApplied = true
  }

  amount = Math.round(amount * 100) / 100
  const amountBeforeRoundToTen = amount

  if (config.roundToTenEnabled && amount > 0) {
    const rounded = Math.ceil(amount / 10) * 10
    if (rounded !== amount) {
      roundToTenApplied = true
      amount = rounded
    }
  }

  return {
    amount,
    proportionalAmount,
    minRuleApplied,
    maxRuleApplied,
    roundToTenApplied,
    amountBeforeRoundToTen,
  }
}

/** @deprecated use calculateQuote */
export function calculateQuoteAmount(
  distanceMeters: number,
  config: PricingConfig,
): number {
  return calculateQuote(distanceMeters, config).amount
}
