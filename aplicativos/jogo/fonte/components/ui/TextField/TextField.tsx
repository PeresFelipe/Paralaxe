import { useId, type InputHTMLAttributes } from 'react'
import styles from './TextField.module.css'

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string
  description?: string
  error?: string
  className?: string
}

export function TextField({ label, description, error, id, className, ...props }: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const descriptionId = description ? `${inputId}-description` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  const describedBy = [props['aria-describedby'], descriptionId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <label className={[styles.field, className ?? ''].filter(Boolean).join(' ')} htmlFor={inputId}>
      <span className={styles.label}>{label}</span>
      <input
        {...props}
        id={inputId}
        className={styles.control}
        aria-describedby={describedBy}
        aria-invalid={error ? true : props['aria-invalid']}
      />
      {description ? <span className={styles.description} id={descriptionId}>{description}</span> : null}
      {error ? <span className={styles.error} id={errorId} role="alert">{error}</span> : null}
    </label>
  )
}
