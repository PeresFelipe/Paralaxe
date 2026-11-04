/**
 * @file GDD §7: oportunidades opcionais, sete temas e ausência de penalidade na coleta.
 */
import { describe, expect, it } from 'vitest'
import { criarPartidaLocal, type PartidaLocal } from './personagem'
import {
  criarEstadoInicialDosMinigames, obterOportunidadeDeMinigame,
  responderMinigameDeOficio, obterBonusXpDoMinigame,
  DURACAO_DA_JANELA_DE_MINIGAME_MS,
} from './minigamesDeOficio'
import { iniciarAtividadeOciosa, processarProgressoOcioso, type DefinicaoDeAtividadeOciosa, type IdDaProfissao } from './ocioso'
const inicio = '2026-11-04T12:00:00.000Z'
const tempo = (n: number) => new Date(Date.parse(inicio) + n * 1000).toISOString()
const classe = {
  id: 'errante' as const, nome: 'Errante', resumo: 'Teste',
  atributos: { vitalidade: 5, mente: 5, vigor: 5, forca: 5, destreza: 5, inteligencia: 5, fe: 5 },
  equipamentosIniciais: { maoPrincipal: 'arma.viagem-lanca' }, idDaHabilidadeInicial: 'habilidade.abertura',
}
const presente = { id: 'nenhum' as const, nome: 'Nenhum', resumo: 'Teste', concessoes: [] }
const oficios: readonly IdDaProfissao[] = ['mineracao', 'lenhador', 'pesca', 'herbologia', 'metalurgia', 'forja', 'culinaria']
function novaPartida(): PartidaLocal {
  return criarPartidaLocal({ idDaPartida: 'testa-minigame', criadoEm: inicio, versaoDoConteudo: 'test',
    nomeDoPersonagem: 'Aedan', classeDoPersonagem: classe, presente })
}
const coleta: DefinicaoDeAtividadeOciosa = { id: 'coletar.mineracao.cloch', idDaProfissao: 'mineracao',
  nome: 'Cloch', idDaDefinicaoDoItemProduzido: 'material.cloch', nomeDoResultado: 'Cloch',
  nivelExigidoDaProfissao: 1, segundosPorAcao: 4, xpDeProfissaoPorAcao: 8 }
function emAtividade(oficio: IdDaProfissao): PartidaLocal {
  const base = novaPartida()
  if (['mineracao','lenhador','pesca','herbologia'].includes(oficio)) {
    return { ...base, ocioso: { ...base.ocioso, atividadeAtiva: {
      idDaDefinicaoDaAtividade: `coletar.${oficio}.teste`, iniciadoEm: inicio,
      processadoPorUltimoEm: inicio, segundosRestantes: 0 } } }
  }
  return { ...base, fabricacao: { ...base.fabricacao, receitaAtiva: {
    idDaDefinicaoDaReceita: `receita.${oficio}.teste`, iniciadoEm: inicio,
    processadoPorUltimoEm: inicio, segundosRestantes: 0, idDaInstanciaDoEquipamentoAlvo: null,
  } } }
}

describe('GDD: sete minigames de profissão', () => {
  for (const oficio of oficios) {
    it(`${oficio}: janela opcional com três escolhas e uma única tentativa`, () => {
      const partida = emAtividade(oficio)
      expect(obterOportunidadeDeMinigame(partida, oficio, tempo(59))).toBeNull()
      const desafio = obterOportunidadeDeMinigame(partida, oficio, tempo(61))
      if (!desafio) throw new Error('Janela de desafio ausente.')
      expect(desafio.opcoes).toHaveLength(3)
      expect(desafio.nome.length).toBeGreaterThan(4)
      expect(desafio.instrucao.length).toBeGreaterThan(15)
      const errado = (desafio.respostaCorreta + 1) % 3
      const resultado = responderMinigameDeOficio(partida, oficio, errado, tempo(61))
      expect(resultado.acertou).toBe(false)
      expect(resultado.partida.minigames?.bonusAtivo).toBeNull()
      expect(resultado.partida.ocioso).toEqual(partida.ocioso)
      expect(resultado.partida.fabricacao).toEqual(partida.fabricacao)
      expect(resultado.partida.personagem.inventario).toEqual(partida.personagem.inventario)
      expect(obterOportunidadeDeMinigame(resultado.partida, oficio, tempo(62))).toBeNull()
      expect(() => responderMinigameDeOficio(resultado.partida, oficio, 0, tempo(62))).toThrow('expirou')
    })
  }

  it('acerto aplica +4 XP por ciclo somente após o clique, sem retroatividade', () => {
    const iniciado = iniciarAtividadeOciosa(novaPartida(), coleta, inicio)
    const processado = processarProgressoOcioso(iniciado, coleta, tempo(60))
    expect(processado.acoesConcluidas).toBe(15)
    const oportunidade = obterOportunidadeDeMinigame(processado.partida, 'mineracao', tempo(60))
    if (!oportunidade) throw new Error('Oportunidade ausente')
    const respondido = responderMinigameDeOficio(processado.partida, 'mineracao', oportunidade.respostaCorreta, tempo(60))
    expect(respondido.acertou).toBe(true)
    expect(obterBonusXpDoMinigame(respondido.partida, 'mineracao', inicio, tempo(64))).toBe(0)
    expect(obterBonusXpDoMinigame(respondido.partida, 'lenhador', tempo(60), tempo(64))).toBe(0)
    const doisCiclos = processarProgressoOcioso(respondido.partida, coleta, tempo(68))
    expect(doisCiclos.acoesConcluidas).toBe(2)
    expect(doisCiclos.xpDeProfissaoConcedido).toBe(2 * (coleta.xpDeProfissaoPorAcao + 4))
    const repetido = processarProgressoOcioso(doisCiclos.partida, coleta, tempo(68))
    expect(repetido.acoesConcluidas).toBe(0)
    expect(obterBonusXpDoMinigame(doisCiclos.partida,'mineracao',tempo(60),tempo(241))).toBe(0)
  })

  it('as janelas evoluem periodicamente e mantêm tentativas anteriores registradas', () => {
    const p = emAtividade('pesca')
    const primeiro = obterOportunidadeDeMinigame(p,'pesca',tempo(61))
    if (!primeiro) throw new Error('Janela inicial ausente')
    const usado = responderMinigameDeOficio(p,'pesca',primeiro.respostaCorreta,tempo(61)).partida
    const proxima = new Date((primeiro.janela + 1) * DURACAO_DA_JANELA_DE_MINIGAME_MS + 65000).toISOString()
    const outro = obterOportunidadeDeMinigame(usado,'pesca',proxima)
    expect(outro).not.toBeNull()
    expect(outro?.janela).toBe(primeiro.janela + 1)
    expect(usado.minigames?.ultimasJanelasUsadas.pesca).toBe(primeiro.janela)
    expect(novaPartida().minigames).toEqual(criarEstadoInicialDosMinigames())
  })

  it('recusa entrada inválida ou jogo durante expedição ativa', () => {
    const p = emAtividade('mineracao')
    expect(() => responderMinigameDeOficio(p,'mineracao',-1,tempo(61))).toThrow('inválida')
    const semAtividade = novaPartida()
    expect(obterOportunidadeDeMinigame(semAtividade,'mineracao',tempo(61))).toBeNull()
  })
})
