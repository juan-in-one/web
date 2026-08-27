import type { Challenge, MaintenanceEvent } from './types'

// Rutas relativas: en local, vite.config.ts las reenvía a juan-in-one.local;
// en producción (dentro del Pod de web), ingress-nginx las reenvía al
// microservicio correspondiente, sin que este código necesite saber cuál de
// las dos cosas está pasando.
const SPORT_API_BASE = '/api/sport-api'
const CAR_API_BASE = '/api/car-api'

export async function fetchChallenges(): Promise<Challenge[]> {
  const res = await fetch(`${SPORT_API_BASE}/challenges`)
  if (!res.ok) {
    throw new Error(`sport-api respondió ${res.status}`)
  }
  return res.json()
}

export async function fetchMaintenanceEvents(): Promise<MaintenanceEvent[]> {
  const res = await fetch(`${CAR_API_BASE}/maintenance-events`)
  if (!res.ok) {
    throw new Error(`car-api respondió ${res.status}`)
  }
  return res.json()
}
