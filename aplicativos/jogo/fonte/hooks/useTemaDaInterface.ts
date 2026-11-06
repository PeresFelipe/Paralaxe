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
    // A barra do navegador deve acompanhar a aparência ativa, inclusive após alternar.
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      tema === 'claro' ? '#ece7dc' : '#171d14',
    )
    try {
      window.localStorage.setItem(CHAVE_DO_TEMA, tema)
    } catch {
      // O tema ainda funciona na sessão atual quando localStorage está indisponível.
    }
  }, [tema])

  return [tema, definirTema] as const
}
