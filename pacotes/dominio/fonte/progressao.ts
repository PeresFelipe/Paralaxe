import { CHAVES_DOS_ATRIBUTOS, type ChaveDeAtributo, type PartidaLocal } from './personagem'

export const XP_GERAL_PARA_PROXIMO_NIVEL = [
  100,
  150,
  225,
  325,
  450,
  600,
  775,
  975,
  1200,
] as const

export const NIVEL_GERAL_MAXIMO_V01 = 10

export type DistribuicaoDeAtributos = Partial<Record<ChaveDeAtributo, number>>

export function obterNivelGeralPorXp(totalXp: number) {
  let nivel = 1
  let acumulado = 0

  for (const exigido of XP_GERAL_PARA_PROXIMO_NIVEL) {
    acumulado += exigido
    if (totalXp < acumulado) break
    nivel += 1
  }

  return Math.min(nivel, NIVEL_GERAL_MAXIMO_V01)
}

export function concederXpGeral(
  partida: PartidaLocal,
  quantidadeTotal: number,
  agora: string,
): PartidaLocal {
  if (!Number.isFinite(quantidadeTotal) || quantidadeTotal < 0) {
    throw new Error('XP Geral concedido precisa ser um valor não negativo.')
  }

  if (quantidadeTotal === 0) return partida

  const xp = partida.personagem.xp + quantidadeTotal
  const nivel = Math.max(partida.personagem.nivel, obterNivelGeralPorXp(xp))
  const niveisGanhos = Math.max(0, nivel - partida.personagem.nivel)

  return {
    ...partida,
    atualizadoEm: agora,
    personagem: {
      ...partida.personagem,
      xp,
      nivel,
      pontosDeAtributoDisponiveis: partida.personagem.pontosDeAtributoDisponiveis + niveisGanhos,
    },
  }
}

export function distribuirPontosDeAtributo(
  partida: PartidaLocal,
  distribuicao: DistribuicaoDeAtributos,
  agora: string,
): PartidaLocal {
  let gastoPontos = 0
  const atributos = { ...partida.personagem.atributos }

  for (const chave of CHAVES_DOS_ATRIBUTOS) {
    const quantidadeTotal = distribuicao[chave] ?? 0
    if (!Number.isInteger(quantidadeTotal) || quantidadeTotal < 0) {
      throw new Error('A distribuição de atributos precisa usar valores inteiros não negativos.')
    }
    gastoPontos += quantidadeTotal
    atributos[chave] += quantidadeTotal
  }

  if (gastoPontos <= 0) {
    throw new Error('Distribua pelo menos um ponto de atributo antes de confirmar.')
  }

  if (gastoPontos > partida.personagem.pontosDeAtributoDisponiveis) {
    throw new Error('A distribuição excede os pontos de atributo disponíveis.')
  }

  return {
    ...partida,
    atualizadoEm: agora,
    personagem: {
      ...partida.personagem,
      atributos,
      pontosDeAtributoDisponiveis: partida.personagem.pontosDeAtributoDisponiveis - gastoPontos,
    },
  }
}
