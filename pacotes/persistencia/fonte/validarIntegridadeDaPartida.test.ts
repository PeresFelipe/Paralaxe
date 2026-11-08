import { describe, expect, it } from 'vitest'
import { criarPartidaLocal, type PartidaLocal } from '@paralaxe/dominio'
import { validarIntegridadeDaPartida } from './validarIntegridadeDaPartida'

function partida() {
  return criarPartidaLocal({ idDaPartida: 'integridade', criadoEm: '2026-11-07T00:00:00.000Z', versaoDoConteudo: 'teste', nomeDoPersonagem: 'Aedan',
    classeDoPersonagem: { id: 'errante', nome: 'Errante', resumo: '', atributos: { vitalidade: 5, mente: 5, vigor: 5, forca: 5, destreza: 5, inteligencia: 5, fe: 5 }, equipamentosIniciais: { maoPrincipal: 'arma.viagem-lanca' }, idDaHabilidadeInicial: 'habilidade.abertura' },
    presente: { id: 'nenhum', nome: 'Nenhum', resumo: '', concessoes: [] } })
}

describe('integridade do agregado migrado', () => {
  it('aceita a partida inicial sem alterá-la e preserva extensões opcionais', () => {
    const atual = { ...partida(), extensaoFutura: { ativa: true } }
    const copia = structuredClone(atual)
    expect(() => validarIntegridadeDaPartida(atual)).not.toThrow()
    expect(atual).toEqual(copia)
  })
  it.each([
    ['ouro negativo', (p: PartidaLocal) => { p.personagem.ouro = -1 }],
    ['quantidade fracionária', (p: PartidaLocal) => { p.personagem.inventario = [{ idDaDefinicao: 'item', quantidade: 1.5 }] }],
    ['pilha repetida', (p: PartidaLocal) => { p.personagem.inventario = [{ idDaDefinicao: 'item', quantidade: 1 }, { idDaDefinicao: 'item', quantidade: 2 }] }],
    ['instância duplicada entre banco e mochila', (p: PartidaLocal) => { p.personagem.banco.itensDeEquipamento = [...p.personagem.itensDeEquipamento] }],
    ['referência de equipamento perdida', (p: PartidaLocal) => { p.personagem.equipamento.maoPrincipal = 'ausente' }],
    ['número infinito em campo opcional', (p: PartidaLocal) => { p.personagem.prestigio.pontos = Infinity }],
    ['relógio inválido', (p: PartidaLocal) => { p.ocioso.atividadeAtiva = { idDaDefinicaoDaAtividade: 'coleta', iniciadoEm: 'ontem', processadoPorUltimoEm: 'agora', segundosRestantes: 0 } }],
    ['habilidade equipada desconhecida', (p: PartidaLocal) => { p.personagem.espacosDeHabilidadesAtivas[0] = 'inexistente' }],
  ])('recusa %s', (_nome, corromper) => {
    const atual = partida(); corromper(atual)
    expect(() => validarIntegridadeDaPartida(atual)).toThrow('Partida inválida')
  })
  it('recusa subsistemas malformados e dados cíclicos sem travar a leitura', () => {
    const atual = partida()
    expect(() => validarIntegridadeDaPartida({ ...atual, personagem: { ...atual.personagem, banco: null } })).toThrow('banco')
    expect(() => validarIntegridadeDaPartida({ ...atual, grupo: [] })).toThrow('grupo')
    const circular: Record<string, unknown> = { ...atual }; circular.circular = circular
    expect(() => validarIntegridadeDaPartida(circular)).toThrow('circular')
  })
})

describe('subsistemas retomáveis', () => {
  it.each([
    ['parceiro ativo ausente', (p: PartidaLocal) => { p.grupo.idsDosParceirosAtivos = ['ausente'] }],
    ['vínculo inválido', (p: PartidaLocal) => { (p.grupo.parceiros['parceira.mira'] as unknown as Record<string, unknown>).vinculo = 'inválido' }],
    ['meta sem horário', (p: PartidaLocal) => { p.jornada.meta = { idDaDefinicaoDaReceita: 'receita', selecionadoEm: '', concluidoEm: null } }],
    ['reforço fora do domínio', (p: PartidaLocal) => { (p.personagem.itensDeEquipamento[0] as unknown as Record<string, unknown>).nivelDeReforco = 3 }],
  ])('recusa %s sem reparar ou apagar o save', (_nome, corromper) => {
    const atual = partida()
    corromper(atual)
    const copia = structuredClone(atual)
    expect(() => validarIntegridadeDaPartida(atual)).toThrow('Partida inválida')
    expect(atual).toEqual(copia)
  })
  it.each([
    { preset: 'inexistente' }, { semente: -1 }, { chanceDeSucesso: 2 },
    { terminaEm: '2026-11-06T00:00:00.000Z' },
  ])('recusa plano de incursão corrompido: %j', alteracao => {
    const atual = partida()
    Object.assign(atual.masmorra, { incursaoAutomaticaAtiva: {
      preset: 'cautelosa', semente: 1, chanceDeSucesso: 0.82, recompensaPossivel: [],
      iniciadaEm: '2026-11-07T00:00:00.000Z', terminaEm: '2026-11-07T00:15:00.000Z', ...alteracao,
    } })
    expect(() => validarIntegridadeDaPartida(atual)).toThrow('Partida inválida')
  })
})
