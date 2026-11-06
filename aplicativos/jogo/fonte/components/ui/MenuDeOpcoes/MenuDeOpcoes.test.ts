import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Button } from '../Button/Button'
import { MenuDeOpcoes } from './MenuDeOpcoes'

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
  it('mantém um slot de rótulo estável independente do nome gerado por CSS Modules', () => {
    const html = renderToStaticMarkup(createElement(Button, { variant: 'secondary' }, 'Uma ação'))
    expect(html).toContain('data-ui-slot="label"')
    expect(html).toContain('Uma ação')
    const css = readFileSync(new URL('../../../features/jornada/MetaDaJornada/MetaDaJornada.module.css', import.meta.url), 'utf8')
    expect(css).toContain("[data-ui-slot='label']")
    expect(css).not.toContain("[class*='label']")
  })

  it('permite alinhar o menu ao início para evitar corte na esquerda no UI Kit', () => {
    const codigo = readFileSync(new URL('./MenuDeOpcoes.tsx', import.meta.url), 'utf8')
    const estilos = readFileSync(new URL('./MenuDeOpcoes.module.css', import.meta.url), 'utf8')
    expect(codigo).toContain("data-alinhamento={alinhamento}")
    expect(estilos).toMatch(/\.painel\[data-alinhamento='inicio'\]\s*\{\s*left:\s*0;/)
    expect(estilos).toMatch(/\.painel\[data-posicao='acima'\]/)
  })

  it('renderiza o gatilho de opções com estado acessível e rótulo', () => {
    const html = renderToStaticMarkup(createElement(MenuDeOpcoes, {
      itens: [{ id: 'tema', grupo: 'Aparência', titulo: 'Ativar tema claro', acao: () => undefined }],
    }))
    expect(html).toContain('aria-haspopup="menu"')
    expect(html).toContain('aria-expanded="false"')
    expect(html).toContain('aria-label="Abrir opções do jogo"')
  })

})
