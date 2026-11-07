/** Casos de uso de Dún Liath: cada comando deriva a transição da partida recebida pela fila. */
import {
  DUN_LIATH_FACIL, obterDefinicaoDeMasmorra, obterConjuntoDeHabilidadesAntesDaMasmorra,
  obterDefinicaoDeAtividadeOciosa, obterDefinicaoDeReceitaDeFabricacao,
} from '@paralaxe/conteudo'
import {
  aceitarContratoDeDunLiath, ensinarEEquiparHabilidadesDeCombate,
  derivarEstatisticasDeCombateDoJogador, obterDificuldadesDesbloqueadasDaMasmorra,
  gerarDunLiathProcedural, iniciarMasmorraComContinuidade, resolverSalaDaMasmorra,
  retomarTrabalhoAposRisco, extrairExpedicaoDaMasmorra, escolherCaminhoNaMasmorra,
  decidirDestinoDoProtetor, iniciarIncursaoAutomatica, finalizarIncursaoAutomatica, cancelarIncursaoAutomatica,
  type DefinicaoDeMasmorra, type PartidaLocal, type ResultadoDeCombate, type DificuldadeDaMasmorra, type PresetDeIncursao,
} from '@paralaxe/dominio'
import { catalogoDeCombate } from './combateDaEstrada'
export const catalogoDaMasmorra = { ...catalogoDeCombate, obterDefinicaoDeMasmorra }
export interface ResultadoDaAcaoDaMasmorra { partida: PartidaLocal; mensagem: string; combate?: ResultadoDeCombate }
export type AcaoDaMasmorra = (atual: PartidaLocal, agora: string) => ResultadoDaAcaoDaMasmorra

export function mapaDaMasmorra(partida: PartidaLocal): DefinicaoDeMasmorra {
  const execucao = partida.masmorra.expedicaoAtiva
  return execucao?.grafoGerado ?? (execucao ? obterDefinicaoDeMasmorra(execucao.idDaDefinicaoDaMasmorra) : null) ?? DUN_LIATH_FACIL
}
export function ativoTrabalhoRotulo(partida: PartidaLocal) {
  if (partida.ocioso.atividadeAtiva) return obterDefinicaoDeAtividadeOciosa(partida.ocioso.atividadeAtiva.idDaDefinicaoDaAtividade)?.nome ?? 'Atividade de coleta'
  if (partida.fabricacao.receitaAtiva) return obterDefinicaoDeReceitaDeFabricacao(partida.fabricacao.receitaAtiva.idDaDefinicaoDaReceita)?.nome ?? 'Produção'
  return 'Nenhuma atividade automática ativa'
}
export const aceitarContrato: AcaoDaMasmorra = (atual, agora) => {
  if (!atual.combate.loboDerrotado) throw new Error('Conclua primeiro o Serviço — Estrada Baixa.')
  const equipada = ensinarEEquiparHabilidadesDeCombate(atual, obterConjuntoDeHabilidadesAntesDaMasmorra(atual.personagem.idDaClasse), agora)
  return { partida: aceitarContratoDeDunLiath(equipada, agora), mensagem: 'Contrato aceito. Técnicas básicas preparadas e 2× Preparado de Campo entregues uma única vez.' }
}
export function iniciarExpedicao(dificuldade: DificuldadeDaMasmorra, semente: number): AcaoDaMasmorra {
  return (atual, agora) => {
    if (!atual.combate.loboDerrotado) throw new Error('Derrote primeiro o Lobo de Estrada.')
    const base = obterDefinicaoDeMasmorra(`masmorra.dun-liath.${dificuldade}`)
    if (!base || !obterDificuldadesDesbloqueadasDaMasmorra(atual.masmorra).includes(dificuldade)) throw new Error('Conclua a dificuldade anterior antes de entrar.')
    const estatisticas = derivarEstatisticasDeCombateDoJogador(atual, catalogoDaMasmorra)
    const definicao = dificuldade === 'facil' && !atual.masmorra.dunLiathFacilConquistado ? DUN_LIATH_FACIL : gerarDunLiathProcedural(base, semente, {
      possuiLacreDoComandante: atual.personagem.inventario.some(item => item.idDaDefinicao === 'item.dun-liath.lacre-comandante' && item.quantidade > 0),
    })
    const recursos = { vida: estatisticas.vidaMaxima, vidaMaxima: estatisticas.vidaMaxima,
      mana: estatisticas.manaMaxima, manaMaxima: estatisticas.manaMaxima,
      folego: estatisticas.folegoMaximo, folegoMaximo: estatisticas.folegoMaximo }
    return { partida: iniciarMasmorraComContinuidade(atual, definicao, semente, agora, recursos),
      mensagem: `Dún Liath iniciada. ${ativoTrabalhoRotulo(atual)} foi pausada e será retomada ao voltar à segurança.` }
  }
}
export const resolverSala: AcaoDaMasmorra = (atual, agora) => {
  const mapa = mapaDaMasmorra(atual)
  const sala = mapa.salas.find(s => s.id === atual.masmorra.expedicaoAtiva?.idDaSalaAtual)
  if (!sala) throw new Error('Não existe sala ativa para resolver.')
  const resolvida = resolverSalaDaMasmorra(atual, mapa, catalogoDaMasmorra, agora)
  const proxima = resolvida.partida.masmorra.expedicaoAtiva ? resolvida.partida : retomarTrabalhoAposRisco(resolvida.partida, agora)
  const mensagem = !resolvida.partida.masmorra.expedicaoAtiva
    ? 'A expedição terminou em derrota. A Bolsa foi perdida. Sua atividade automática anterior foi retomada.'
    : sala.id === 'sala.fairtheoir' && resolvida.resultadoDeCombate?.desfecho === 'vitoria'
      ? 'Fairtheoir caiu. Retorne em segurança para assegurar o conclusão e o saques.'
      : resolvida.resultadoDeCombate ? `${sala.nome} resolvida · ${resolvida.resultadoDeCombate.xpConcedido} XP. Saques encontrado permanece em risco.` : `${sala.nome} resolvida.`
  return { partida: proxima, mensagem, ...(resolvida.resultadoDeCombate ? { combate: resolvida.resultadoDeCombate } : {}) }
}
export const seguirCaminho = (id: string): AcaoDaMasmorra => (atual, agora) => ({
  partida: escolherCaminhoNaMasmorra(atual, mapaDaMasmorra(atual), id, agora),
  mensagem: 'Caminho escolhido. A bifurcação anterior não pode ser refeita nesta expedição.',
})
export const decidirProtetor = (decisao: 'morto' | 'poupado'): AcaoDaMasmorra => (atual, agora) => ({
  partida: decidirDestinoDoProtetor(atual, decisao, agora), mensagem: decisao === 'poupado' ? 'Você poupa o protetor.' : 'Você mata o protetor. O indivíduo protegido foge.',
})
export const extrairExpedicao: AcaoDaMasmorra = (atual, agora) => ({
  partida: retomarTrabalhoAposRisco(extrairExpedicaoDaMasmorra(atual, agora), agora),
  mensagem: atual.masmorra.expedicaoAtiva?.concluido ? 'Conclusão assegurado. Bolsa transferida e atividade automática anterior retomada.' : 'Retirada segura concluída. Bolsa transferida e atividade automática anterior retomada.',
})
export const iniciarIncursao = (preset: PresetDeIncursao, semente: number): AcaoDaMasmorra => (atual, agora) => {
  if (!atual.masmorra.dunLiathFacilConquistado) throw new Error('Conclua Dún Liath Fácil antes de iniciar Incursão Automática.')
  return { partida: iniciarIncursaoAutomatica(atual, preset, atual.personagem.nivel, semente, agora), mensagem: 'Incursão Automática iniciada. Os trabalhos serão retomados ao resgatar ou cancelar.' }
}
export const finalizarIncursao: AcaoDaMasmorra = (atual, agora) => {
  const encerrada = finalizarIncursaoAutomatica(atual, agora)
  return { partida: encerrada, mensagem: encerrada.masmorra.ultimaIncursaoAutomatica?.sucesso
    ? 'Incursão concluída! Recompensa comum no Inventário; seus trabalhos foram retomados.' : 'A incursão falhou, sem perder itens seguros. Seus trabalhos foram retomados.' }
}
export const cancelarIncursao: AcaoDaMasmorra = (atual, agora) => ({ partida: cancelarIncursaoAutomatica(atual, agora), mensagem: 'Incursão cancelada sem recompensas. Seus trabalhos foram retomados.' })
