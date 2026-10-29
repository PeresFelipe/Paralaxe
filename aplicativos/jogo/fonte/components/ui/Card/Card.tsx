import type { HTMLAttributes } from 'react'
import styles from './Card.module.css'

export type CardElement = 'article' | 'aside' | 'div' | 'section'

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: CardElement
}

export function Card({ as: Element = 'article', children, className, ...props }: CardProps) {
  const classes = [styles.card, className ?? ''].filter(Boolean).join(' ')

  return <Element {...props} data-ui="card" className={classes}>{children}</Element>
}
