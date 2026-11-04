/** @file Prestígios II/III: prioridades determinísticas, três relógios e produção sem duplicação. */
import { describe, expect, it } from 'vitest'
import { criarPartidaLocal, type PartidaLocal } from './personagem'
import {
  iniciarAtividadeOciosa, iniciarAtividadeSecundaria, iniciarAtividadeTerciaria,
  processarProgressoOcioso, processarProgressoDaAtividadeSecundaria,
  processarProgressoDaAtividadeTerciaria, configurarPrioridadeDaColeta,
  type DefinicaoDeAtividadeOciosa,
} from './ocioso'
import {
  iniciarReceitaDeFabricacao, iniciarReceitaSecundaria, iniciarReceitaTerciaria,
  processarProgressoDeFabricacao, processarProgressoDaReceitaSecundaria,
  processarProgressoDaReceitaTerciaria, configurarPrioridadeDaFabricacao,
  type DefinicaoDeReceitaDeFabricacao,
} from './fabricacao'
import { pausarTrabalhoAtualDuranteRisco } from './continuidade'
import { segundosPorAcaoComPrioridade } from './prioridadesDeOficio'

const inicio = '2026-11-04T12:00:00.000Z'
const tempo = (s: number) => new Date(Date.parse(inicio) + s * 1000).toISOString()
const classe = {
  id: 'errante' as const, nome: 'Errante', resumo: 'Teste',
  atributos: { vitalidade: 5, mente: 5, vigor: 5, forca: 5, destreza: 5, inteligencia: 5, fe: 5 },
  equipamentosIniciais: { maoPrincipal: 'arma.viagem-lanca' },
  idDaHabilidadeInicial: 'habilidade.abertura',
}
const presente = { id: 'nenhum' as const, nome: 'Nenhum', resumo: 'Teste', concessoes: [] }
function partida(prestigio = 3): PartidaLocal {
  const base = criarPartidaLocal({ idDaPartida: 'prestigio-avancado', criadoEm: inicio,
    versaoDoConteudo: 'test', nomeDoPersonagem: 'Aedan', classeDoPersonagem: classe, presente })
  return { ...base, profissoes: {
    ...base.profissoes, mineracao: { nivel: 30, xp: 0, prestigio },
    metalurgia: { nivel: 30, xp: 0, prestigio },
  }, personagem: { ...base.personagem, inventario: [
    { idDaDefinicao: 'material.cloch', quantidade: 20 },
    { idDaDefinicao: 'material.stan', quantidade: 20 },
    { idDaDefinicao: 'material.copar', quantidade: 20 },
  ] } }
}
const coletas = ['cloch', 'stan', 'copar'].map((slug, indice) => ({
  id: `coletar.mineracao.${slug}`, idDaProfissao: 'mineracao', nome: slug,
  idDaDefinicaoDoItemProduzido: `material.${slug}`, nomeDoResultado: slug,
  nivelExigidoDaProfissao: indice === 2 ? 20 : 1, segundosPorAcao: 8,
  xpDeProfissaoPorAcao: 8,
})) as [DefinicaoDeAtividadeOciosa, DefinicaoDeAtividadeOciosa, DefinicaoDeAtividadeOciosa]
const receitas = ['alpha', 'beta', 'gama'].map((slug, indice): DefinicaoDeReceitaDeFabricacao => ({
  id: `receita.metalurgia.${slug}`, idDaProfissao: 'metalurgia',
  nome: slug, nivelExigidoDaProfissao: 1, segundosPorAcao: 8, xpDeProfissaoPorAcao: 8,
  ingredientes: [{ idDaDefinicao: (['material.cloch', 'material.stan', 'material.copar'] as const)[indice] ?? 'material.cloch', quantidade: 2 }],
  saida: { tipo: 'item', idDaDefinicao: `material.liga-${slug}`, nome: slug, quantidade: 1 },
})) as [DefinicaoDeReceitaDeFabricacao, DefinicaoDeReceitaDeFabricacao, DefinicaoDeReceitaDeFabricacao]
const qtd = (p: PartidaLocal, id: string) => p.personagem.inventario.find(i => i.idDaDefinicao === id)?.quantidade ?? 0

describe('GDD §9: Prestígios II e III', () => {
  it('impede alterar prioridade antes do Prestígio II e valida a distribuição dos relógios', () => {
    const inicial = iniciarAtividadeOciosa(partida(1), coletas[0], inicio)
    expect(() => configurarPrioridadeDaColeta(inicial, 'secundaria', inicio)).toThrow('Prestígio II')
    const p2 = iniciarAtividadeSecundaria(iniciarAtividadeOciosa(partida(2), coletas[0], inicio), coletas[1], inicio)
    const secundario = configurarPrioridadeDaColeta(p2, 'secundaria', inicio)
    expect(secundario.ocioso.prioridade).toBe('secundaria')
    expect(segundosPorAcaoComPrioridade(8, 'secundaria', 'principal')).toBe(10)
    expect(segundosPorAcaoComPrioridade(8, 'secundaria', 'secundaria')).toBe(11)
    expect(segundosPorAcaoComPrioridade(8, 'principal', 'principal')).toBe(7)
    expect(segundosPorAcaoComPrioridade(8, 'equilibrado', 'secundaria')).toBe(16)
  })

  it('exige Prestígio III e três coletas distintas da mesma profissão', () => {
    const p2 = iniciarAtividadeSecundaria(iniciarAtividadeOciosa(partida(2), coletas[0], inicio), coletas[1], inicio)
    expect(() => iniciarAtividadeTerciaria(p2, coletas[2], inicio)).toThrow('Prestígio III')
    const p3 = iniciarAtividadeSecundaria(iniciarAtividadeOciosa(partida(), coletas[0], inicio), coletas[1], inicio)
    expect(() => iniciarAtividadeTerciaria(p3, coletas[0], inicio)).toThrow('diferente')
    const terceiro = iniciarAtividadeTerciaria(p3, coletas[2], inicio)
    const um = processarProgressoOcioso(terceiro, coletas[0], tempo(32))
    const dois = processarProgressoDaAtividadeSecundaria(um.partida, coletas[1], tempo(32))
    const tres = processarProgressoDaAtividadeTerciaria(dois.partida, coletas[2], tempo(32))
    expect([um.acoesConcluidas, dois.acoesConcluidas, tres.acoesConcluidas]).toEqual([4, 2, 1])
    expect(qtd(tres.partida, 'material.cloch')).toBe(24)
    expect(qtd(tres.partida, 'material.stan')).toBe(22)
    expect(qtd(tres.partida, 'material.copar')).toBe(21)
    const repetido = processarProgressoDaAtividadeTerciaria(tres.partida, coletas[2], tempo(32))
    expect(repetido.acoesConcluidas).toBe(0)
    expect(repetido.partida.ocioso.atividadeAtiva).toEqual(tres.partida.ocioso.atividadeAtiva)
    expect(tres.partida.versaoDoEsquemaDaPartida).toBe(16)
    const pausa = pausarTrabalhoAtualDuranteRisco(tres.partida, tempo(100))
    expect(pausa.ocioso.atividadeTerciaria?.processadoPorUltimoEm).toBe(tempo(100))
  })

  it('três receitas compartilham ingredientes e geram resultados sem duplicação', () => {
    const [a,b,c] = receitas
    const p = iniciarReceitaSecundaria(iniciarReceitaDeFabricacao(partida(), a, inicio), a, b, inicio)
    const tres = iniciarReceitaTerciaria(p, a, b, c, inicio)
    const um = processarProgressoDeFabricacao(tres, a, tempo(32))
    const dois = processarProgressoDaReceitaSecundaria(um.partida, b, tempo(32))
    const terceiro = processarProgressoDaReceitaTerciaria(dois.partida, c, tempo(32))
    expect([um.acoesConcluidas, dois.acoesConcluidas, terceiro.acoesConcluidas]).toEqual([4,2,1])
    expect(qtd(terceiro.partida,'material.liga-alpha')).toBe(4)
    expect(qtd(terceiro.partida,'material.liga-beta')).toBe(2)
    expect(qtd(terceiro.partida,'material.liga-gama')).toBe(1)
    expect(qtd(terceiro.partida,'material.cloch')).toBe(12)
    expect(qtd(terceiro.partida,'material.stan')).toBe(16)
    expect(qtd(terceiro.partida,'material.copar')).toBe(18)
    expect(processarProgressoDaReceitaTerciaria(terceiro.partida, c, tempo(32)).acoesConcluidas).toBe(0)
    expect(terceiro.partida.jornada.idsDasReceitasFabricadas).toEqual([a.id, b.id, c.id])
    const pausado = pausarTrabalhoAtualDuranteRisco(terceiro.partida, tempo(100))
    expect(pausado.fabricacao.receitaTerciaria?.processadoPorUltimoEm).toBe(tempo(100))
  })

  it('prioridade de produção requer Prestígio II e mantém a receita selecionada', () => {
    const [a] = receitas
    const p1 = iniciarReceitaDeFabricacao(partida(1), a, inicio)
    expect(() => configurarPrioridadeDaFabricacao(p1, a, 'principal', inicio)).toThrow('Prestígio II')
    const p2 = iniciarReceitaDeFabricacao(partida(2), a, inicio)
    const configurado = configurarPrioridadeDaFabricacao(p2, a, 'secundaria', inicio)
    expect(configurado.fabricacao.prioridade).toBe('secundaria')
    expect(configurado.fabricacao.receitaAtiva).toEqual(p2.fabricacao.receitaAtiva)
  })
})
