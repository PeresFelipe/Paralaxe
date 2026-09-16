import { useEffect, useRef, type ReactNode } from 'react'

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
    evento.preventDefault()
    aoFechar()
  }}>{children}</dialog>
}
