import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { createChallenge, deleteChallenge, fetchChallenges } from '../api'
import type { Challenge, ChallengeCategory, ChallengeStatus } from '../types'
import {
  IconArrowLeft,
  IconCalendar,
  IconMountain,
  IconPin,
  IconPlus,
  IconRunner,
  IconTrash,
} from '../icons'

const CATEGORY_ICON: Record<Challenge['category'], ReactNode> = {
  race: <IconRunner />,
  mountain: <IconMountain />,
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function ChallengeCard({ challenge, onDeleted }: { challenge: Challenge; onDeleted: () => void }) {
  async function handleDelete() {
    if (!confirm(`¿Borrar "${challenge.name}"?`)) return
    try {
      await deleteChallenge(challenge.id)
      onDeleted()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al borrar')
    }
  }

  return (
    <li className={`item-card${challenge.status === 'pending' ? ' is-pending' : ''}`}>
      <div className="icon-chip item-icon" aria-hidden="true">
        {CATEGORY_ICON[challenge.category]}
      </div>
      <div className="item-body">
        <h3>{challenge.name}</h3>
        <p className="item-meta">
          {challenge.location && (
            <span>
              <IconPin />
              {challenge.location}
            </span>
          )}
          <span>
            <IconCalendar />
            {formatDate(challenge.challenge_date)}
          </span>
        </p>
        <div className="item-tags">
          {challenge.distance_km != null && <span className="tag">{challenge.distance_km} km</span>}
          {challenge.elevation_m != null && <span className="tag">{challenge.elevation_m} m desnivel</span>}
          {challenge.result && <span className="tag tag-accent">{challenge.result}</span>}
        </div>
      </div>
      <button type="button" className="item-delete" aria-label="Borrar" onClick={handleDelete}>
        <IconTrash />
      </button>
    </li>
  )
}

function AddChallengeForm({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    const formEl = e.currentTarget
    const form = new FormData(formEl)
    try {
      await createChallenge({
        category: form.get('category') as ChallengeCategory,
        status: form.get('status') as ChallengeStatus,
        name: form.get('name') as string,
        location: (form.get('location') as string) || null,
        challenge_date: form.get('challenge_date') as string,
        distance_km: form.get('distance_km') ? Number(form.get('distance_km')) : null,
        elevation_m: form.get('elevation_m') ? Number(form.get('elevation_m')) : null,
        result: (form.get('result') as string) || null,
        notes: (form.get('notes') as string) || null,
      })
      formEl.reset()
      setOpen(false)
      onCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setSaving(false)
    }
  }

  if (!open) {
    return (
      <button type="button" className="add-toggle" onClick={() => setOpen(true)}>
        <IconPlus />
        Añadir reto
      </button>
    )
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          Categoría
          <select name="category" required defaultValue="race">
            <option value="race">Carrera</option>
            <option value="mountain">Montaña</option>
          </select>
        </label>
        <label>
          Estado
          <select name="status" required defaultValue="pending">
            <option value="pending">Pendiente</option>
            <option value="completed">Conseguido</option>
          </select>
        </label>
      </div>
      <label>
        Nombre
        <input type="text" name="name" required />
      </label>
      <div className="form-row">
        <label>
          Ubicación (opcional)
          <input type="text" name="location" />
        </label>
        <label>
          Fecha
          <input type="date" name="challenge_date" required />
        </label>
      </div>
      <div className="form-row">
        <label>
          Distancia km (opcional)
          <input type="number" step="0.1" name="distance_km" min="0" />
        </label>
        <label>
          Desnivel m (opcional)
          <input type="number" name="elevation_m" min="0" />
        </label>
      </div>
      <label>
        Resultado (opcional)
        <input type="text" name="result" placeholder="ej. 1h50m" />
      </label>
      <label>
        Notas (opcional)
        <input type="text" name="notes" />
      </label>
      {error && <p className="error">{error}</p>}
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
          Cancelar
        </button>
        <button type="submit" disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}

export default function Retos() {
  const [challenges, setChallenges] = useState<Challenge[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  function load() {
    fetchChallenges()
      .then(setChallenges)
      .catch((err: Error) => setError(err.message))
  }

  useEffect(load, [])

  const completed = challenges?.filter((c) => c.status === 'completed') ?? []
  const pending = challenges?.filter((c) => c.status === 'pending') ?? []

  return (
    <main id="page">
      <Link to="/" className="back-link">
        <IconArrowLeft />
        Inicio
      </Link>

      <header id="page-header">
        <div className="icon-chip" style={{ width: 52, height: 52 }} aria-hidden="true">
          <IconRunner size={26} />
        </div>
        <div>
          <span className="eyebrow">Retos</span>
          <h1>Carreras &amp; montaña</h1>
        </div>
      </header>
      <p className="page-subtitle">Lo conseguido y lo que queda por delante</p>

      {error && <p className="error">No se ha podido cargar sport-api: {error}</p>}
      {!error && challenges === null && <p className="loading">Cargando retos…</p>}

      {challenges !== null && (
        <>
          <section className="item-section">
            <div className="section-head">
              <span className="eyebrow">Conseguidos</span>
              <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{completed.length}</span>
            </div>
            {completed.length === 0 ? (
              <p className="empty">Todavía ninguno registrado.</p>
            ) : (
              <ul className="item-list">
                {completed.map((c) => (
                  <ChallengeCard key={c.id} challenge={c} onDeleted={load} />
                ))}
              </ul>
            )}
          </section>

          <section className="item-section">
            <div className="section-head">
              <span className="eyebrow">Pendientes</span>
              <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{pending.length}</span>
            </div>
            {pending.length === 0 ? (
              <p className="empty">Sin objetivos pendientes todavía.</p>
            ) : (
              <ul className="item-list" style={{ marginBottom: 24 }}>
                {pending.map((c) => (
                  <ChallengeCard key={c.id} challenge={c} onDeleted={load} />
                ))}
              </ul>
            )}
            <AddChallengeForm onCreated={load} />
          </section>
        </>
      )}
    </main>
  )
}
