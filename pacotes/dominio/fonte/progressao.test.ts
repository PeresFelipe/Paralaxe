/**
 * @file Testes de experiência geral acumulada e distribuição de atributos.
 * Protegem ganhos de múltiplos níveis, preservação de níveis já existentes e o orçamento
 * de pontos, incluindo a rejeição de uma distribuição maior que o saldo disponível.
 */
import { describe, expect, it } from 'vitest'
import { criarPartidaLocal } from './personagem'
import { distribuirPontosDeAtributo, concederXpGeral, obterNivelGeralPorXp, XP_GERAL_PARA_PROXIMO_NIVEL } from './progressao'

const classeDoPersonagem = {
  id: "errante" as const,
  nome: 'Errante',
  resumo: 'Teste',
  atributos: {
    vitalidade: 5,
    mente: 5,
    vigor: 5,
    forca: 5,
    destreza: 5,
    inteligencia: 5,
    fe: 5,
  },
  equipamentosIniciais: {
    maoPrincipal: "arma.viagem-lanca",
    peitoral: "armadura.viagem-protecao",
  },
  idDaHabilidadeInicial: "habilidade.abertura",
}

const presente = {
  id: "nenhum" as const,
  nome: 'Nenhum Presente',
  resumo: 'Teste',
  concessoes: [],
}

/** Cria um estado novo com identidade e horário fixos, isolando as alterações de cada caso. */
function criarPartida() {
  return criarPartidaLocal({
    idDaPartida: "progressao-test",
    criadoEm: '2026-09-09T12:00:00.000Z',
    versaoDoConteudo: '0.1.0-dev',
    nomeDoPersonagem: 'Teste',
    classeDoPersonagem,
    presente,
  })
}

describe("progressão geral da versão 0.1", () => {
  it("sobe para o nível 2 aos 100 de experiência e concede um ponto", () => {
    const partida = concederXpGeral(criarPartida(), 100, '2026-09-09T12:01:00.000Z')
    expect(partida.personagem.xp).toBe(100)
    expect(partida.personagem.nivel).toBe(2)
    expect(partida.personagem.pontosDeAtributoDisponiveis).toBe(1)
  })

  it("usa experiência total acumulada para atravessar múltiplos níveis", () => {
    const partida = concederXpGeral(criarPartida(), 475, '2026-09-09T12:01:00.000Z')
    expect(partida.personagem.nivel).toBe(4)
    expect(partida.personagem.pontosDeAtributoDisponiveis).toBe(3)
  })

  it("não reduz o nível de partidas já avançadas", () => {
    const base = criarPartida()
    const avancado = {
      ...base,
      personagem: { ...base.personagem, nivel: 5, xp: 10, pontosDeAtributoDisponiveis: 4 },
    }
    const partida = concederXpGeral(avancado, 5, '2026-09-09T12:01:00.000Z')
    expect(partida.personagem.nivel).toBe(5)
    expect(partida.personagem.pontosDeAtributoDisponiveis).toBe(4)
  })

  it("confirma uma distribuição de atributos e consome apenas os pontos usados", () => {
    const subiuDeNivel = concederXpGeral(criarPartida(), 475, '2026-09-09T12:01:00.000Z')
    const partida = distribuirPontosDeAtributo(
      subiuDeNivel,
      { vitalidade: 1, forca: 1 },
      '2026-09-09T12:02:00.000Z',
    )

    expect(partida.personagem.atributos.vitalidade).toBe(6)
    expect(partida.personagem.atributos.forca).toBe(6)
    expect(partida.personagem.pontosDeAtributoDisponiveis).toBe(1)
  })

  it("rejeita uma distribuição acima dos pontos disponíveis", () => {
    const subiuDeNivel = concederXpGeral(criarPartida(), 100, '2026-09-09T12:01:00.000Z')
    expect(() => distribuirPontosDeAtributo(
      subiuDeNivel,
      { vitalidade: 2 },
      '2026-09-09T12:02:00.000Z',
    )).toThrow('excede os pontos')
  })
})


describe('nível geral 1–99 (GDD §4)', () => {
  it('mantém os primeiros nove custos e alcança exatamente o nível 99', () => {
    expect(XP_GERAL_PARA_PROXIMO_NIVEL.slice(0, 3)).toEqual([100, 150, 225])
    expect(XP_GERAL_PARA_PROXIMO_NIVEL).toHaveLength(98)
    const xpPara99 = XP_GERAL_PARA_PROXIMO_NIVEL.reduce((soma, custo) => soma + custo, 0)
    expect(obterNivelGeralPorXp(xpPara99 - 1)).toBe(98)
    expect(obterNivelGeralPorXp(xpPara99)).toBe(99)
    expect(obterNivelGeralPorXp(xpPara99 * 2)).toBe(99)
  })

  it('concede pontos por cada nível atravessado sem rebaixar saves anteriores', () => {
    const xp = XP_GERAL_PARA_PROXIMO_NIVEL.slice(0, 10).reduce((a, b) => a + b, 0)
    const partida = concederXpGeral(criarPartida(), xp, '2026-09-09T12:01:00.000Z')
    expect(partida.personagem.nivel).toBe(11)
    expect(partida.personagem.pontosDeAtributoDisponiveis).toBe(10)
  })
})
