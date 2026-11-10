import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import type { PartidaLocal } from '@paralaxe/dominio'
import TelaDeSelecaoDePersonagens from './TelaDeSelecaoDePersonagens'

const criarPartida = (nome: string, expedicaoAtiva = false) => ({
  idDaPartida: nome,
  personagem: { nome, idDaClasse: 'guerreiro', idDoPresente: 'moedas', nivel: 9 },
  masmorra: { expedicaoAtiva },
}) as unknown as PartidaLocal

const propriedades = {
  mensagem: null,
  aoCriar: () => {},
  aoCarregar: () => {},
  saidaIndisponivel: false,
  obterNomeDaClasse: () => 'Guerreiro',
  obterNomeDoPresente: () => 'Bolsa de Moedas',
}

describe('seleção de personagens', () => {
  it('lista partidas locais e identifica expedições sem repetir marcadores offline', () => {
    const html = renderToStaticMarkup(
      <TelaDeSelecaoDePersonagens {...propriedades}
        partidas={[criarPartida('Felipe'), criarPartida('Exploradora', true)]} />,
    )
    expect(html).toContain('Escolha um personagem')
    expect(html).toContain('2 personagens')
    expect(html).toContain('Felipe')
    expect(html).toContain('Exploradora')
    expect(html).toContain('Nv. 9')
    expect(html).toContain('Retomar Dún Liath')
    expect(html).toContain('Continuar jornada')
    expect(html).not.toContain('OFFLINE · LOCAL')
    expect(html).toContain('Novo personagem')
    expect(html).toContain('Créditos e licenças')
  })

  it('mostra estado vazio sem ocultar a ação de criar', () => {
    const html = renderToStaticMarkup(<TelaDeSelecaoDePersonagens {...propriedades} partidas={[]} />)
    expect(html).toContain('Você ainda não tem personagens.')
    expect(html).toContain('Novo personagem')
    expect(html).toContain('0 personagens')
  })

  it('não confunde HTML inserido no nome com elementos reais', () => {
    const html = renderToStaticMarkup(
      <TelaDeSelecaoDePersonagens {...propriedades} partidas={[criarPartida('<script>teste</script>')]} />,
    )
    expect(html).not.toContain('<script>teste</script>')
    expect(html).toContain('&lt;script&gt;teste&lt;/script&gt;')
  })
})
