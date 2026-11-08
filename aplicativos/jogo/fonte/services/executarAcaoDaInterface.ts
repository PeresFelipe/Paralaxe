import { mensagensDeErroDaInterface } from '@/rotulosDaInterface'

export type EstadoDaAcao =
  | { fase: 'ocioso' | 'executando' | 'concluido'; mensagem: string | null }
  | { fase: 'falhou'; mensagem: string }

/** Uma única ação em voo. O erro só vira apresentação nesta fronteira, nunca nos casos de uso. */
export function criarExecutorDeAcao(aoMudar: (estado: EstadoDaAcao) => void) {
  let pendente = false
  return async (acao: () => Promise<void>, mensagemDeSucesso: string | null = null): Promise<boolean> => {
    if (pendente) return false
    pendente = true
    aoMudar({ fase: 'executando', mensagem: null })
    try {
      await acao()
      aoMudar({ fase: 'concluido', mensagem: mensagemDeSucesso })
      return true
    } catch (erro) {
      aoMudar({ fase: 'falhou', mensagem: erro instanceof Error ? erro.message : mensagensDeErroDaInterface.concluirAcao })
      return false
    } finally { pendente = false }
  }
}
