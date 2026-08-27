import type { Challenge } from './types'

// Ruta relativa: en local, vite.config.ts la reenvía a juan-in-one.local; en
// producción (dentro del Pod de web), ingress-nginx la reenvía a sport-api,
// sin que este código necesite saber cuál de las dos cosas está pasando.
const SPORT_API_BASE = '/api/sport-api'

export async function fetchChallenges(): Promise<Challenge[]> {
  const res = await fetch(`${SPORT_API_BASE}/challenges`)
  if (!res.ok) {
    throw new Error(`sport-api respondió ${res.status}`)
  }
  return res.json()
}
