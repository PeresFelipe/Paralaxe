import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'profession' | 'node' | 'journey' | 'recipe' | 'route' | 'navigation' | 'tab' | 'hud' | 'activity' | 'location' | 'filter' | 'inventory' | 'creation' | 'saveCard' | 'icon'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
  fullWidth?: boolean
  loading?: boolean
}

export function Button({
  children,
  className,
  disabled = false,
  fullWidth = false,
  icon,
  loading = false,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    loading ? styles.loading : '',
    className ?? '',
  ].filter(Boolean).join(' ')

  return (
    <button
      {...props}
      aria-busy={loading || undefined}
      className={classes}
      data-variant={variant}
      disabled={disabled || loading}
      type={type}
    >
      {loading ? <span aria-hidden="true" className={styles.spinner} /> : icon ? <span aria-hidden="true" className={styles.iconContent}>{icon}</span> : null}
      <span className={styles.label} data-ui-slot="label">{children}</span>
    </button>
  )
}
