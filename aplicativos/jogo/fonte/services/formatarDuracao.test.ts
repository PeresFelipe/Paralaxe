import { describe, expect, it } from 'vitest'
import { formatarDuracao } from './formatarDuracao'

describe('formatador MIT adaptado de IktahMetrics', () => {
  it.each([
    [0, '—'], [-1, '—'], [Number.POSITIVE_INFINITY, '—'], [Number.NaN, '—'],
    [1, '1s'], [59.01, '1m'], [60, '1m'], [61, '1m 1s'],
    [3599, '59m 59s'], [3600, '1h'], [3661, '1h 1m'],
  ])('apresenta %s segundos como %s', (segundos, rotulo) => {
    expect(formatarDuracao(segundos)).toBe(rotulo)
  })
})
