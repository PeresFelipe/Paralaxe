import { useEffect, useState } from 'react'

/** Preferência de apresentação isolada do save. Armazenamento indisponível não bloqueia o jogo. */
export function usePreferenciaDeTela<T extends string>(chave: string, inicial: T, opcoes: readonly T[], restaurar = true) {
  const [valor, definirValor] = useState<T>(() => {
    if (!restaurar || typeof window === 'undefined') return inicial
    try {
      const salvo = window.localStorage.getItem(`paralaxe.ui.${chave}`)
      return opcoes.find(opcao => opcao === salvo) ?? inicial
    } catch { return inicial }
  })
  useEffect(() => {
    if (!restaurar) return
    try { window.localStorage.setItem(`paralaxe.ui.${chave}`, valor) }
    catch { /* A navegação continua em memória quando o armazenamento é bloqueado. */ }
  }, [chave, valor, restaurar])
  return [valor, definirValor] as const
}
