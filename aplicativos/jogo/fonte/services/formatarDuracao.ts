/**
 * Adaptado de IktahMetrics, src/renderer.js, função fmtDuration.
 * Copyright (c) 2026 Merrill Lines — MIT.
 * Fonte: https://github.com/Linesmerrill/IktahMetrics
 * Licença integral: /creditos/iktahmetrics-MIT.txt.
 * Alterações: tipagem, Math.ceil e correção do limite de 60 segundos.
 */
export function formatarDuracao(segundos: number): string {
  if (!Number.isFinite(segundos) || segundos <= 0) return '—'
  const total = Math.ceil(segundos)
  if (total < 60) return `${total}s`
  if (total < 3600) {
    const minutos = Math.floor(total / 60)
    const restantes = total - minutos * 60
    return restantes ? `${minutos}m ${restantes}s` : `${minutos}m`
  }
  const horas = Math.floor(total / 3600)
  const minutos = Math.floor((total - horas * 3600) / 60)
  return minutos ? `${horas}h ${minutos}m` : `${horas}h`
}
