import { useEffect, useState } from 'react'
import { fetchChallenges } from './api'
import type { Challenge } from './types'
import './App.css'

const CATEGORY_ICON: Record<Challenge['category'], string> = {
  race: '🏃',
  mountain: '⛰️',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  return (
    <li className="challenge-card">
      <span className="challenge-icon" aria-hidden="true">
        {CATEGORY_ICON[challenge.category]}
      </span>
      <div className="challenge-body">
        <h3>{challenge.name}</h3>
        <p className="challenge-meta">
          {challenge.location && <span>{challenge.location}</span>}
          <span>{formatDate(challenge.challenge_date)}</span>
        </p>
        <p className="challenge-stats">
          {challenge.distance_km != null && <span>{challenge.distance_km} km</span>}
          {challenge.elevation_m != null && <span>{challenge.elevation_m} m desnivel</span>}
          {challenge.result && <span className="challenge-result">{challenge.result}</span>}
        </p>
      </div>
    </li>
  )
}

function App() {
  const [challenges, setChallenges] = useState<Challenge[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchChallenges()
      .then(setChallenges)
      .catch((err: Error) => setError(err.message))
  }, [])

  const completed = challenges?.filter((c) => c.status === 'completed') ?? []
  const pending = challenges?.filter((c) => c.status === 'pending') ?? []

  return (
    <main id="page">
      <header id="page-header">
        <h1>Retos</h1>
        <p>Carreras, ultras y montaña — lo conseguido y lo que queda por delante.</p>
      </header>

      {error && <p className="error">No se ha podido cargar sport-api: {error}</p>}
      {!error && challenges === null && <p className="loading">Cargando retos…</p>}

      {challenges !== null && (
        <>
          <section className="challenge-section">
            <h2>Conseguidos ({completed.length})</h2>
            {completed.length === 0 ? (
              <p className="empty">Todavía ninguno registrado.</p>
            ) : (
              <ul className="challenge-list">
                {completed.map((c) => (
                  <ChallengeCard key={c.id} challenge={c} />
                ))}
              </ul>
            )}
          </section>

          <section className="challenge-section">
            <h2>Pendientes ({pending.length})</h2>
            {pending.length === 0 ? (
              <p className="empty">Sin objetivos pendientes todavía.</p>
            ) : (
              <ul className="challenge-list">
                {pending.map((c) => (
                  <ChallengeCard key={c.id} challenge={c} />
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  )
}

export default App
