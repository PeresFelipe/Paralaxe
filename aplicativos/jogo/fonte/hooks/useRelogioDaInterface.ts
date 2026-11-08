import { useEffect, useState } from 'react'
import { observarRelogioDaInterface } from '@/services/relogioDaInterface'
export { lerTempoMonotonico, lerHorarioCivil } from '@/services/relogioDaInterface'

/** Os ticks solicitam uma leitura do relógio; nunca representam tempo acumulado. */
export function useRelogioDaInterface(ativo: boolean, intervalo: number, lerAgora: () => number) {
  const [agora, definirAgora] = useState(lerAgora)
  useEffect(() => {
    if (!ativo) return
    return observarRelogioDaInterface(lerAgora, definirAgora, intervalo)
  }, [ativo, intervalo, lerAgora])
  return agora
}
