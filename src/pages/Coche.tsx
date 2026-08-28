import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { createMaintenanceEvent, deleteMaintenanceEvent, fetchMaintenanceEvents } from '../api'
import type { MaintenanceEvent, MaintenanceType } from '../types'

const TYPE_ICON: Record<MaintenanceEvent['type'], string> = {
  oil_change: '🛢️',
  itv: '📋',
  timing_belt: '⚙️',
  other: '🔧',
}

const TYPE_LABEL: Record<MaintenanceEvent['type'], string> = {
  oil_change: 'Cambio de aceite',
  itv: 'ITV',
  timing_belt: 'Distribución',
  other: 'Otro',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function EventCard({ event, onDeleted }: { event: MaintenanceEvent; onDeleted: () => void }) {
  async function handleDelete() {
    if (!confirm(`¿Borrar "${TYPE_LABEL[event.type]}" (${event.odometer_km} km)?`)) return
    try {
      await deleteMaintenanceEvent(event.id)
      onDeleted()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al borrar')
    }
  }

  return (
    <li className="item-card">
      <span className="item-icon" aria-hidden="true">
        {TYPE_ICON[event.type]}
      </span>
      <div className="item-body">
        <h3>{TYPE_LABEL[event.type]}</h3>
        <p className="item-meta">
          <span>{formatDate(event.event_date)}</span>
          <span>{event.odometer_km.toLocaleString('es-ES')} km</span>
        </p>
        {event.notes && (
          <p className="item-stats">
            <span className="item-highlight">{event.notes}</span>
          </p>
        )}
      </div>
      <button type="button" className="item-delete" aria-label="Borrar" onClick={handleDelete}>
        🗑️
      </button>
    </li>
  )
}

function AddEventForm({ onCreated }: { onCreated: () => void }) {
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
      await createMaintenanceEvent({
        type: form.get('type') as MaintenanceType,
        event_date: form.get('event_date') as string,
        odometer_km: Number(form.get('odometer_km')),
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
        + Añadir evento
      </button>
    )
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          Tipo
          <select name="type" required defaultValue="oil_change">
            <option value="oil_change">Cambio de aceite</option>
            <option value="itv">ITV</option>
            <option value="timing_belt">Distribución</option>
            <option value="other">Otro</option>
          </select>
        </label>
        <label>
          Fecha
          <input type="date" name="event_date" required />
        </label>
      </div>
      <div className="form-row">
        <label>
          Kilómetros
          <input type="number" name="odometer_km" min="0" required />
        </label>
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

export default function Coche() {
  const [events, setEvents] = useState<MaintenanceEvent[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  function load() {
    fetchMaintenanceEvents()
      .then(setEvents)
      .catch((err: Error) => setError(err.message))
  }

  useEffect(load, [])

  return (
    <main id="page">
      <Link to="/" className="back-link">
        ← Inicio
      </Link>
      <header id="page-header">
        <h1>Coche</h1>
        {/* Dato fijo por ahora, no viene de car-api todavía — ver
            wiki/log.md 2026-08-27 sobre por qué se dejó así de momento. */}
        <p className="vehicle-info">Alfa Romeo 147 · 2005 · 1.9 JTD</p>
        <p>Historial de mantenimiento.</p>
      </header>

      {error && <p className="error">No se ha podido cargar car-api: {error}</p>}
      {!error && events === null && <p className="loading">Cargando eventos…</p>}

      {events !== null && (
        <section className="item-section">
          <h2>Eventos ({events.length})</h2>
          {events.length === 0 ? (
            <p className="empty">Todavía ningún evento registrado.</p>
          ) : (
            <ul className="item-list">
              {events.map((e) => (
                <EventCard key={e.id} event={e} onDeleted={load} />
              ))}
            </ul>
          )}
          <AddEventForm onCreated={load} />
        </section>
      )}
    </main>
  )
}
