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

/** Explica a configuração escolhida pelo jogador; não há IA nem decisão oculta. */
export function explicarPrioridadeDeOficio(
  prioridade: PrioridadeDeOficio | undefined,
  espaco: 'principal' | 'secundaria' | 'terciaria',
): string {
  const escolha = prioridade ?? 'equilibrado'
  const eficiencia = EFICIENCIAS_POR_PRIORIDADE[escolha][espaco]
  const nomes = { equilibrado: 'Equilibrado', principal: 'Prioridade principal', secundaria: 'Prioridade secundária' }
  const trabalhos = { principal: 'trabalho principal', secundaria: 'trabalho secundário', terciaria: 'terceiro trabalho' }
  return `${nomes[escolha]}: o ${trabalhos[espaco]} recebe eficiência de ${Math.round(eficiencia * 100)}% conforme sua configuração. Essa eficiência altera o tempo do ciclo, não a chance de recompensa.`
}
