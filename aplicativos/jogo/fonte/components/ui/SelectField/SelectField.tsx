import { useId, type ReactNode, type SelectHTMLAttributes } from 'react'
import styles from './SelectField.module.css'

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  description?: string
  error?: string
  className?: string
  children: ReactNode
}

export function SelectField({ label, description, error, id, className, children, ...props }: SelectFieldProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const descriptionId = description ? `${selectId}-description` : undefined
  const errorId = error ? `${selectId}-error` : undefined
  const describedBy = [props['aria-describedby'], descriptionId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <label className={[styles.field, className ?? ''].filter(Boolean).join(' ')} htmlFor={selectId}>
      <span className={styles.label}>{label}</span>
      <select
        {...props}
        id={selectId}
        className={styles.control}
        aria-describedby={describedBy}
        aria-invalid={error ? true : props['aria-invalid']}
      >
        {children}
      </select>
      {description ? <span className={styles.description} id={descriptionId}>{description}</span> : null}
      {error ? <span className={styles.error} id={errorId} role="alert">{error}</span> : null}
    </label>
  )
}
