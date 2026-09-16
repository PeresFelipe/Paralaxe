/**
 * @file Contêiner modal reutilizado pelos painéis laterais da partida.
 * A presença do componente controla a abertura; o pai recebe a intenção de fechar.
 */
import { useEffect, useRef, type ReactNode } from 'react'

/** Abre o diálogo nativo, mantém o foco modal e o devolve ao acionador na desmontagem. */
export default function PainelRapido({ rotulo, aoFechar, children }: {
  rotulo: string
  aoFechar: () => void
  children: ReactNode
}) {
  const janelaReferencia = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const janela = janelaReferencia.current
    const acionar = document.activeElement
    janela?.showModal()
    return () => {
      janela?.close()
      if (acionar instanceof HTMLElement && acionar.isConnected) acionar.focus()
    }
  }, [])

  return <dialog ref={janelaReferencia} className="lateral-folha" aria-label={rotulo} onCancel={(evento) => {
    // Sincroniza a tecla Esc com o estado do pai, em vez de só fechar o elemento HTML.
    evento.preventDefault()
    aoFechar()
  }}>{children}</dialog>
}
