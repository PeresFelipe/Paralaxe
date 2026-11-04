/**
 * @file Prestígio I: duas linhas de fabricação, estoque partilhado, risco e equipamentos únicos.
 */
import { describe, expect, it } from 'vitest'
import { criarPartidaLocal, type PartidaLocal } from './personagem'
import {
  iniciarReceitaDeFabricacao, iniciarReceitaSecundaria, interromperReceitaSecundaria,
  processarProgressoDeFabricacao, processarProgressoDaReceitaSecundaria,
  ajustarReceitaParaSegundoEspaco, type DefinicaoDeReceitaDeFabricacao,
} from './fabricacao'
import { pausarTrabalhoAtualDuranteRisco } from './continuidade'

const inicio = '2026-11-04T12:00:00.000Z'
const tempo = (n: number) => new Date(Date.parse(inicio) + n * 1000).toISOString()
const classe = {
  id: 'errante' as const, nome: 'Errante', resumo: 'Teste',
  atributos: { vitalidade: 5, mente: 5, vigor: 5, forca: 5, destreza: 5, inteligencia: 5, fe: 5 },
  equipamentosIniciais: { maoPrincipal: 'arma.viagem-lanca' },
  idDaHabilidadeInicial: 'habilidade.abertura',
}
const presente = { id: 'nenhum' as const, nome: 'Nenhum', resumo: 'Teste', concessoes: [] }
const principal: DefinicaoDeReceitaDeFabricacao = {
  id: 'receita.metalurgia.alpha', idDaProfissao: 'metalurgia', nome: 'Alpha',
  nivelExigidoDaProfissao: 1, segundosPorAcao: 8, xpDeProfissaoPorAcao: 4,
  ingredientes: [{ idDaDefinicao: 'material.cloch', quantidade: 2 }],
  saida: { tipo: 'item', idDaDefinicao: 'material.alpha', nome: 'Alpha', quantidade: 1 },
}
const secundaria: DefinicaoDeReceitaDeFabricacao = {
  ...principal, id: 'receita.metalurgia.beta', nome: 'Beta', xpDeProfissaoPorAcao: 5,
  ingredientes: [{ idDaDefinicao: 'material.giuis', quantidade: 2 }],
  saida: { tipo: 'item', idDaDefinicao: 'material.beta', nome: 'Beta', quantidade: 1 },
}
function partida(prestigio = 1): PartidaLocal {
  const nova = criarPartidaLocal({
    idDaPartida: 'fabrica-paralela', criadoEm: inicio, versaoDoConteudo: 'test',
    nomeDoPersonagem: 'Aedan', classeDoPersonagem: classe, presente,
  })
  return {
    ...nova,
    profissoes: { ...nova.profissoes, metalurgia: { nivel: 1, xp: 0, prestigio } },
    personagem: { ...nova.personagem, inventario: [
      { idDaDefinicao: 'material.cloch', quantidade: 12 },
      { idDaDefinicao: 'material.giuis', quantidade: 12 },
    ] },
  }
}
function quantidade(partidaAtual: PartidaLocal, id: string) {
  return partidaAtual.personagem.inventario.find(x => x.idDaDefinicao === id)?.quantidade ?? 0
}
function iniciar(p: PartidaLocal = partida()) {
  return iniciarReceitaSecundaria(iniciarReceitaDeFabricacao(p, principal, inicio), principal, secundaria, inicio)
}

describe('GDD §9: produção paralela do Prestígio I', () => {
  it('exige P1, primeiro trabalho, ofício igual e receita diferente', () => {
    expect(() => iniciarReceitaSecundaria(partida(), principal, secundaria, inicio)).toThrow('principal')
    expect(() => iniciar(partida(0))).toThrow('Prestígio I')
    const pronto = iniciarReceitaDeFabricacao(partida(), principal, inicio)
    expect(() => iniciarReceitaSecundaria(pronto, principal, principal, inicio)).toThrow('outra receita')
    const outra = { ...secundaria, idDaProfissao: 'culinaria' as const }
    expect(() => iniciarReceitaSecundaria(pronto, principal, outra, inicio)).toThrow('mesmo Ofício')
    const reforco = { ...secundaria, saida: { tipo: 'equipamento-reforco' as const, nome: 'Reforço' } }
    expect(() => iniciarReceitaSecundaria(pronto, principal, reforco, inicio)).toThrow('Reforços')
  })

  it('executa dois ciclos principais e um secundário, preservando relógios, XP e materiais', () => {
    const rodando = iniciar()
    const primeira = processarProgressoDeFabricacao(rodando, principal, tempo(16))
    const segunda = processarProgressoDaReceitaSecundaria(primeira.partida, secundaria, tempo(16))
    expect(ajustarReceitaParaSegundoEspaco(secundaria).segundosPorAcao).toBe(16)
    expect(primeira.acoesConcluidas).toBe(2)
    expect(segunda.acoesConcluidas).toBe(1)
    expect(quantidade(segunda.partida, 'material.cloch')).toBe(8)
    expect(quantidade(segunda.partida, 'material.giuis')).toBe(10)
    expect(quantidade(segunda.partida, 'material.alpha')).toBe(2)
    expect(quantidade(segunda.partida, 'material.beta')).toBe(1)
    expect(segunda.partida.profissoes.metalurgia.xp).toBe(13)
    expect(segunda.partida.fabricacao.receitaAtiva?.idDaDefinicaoDaReceita).toBe(principal.id)
    expect(segunda.partida.fabricacao.receitaSecundaria?.idDaDefinicaoDaReceita).toBe(secundaria.id)
    expect(segunda.partida.jornada.idsDasReceitasFabricadas).toEqual([principal.id, secundaria.id])
    const repetida = processarProgressoDaReceitaSecundaria(segunda.partida, secundaria, tempo(16))
    expect(repetida.acoesConcluidas).toBe(0)
    expect(quantidade(repetida.partida, 'material.beta')).toBe(1)
  })

  it('não duplica ingredientes: o principal consome primeiro, a secundária recebe apenas o saldo', () => {
    const compete = { ...secundaria, ingredientes: principal.ingredientes }
    const base = partida()
    const apertada = { ...base, personagem: { ...base.personagem, inventario: [{ idDaDefinicao: 'material.cloch', quantidade: 3 }] } }
    const primeiro = iniciarReceitaDeFabricacao(apertada, principal, inicio)
    const ambos = iniciarReceitaSecundaria(primeiro, principal, compete, inicio)
    const a = processarProgressoDeFabricacao(ambos, principal, tempo(16))
    const b = processarProgressoDaReceitaSecundaria(a.partida, compete, tempo(16))
    expect(a.acoesConcluidas).toBe(1)
    expect(b.acoesConcluidas).toBe(0)
    expect(b.interrompidoPorMateriais).toBe(true)
    expect(quantidade(b.partida, 'material.cloch')).toBe(1)
    expect(quantidade(b.partida, 'material.alpha')).toBe(1)
    expect(quantidade(b.partida, 'material.beta')).toBe(0)
  })

  it('mantém IDs únicos de equipamentos fabricados pelas duas linhas', () => {
    const pecas = { ...principal, idDaProfissao: 'forja' as const, saida: { tipo: 'equipamento' as const, nome: 'Peça A', idDaDefinicao: 'armadura.peca-a' } }
    const outras = { ...secundaria, idDaProfissao: 'forja' as const, saida: { tipo: 'equipamento' as const, nome: 'Peça B', idDaDefinicao: 'armadura.peca-b' } }
    const base = partida()
    const forja = { ...base, profissoes: { ...base.profissoes, forja: { nivel: 1, xp: 0, prestigio: 1 } } }
    const ambos = iniciarReceitaSecundaria(iniciarReceitaDeFabricacao(forja, pecas, inicio), pecas, outras, inicio)
    const a = processarProgressoDeFabricacao(ambos, pecas, tempo(16))
    const b = processarProgressoDaReceitaSecundaria(a.partida, outras, tempo(16))
    expect(a.equipamentosProduzidos).toBe(2)
    expect(b.equipamentosProduzidos).toBe(1)
    const ids = b.partida.personagem.itensDeEquipamento.map(x => x.idDaInstancia)
    expect(new Set(ids).size).toBe(ids.length)
    expect(b.partida.personagem.proximaSequenciaDeEquipamento).toBe(base.personagem.proximaSequenciaDeEquipamento + 3)
  })

  it('congela os dois relógios durante risco, preservando o saldo secundário', () => {
    const ambos = iniciar()
    const parcial = processarProgressoDaReceitaSecundaria(ambos, secundaria, tempo(10))
    expect(parcial.partida.fabricacao.receitaSecundaria?.segundosRestantes).toBe(10)
    const pausado = pausarTrabalhoAtualDuranteRisco(parcial.partida, tempo(100))
    expect(pausado.fabricacao.receitaAtiva?.processadoPorUltimoEm).toBe(tempo(100))
    expect(pausado.fabricacao.receitaSecundaria?.processadoPorUltimoEm).toBe(tempo(100))
    const retomada = processarProgressoDaReceitaSecundaria(pausado, secundaria, tempo(106))
    expect(retomada.acoesConcluidas).toBe(1)
    expect(retomada.partida.fabricacao.receitaSecundaria?.segundosRestantes).toBe(0)
    const parada = interromperReceitaSecundaria(retomada.partida, tempo(106))
    expect(parada.fabricacao.receitaAtiva).not.toBeNull()
    expect(parada.fabricacao.receitaSecundaria).toBeNull()
  })
})
