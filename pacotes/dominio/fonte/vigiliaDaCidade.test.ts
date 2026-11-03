import { describe, expect, it } from 'vitest'
import type { PartidaLocal } from './personagem'
import {
  criarEstadoInicialDaVigilia, iniciarVigilia, concluirVigilia,
  cancelarVigilia, melhorarDistrito, consultarMelhoria, obterEstagioDaCidade,
  calcularBrasasDaVigilia, validarEstadoDaVigilia,
} from './vigiliaDaCidade'

const partida = (): PartidaLocal => ({
  idDaPartida: 'teste', atualizadoEm: '2026-11-03T10:00:00.000Z',
  vigilia: criarEstadoInicialDaVigilia(),
  personagem: { ouro: 99, inventario: [{ idDaDefinicao: 'x', quantidade: 2 }] },
  jornada: { meta: null },
  ocioso: { atividadeAtiva: { idDaDefinicaoDaAtividade: 'atividade' } },
} as unknown as PartidaLocal)

const inicio = '2026-11-03T10:00:00.000Z'
const fim = '2026-11-03T10:25:00.000Z'
const taverna = { id: 'taverna' as const, nome: 'Taverna', descricao: 'Teste', custosPorNivel: [3, 8, 15, 27] as const }

describe('Vigília da Cidade', () => {
  it('cria um estado sem compartilhar referências e valida o save', () => {
    const a = criarEstadoInicialDaVigilia()
    const b = criarEstadoInicialDaVigilia()
    a.distritos.taverna = 2
    expect(b.distritos.taverna).toBe(0)
    expect(() => validarEstadoDaVigilia(a)).not.toThrow()
  })
  it('respeita os limites e calcula a recompensa', () => {
    expect(calcularBrasasDaVigilia(25)).toBe(5)
    expect(calcularBrasasDaVigilia(60)).toBe(12)
    expect(() => calcularBrasasDaVigilia(9)).toThrow()
    expect(() => calcularBrasasDaVigilia(121)).toThrow()
  })
  it('não duplica sessão nem recompensa e preserva os outros sistemas', () => {
    const base = partida()
    const ativa = iniciarVigilia(base, { id: 's1', nome: 'Estudar', duracaoMinutos: 25 }, inicio)
    expect(() => iniciarVigilia(ativa, { id: 's2', nome: 'Outra', duracaoMinutos: 25 }, inicio)).toThrow()
    expect(() => concluirVigilia(ativa, 's1', '2026-11-03T10:24:59.000Z')).toThrow()
    const final = concluirVigilia(ativa, 's1', fim)
    expect(final.vigilia.saldoBrasas).toBe(5)
    expect(final.vigilia.sessoesConcluidas).toBe(1)
    expect(final.vigilia.minutosDeFoco).toBe(25)
    expect(concluirVigilia(final, 's1', fim)).toBe(final)
    expect(final.personagem).toBe(base.personagem)
    expect(final.jornada).toBe(base.jornada)
    expect(final.ocioso).toBe(base.ocioso)
  })
  it('cancela sem recompensar', () => {
    const ativa = iniciarVigilia(partida(), { id: 'cancelar', nome: '', duracaoMinutos: 15 }, inicio)
    const cancelada = cancelarVigilia(ativa, 'cancelar', inicio)
    expect(cancelada.vigilia.saldoBrasas).toBe(0)
    expect(cancelada.vigilia.historico[0]?.resultado).toBe('cancelada')
    expect(cancelarVigilia(cancelada, 'cancelar', inicio)).toBe(cancelada)
  })
  it('melhora um distrito, respeita saldo e calcula os estágios', () => {
    const base = partida()
    const coberta = { ...base, vigilia: { ...base.vigilia, saldoBrasas: 3 } }
    const melhorada = melhorarDistrito(coberta, taverna, inicio)
    expect(melhorada.vigilia.distritos.taverna).toBe(1)
    expect(melhorada.vigilia.saldoBrasas).toBe(0)
    expect(consultarMelhoria(melhorada.vigilia, taverna).permitido).toBe(false)
    expect(() => melhorarDistrito(melhorada, taverna, inicio)).toThrow()
    const cidade = criarEstadoInicialDaVigilia()
    expect(obterEstagioDaCidade(cidade)).toBe(0)
    cidade.distritos.praca = 3
    expect(obterEstagioDaCidade(cidade)).toBe(1)
    cidade.distritos.taverna = 4
    cidade.distritos.mercado = 1
    expect(obterEstagioDaCidade(cidade)).toBe(2)
  })
  it('conclui a Vigília sobre o estado mais recente sem apagar mudanças do inventário ou Jornada', () => {
    const iniciada = iniciarVigilia(partida(), { id: 'concorre', nome: 'Leitura', duracaoMinutos: 25 }, inicio)
    const atual = {
      ...iniciada,
      personagem: { ...iniciada.personagem, ouro: 178 },
      jornada: { ...iniciada.jornada, idsDasReceitasFabricadas: ['receita.teste'] },
    }
    const concluida = concluirVigilia(atual, 'concorre', fim)
    expect(concluida.personagem.ouro).toBe(178)
    expect(concluida.jornada.idsDasReceitasFabricadas).toEqual(['receita.teste'])
    expect(concluida.vigilia.saldoBrasas).toBe(5)
  })

  it('não permite ultrapassar o nível máximo dos distritos', () => {
    let atual = { ...partida(), vigilia: { ...criarEstadoInicialDaVigilia(), saldoBrasas: 1000 } }
    for (let nivel = 0; nivel < 4; nivel++) atual = melhorarDistrito(atual, taverna, inicio)
    expect(atual.vigilia.distritos.taverna).toBe(4)
    expect(() => melhorarDistrito(atual, taverna, inicio)).toThrow('Nível máximo')
  })

  it('não credita uma sessão vencida sem confirmação após recarregar', () => {
    const ativa = iniciarVigilia(partida(), { id: 'reabrir', nome: 'Leitura', duracaoMinutos: 25 }, inicio)
    const restaurada = JSON.parse(JSON.stringify(ativa)) as typeof ativa
    expect(restaurada.vigilia.saldoBrasas).toBe(0)
    expect(concluirVigilia(restaurada, 'reabrir', fim).vigilia.saldoBrasas).toBe(5)
  })
})
