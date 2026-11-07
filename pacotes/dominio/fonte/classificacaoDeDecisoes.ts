/**
 * Trecho adaptado de Universal-AI, src/game/overseer/utility.ts (scored/rankActions).
 * Copyright (c) 2026 TechLuddite — MIT.
 * Fonte: https://github.com/TechLuddite/Universal-AI
 * Licença completa distribuída em /creditos/universal-ai-MIT.txt.
 *
 * Alterações do Paralaxe: motor genérico tipado, validação de pontuação,
 * desempate determinístico e função síncrona sem efeitos colaterais.
 */
export const PESO_DE_ADERENCIA_A_DIRETRIZ = 0.35

export interface CandidatoDeDecisao<Id extends string> {
  id: Id
  /** Benefício normalizado (0..1) no objetivo do jogador. */
  utilidade: number
  /** Aderência às preferências já configuradas (0..1); padrão = 1. */
  alinhamento?: number
  /** Justificativa curta, produzida pelo sistema que propôs a ação. */
  motivo: string
}

export type DecisaoPontuada<Id extends string> = Omit<CandidatoDeDecisao<Id>, 'alinhamento'> & {
  alinhamento: number
  pontuacao: number
}

function limitarProporcao(valor: number): number {
  return Number.isFinite(valor) ? Math.min(1, Math.max(0, valor)) : 0
}

/** Original: score = utility * (1 - DIRECTIVE_WEIGHT + DIRECTIVE_WEIGHT * fit). */
export function pontuarDecisao<Id extends string>(
  candidato: CandidatoDeDecisao<Id>,
): DecisaoPontuada<Id> {
  const utilidade = limitarProporcao(candidato.utilidade)
  const alinhamento = candidato.alinhamento === undefined
    ? 1
    : limitarProporcao(candidato.alinhamento)

  return {
    ...candidato,
    utilidade,
    alinhamento,
    pontuacao: utilidade * (1 - PESO_DE_ADERENCIA_A_DIRETRIZ + PESO_DE_ADERENCIA_A_DIRETRIZ * alinhamento),
  }
}

/** Classifica alternativas sem alterar o array recebido nem consultar estado global. */
export function classificarDecisoes<Id extends string>(
  candidatos: readonly CandidatoDeDecisao<Id>[],
): DecisaoPontuada<Id>[] {
  return candidatos
    .map((candidato, ordem) => ({ opcao: pontuarDecisao(candidato), ordem }))
    .sort((a, b) => b.opcao.pontuacao - a.opcao.pontuacao || a.ordem - b.ordem)
    .map(({ opcao }) => opcao)
}
