/**
 * @file GDD §9: segunda coleta após Prestígio I, eficiência reduzida e retomada sem duplicar ganhos.
 */
import { describe, expect, it } from 'vitest'
import { criarPartidaLocal } from './personagem'
import {
  iniciarAtividadeOciosa, iniciarAtividadeSecundaria, interromperAtividadeSecundaria,
  processarProgressoOcioso, processarProgressoDaAtividadeSecundaria,
  ajustarAtividadeParaSegundoEspaco, type DefinicaoDeAtividadeOciosa,
} from './ocioso'
import { pausarTrabalhoAtualDuranteRisco } from './continuidade'

const inicio = '2026-11-04T12:00:00.000Z'
const tempo = (segundos: number) => new Date(Date.parse(inicio) + segundos * 1000).toISOString()
const classe = {
  id: 'errante' as const, nome: 'Errante', resumo: 'Teste',
  atributos: { vitalidade: 5, mente: 5, vigor: 5, forca: 5, destreza: 5, inteligencia: 5, fe: 5 },
  equipamentosIniciais: { maoPrincipal: 'arma.viagem-lanca' }, idDaHabilidadeInicial: 'habilidade.abertura',
}
const presente = { id: 'nenhum' as const, nome: 'Nenhum', resumo: 'Teste', concessoes: [] }
const cloch: DefinicaoDeAtividadeOciosa = {
  id: 'coletar.mineracao.cloch', idDaProfissao: 'mineracao', nome: 'Cloch',
  idDaDefinicaoDoItemProduzido: 'material.cloch', nomeDoResultado: 'Cloch',
  nivelExigidoDaProfissao: 1, segundosPorAcao: 4, xpDeProfissaoPorAcao: 8,
}
const stan: DefinicaoDeAtividadeOciosa = {
  ...cloch, id: 'coletar.mineracao.stan', nome: 'Stán', nomeDoResultado: 'Stán',
  idDaDefinicaoDoItemProduzido: 'material.stan', nivelExigidoDaProfissao: 10,
  segundosPorAcao: 8, xpDeProfissaoPorAcao: 16,
}
const giuis: DefinicaoDeAtividadeOciosa = {
  ...cloch, id: 'coletar.lenhador.giuis', idDaProfissao: 'lenhador', nome: 'Giúis',
  nomeDoResultado: 'Giúis', idDaDefinicaoDoItemProduzido: 'material.giuis',
}
function partida(prestigio: number) {
  const nova = criarPartidaLocal({
    idDaPartida: 'segundo-espaco', criadoEm: inicio, versaoDoConteudo: 'test',
    nomeDoPersonagem: 'Aedan', classeDoPersonagem: classe, presente,
  })
  return { ...nova, profissoes: { ...nova.profissoes, mineracao: { nivel: 10, xp: 0, prestigio } } }
}
function quantidade(partidaAtual: ReturnType<typeof partida>, id: string) {
  return partidaAtual.personagem.inventario.find(p => p.idDaDefinicao === id)?.quantidade ?? 0
}

describe('GDD §9: coleta secundária do Prestígio I', () => {
  it('não permite segundo relógio no Normal, nem duplicata, Ofício diferente ou sem principal', () => {
    const normal = iniciarAtividadeOciosa(partida(0), cloch, inicio)
    expect(() => iniciarAtividadeSecundaria(normal, stan, inicio)).toThrow('Prestígio I')
    const prestigiado = partida(1)
    expect(() => iniciarAtividadeSecundaria(prestigiado, stan, inicio)).toThrow('principal')
    const inicial = iniciarAtividadeOciosa(prestigiado, cloch, inicio)
    expect(() => iniciarAtividadeSecundaria(inicial, cloch, inicio)).toThrow('outro recurso')
    expect(() => iniciarAtividadeSecundaria(inicial, giuis, inicio)).toThrow('mesmo Ofício')
  })

  it('credita 4 ciclos principais e 1 secundário em 16 segundos, sem repetir no mesmo instante', () => {
    let atual = iniciarAtividadeOciosa(partida(1), cloch, inicio)
    atual = iniciarAtividadeSecundaria(atual, stan, inicio)
    const principal = processarProgressoOcioso(atual, cloch, tempo(16))
    const secundaria = processarProgressoDaAtividadeSecundaria(principal.partida, stan, tempo(16))
    expect(principal.acoesConcluidas).toBe(4)
    expect(secundaria.acoesConcluidas).toBe(1)
    expect(ajustarAtividadeParaSegundoEspaco(stan).segundosPorAcao).toBe(16)
    expect(quantidade(secundaria.partida, 'material.cloch')).toBe(4)
    expect(quantidade(secundaria.partida, 'material.stan')).toBe(1)
    expect(secundaria.partida.profissoes.mineracao.xp).toBe(48)
    const repetida = processarProgressoDaAtividadeSecundaria(secundaria.partida, stan, tempo(16))
    expect(repetida.acoesConcluidas).toBe(0)
    expect(quantidade(repetida.partida, 'material.stan')).toBe(1)
    expect(repetida.partida.ocioso.atividadeAtiva?.idDaDefinicaoDaAtividade).toBe(cloch.id)
  })

  it('preserva o saldo de ciclo incompleto e pausa ambos no risco', () => {
    const secundaria = iniciarAtividadeSecundaria(iniciarAtividadeOciosa(partida(1), cloch, inicio), stan, inicio)
    const parcial = processarProgressoDaAtividadeSecundaria(secundaria, stan, tempo(10))
    expect(parcial.partida.ocioso.atividadeSecundaria?.segundosRestantes).toBe(10)
    const pausada = pausarTrabalhoAtualDuranteRisco(parcial.partida, tempo(20))
    expect(pausada.ocioso.atividadeAtiva?.processadoPorUltimoEm).toBe(tempo(20))
    expect(pausada.ocioso.atividadeSecundaria?.processadoPorUltimoEm).toBe(tempo(20))
    const retomada = processarProgressoDaAtividadeSecundaria(pausada, stan, tempo(26))
    expect(retomada.acoesConcluidas).toBe(1)
    expect(quantidade(retomada.partida, 'material.stan')).toBe(1)
    expect(retomada.partida.ocioso.atividadeSecundaria?.segundosRestantes).toBe(0)
    expect(interromperAtividadeSecundaria(retomada.partida, tempo(26)).ocioso.atividadeAtiva).not.toBeNull()
  })

  it('paralisa somente a secundária quando seu recurso esgota o Inventário', () => {
    const base = partida(1)
    const cheias = {
      ...base, personagem: { ...base.personagem, inventario: [
        { idDaDefinicao: 'material.cloch', quantidade: 1 },
        ...Array.from({ length: 23 }, (_, n) => ({ idDaDefinicao: `material.extra-${n}`, quantidade: 1 })),
      ] },
    }
    const principal = iniciarAtividadeOciosa(cheias, cloch, inicio)
    expect(() => iniciarAtividadeSecundaria(principal, stan, inicio)).toThrow('capacidade')
  })
})
