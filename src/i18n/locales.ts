import type { Locale } from '../types'

export type MessageKey =
  | 'app.subtitle'
  | 'header.settings'
  | 'settings.panelHint'
  | 'locale.pt'
  | 'locale.en'
  | 'form.origin'
  | 'form.destination'
  | 'form.addressHint'
  | 'form.calculate'
  | 'form.calculating'
  | 'settings.title'
  | 'settings.ratePerKm'
  | 'settings.baseAddress'
  | 'settings.baseAddressHint'
  | 'settings.min.title'
  | 'settings.min.enabled'
  | 'settings.min.distance'
  | 'settings.min.amount'
  | 'settings.max.title'
  | 'settings.max.enabled'
  | 'settings.max.amount'
  | 'settings.roundToTen.title'
  | 'settings.roundToTen.enabled'
  | 'result.title'
  | 'result.receiptBanner'
  | 'result.distance'
  | 'result.duration'
  | 'result.price'
  | 'result.proportional'
  | 'result.minApplied'
  | 'result.maxApplied'
  | 'result.roundToTenApplied'
  | 'errors.emptyOrigin'
  | 'errors.emptyDestination'
  | 'errors.geocodeNotFound'
  | 'errors.geocodeNetwork'
  | 'errors.routeFailed'
  | 'errors.generic'
  | 'attribution.osm'
  | 'attribution.osrm'

type Messages = Record<MessageKey, string>

const pt: Messages = {
  'app.subtitle': 'Taxa por distância no atendimento a domicílio',
  'header.settings': 'Configurações',
  'settings.panelHint': 'Defina taxa, mínimo, máximo e endereço base.',
  'locale.pt': 'PT',
  'locale.en': 'EN',
  'form.origin': 'Origem',
  'form.destination': 'Destino',
  'form.addressHint':
    'Digite o endereço em português para melhor resultado no Brasil.',
  'form.calculate': 'Calcular valor',
  'form.calculating': 'Calculando…',
  'settings.title': 'Regras de preço',
  'settings.ratePerKm': 'Valor por km',
  'settings.baseAddress': 'Endereço base (opcional)',
  'settings.baseAddressHint':
    'Preenche o campo Origem automaticamente (seu ponto de partida fixo).',
  'settings.min.title': 'Valor mínimo (opcional)',
  'settings.min.enabled': 'Usar valor fixo abaixo da distância',
  'settings.min.distance': 'Distância limite (metros)',
  'settings.min.amount': 'Valor fixo',
  'settings.max.title': 'Valor máximo (opcional)',
  'settings.max.enabled': 'Limitar ao teto',
  'settings.max.amount': 'Teto',
  'settings.roundToTen.title': 'Arredondamento (opcional)',
  'settings.roundToTen.enabled':
    'Arredondar valor final para cima (múltiplos de 10)',
  'result.title': 'Orçamento',
  'result.receiptBanner': '— Orçamento —',
  'result.distance': 'Distância',
  'result.duration': 'Tempo estimado',
  'result.price': 'Valor',
  'result.proportional': 'Só pela distância',
  'result.minApplied': 'Mínimo (abaixo do limite em m)',
  'result.maxApplied': 'Teto máximo aplicado',
  'result.roundToTenApplied': 'Arredondado para cima (múltiplo de 10)',
  'errors.emptyOrigin': 'Informe a origem.',
  'errors.emptyDestination': 'Informe o destino.',
  'errors.geocodeNotFound':
    'Endereço não encontrado. Revise o texto e use português no Brasil.',
  'errors.geocodeNetwork': 'Falha ao buscar o endereço. Tente de novo.',
  'errors.routeFailed': 'Não foi possível traçar a rota entre os pontos.',
  'errors.generic': 'Algo deu errado. Tente novamente.',
  'attribution.osm': 'Dados do mapa © OpenStreetMap',
  'attribution.osrm': 'Rota via OSRM',
}

const en: Messages = {
  'app.subtitle': 'Distance-based pricing for home visits',
  'header.settings': 'Settings',
  'settings.panelHint': 'Set rate, min, max, and base address.',
  'locale.pt': 'PT',
  'locale.en': 'EN',
  'form.origin': 'Origin',
  'form.destination': 'Destination',
  'form.addressHint':
    'Use the local language for the address (e.g. Portuguese in Brazil).',
  'form.calculate': 'Calculate quote',
  'form.calculating': 'Calculating…',
  'settings.title': 'Pricing rules',
  'settings.ratePerKm': 'Rate per km',
  'settings.baseAddress': 'Base address (optional)',
  'settings.baseAddressHint':
    'Fills the Origin field automatically (your usual starting point).',
  'settings.min.title': 'Minimum charge (optional)',
  'settings.min.enabled': 'Flat fee below distance threshold',
  'settings.min.distance': 'Distance threshold (meters)',
  'settings.min.amount': 'Flat amount',
  'settings.max.title': 'Maximum charge (optional)',
  'settings.max.enabled': 'Cap the quote',
  'settings.max.amount': 'Ceiling',
  'settings.roundToTen.title': 'Rounding (optional)',
  'settings.roundToTen.enabled': 'Round final amount up to nearest 10',
  'result.title': 'Quote',
  'result.receiptBanner': '— Quote —',
  'result.distance': 'Distance',
  'result.duration': 'Estimated time',
  'result.price': 'Amount',
  'result.proportional': 'Distance only',
  'result.minApplied': 'Minimum (below distance threshold)',
  'result.maxApplied': 'Maximum cap applied',
  'result.roundToTenApplied': 'Rounded up to nearest 10',
  'errors.emptyOrigin': 'Enter an origin.',
  'errors.emptyDestination': 'Enter a destination.',
  'errors.geocodeNotFound':
    'Address not found. Check spelling and use the local language.',
  'errors.geocodeNetwork': 'Could not look up the address. Try again.',
  'errors.routeFailed': 'Could not compute a route between the points.',
  'errors.generic': 'Something went wrong. Please try again.',
  'attribution.osm': 'Map data © OpenStreetMap',
  'attribution.osrm': 'Routing via OSRM',
}

const table: Record<Locale, Messages> = { pt, en }

export function t(locale: Locale, key: MessageKey): string {
  return table[locale][key]
}

export function detectInitialLocale(): Locale {
  if (typeof navigator !== 'undefined') {
    const lang = navigator.language.toLowerCase()
    if (lang.startsWith('pt')) return 'pt'
  }
  return 'en'
}
