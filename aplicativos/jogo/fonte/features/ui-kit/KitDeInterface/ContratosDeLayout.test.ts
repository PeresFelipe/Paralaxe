import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const fonte = (caminho: string) => readFileSync(new URL(caminho, import.meta.url), 'utf8')

describe('contratos de layout do Paralaxe', () => {
  it('permite reproduzir cenários visuais de temas, menu e notificações', () => {
    const kit = fonte('./KitDeInterface.tsx')
    const menu = fonte('../../../components/ui/MenuDeOpcoes/MenuDeOpcoes.tsx')
    expect(kit).toContain("parametrosVisuais?.get('menu')")
    expect(kit).toContain("parametrosVisuais?.get('aviso')")
    expect(kit).toContain('alinhamento="inicio"')
    expect(menu).toContain("data-posicao={abrirAcima ? 'acima' : 'abaixo'}")
  })

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

  it('usa tokens nomeados e definidos em todas as cores do seletor de ofícios', () => {
    const css = fonte('../../atividades/SeletorDeOficios/SeletorDeOficios.module.css')
    const tokens = fonte('../../../styles/tokens.css')
    const cores = Array.from(css.matchAll(/var\((--ui-oficio-seletor-[a-z-]+)/g), match => match[1])
    expect(new Set(cores).size).toBe(30)
    expect(css).not.toMatch(/--ui-oficios-cor-(?:[1-9]|[12][0-9]|30)\b/)
    for (const cor of cores) {
      expect(tokens).toContain(cor + ':')
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

  it('oculta os ícones decorativos do HUD em telas pequenas sem perder para a cascata', () => {
    const base = fonte('../../../estilos.css')
    const responsivo = fonte('../../../interface-do-jogo.css')
    expect(base).toContain('.global-recursos > div > dt.recurso-simbolo { grid-area: sig; display: grid; }')
    expect(responsivo).toMatch(/@media \(max-width: 720px\)[\s\S]*?\.global-recursos > div > dt\.recurso-simbolo \{ display: none; \}/)
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
