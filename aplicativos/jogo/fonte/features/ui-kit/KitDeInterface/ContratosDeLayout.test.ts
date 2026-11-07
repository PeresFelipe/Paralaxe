import { createElement, type ComponentProps } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { CLASSES_DE_PERSONAGEM, PRESENTES_INICIAIS, ATIVIDADES_OCIOSAS_INICIAIS } from '@paralaxe/conteudo'
import { criarPartidaLocal, iniciarAtividadeOciosa } from '@paralaxe/dominio'
import EstruturaDoJogo from '../../../EstruturaDoJogo'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const fonte = (caminho: string) => readFileSync(new URL(caminho, import.meta.url), 'utf8')

/** Renderização real do shell, sem depender da grafia ou da organização do JSX. */
function renderizarEstrutura(riscoAtivo = false) {
  const base = criarPartidaLocal({ idDaPartida: 'layout', criadoEm: '2026-11-07T00:00:00.000Z',
    versaoDoConteudo: 'teste', nomeDoPersonagem: 'Aedan', classeDoPersonagem: CLASSES_DE_PERSONAGEM[0]!, presente: PRESENTES_INICIAIS[0]! })
  const partida = iniciarAtividadeOciosa(base, ATIVIDADES_OCIOSAS_INICIAIS[0]!, base.criadoEm)
  const semEfeito = async () => {}
  const props: ComponentProps<typeof EstruturaDoJogo> = {
    partida, mensagem: null, tipoDaMensagem: 'informacao', ultimoResultadoDoTrabalho: null, riscoAtivo,
    aoDispensarMensagem: semEfeito, aoAlterarEstadoDeRisco: semEfeito, aoAlternarPartida: semEfeito,
    temaDaInterface: 'escuro', aoAlternarTema: semEfeito, prepararRisco: async () => partida,
    aoPersistir: async alterar => alterar(partida),
    aoConcluirProjeto: semEfeito,
    aoComprarOfertaDoMercado: semEfeito,
    aoIniciarAtividade: semEfeito,
    aoIniciarAtividadeSecundaria: semEfeito,
    aoPararAtividadeSecundaria: semEfeito,
    aoIniciarAtividadeTerciaria: semEfeito,
    aoPararAtividadeTerciaria: semEfeito,
    aoAlterarPrioridade: semEfeito,
    aoResponderMinigame: semEfeito,
    aoIniciarReceitaSecundaria: semEfeito,
    aoPararReceitaSecundaria: semEfeito,
    aoIniciarReceitaTerciaria: semEfeito,
    aoPararReceitaTerciaria: semEfeito,
    aoIniciarReceita: semEfeito,
    aoEscolherMetaDaJornada: semEfeito,
    aoPararTrabalho: semEfeito,
    aoPrestigiarProfissao: semEfeito,
    aoEquipar: semEfeito,
    aoDistribuirAtributos: semEfeito,
    aoRealizarPrestigioDoPersonagem: semEfeito,
    aoDesbloquearNoDePrestigio: semEfeito,
    aoDepositarPilhaNoBanco: semEfeito,
    aoRetirarPilhaDoBanco: semEfeito,
    aoDepositarEquipamentoNoBanco: semEfeito,
    aoRetirarEquipamentoDoBanco: semEfeito,
  }
  return renderToStaticMarkup(createElement(EstruturaDoJogo, props))
}

describe('contratos de layout do Paralaxe', () => {
  it('mantém larguras responsivas e contador de trabalhos acessível', () => {
    const css = fonte('../../../responsivo-refinamento.css')
    const estrutura = renderizarEstrutura()
    expect(css).toContain('@media (min-width: 900px)')
    expect(css).toContain("[data-largura='compacta']")
    expect(css).toContain("[data-largura='ampla']")
    expect(estrutura).toMatch(/data-largura="(?:compacta|normal|ampla)"/)
    expect(estrutura).toContain('href="#jogo-conteudo"')
    expect(estrutura).toContain('trabalho(s) em andamento')
  })

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
    const html = renderizarEstrutura()
    const secao = html.match(/<dl class="global-recursos"[\s\S]*?<\/dl>/)?.[0] ?? ''
    expect(secao).toContain('aria-label="Estado global do personagem"')
    expect((secao.match(/<dt>/g) ?? []).length).toBe(4)
    expect((secao.match(/<dt class="recurso-simbolo/g) ?? []).length).toBe(4)
    expect((secao.match(/<dd>/g) ?? []).length).toBe(4)
    expect(secao).not.toContain('<button')
    expect(html.indexOf('Opções')).toBeGreaterThan(html.indexOf('</dl>'))
  })

  it('pré-aplica o tema salvo e atualiza a cor da barra do navegador', () => {
    const entrada = fonte('../../../../index.html')
    const hook = fonte('../../../hooks/useTemaDaInterface.ts')
    expect(entrada).toContain("localStorage.getItem('paralaxe.ui.tema')")
    expect(hook).toContain('meta[name="theme-color"]')
  })
})
