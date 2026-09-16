/**
 * @file Aplica a recompensa do combate introdutório contra o lobo da estrada.
 * Reaproveita o resultado do motor e acrescenta o bônus do primeiro serviço uma única vez.
 */
import type { PartidaLocal } from './personagem'
import { aplicarResultadoDeCombate, type ResultadoDeCombate } from './combate'
import { concederXpGeral } from './progressao'

/** Concede 40 moedas e 25 XP extras apenas na primeira vitória; as vitórias seguintes mantêm a XP normal. */
export function aplicarResultadoDoCombateNaEstrada(
  partida: PartidaLocal,
  resultado: ResultadoDeCombate,
  agora: string,
): PartidaLocal {
  const primeiroServicoConcluir = resultado.desfecho === "vitoria" && !partida.combate.loboDerrotado
  // A condição de primeira vitória usa a partida anterior, antes que o motor marque loboDerrotado.
  let proximo = aplicarResultadoDeCombate(partida, "inimigo.estrada-lobo", resultado, agora)

  // A aplicação básica já somou XP. Recuperar a base antes de concederXpGeral evita somar duas vezes
  // e permite que a função de progressão calcule níveis e pontos de atributo.
  if (!primeiroServicoConcluir) {
    return concederXpGeral(
      { ...proximo, personagem: { ...proximo.personagem, xp: partida.personagem.xp } },
      resultado.xpConcedido,
      agora,
    )
  }

  proximo = {
    ...proximo,
    personagem: {
      ...proximo.personagem,
      xp: partida.personagem.xp,
      ouro: proximo.personagem.ouro + 40,
    },
  }

  return concederXpGeral(proximo, resultado.xpConcedido + 25, agora)
}
