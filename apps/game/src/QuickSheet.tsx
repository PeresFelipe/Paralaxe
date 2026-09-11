import { useEffect, useRef, type ReactNode } from 'react'

export default function QuickSheet({ label, onClose, children }: {
  label: string
  onClose: () => void
  children: ReactNode
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    const trigger = document.activeElement
    dialog?.showModal()
    return () => {
      dialog?.close()
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus()
    }
  }, [])

  return <dialog ref={dialogRef} className="side-sheet" aria-label={label} onCancel={(event) => {
    event.preventDefault()
    onClose()
  }}>{children}</dialog>
}
