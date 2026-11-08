import type { ProvedorDeAutenticacao } from '@paralaxe/interface'

export interface PreferenciasDeAcesso { identificador: string; lembrar: boolean }
export interface ArmazenamentoDePreferencia {
  ler(): string | null
  gravar(valor: string): void
  remover(): void
}
export const CHAVE_DO_USUARIO_LEMBRADO = 'paralaxe.usuario-lembrado'
export const LIMITE_DO_IDENTIFICADOR = 254

/** Guarda apenas a preferência de preenchimento. Nunca guarda sessão, token ou senha. */
export function criarPreferenciaDeAcesso(armazenamento: ArmazenamentoDePreferencia) {
  return {
    ler(): PreferenciasDeAcesso {
      try {
        const identificador = normalizarIdentificador(armazenamento.ler() ?? '')
        return { identificador, lembrar: Boolean(identificador) }
      } catch { return { identificador: '', lembrar: false } }
    },
    salvar(identificador: string, lembrar: boolean): boolean {
      const texto = normalizarIdentificador(identificador)
      try {
        if (lembrar && texto) armazenamento.gravar(texto)
        else armazenamento.remover()
        return true
      } catch { return false }
    },
    esquecer() { try { armazenamento.remover() } catch { /* A entrada local continua disponível sem armazenamento. */ } },
  }
}

export function normalizarIdentificador(valor: string): string {
  return valor.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, LIMITE_DO_IDENTIFICADOR)
}

/** Falha fechada: uma UI futura não pode ativar um provedor por uma flag visual. */
export function criarAutenticacaoIndisponivel(): ProvedorDeAutenticacao {
  const indisponivel = async (): Promise<never> => { throw new Error('Contas online ainda não estão disponíveis.') }
  return { entrar: indisponivel, cadastrar: indisponivel, recuperarSenha: indisponivel, entrarComGoogle: indisponivel, sair: async () => {} }
}
