/** Casos de uso da luta na estrada; relógio e gravação são fornecidos pela aplicação. */
import {
  obterDefinicaoDeEquipamento, obterDefinicaoDeHabilidadeDeCombate,
  obterDefinicaoDeInimigo, obterDefinicaoDeConsumivelDeCombate,
} from '@paralaxe/conteudo'
import { aplicarResultadoDoCombateNaEstrada, retomarTrabalhoAposRisco, type PartidaLocal, type ResultadoDeCombate } from '@paralaxe/dominio'

export const catalogoDeCombate = {
  obterDefinicaoDeEquipamento,
  obterDefinicaoDeHabilidade: obterDefinicaoDeHabilidadeDeCombate,
  obterDefinicaoDeInimigo,
  obterDefinicaoDeConsumivel: obterDefinicaoDeConsumivelDeCombate,
}

export function concluirCombateDaEstrada(atual: PartidaLocal, resultado: ResultadoDeCombate, agora: string) {
  const proxima = retomarTrabalhoAposRisco(aplicarResultadoDoCombateNaEstrada(atual, resultado, agora), agora)
  const xp = proxima.personagem.xp - atual.personagem.xp
  const ouro = proxima.personagem.ouro - atual.personagem.ouro
  const mensagem = resultado.desfecho === 'vitoria'
    ? `Vitória persistida: +${xp} XP geral${ouro > 0 ? ` e +${ouro} moedas` : ''}. Atividade automática retomada.`
    : `Combate encerrado e persistido: ${Math.max(0, -ouro)} moeda(s) perdida(s). Atividade automática retomada.`
  return { partida: proxima, mensagem }
}

/** Uma reprodução confirma uma única vez; falhas de transação podem ser tentadas novamente. */
export function criarConfirmacaoDoCombate(resultado: ResultadoDeCombate) {
  let pendente: Promise<{ partida: PartidaLocal; mensagem: string }> | undefined
  return {
    confirmar(persistir: import('./alteracoesDaPartida').PersistirAlteracaoDaPartida, agora: string) {
      if (pendente) return pendente
      let mensagem = ''
      const tarefa = persistir(atual => {
        const concluido = concluirCombateDaEstrada(atual, resultado, agora)
        mensagem = concluido.mensagem
        return concluido.partida
      }, () => mensagem).then(partida => ({ partida, mensagem }))
      pendente = tarefa
      void tarefa.catch(() => { if (pendente === tarefa) pendente = undefined })
      return tarefa
    },
  }
}
