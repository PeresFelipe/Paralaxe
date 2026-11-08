import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import TelaDeAcesso from './TelaDeAcesso'
import { Checkbox } from '@/components/ui'

describe('entrada local', () => {
  it('identifica o acesso local e deixa credenciais e integrações indisponíveis', () => {
    const html = renderToStaticMarkup(<TelaDeAcesso preferencias={{ identificador: '', lembrar: false }} aoEntrarLocalmente={() => {}} aoEsquecerUsuario={() => {}} />)
    expect(html).toContain('Usuário ou e-mail')
    expect(html).toContain('Entrar localmente')
    expect(html).toContain('Criar usuário')
    expect(html).toContain('Esqueci a senha')
    expect(html).toMatch(/<input[^>]*type="password"[^>]*disabled=""/)
    expect(html).toContain('contas online ainda não estão disponíveis')
  })
  it('renderiza o identificador lembrado como texto escapado e checkbox com rótulo', () => {
    const html = renderToStaticMarkup(<TelaDeAcesso preferencias={{ identificador: '<script>teste</script>', lembrar: true }} aoEntrarLocalmente={() => {}} aoEsquecerUsuario={() => {}} />)
    expect(html).not.toContain('<script>teste</script>')
    expect(html).toContain('&lt;script&gt;teste&lt;/script&gt;')
    expect(html).toContain('Lembrar usuário')
    const checkbox = renderToStaticMarkup(<Checkbox label="Lembrar usuário" checked onChange={() => {}} />)
    expect(checkbox).toContain('type="checkbox"')
    expect(checkbox).toContain('checked=""')
  })
})
