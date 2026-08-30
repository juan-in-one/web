import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { createMaintenanceEvent, deleteMaintenanceEvent, fetchMaintenanceEvents } from '../api'
import type { MaintenanceEvent, MaintenanceType } from '../types'
import {
  IconArrowLeft,
  IconCalendar,
  IconCar,
  IconClipboardCheck,
  IconGauge,
  IconGear,
  IconOilDrop,
  IconPlus,
  IconTrash,
  IconWrench,
} from '../icons'

const TYPE_ICON: Record<MaintenanceEvent['type'], ReactNode> = {
  oil_change: <IconOilDrop />,
  itv: <IconClipboardCheck />,
  timing_belt: <IconGear />,
  other: <IconWrench />,
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
      <div className="icon-chip item-icon" aria-hidden="true">
        {TYPE_ICON[event.type]}
      </div>
      <div className="item-body">
        <h3>{TYPE_LABEL[event.type]}</h3>
        <p className="item-meta">
          <span>
            <IconCalendar />
            {formatDate(event.event_date)}
          </span>
          <span>
            <IconGauge />
            {event.odometer_km.toLocaleString('es-ES')} km
          </span>
        </p>
        {event.notes && (
          <div className="item-tags">
            <span className="tag tag-accent">{event.notes}</span>
          </div>
        )}
      </div>
      <button type="button" className="item-delete" aria-label="Borrar" onClick={handleDelete}>
        <IconTrash />
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
        <IconPlus />
        Añadir evento
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
        <IconArrowLeft />
        Inicio
      </Link>

      <header id="page-header">
        <div className="icon-chip" style={{ width: 52, height: 52 }} aria-hidden="true">
          <IconCar size={26} />
        </div>
        <div>
          <span className="eyebrow">Coche</span>
          <h1>Alfa Romeo 147</h1>
        </div>
      </header>
      <p className="page-subtitle">
        <span className="vehicle-info">2005 · 1.9 JTD</span> · historial de mantenimiento
      </p>

      {error && <p className="error">No se ha podido cargar car-api: {error}</p>}
      {!error && events === null && <p className="loading">Cargando eventos…</p>}

      {events !== null && (
        <section className="item-section">
          <div className="section-head">
            <span className="eyebrow">Eventos</span>
            <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{events.length}</span>
          </div>
          {events.length === 0 ? (
            <p className="empty">Todavía ningún evento registrado.</p>
          ) : (
            <ul className="item-list" style={{ marginBottom: 24 }}>
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
