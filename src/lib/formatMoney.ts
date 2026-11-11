import type { Locale } from '../types'

export function formatMoney(amount: number, locale: Locale): string {
  const tag = locale === 'pt' ? 'pt-BR' : 'en-US'
  const currency = locale === 'pt' ? 'BRL' : 'USD'
  return new Intl.NumberFormat(tag, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDistance(meters: number, locale: Locale): string {
  const km = meters / 1000
  const tag = locale === 'pt' ? 'pt-BR' : 'en-US'
  const kmStr = new Intl.NumberFormat(tag, {
    minimumFractionDigits: km < 10 ? 2 : 1,
    maximumFractionDigits: 2,
  }).format(km)
  return `${meters.toLocaleString(tag)} m · ${kmStr} km`
}

export function formatDuration(seconds: number, locale: Locale): string {
  const mins = Math.round(seconds / 60)
  if (locale === 'pt') {
    return mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)} h ${mins % 60} min`
  }
  return mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)} h ${mins % 60} min`
}
