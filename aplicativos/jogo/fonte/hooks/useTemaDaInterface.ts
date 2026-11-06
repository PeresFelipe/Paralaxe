import { useLayoutEffect, useState } from 'react'

export type TemaDaInterface = 'escuro' | 'claro'

export const CHAVE_DO_TEMA = 'paralaxe.ui.tema'

/** Preferência de aparência é do navegador, nunca do save do personagem. */
export function normalizarTemaDaInterface(valor: string | null): TemaDaInterface {
  return valor === 'claro' ? 'claro' : 'escuro'
}

/** Falhas de armazenamento (modo privado, permissões) não bloqueiam a partida. */
export function lerTemaDaInterface(armazenamento?: Pick<Storage, 'getItem'> | null): TemaDaInterface {
  try {
    const origem = armazenamento === undefined && typeof window !== 'undefined'
      ? window.localStorage
      : armazenamento
    return normalizarTemaDaInterface(origem?.getItem(CHAVE_DO_TEMA) ?? null)
  } catch {
    return 'escuro'
  }
}

export function useTemaDaInterface() {
  const [tema, definirTema] = useState<TemaDaInterface>(lerTemaDaInterface)

  // A mudança ocorre antes da pintura para não piscar ao trocar de tela.
  useLayoutEffect(() => {
    document.documentElement.dataset.tema = tema
    try {
      window.localStorage.setItem(CHAVE_DO_TEMA, tema)
    } catch {
      // O tema ainda funciona na sessão atual quando localStorage está indisponível.
    }
  }, [tema])

  return [tema, definirTema] as const
}
