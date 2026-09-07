// Coincide con el modelo real de sport-api (app/schemas.py) — ver
// wiki/projects/juan-in-one.md en el vault para el porqué de estos campos.
export type ChallengeCategory = 'race' | 'mountain'
export type ChallengeStatus = 'pending' | 'completed'

export interface Challenge {
  id: string
  category: ChallengeCategory
  status: ChallengeStatus
  name: string
  location: string | null
  challenge_date: string
  distance_km: number | null
  elevation_m: number | null
  result: string | null
  notes: string | null
  created_at: string
}

// Coincide con el modelo real de car-api (app/schemas.py).
export type MaintenanceType = 'oil_change' | 'itv' | 'timing_belt' | 'other'

export interface MaintenanceEvent {
  id: string
  type: MaintenanceType
  event_date: string
  odometer_km: number
  notes: string | null
  created_at: string
}

// Coincide con el modelo real de academy-api (app/schemas.py).
export type CertificationStatus = 'completed' | 'in_progress' | 'planned'

export interface Certification {
  id: string
  name: string
  issuer: string
  status: CertificationStatus
  issued_date: string | null
  target_date: string | null
  notes: string | null
  created_at: string
}

export interface Goal {
  id: string
  name: string
  target_minutes: number
  active: boolean
  created_at: string
}

export interface GoalTodayStatus {
  goal_id: string
  goal_name: string
  date: string
  target_minutes: number
  checked_in: boolean
  minutes: number
  goal_met: boolean
}
