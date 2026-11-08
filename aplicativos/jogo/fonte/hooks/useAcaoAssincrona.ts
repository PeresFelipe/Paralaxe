import { useRef, useState } from 'react'
import { criarExecutorDeAcao, type EstadoDaAcao } from '@/services/executarAcaoDaInterface'

/** Estado transitório padronizado: sucesso somente após resolver a ação; erro permanece visível. */
export function useAcaoAssincrona() {
  const [estado, definirEstado] = useState<EstadoDaAcao>({ fase: 'ocioso', mensagem: null })
  const executor = useRef<ReturnType<typeof criarExecutorDeAcao> | null>(null)
  if (!executor.current) executor.current = criarExecutorDeAcao(definirEstado)
  return {
    executar: executor.current,
    pendente: estado.fase === 'executando',
    erro: estado.fase === 'falhou',
    mensagem: estado.mensagem,
    limparMensagem: () => definirEstado(atual => atual.fase === 'executando' ? atual : { fase: 'ocioso', mensagem: null }),
  }
}
