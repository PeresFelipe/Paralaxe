/** Casos de uso dos ofícios. Cada comando opera sobre a partida corrente recebida pela fila. */
import {
  obterDefinicaoDeAtividadeOciosa, obterDefinicaoDeReceitaDeFabricacao,
} from '@paralaxe/conteudo'
import {
  configurarPrioridadeDaColeta, configurarPrioridadeDaFabricacao, iniciarAtividadeOciosa,
  iniciarAtividadeSecundaria, iniciarAtividadeTerciaria, iniciarReceitaDeFabricacao,
  iniciarReceitaSecundaria, iniciarReceitaTerciaria, interromperAtividadeOciosa,
  interromperAtividadeSecundaria, interromperAtividadeTerciaria, interromperReceitaDeFabricacao,
  interromperReceitaSecundaria, interromperReceitaTerciaria, realizarPrestigioDaProfissao,
  responderMinigameDeOficio, type IdDaProfissao, type PartidaLocal, type PrioridadeDeOficio,
} from '@paralaxe/dominio'
import type { PortasDasAcoes } from './portasDasAcoes'
import { processarTrabalhoAtual } from './partida'

export function criarAcoesDeOficios({ persistir, agora, estaEmRisco }: PortasDasAcoes) {
  function atividade(id: string) {
    const definicao = obterDefinicaoDeAtividadeOciosa(id)
    if (!definicao) throw new Error('Recurso não encontrado.')
    return definicao
  }
  function receita(id: string) {
    const definicao = obterDefinicaoDeReceitaDeFabricacao(id)
    if (!definicao) throw new Error('Receita não encontrada.')
    return definicao
  }
  async function alterarTrabalho(alterar: (atual: PartidaLocal, instante: string) => PartidaLocal, mensagem: string | (() => string)) {
    await persistir(atual => {
      if (estaEmRisco()) throw new Error('Altere os ofícios após retornar a um lugar seguro.')
      const instante = agora()
      return alterar(processarTrabalhoAtual(atual, instante).partida, instante)
    }, mensagem)
  }
  return {
    tratarIniciarAtividade: (id: string) => alterarTrabalho((atual, instante) => {
      const limpa = interromperReceitaDeFabricacao(interromperAtividadeOciosa(atual, instante), instante)
      return iniciarAtividadeOciosa(limpa, atividade(id), instante)
    }, 'Atividade automática iniciada.'),
    tratarIniciarAtividadeSecundaria: (id: string) => alterarTrabalho((atual, instante) => iniciarAtividadeSecundaria(atual, atividade(id), instante), 'Coleta secundária iniciada.'),
    tratarIniciarAtividadeTerciaria: (id: string) => alterarTrabalho((atual, instante) => iniciarAtividadeTerciaria(atual, atividade(id), instante), 'Terceira coleta iniciada.'),
    tratarPararAtividadeSecundaria: () => alterarTrabalho(interromperAtividadeSecundaria, 'Coleta secundária interrompida.'),
    tratarPararAtividadeTerciaria: () => alterarTrabalho(interromperAtividadeTerciaria, 'Terceira coleta interrompida.'),
    tratarIniciarReceita: (id: string, alvo: string | null = null) => alterarTrabalho((atual, instante) => {
      const limpa = interromperReceitaDeFabricacao(interromperAtividadeOciosa(atual, instante), instante)
      return iniciarReceitaDeFabricacao(limpa, receita(id), instante, alvo)
    }, 'Produção iniciada. A atividade anterior foi substituída.'),
    tratarIniciarReceitaSecundaria: (id: string) => alterarTrabalho((atual, instante) => {
      const principal = atual.fabricacao.receitaAtiva
      if (!principal) throw new Error('Inicie uma produção principal.')
      return iniciarReceitaSecundaria(atual, receita(principal.idDaDefinicaoDaReceita), receita(id), instante)
    }, 'Produção secundária iniciada.'),
    tratarIniciarReceitaTerciaria: (id: string) => alterarTrabalho((atual, instante) => {
      const principal = atual.fabricacao.receitaAtiva
      const secundaria = atual.fabricacao.receitaSecundaria
      if (!principal || !secundaria) throw new Error('Selecione duas receitas antes da terceira.')
      return iniciarReceitaTerciaria(atual, receita(principal.idDaDefinicaoDaReceita), receita(secundaria.idDaDefinicaoDaReceita), receita(id), instante)
    }, 'Terceira produção iniciada.'),
    tratarPararReceitaSecundaria: () => alterarTrabalho(interromperReceitaSecundaria, 'Produção secundária interrompida.'),
    tratarPararReceitaTerciaria: () => alterarTrabalho(interromperReceitaTerciaria, 'Terceira produção interrompida.'),
    tratarPararTrabalho: () => alterarTrabalho((atual, instante) => interromperReceitaDeFabricacao(interromperAtividadeOciosa(atual, instante), instante), 'Atividade interrompida.'),
    tratarPrestigiarProfissao: async (id: IdDaProfissao) => { await persistir(atual => realizarPrestigioDaProfissao(atual, id, agora()), 'Prestígio do ofício realizado; ele voltou ao nível 1.') },
    tratarAlterarPrioridadeDeOficio: (prioridade: PrioridadeDeOficio) => alterarTrabalho((atual, instante) => {
      if (atual.ocioso.atividadeAtiva) return configurarPrioridadeDaColeta(atual, prioridade, instante)
      if (atual.fabricacao.receitaAtiva) return configurarPrioridadeDaFabricacao(atual, receita(atual.fabricacao.receitaAtiva.idDaDefinicaoDaReceita), prioridade, instante)
      throw new Error('Não há trabalho ativo para configurar.')
    }, 'Prioridade da atividade atualizada.'),
    tratarResponderMinigame: async (id: IdDaProfissao, resposta: number) => {
      let acertou = false
      await alterarTrabalho((atual, instante) => {
        const resultado = responderMinigameDeOficio(atual, id, resposta, instante)
        acertou = resultado.acertou
        return resultado.partida
      }, () => acertou ? 'Minigame concluído: +4 XP por ciclo nos próximos minutos.' : 'Desafio encerrado; o trabalho automático continua normalmente.')
    },
  }
}
