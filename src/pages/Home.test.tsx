import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Home from './Home'

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  )
}

describe('Home', () => {
  it('enlaza las tres tarjetas a sus rutas correctas', () => {
    renderHome()

    expect(screen.getByRole('link', { name: /coche/i })).toHaveAttribute('href', '/coche')
    expect(screen.getByRole('link', { name: /retos/i })).toHaveAttribute('href', '/retos')
    expect(screen.getByRole('link', { name: /academia/i })).toHaveAttribute('href', '/academia')
  })

  it('muestra el título de la plataforma', () => {
    renderHome()

    expect(screen.getByText('Juan In')).toBeInTheDocument()
  })
})
