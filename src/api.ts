import type { Certification, Challenge, Goal, GoalTodayStatus, MaintenanceEvent } from './types'

// Rutas relativas: en local, vite.config.ts las reenvía a juan-in-one.local;
// en producción (dentro del Pod de web), ingress-nginx las reenvía al
// microservicio correspondiente, sin que este código necesite saber cuál de
// las dos cosas está pasando.
const SPORT_API_BASE = '/api/sport-api'
const CAR_API_BASE = '/api/car-api'
const ACADEMY_API_BASE = '/api/academy-api'

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

export async function createChallenge(
  payload: Omit<Challenge, 'id' | 'created_at'>,
): Promise<Challenge> {
  const res = await fetch(`${SPORT_API_BASE}/challenges`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    throw new Error(`sport-api respondió ${res.status}`)
  }
  return res.json()
}

export async function createMaintenanceEvent(
  payload: Omit<MaintenanceEvent, 'id' | 'created_at'>,
): Promise<MaintenanceEvent> {
  const res = await fetch(`${CAR_API_BASE}/maintenance-events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    throw new Error(`car-api respondió ${res.status}`)
  }
  return res.json()
}

export async function deleteChallenge(id: string): Promise<void> {
  const res = await fetch(`${SPORT_API_BASE}/challenges/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    throw new Error(`sport-api respondió ${res.status}`)
  }
}

export async function deleteMaintenanceEvent(id: string): Promise<void> {
  const res = await fetch(`${CAR_API_BASE}/maintenance-events/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    throw new Error(`car-api respondió ${res.status}`)
  }
}

export async function fetchCertifications(): Promise<Certification[]> {
  const res = await fetch(`${ACADEMY_API_BASE}/certifications`)
  if (!res.ok) {
    throw new Error(`academy-api respondió ${res.status}`)
  }
  return res.json()
}

export async function createCertification(
  payload: Omit<Certification, 'id' | 'created_at'>,
): Promise<Certification> {
  const res = await fetch(`${ACADEMY_API_BASE}/certifications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    throw new Error(`academy-api respondió ${res.status}`)
  }
  return res.json()
}

export async function deleteCertification(id: string): Promise<void> {
  const res = await fetch(`${ACADEMY_API_BASE}/certifications/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    throw new Error(`academy-api respondió ${res.status}`)
  }
}

export async function fetchGoals(): Promise<Goal[]> {
  const res = await fetch(`${ACADEMY_API_BASE}/goals`)
  if (!res.ok) {
    throw new Error(`academy-api respondió ${res.status}`)
  }
  return res.json()
}

export async function fetchGoalToday(goalId: string): Promise<GoalTodayStatus> {
  const res = await fetch(`${ACADEMY_API_BASE}/goals/${goalId}/today`)
  if (!res.ok) {
    throw new Error(`academy-api respondió ${res.status}`)
  }
  return res.json()
}

// "date" en formato YYYY-MM-DD (día local del navegador, no UTC — para que
// marcar "hoy" a última hora de la noche no cuente para el día siguiente).
function todayLocalDate(): string {
  const now = new Date()
  const offsetMs = now.getTimezoneOffset() * 60_000
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10)
}

export async function checkInGoalToday(goalId: string, minutes: number): Promise<GoalTodayStatus['minutes']> {
  const res = await fetch(`${ACADEMY_API_BASE}/goals/${goalId}/check-ins`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date: todayLocalDate(), minutes }),
  })
  if (!res.ok) {
    throw new Error(`academy-api respondió ${res.status}`)
  }
  const created = await res.json()
  return created.minutes
}
