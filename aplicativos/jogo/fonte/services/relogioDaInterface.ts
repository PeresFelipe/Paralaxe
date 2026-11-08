/** Assina o relógio e recupera a leitura após suspensão da aba. */
export function observarRelogioDaInterface(
  lerAgora: () => number, aoAtualizar: (instante: number) => void, intervalo: number,
  janela: EventTarget = window, documento: EventTarget = document,
) {
  const atualizar = () => aoAtualizar(lerAgora())
  atualizar()
  const timer = setInterval(atualizar, intervalo)
  documento.addEventListener('visibilitychange', atualizar)
  janela.addEventListener('focus', atualizar)
  return () => {
    clearInterval(timer)
    documento.removeEventListener('visibilitychange', atualizar)
    janela.removeEventListener('focus', atualizar)
  }
}

export const lerTempoMonotonico = () => performance.now()
export const lerHorarioCivil = () => Date.now()
