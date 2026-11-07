import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { SeloDeNavegacao } from './SeloDeNavegacao'

describe('contador adaptado de NavbarIcon (ciefa, MIT)', () => {
  it('não ocupa espaço quando não há atividades', () => {
    expect(renderToStaticMarkup(createElement(SeloDeNavegacao, { quantidade: 0 }))).toBe('')
    expect(renderToStaticMarkup(createElement(SeloDeNavegacao, { quantidade: NaN }))).toBe('')
  })
  it('exibe contagem e oculta o elemento decorativo de leitores de tela', () => {
    const html = renderToStaticMarkup(createElement(SeloDeNavegacao, { quantidade: 3 }))
    expect(html).toContain('aria-hidden="true"')
    expect(html).toContain('>3</span>')
  })
  it('preserva o limite de 99+ do código MIT de origem', () => {
    expect(renderToStaticMarkup(createElement(SeloDeNavegacao, { quantidade: 103 }))).toContain('99+')
  })
})
