import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { CLASSES_DE_PERSONAGEM } from '@paralaxe/conteudo'
import CartaoDaClasse from './CartaoDaClasse'

describe('cartão de escolha da classe', () => {
  it.each(CLASSES_DE_PERSONAGEM)('renderiza $nome com identificação acessível e arte decorativa', definicao => {
    const html = renderToStaticMarkup(<CartaoDaClasse definicao={definicao} selecionada={true} aoSelecionar={() => {}} />)
    expect(html).toContain('aria-pressed="true"')
    expect(html).toContain(`<strong>${definicao.nome}</strong>`)
    expect(html).toContain('data-with-art="true"')
    expect(html).toContain('/arte/classes/')
    if (definicao.id === 'guerreiro' || definicao.id === 'mago') expect(html).toContain('alt=""')
    else expect(html).toContain('aria-hidden="true"')
    expect(html.match(/<button\b/g)).toHaveLength(1)
  })
  it('distingue a classe não selecionada sem alterar os dados do catálogo', () => {
    const definicao = CLASSES_DE_PERSONAGEM[0]!
    const copia = structuredClone(definicao)
    const html = renderToStaticMarkup(<CartaoDaClasse definicao={definicao} selecionada={false} aoSelecionar={() => {}} />)
    expect(html).toContain('aria-pressed="false"')
    expect(definicao).toEqual(copia)
  })
})
