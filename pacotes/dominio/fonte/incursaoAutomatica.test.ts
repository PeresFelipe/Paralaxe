import { describe, expect, it } from 'vitest'
import { consultarResultadoDaIncursaoAutomatica, planejarIncursaoAutomatica } from './incursaoAutomatica'

const inicio = '2026-11-04T12:00:00.000Z'

describe('Incursão Automática — núcleo determinístico', () => {
  it('exige conclusão da Fácil antes de liberar o modo separado', () => {
    expect(() => planejarIncursaoAutomatica('cautelosa', 10, 1, inicio, false)).toThrow('Conclua Dún Liath')
  })

  it('define duração, chance e saques comuns para os três presets', () => {
    const planos = (['cautelosa', 'equilibrada', 'ousada'] as const)
      .map(preset => planejarIncursaoAutomatica(preset, 0, 1, inicio, true))
    expect(planos.map(plano => (Date.parse(plano.terminaEm) - Date.parse(inicio)) / 60000)).toEqual([15, 30, 60])
    expect(planos.map(plano => plano.chanceDeSucesso)).toEqual([0.82, 0.67, 0.52])
    expect(planos.map(plano => plano.recompensaPossivel[0]?.quantidade)).toEqual([1, 2, 3])
    expect(planos.flatMap(plano => plano.recompensaPossivel.map(item => item.idDaDefinicao)))
      .toEqual(['item.dun-liath.viga', 'item.dun-liath.viga', 'item.dun-liath.viga'])
  })

  it('não conclui nem concede saques antes da duração e mantém resultado reproduzível', () => {
    const plano = planejarIncursaoAutomatica('equilibrada', 20, 17, inicio, true)
    expect(consultarResultadoDaIncursaoAutomatica(plano, '2026-11-04T12:29:59.999Z')).toEqual({
      concluida: false, sucesso: null, recompensa: [],
    })
    const resultado = consultarResultadoDaIncursaoAutomatica(plano, plano.terminaEm)
    expect(resultado.concluida).toBe(true)
    expect(consultarResultadoDaIncursaoAutomatica(plano, '2026-11-05T12:00:00Z')).toEqual(resultado)
  })

  it('limita chance máxima e rejeita dados inválidos', () => {
    expect(planejarIncursaoAutomatica('cautelosa', 5000, 0, inicio, true).chanceDeSucesso).toBe(0.94)
    expect(() => planejarIncursaoAutomatica('ousada', -1, 0, inicio, true)).toThrow('Poder')
    expect(() => planejarIncursaoAutomatica('ousada', 1, -1, inicio, true)).toThrow('Semente')
    expect(() => planejarIncursaoAutomatica('ousada', 1, 0, 'invalido', true)).toThrow('Horário')
  })
})
