import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  checkInGoalToday,
  createCertification,
  deleteCertification,
  fetchCertifications,
  fetchGoalToday,
  fetchGoals,
} from '../api'
import type { Certification, CertificationStatus, Goal, GoalTodayStatus } from '../types'
import {
  IconArrowLeft,
  IconCalendar,
  IconClipboardCheck,
  IconGraduationCap,
  IconPlus,
  IconTrash,
} from '../icons'

const STATUS_LABEL: Record<CertificationStatus, string> = {
  completed: 'Conseguida',
  in_progress: 'En curso',
  planned: 'Objetivo',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

function CertificationCard({
  certification,
  onDeleted,
}: {
  certification: Certification
  onDeleted: () => void
}) {
  async function handleDelete() {
    if (!confirm(`¿Borrar "${certification.name}"?`)) return
    try {
      await deleteCertification(certification.id)
      onDeleted()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al borrar')
    }
  }

  const date = certification.issued_date ?? certification.target_date

  return (
    <li className={`item-card${certification.status !== 'completed' ? ' is-pending' : ''}`}>
      <div className="icon-chip item-icon" aria-hidden="true">
        <IconGraduationCap size={22} />
      </div>
      <div className="item-body">
        <h3>{certification.name}</h3>
        <p className="item-meta">
          <span>{certification.issuer}</span>
          {date && (
            <span>
              <IconCalendar />
              {formatDate(date)}
            </span>
          )}
        </p>
        <div className="item-tags">
          <span className={`tag${certification.status === 'completed' ? ' tag-accent' : ''}`}>
            {STATUS_LABEL[certification.status]}
          </span>
        </div>
      </div>
      <button type="button" className="item-delete" aria-label="Borrar" onClick={handleDelete}>
        <IconTrash />
      </button>
    </li>
  )
}

function AddCertificationForm({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<CertificationStatus>('planned')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    const formEl = e.currentTarget
    const form = new FormData(formEl)
    try {
      await createCertification({
        name: form.get('name') as string,
        issuer: form.get('issuer') as string,
        status,
        issued_date: (form.get('issued_date') as string) || null,
        target_date: (form.get('target_date') as string) || null,
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
        Añadir certificación
      </button>
    )
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          Nombre
          <input type="text" name="name" required placeholder="ej. AWS Certified..." />
        </label>
        <label>
          Emisor
          <input type="text" name="issuer" required placeholder="ej. AWS" />
        </label>
      </div>
      <label>
        Estado
        <select
          name="status"
          required
          value={status}
          onChange={(e) => setStatus(e.target.value as CertificationStatus)}
        >
          <option value="planned">Objetivo</option>
          <option value="in_progress">En curso</option>
          <option value="completed">Conseguida</option>
        </select>
      </label>
      <div className="form-row">
        {status === 'completed' ? (
          <label>
            Fecha de obtención
            <input type="date" name="issued_date" required />
          </label>
        ) : (
          <label>
            Fecha objetivo (opcional)
            <input type="date" name="target_date" />
          </label>
        )}
      </div>
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

function GoalCard({ goal, status, onChecked }: { goal: Goal; status?: GoalTodayStatus; onChecked: () => void }) {
  const [minutes, setMinutes] = useState(goal.target_minutes)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCheckIn() {
    setError(null)
    setSaving(true)
    try {
      await checkInGoalToday(goal.id, minutes)
      onChecked()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al marcar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <li className={`item-card${status?.checked_in ? '' : ' is-pending'}`}>
      <div className="icon-chip item-icon" aria-hidden="true">
        <IconClipboardCheck size={22} />
      </div>
      <div className="item-body">
        <h3>{goal.name}</h3>
        <p className="item-meta">
          <span>Objetivo: {goal.target_minutes} min/día</span>
        </p>
        <div className="item-tags">
          {!status ? (
            <span className="tag">Cargando…</span>
          ) : !status.checked_in ? (
            <span className="tag">Hoy no lo has marcado todavía</span>
          ) : status.goal_met ? (
            <span className="tag tag-accent">Hoy cumplido — {status.minutes} min</span>
          ) : (
            <span className="tag">Marcado hoy, {status.minutes} min (no llega al objetivo)</span>
          )}
        </div>
        <div className="form-row" style={{ marginTop: 12 }}>
          <label style={{ flex: '0 0 100px' }}>
            Minutos
            <input
              type="number"
              min="0"
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
            />
          </label>
          <button type="button" disabled={saving} onClick={handleCheckIn} style={{ alignSelf: 'flex-end' }}>
            {saving ? 'Guardando…' : 'Marcar hoy'}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </div>
    </li>
  )
}

export default function Academia() {
  const [certifications, setCertifications] = useState<Certification[] | null>(null)
  const [goals, setGoals] = useState<Goal[] | null>(null)
  const [goalStatus, setGoalStatus] = useState<Record<string, GoalTodayStatus>>({})
  const [error, setError] = useState<string | null>(null)

  function loadCertifications() {
    fetchCertifications()
      .then(setCertifications)
      .catch((err: Error) => setError(err.message))
  }

  function loadGoals() {
    fetchGoals()
      .then((loadedGoals) => {
        setGoals(loadedGoals)
        for (const goal of loadedGoals) {
          fetchGoalToday(goal.id)
            .then((s) => setGoalStatus((prev) => ({ ...prev, [goal.id]: s })))
            .catch(() => {
              /* si falla el estado de un objetivo concreto, no bloquea el resto */
            })
        }
      })
      .catch((err: Error) => setError(err.message))
  }

  useEffect(() => {
    loadCertifications()
    loadGoals()
  }, [])

  const completed = certifications?.filter((c) => c.status === 'completed') ?? []
  const inProgressOrPlanned = certifications?.filter((c) => c.status !== 'completed') ?? []

  return (
    <main id="page">
      <Link to="/" className="back-link">
        <IconArrowLeft />
        Inicio
      </Link>

      <header id="page-header">
        <div className="icon-chip" style={{ width: 52, height: 52 }} aria-hidden="true">
          <IconGraduationCap size={26} />
        </div>
        <div>
          <span className="eyebrow">Academia</span>
          <h1>Certificaciones &amp; aprendizaje</h1>
        </div>
      </header>
      <p className="page-subtitle">Lo conseguido, el objetivo, y si toca hoy el check diario</p>

      {error && <p className="error">No se ha podido cargar academy-api: {error}</p>}

      {certifications !== null && (
        <section className="item-section">
          <div className="section-head">
            <span className="eyebrow">Certificaciones</span>
            <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{certifications.length}</span>
          </div>
          {completed.length === 0 && inProgressOrPlanned.length === 0 ? (
            <p className="empty">Todavía ninguna registrada.</p>
          ) : (
            <ul className="item-list" style={{ marginBottom: 24 }}>
              {[...completed, ...inProgressOrPlanned].map((c) => (
                <CertificationCard key={c.id} certification={c} onDeleted={loadCertifications} />
              ))}
            </ul>
          )}
          <AddCertificationForm onCreated={loadCertifications} />
        </section>
      )}

      {goals !== null && (
        <section className="item-section">
          <div className="section-head">
            <span className="eyebrow">Objetivos diarios</span>
            <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{goals.length}</span>
          </div>
          {goals.length === 0 ? (
            <p className="empty">Sin objetivos configurados todavía (se crean vía API por ahora).</p>
          ) : (
            <ul className="item-list">
              {goals.map((g) => (
                <GoalCard
                  key={g.id}
                  goal={g}
                  status={goalStatus[g.id]}
                  onChecked={() => fetchGoalToday(g.id).then((s) => setGoalStatus((prev) => ({ ...prev, [g.id]: s })))}
                />
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  )
}
