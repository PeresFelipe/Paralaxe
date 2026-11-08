import { describe, expect, it, vi } from 'vitest'
import { criarPreferenciaDeAcesso, criarAutenticacaoIndisponivel, normalizarIdentificador } from './acessoLocal'

describe('preferência de acesso local', () => {
  it('lembra apenas o identificador com consentimento e apaga ao desmarcar', () => {
    let valor: string | null = null
    const pref = criarPreferenciaDeAcesso({ ler: () => valor, gravar: texto => { valor = texto }, remover: () => { valor = null } })
    expect(pref.ler()).toEqual({ identificador: '', lembrar: false })
    pref.salvar('  viajante@exemplo.com  ', true)
    expect(valor).toBe('viajante@exemplo.com')
    expect(pref.ler()).toEqual({ identificador: 'viajante@exemplo.com', lembrar: true })
    pref.salvar('viajante', false)
    expect(valor).toBeNull()
    pref.salvar('viajante', true)
    pref.esquecer()
    expect(valor).toBeNull()
  })
  it('continua disponível quando o navegador bloqueia armazenamento', () => {
    const falhar = () => { throw new Error('bloqueado') }
    const pref = criarPreferenciaDeAcesso({ ler: falhar, gravar: falhar, remover: falhar })
    expect(pref.ler()).toEqual({ identificador: '', lembrar: false })
    expect(pref.salvar('viajante', true)).toBe(false)
    expect(() => pref.esquecer()).not.toThrow()
  })
  it('limita dados não confiáveis sem transformar o nome em HTML ou identidade autenticada', () => {
    expect(normalizarIdentificador(' \u0000viajante\n ')).toBe('viajante')
    expect(normalizarIdentificador('x'.repeat(500))).toHaveLength(254)
    expect(normalizarIdentificador('<img onerror=alert(1)>')).toBe('<img onerror=alert(1)>')
  })
})

describe('integrações futuras fechadas', () => {
  it('recusa senha, cadastro, recuperação e Google sem enviar requisições', async () => {
    const fetchOriginal = globalThis.fetch
    const fetch = vi.fn()
    globalThis.fetch = fetch
    try {
      const provedor = criarAutenticacaoIndisponivel()
      await expect(provedor.entrar({ identificador: 'exemplo', senha: 'nao-armazenar' })).rejects.toThrow('não estão disponíveis')
      await expect(provedor.cadastrar({ usuario: 'exemplo', email: 'teste@exemplo.com', senha: 'nao-armazenar' })).rejects.toThrow()
      await expect(provedor.recuperarSenha('teste@exemplo.com')).rejects.toThrow()
      await expect(provedor.entrarComGoogle()).rejects.toThrow()
      await provedor.sair()
      expect(fetch).not.toHaveBeenCalled()
    } finally { globalThis.fetch = fetchOriginal }
  })
})
