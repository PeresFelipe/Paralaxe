import { describe, expect, it } from 'vitest'
import { criarPartidaLocal, type DefinicaoDeClasseDoPersonagem, type DefinicaoDePresente } from './personagem'
import { iniciarIncursaoAutomatica, finalizarIncursaoAutomatica, cancelarIncursaoAutomatica,
  planejarIncursaoAutomatica, consultarResultadoDaIncursaoAutomatica } from './incursaoAutomatica'

const classe: DefinicaoDeClasseDoPersonagem = {
  id: 'errante', nome: 'Errante', resumo: 'Equilibrado.',
  atributos: { vitalidade: 5, mente: 5, vigor: 5, forca: 5, destreza: 5, inteligencia: 5, fe: 5 },
  equipamentosIniciais: { maoPrincipal: 'arma.viagem-lanca' }, idDaHabilidadeInicial: 'habilidade.abertura',
}
const presente: DefinicaoDePresente = { id: 'nenhum', nome: 'Nenhum', resumo: 'Sem presente.', concessoes: [] }
const inicio = '2026-11-04T12:00:00.000Z'
function partidaPronta() {
  const p = criarPartidaLocal({ idDaPartida: 'incursao-teste', criadoEm: inicio,
    versaoDoConteudo: 'test', nomeDoPersonagem: 'Ailith', classeDoPersonagem: classe, presente })
  return { ...p, masmorra: { ...p.masmorra, dunLiathFacilConquistado: true } }
}
function seed(sucesso: boolean): number {
  for (let i = 0; i < 1000; i++) {
    const plano = planejarIncursaoAutomatica('equilibrada', 10, i, inicio, true)
    if (consultarResultadoDaIncursaoAutomatica(plano, plano.terminaEm).sucesso === sucesso) return i
  }
  throw new Error('Semente não encontrada')
}
describe('Incursão Automática integrada', () => {
  it('exige concluir a Fácil e não admite duas incursões', () => {
    const base = partidaPronta()
    const bloqueada = { ...base, masmorra: { ...base.masmorra, dunLiathFacilConquistado: false } }
    expect(() => iniciarIncursaoAutomatica(bloqueada, 'cautelosa', 1, 2, inicio)).toThrow('Conclua Dún Liath')
    const ativa = iniciarIncursaoAutomatica(base, 'cautelosa', 1, 2, inicio)
    expect(() => iniciarIncursaoAutomatica(ativa, 'cautelosa', 1, 3, inicio)).toThrow('Já existe')
  })
  it('só permite resgate na conclusão, retoma relógio e impede repetição', () => {
    const base = partidaPronta()
    const trabalhando = { ...base, ocioso: { ...base.ocioso,
      atividadeAtiva: { idDaDefinicaoDaAtividade: 'coletar.mineracao.cloch',
        iniciadoEm: inicio, processadoPorUltimoEm: inicio, segundosRestantes: 3 } } }
    const ativa = iniciarIncursaoAutomatica(trabalhando, 'equilibrada', 10, seed(true), inicio)
    expect(() => finalizarIncursaoAutomatica(ativa, '2026-11-04T12:29:59.999Z')).toThrow('ainda está')
    const final = finalizarIncursaoAutomatica(ativa, '2026-11-04T12:30:00Z')
    expect(final.personagem.inventario.find(p => p.idDaDefinicao === 'item.dun-liath.viga')?.quantidade).toBe(2)
    expect(final.ocioso.atividadeAtiva?.processadoPorUltimoEm).toBe('2026-11-04T12:30:00Z')
    expect(() => finalizarIncursaoAutomatica(final, '2026-11-04T12:31:00Z')).toThrow('Não existe')
    expect(trabalhando.personagem.inventario.some(p => p.idDaDefinicao === 'item.dun-liath.viga')).toBe(false)
  })
  it('não perde itens seguros se falhar', () => {
    const base = partidaPronta()
    const ativa = iniciarIncursaoAutomatica(base, 'equilibrada', 10, seed(false), inicio)
    const final = finalizarIncursaoAutomatica(ativa, '2026-11-04T12:30:00Z')
    expect(final.masmorra.ultimaIncursaoAutomatica?.sucesso).toBe(false)
    expect(final.personagem.inventario).toEqual(base.personagem.inventario)
  })
  it('não perde resultado em inventário cheio; permite cancelar sem saque', () => {
    const base = partidaPronta()
    const cheia = { ...base, personagem: { ...base.personagem, inventario:
      Array.from({ length: 24 }, (_, i) => ({ idDaDefinicao: `material.teste-${i}`, quantidade: 1 })) } }
    const ativa = iniciarIncursaoAutomatica(cheia, 'equilibrada', 10, seed(true), inicio)
    expect(() => finalizarIncursaoAutomatica(ativa, '2026-11-04T12:30:00Z')).toThrow('capacidade')
    expect(ativa.masmorra.incursaoAutomaticaAtiva).not.toBeNull()
    const cancelada = cancelarIncursaoAutomatica(ativa, '2026-11-04T12:31:00Z')
    expect(cancelada.masmorra.incursaoAutomaticaAtiva).toBeNull()
    expect(cancelada.personagem.inventario).toEqual(cheia.personagem.inventario)
  })
})
