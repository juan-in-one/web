import { Link } from 'react-router-dom'
import { IconArrowUpRight, IconCar, IconRunner } from '../icons'

export default function Home() {
  return (
    <main id="page">
      <header className="home-hero">
        <span className="eyebrow">Panel personal</span>
        <h1 className="wordmark">
          Juan In <span className="wordmark-accent">One</span>
        </h1>
        <p>El sitio donde llevo el control de mi vida, pieza a pieza.</p>
      </header>

      <div className="hub-grid">
        <Link to="/coche" className="hub-card">
          <div className="hub-card-top">
            <div className="icon-chip" aria-hidden="true">
              <IconCar />
            </div>
            <span className="hub-card-arrow">
              <IconArrowUpRight />
            </span>
          </div>
          <div>
            <h2>Coche</h2>
            <p>Mantenimiento, ITV, kilómetros.</p>
          </div>
          <div className="hub-card-stat">2 eventos registrados</div>
        </Link>

        <Link to="/retos" className="hub-card">
          <div className="hub-card-top">
            <div className="icon-chip" aria-hidden="true">
              <IconRunner />
            </div>
            <span className="hub-card-arrow">
              <IconArrowUpRight />
            </span>
          </div>
          <div>
            <h2>Retos</h2>
            <p>Carreras, ultras y montaña.</p>
          </div>
          <div className="hub-card-stat">Conseguidos y pendientes</div>
        </Link>
      </div>
    </main>
  )
}
