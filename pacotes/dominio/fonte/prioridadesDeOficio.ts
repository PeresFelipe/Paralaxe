/** Distribuição de trabalho de Prestígio II. Percentuais provisórios, sem RNG. */
export const PRIORIDADES_DE_OFICIO = ['equilibrado', 'principal', 'secundaria'] as const
export type PrioridadeDeOficio = (typeof PRIORIDADES_DE_OFICIO)[number]
export const EFICIENCIAS_POR_PRIORIDADE = {
  equilibrado: { principal: 1, secundaria: 0.5, terciaria: 0.33 },
  principal: { principal: 1.25, secundaria: 0.35, terciaria: 0.33 },
  secundaria: { principal: 0.8, secundaria: 0.75, terciaria: 0.33 },
} as const
export function segundosPorAcaoComPrioridade(
  segundos: number, prioridade: PrioridadeDeOficio | undefined,
  espaco: 'principal' | 'secundaria' | 'terciaria',
): number {
  return Math.max(1, Math.ceil(segundos / EFICIENCIAS_POR_PRIORIDADE[prioridade ?? 'equilibrado'][espaco]))
}
