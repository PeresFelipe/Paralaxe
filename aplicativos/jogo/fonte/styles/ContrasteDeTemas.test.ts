import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const escuro = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8')
const claro = readFileSync(new URL('../tema-claro.css', import.meta.url), 'utf8')

function corHexadecimal(css: string, variavel: string) {
  const expressao = new RegExp('(?:^|\\n)\\s*' + variavel + ':\\s*(#[0-9a-fA-F]{6})\\s*;', 'm')
  const valor = css.match(expressao)?.[1]
  if (!valor) throw new Error('Token hexadecimal ausente: ' + variavel)
  return valor
}

function luminancia(cor: string) {
  const canais = [1, 3, 5].map(posicao => parseInt(cor.slice(posicao, posicao + 2), 16) / 255)
  const linear = canais.map(canal => canal <= 0.04045 ? canal / 12.92 : ((canal + 0.055) / 1.055) ** 2.4)
  return linear[0]! * 0.2126 + linear[1]! * 0.7152 + linear[2]! * 0.0722
}

function contraste(corA: string, corB: string) {
  const a = luminancia(corA)
  const b = luminancia(corB)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

describe('contraste das superfícies principais (WCAG AA)', () => {
  it.each([
    ['escuro', escuro],
    ['claro', claro],
  ])('%s: texto, legenda, aviso e ação mantêm contraste mínimo', (_nome, css) => {
    const superficie = corHexadecimal(css, '--ui-color-surface')
    for (const token of [
      '--ui-color-text',
      '--ui-color-text-muted',
      '--ui-color-warning-text',
      '--ui-color-primary',
    ]) {
      expect(contraste(corHexadecimal(css, token), superficie), token).toBeGreaterThanOrEqual(4.5)
    }
  })
})
