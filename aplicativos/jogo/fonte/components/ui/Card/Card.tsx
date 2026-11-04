import type { HTMLAttributes } from 'react'
import styles from './Card.module.css'

export type CardElement = 'article' | 'aside' | 'div' | 'section'

/** Aparências semânticas: a hierarquia decide quando uma moldura é realmente necessária. */
export type CardAppearance = 'default' | 'soft' | 'plain'

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: CardElement
  appearance?: CardAppearance
}

export function Card({ as: Element = 'article', appearance = 'default', children, className, ...props }: CardProps) {
  const classes = [styles.card, styles[appearance], className ?? ''].filter(Boolean).join(' ')

  return <Element {...props} data-ui="card" data-appearance={appearance} className={classes}>{children}</Element>
}
