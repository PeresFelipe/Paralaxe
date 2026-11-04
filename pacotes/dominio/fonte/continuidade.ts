/**
 * @file Coordena a continuidade do trabalho seguro ao entrar e sair de situações de risco.
 * Mantém a seleção de coleta ou receita, mas desloca sua referência de tempo para que
 * o período passado em combate ou masmorra não gere produção paralela.
 */
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
      ...partida.ocioso,
      atividadeTerciaria: partida.ocioso.atividadeTerciaria
        ? { ...partida.ocioso.atividadeTerciaria, processadoPorUltimoEm: agora } : null,
      atividadeSecundaria: partida.ocioso.atividadeSecundaria
        ? { ...partida.ocioso.atividadeSecundaria, processadoPorUltimoEm: agora }
        : null,
      atividadeAtiva: partida.ocioso.atividadeAtiva
        ? { ...partida.ocioso.atividadeAtiva, processadoPorUltimoEm: agora }
        : null,
    },
    fabricacao: {
      ...partida.fabricacao,
      receitaTerciaria: partida.fabricacao.receitaTerciaria
        ? { ...partida.fabricacao.receitaTerciaria, processadoPorUltimoEm: agora } : null,
      receitaSecundaria: partida.fabricacao.receitaSecundaria
        ? { ...partida.fabricacao.receitaSecundaria, processadoPorUltimoEm: agora }
        : null,
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
  // A validação de iniciarMasmorra exige trabalho inativo; a retirada é temporária e só nesta chamada.
  const desvinculado: PartidaLocal = {
    ...pausado,
    ocioso: { ...pausado.ocioso, atividadeAtiva: null, atividadeSecundaria: null, atividadeTerciaria: null },
    fabricacao: { ...pausado.fabricacao, receitaAtiva: null, receitaSecundaria: null, receitaTerciaria: null },
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
