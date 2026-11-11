import { useCallback, useEffect, useState } from 'react'

const SESSION_KEY = 'magic-route.location.v1'
const MAX_AGE_MS = 300_000

export type LocationBiasStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'denied'
  | 'unsupported'

export interface LocationBias {
  lat: number
  lon: number
}

interface SessionPayload {
  lat: number
  lon: number
  ts: number
}

function readSession(): LocationBias | null {
  if (typeof sessionStorage === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as SessionPayload
    if (Date.now() - data.ts > MAX_AGE_MS) {
      sessionStorage.removeItem(SESSION_KEY)
      return null
    }
    return { lat: data.lat, lon: data.lon }
  } catch {
    return null
  }
}

function writeSession(bias: LocationBias): void {
  const payload: SessionPayload = { ...bias, ts: Date.now() }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload))
}

function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY)
}

function getCurrentPositionOnce(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10_000,
      maximumAge: MAX_AGE_MS,
    })
  })
}

export function useLocationBias() {
  const [bias, setBias] = useState<LocationBias | null>(null)
  const [status, setStatus] = useState<LocationBiasStatus>(() =>
    typeof navigator !== 'undefined' && 'geolocation' in navigator
      ? 'idle'
      : 'unsupported',
  )

  useEffect(() => {
    const stored = readSession()
    if (stored) {
      setBias(stored)
      setStatus('ready')
    }
  }, [])

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setStatus('unsupported')
      return null
    }
    setStatus('loading')
    try {
      const position = await getCurrentPositionOnce()
      const next: LocationBias = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      }
      setBias(next)
      writeSession(next)
      setStatus('ready')
      return next
    } catch (err) {
      const geoErr = err as GeolocationPositionError
      if (geoErr?.code === 1) setStatus('denied')
      else setStatus('idle')
      return null
    }
  }, [])

  const disableLocation = useCallback(() => {
    setBias(null)
    clearSession()
    setStatus(
      typeof navigator !== 'undefined' && 'geolocation' in navigator
        ? 'idle'
        : 'unsupported',
    )
  }, [])

  return {
    bias,
    status,
    requestLocation,
    disableLocation,
  }
}
