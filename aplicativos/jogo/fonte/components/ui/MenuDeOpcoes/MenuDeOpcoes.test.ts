import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

/** Evita que os rótulos dos indicadores de recursos afetem outras grades do cabeçalho. */
describe('isolamento visual do menu de opções', () => {
  const estilos = [
    '../../../estilos.css',
    '../../../disposicao-compacta.css',
    '../../../tema-do-jogo.css',
    '../../../interface-do-jogo.css',
  ]

  it.each(estilos)('limita as regras de recursos aos seus cartões em %s', (arquivo) => {
    const css = readFileSync(new URL(arquivo, import.meta.url), 'utf8')
    expect(css).not.toMatch(/\.global-recursos\s+(?:strong|small)\b/)
  })

  it('usa disposição vertical independente dos indicadores de recursos', () => {
    const css = readFileSync(new URL('./MenuDeOpcoes.module.css', import.meta.url), 'utf8')
    expect(css).toMatch(/\.cabecalho\s*\{[^}]*flex-direction:\s*column/s)
    expect(css).toMatch(/\.textos\s*\{[^}]*flex-direction:\s*column/s)
    expect(css).toMatch(/\.opcao\s*\{[^}]*display:\s*flex/s)
  })
})
