import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const fonte = (caminho: string) => readFileSync(new URL(caminho, import.meta.url), 'utf8')

describe('contratos de layout do Paralaxe', () => {
  it('define o grid realmente utilizado pela tela de Atividades', () => {
    const tela = fonte('../../atividades/TelaDeAtividades/TelaDeAtividades.tsx')
    const estilos = fonte('../../atividades/TelaDeAtividades/TelaDeAtividades.module.css')
    expect(tela).toContain('className={estilos.layout}')
    expect(estilos).toMatch(/\.layout\s*\{\s*display:\s*grid;/)
    expect(estilos).toMatch(/grid-template-columns:\s*minmax\(0,\s*1fr\)/)
  })

  it('não mantém seletores legados sem componentes consumidores', () => {
    const folhas = [
      '../../../disposicao-compacta.css',
      '../../../tema-do-jogo.css',
      '../../../interface-do-jogo.css',
    ]
    for (const folha of folhas) {
      const css = fonte(folha)
      expect(css).not.toMatch(/\.(?:atividades-disposicao|atividades-profissao-trilho|movel-profissao-seletor)\b/)
    }
  })

  it('não deixa o aviso lateral com três colunas estreitas no desktop', () => {
    const css = fonte('../../../interface-do-jogo.css')
    expect(css).toMatch(/\.jogo-aviso-conteudo\s*\{\s*grid-column:\s*1\s*\/\s*-1;\s*grid-row:\s*2;/)
  })

  it('define os tokens de redução de movimento com duração válida', () => {
    const tokens = fonte('../../../styles/tokens.css')
    expect(tokens).toMatch(/--ui-motion-reduced-duration:\s*0\.01ms;/)
  })

  it('preserva a estrutura semântica do HUD e o botão de opções fora da lista de descrições', () => {
    const jsx = fonte('../../../EstruturaDoJogo.tsx')
    const secao = jsx.slice(jsx.indexOf('<dl\n'), jsx.indexOf('</dl>') + 5)
    expect(secao).toContain('className="global-recursos"')
    expect((secao.match(/<dt>/g) ?? []).length).toBe(4)
    expect((secao.match(/<dt className="recurso-simbolo/g) ?? []).length).toBe(4)
    expect((secao.match(/<dd>/g) ?? []).length).toBe(4)
    expect(secao).not.toContain('MenuDeOpcoes')
    expect(jsx.indexOf('<MenuDeOpcoes itens={opcoesDoMenu} />')).toBeGreaterThan(jsx.indexOf('</dl>'))
  })

  it('pré-aplica o tema salvo e atualiza a cor da barra do navegador', () => {
    const entrada = fonte('../../../../index.html')
    const hook = fonte('../../../hooks/useTemaDaInterface.ts')
    expect(entrada).toContain("localStorage.getItem('paralaxe.ui.tema')")
    expect(hook).toContain('meta[name="theme-color"]')
  })
})
