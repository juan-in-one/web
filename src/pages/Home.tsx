import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <main id="page">
      <header id="page-header">
        <h1>juan-in-one</h1>
        <p>Un poco de todo, en un solo sitio.</p>
      </header>

      <div className="hub-grid">
        <Link to="/coche" className="hub-card">
          <span className="hub-icon" aria-hidden="true">
            🚗
          </span>
          <h2>Coche</h2>
          <p>Mantenimiento, ITV, kilómetros.</p>
        </Link>

        <Link to="/retos" className="hub-card">
          <span className="hub-icon" aria-hidden="true">
            🏃
          </span>
          <h2>Retos</h2>
          <p>Carreras, ultras y montaña.</p>
        </Link>
      </div>
    </main>
  )
}
