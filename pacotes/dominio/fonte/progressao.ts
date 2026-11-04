/**
 * @file Progressão geral e distribuição confirmada de atributos.
 * A experiência geral é acumulada ao longo da partida; cada nível ganho concede um ponto.
 */
import { CHAVES_DOS_ATRIBUTOS, type ChaveDeAtributo, type PartidaLocal } from './personagem'

/** Custos por transição, não acumulados. Os nove primeiros preservam o balanceamento histórico. */
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
  ...Array.from({ length: 89 }, (_, indice) => {
    const faixa = indice + 1
    return Math.round(1200 + faixa * 155 + Math.pow(faixa, 1.6) * 22)
  }),
] as const

/** Regra canônica: níveis gerais 1–99. Os custos novos são valores provisórios. */
export const NIVEL_GERAL_MAXIMO = 99
/** Alias legado para evitar quebra de importações antigas, mantendo o limite efetivo atualizado. */
export const NIVEL_GERAL_MAXIMO_V01 = NIVEL_GERAL_MAXIMO

export type DistribuicaoDeAtributos = Partial<Record<ChaveDeAtributo, number>>

/** Soma os custos até localizar o nível correspondente à experiência total, respeitando o teto da versão. */
export function obterNivelGeralPorXp(totalXp: number) {
  let nivel = 1
  let acumulado = 0

  for (const exigido of XP_GERAL_PARA_PROXIMO_NIVEL) {
    acumulado += exigido
    if (totalXp < acumulado) break
    nivel += 1
  }

  return Math.min(nivel, NIVEL_GERAL_MAXIMO)
}

/**
 * Concede experiência não negativa e contabiliza todos os níveis atravessados de uma vez.
 * Preserva níveis de partidas já avançadas, mesmo se a tabela de experiência mudar.
 */
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

/** Valida toda a proposta antes de devolver os atributos alterados e descontar os pontos usados. */
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
