import { describe, expect, it, vi } from 'vitest'
import { todayLocalDate } from './api'

describe('todayLocalDate', () => {
  it('devuelve la fecha en formato YYYY-MM-DD', () => {
    expect(todayLocalDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('usa el día local, no el UTC, cerca de medianoche', () => {
    // 23:30 en un huso con UTC-5 (ej. América) es ya el día siguiente en
    // UTC — el bug real que este helper existe para evitar: marcar "hoy"
    // a última hora de la noche no debe contar para el día siguiente.
    const localMidnightEdge = new Date('2026-03-15T23:30:00')
    vi.useFakeTimers()
    vi.setSystemTime(localMidnightEdge)

    expect(todayLocalDate()).toBe('2026-03-15')

    vi.useRealTimers()
  })

  it('coincide con los componentes de fecha locales de "new Date()"', () => {
    const now = new Date()
    const expected = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-')

    expect(todayLocalDate()).toBe(expected)
  })
})
