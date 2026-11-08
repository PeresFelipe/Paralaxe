import { useId, type InputHTMLAttributes } from 'react'
import styles from './Checkbox.module.css'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label: string
}

export function Checkbox({ label, id, className, ...props }: CheckboxProps) {
  const gerado = useId()
  return <label className={[styles.raiz, className].filter(Boolean).join(' ')} htmlFor={id ?? gerado}>
    <input {...props} id={id ?? gerado} type="checkbox" className={styles.controle} />
    <span>{label}</span>
  </label>
}
