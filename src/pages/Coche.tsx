import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchMaintenanceEvents } from '../api'
import type { MaintenanceEvent } from '../types'

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

function EventCard({ event }: { event: MaintenanceEvent }) {
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
    </li>
  )
}

export default function Coche() {
  const [events, setEvents] = useState<MaintenanceEvent[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMaintenanceEvents()
      .then(setEvents)
      .catch((err: Error) => setError(err.message))
  }, [])

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
                <EventCard key={e.id} event={e} />
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  )
}
