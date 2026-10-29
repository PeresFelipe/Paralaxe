import type { ProgressHTMLAttributes } from 'react'
import styles from './ProgressBar.module.css'

export interface ProgressBarProps extends ProgressHTMLAttributes<HTMLProgressElement> {
  label: string
  className?: string
}

export function ProgressBar({ label, className, ...props }: ProgressBarProps) {
  return <progress {...props} aria-label={label} className={[styles.progress, className ?? ''].filter(Boolean).join(' ')} />
}
