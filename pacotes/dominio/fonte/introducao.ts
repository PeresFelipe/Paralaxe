import type { PartidaLocal } from './personagem'
import { aplicarResultadoDeCombate, type ResultadoDeCombate } from './combate'
import { concederXpGeral } from './progressao'

export function aplicarResultadoDoCombateNaEstrada(
  partida: PartidaLocal,
  resultado: ResultadoDeCombate,
  agora: string,
): PartidaLocal {
  const primeiroServicoConcluir = resultado.desfecho === "vitoria" && !partida.combate.loboDerrotado
  let proximo = aplicarResultadoDeCombate(partida, "inimigo.estrada-lobo", resultado, agora)

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
