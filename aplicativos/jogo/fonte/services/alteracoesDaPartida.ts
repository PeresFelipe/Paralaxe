/** Comandos são avaliados na fila sobre o estado corrente, nunca sobre snapshots de telas. */
import type { PartidaLocal } from '@paralaxe/dominio'

export type AlteracaoDaPartida = (atual: PartidaLocal) => PartidaLocal
export type MensagemDaAlteracao = string | (() => string | undefined)
export type PersistirAlteracaoDaPartida = (
  alterar: AlteracaoDaPartida,
  mensagem?: MensagemDaAlteracao,
) => Promise<PartidaLocal>

interface PortasDaFila {
  obterAtual: () => PartidaLocal | null
  salvar: (partida: PartidaLocal) => Promise<void>
  confirmar: (partida: PartidaLocal) => void
}

/** Serializa comandos e confirma estado em memória somente depois da transação persistida. */
export function criarFilaDeAlteracoesDaPartida(portas: PortasDaFila) {
  let pendente: Promise<void> = Promise.resolve()
  function aplicar(alterar: AlteracaoDaPartida, aoConfirmar?: (antes: PartidaLocal, depois: PartidaLocal) => void) {
    const id = portas.obterAtual()?.idDaPartida
    const tarefa = pendente.then(async () => {
      const atual = portas.obterAtual()
      if (!atual || atual.idDaPartida !== id) throw new Error('O personagem ativo mudou. Tente novamente.')
      const proxima = alterar(atual)
      if (proxima.idDaPartida !== id) throw new Error('Uma alteração não pode trocar o personagem ativo.')
      if (proxima === atual) return atual
      await portas.salvar(proxima)
      if (portas.obterAtual()?.idDaPartida === id) {
        portas.confirmar(proxima)
        // A transação já foi confirmada. Uma falha de notificação não pode incentivar repetir a recompensa.
        try { aoConfirmar?.(atual, proxima) }
        catch (erro) { console.error('Partida salva; falha ao apresentar a notificação.', erro) }
      }
      return proxima
    })
    // A falha pertence ao chamador; os comandos seguintes continuam podendo salvar.
    pendente = tarefa.then(() => undefined, () => undefined)
    return tarefa
  }
  return { aplicar, aguardar: () => pendente }
}
