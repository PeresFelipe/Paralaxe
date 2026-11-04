import { useEffect, useRef, type DialogHTMLAttributes, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.css'

export interface ModalProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'aria-label' | 'aria-labelledby' | 'aria-describedby' | 'onCancel'> {
  ariaLabel?: string
  labelledBy?: string
  describedBy?: string
  onClose: () => void
  closeOnBackdropClick?: boolean
}

/** Diálogo modal nativo com ciclo consistente de foco, Escape e renderização no topo do documento. */
export function Modal({
  ariaLabel,
  labelledBy,
  describedBy,
  children,
  className,
  closeOnBackdropClick = false,
  onClose,
  ...props
}: ModalProps) {
  const reference = useRef<HTMLDialogElement>(null)
  // Capture before React commits autoFocus descendants into the portal.
  const triggerReference = useRef(typeof document === 'undefined' ? null : document.activeElement)

  useEffect(() => {
    const dialog = reference.current
    const trigger = triggerReference.current
    dialog?.showModal()
    return () => {
      dialog?.close()
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus()
    }
  }, [])

  function handleClick(event: MouseEvent<HTMLDialogElement>) {
    if (!closeOnBackdropClick || event.target !== event.currentTarget) return
    const bounds = event.currentTarget.getBoundingClientRect()
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    ) onClose()
  }

  return createPortal(
    <dialog
      {...props}
      ref={reference}
      aria-label={ariaLabel}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      className={[styles.modal, className ?? ''].filter(Boolean).join(' ')}
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClick={handleClick}
    >
      {children}
    </dialog>,
    document.body,
  )
}

