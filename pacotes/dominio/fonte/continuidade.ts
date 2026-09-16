import type { RecursosDeCombate } from './combate'
import type { PartidaLocal } from './personagem'
import { iniciarMasmorra, type DefinicaoDeMasmorra } from './masmorra'

/**
 * Congela a referência de tempo do trabalho ocioso selecionado.
 * A partida preserva o trabalho para mostrar o que será retomado depois do risco,
 * sem acumular progresso durante o contexto perigoso.
 */
export function pausarTrabalhoAtualDuranteRisco(partida: PartidaLocal, agora: string): PartidaLocal {
  return {
    ...partida,
    atualizadoEm: agora,
    ocioso: {
      atividadeAtiva: partida.ocioso.atividadeAtiva
        ? { ...partida.ocioso.atividadeAtiva, processadoPorUltimoEm: agora }
        : null,
    },
    fabricacao: {
      receitaAtiva: partida.fabricacao.receitaAtiva
        ? { ...partida.fabricacao.receitaAtiva, processadoPorUltimoEm: agora }
        : null,
    },
  }
}

/**
 * Inicia a masmorra preservando o trabalho seguro que será retomado depois.
 * A função iniciarMasmorra mantém sua restrição de estado; este adaptador remove
 * o trabalho durante a chamada inicial e o restaura pausado na partida resultante.
 */
export function iniciarMasmorraComContinuidade(
  partida: PartidaLocal,
  masmorra: DefinicaoDeMasmorra,
  semente: number,
  agora: string,
  recursosIniciais?: RecursosDeCombate,
): PartidaLocal {
  const pausado = pausarTrabalhoAtualDuranteRisco(partida, agora)
  const desvinculado: PartidaLocal = {
    ...pausado,
    ocioso: { atividadeAtiva: null },
    fabricacao: { receitaAtiva: null },
  }
  const iniciado = iniciarMasmorra(desvinculado, masmorra, semente, agora, recursosIniciais)

  return {
    ...iniciado,
    ocioso: pausado.ocioso,
    fabricacao: pausado.fabricacao,
  }
}

/**
 * Reinicia a referência de tempo após o combate ou a masmorra, sem exigir
 * que o jogador reinicie manualmente a atividade selecionada antes do risco.
 */
export function retomarTrabalhoAposRisco(partida: PartidaLocal, agora: string): PartidaLocal {
  return pausarTrabalhoAtualDuranteRisco(partida, agora)
}
