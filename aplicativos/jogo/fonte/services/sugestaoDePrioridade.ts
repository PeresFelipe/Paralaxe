/**
 * Planejamento explicável: estima quanto tempo cada distribuição de eficiência
 * levaria para fornecer os ingredientes em falta da meta da Jornada.
 *
 * O ranqueamento usa classificarDecisoes, módulo adaptado do Universal-AI
 * (TechLuddite, MIT; aviso em /creditos/universal-ai-MIT.txt).
 * Não altera partida, RNG, tarefas nem persistência.
 */
import { ATIVIDADES_OCIOSAS_INICIAIS, RECEITAS_INICIAIS_DE_FABRICACAO } from '@paralaxe/conteudo'
import {
  PRIORIDADES_DE_OFICIO,
  classificarDecisoes,
  obterProgressoDaMetaDaJornada,
  segundosPorAcaoComPrioridade,
  type DecisaoPontuada,
  type PartidaLocal,
  type PrioridadeDeOficio,
} from '@paralaxe/dominio'
import { rotulosDosItens } from '../rotulosDoJogo'

type Espaco = 'principal' | 'secundaria' | 'terciaria'
type TrabalhoDeMaterial = { espaco: Espaco; idDoItem: string; quantidade: number; segundosPorAcao: number }

export type SugestaoDePrioridade = {
  prioridade: PrioridadeDeOficio
  motivo: string
  opcoes: readonly DecisaoPontuada<PrioridadeDeOficio>[]
}

const ESPACOS: readonly Espaco[] = ['principal', 'secundaria', 'terciaria']

function trabalhosDeColeta(partida: PartidaLocal): TrabalhoDeMaterial[] {
  const ativos = [
    partida.ocioso.atividadeAtiva,
    partida.ocioso.atividadeSecundaria,
    partida.ocioso.atividadeTerciaria,
  ]
  return ativos.flatMap((ativa, indice) => {
    const definicao = ATIVIDADES_OCIOSAS_INICIAIS.find(item => item.id === ativa?.idDaDefinicaoDaAtividade)
    if (!definicao) return []
    return [{
      espaco: ESPACOS[indice]!,
      idDoItem: definicao.idDaDefinicaoDoItemProduzido,
      quantidade: 1,
      segundosPorAcao: definicao.segundosPorAcao,
    }]
  })
}

function trabalhosDeFabricacao(partida: PartidaLocal): TrabalhoDeMaterial[] {
  const ativos = [
    partida.fabricacao.receitaAtiva,
    partida.fabricacao.receitaSecundaria,
    partida.fabricacao.receitaTerciaria,
  ]
  return ativos.flatMap((ativa, indice) => {
    const receita = RECEITAS_INICIAIS_DE_FABRICACAO.find(item => item.id === ativa?.idDaDefinicaoDaReceita)
    if (!receita || receita.saida.tipo !== 'item') return []
    return [{
      espaco: ESPACOS[indice]!,
      idDoItem: receita.saida.idDaDefinicao,
      quantidade: receita.saida.quantidade,
      segundosPorAcao: receita.segundosPorAcao,
    }]
  })
}

function descricaoDaEstimativa(segundos: number, materiais: readonly string[], ignorados: number): string {
  const descricao = materiais.map(id => rotulosDosItens[id] ?? id).join(' e ')
  const prazo = segundos < 60 ? `${Math.ceil(segundos)} s` : `${Math.ceil(segundos / 60)} min`
  return `Para ${descricao}, o ingrediente mais lento levaria cerca de ${prazo}, considerando apenas os ciclos básicos. ${ignorados > 0 ? `Outros ${ignorados} ingrediente(s) da meta ainda dependem de outra atividade. ` : ''}Não considera materiais consumidos, buffs ou inventário cheio.`
}

/** Retorna alternativas ordenadas para os três modos; não aplica nenhuma delas. */
export function obterSugestaoDePrioridadeDaJornada(partida: PartidaLocal): SugestaoDePrioridade | null {
  const meta = partida.jornada.meta
  if (!meta || meta.concluidoEm) return null
  const receita = RECEITAS_INICIAIS_DE_FABRICACAO.find(item => item.id === meta.idDaDefinicaoDaReceita)
  if (!receita) return null

  const faltantes = new Map(
    obterProgressoDaMetaDaJornada(partida, receita).ingredientes
      .filter(ingrediente => ingrediente.faltante > 0)
      .map(ingrediente => [ingrediente.idDaDefinicao, ingrediente.faltante] as const),
  )
  if (!faltantes.size) return null

  // O domínio só permite coleta OU fabricação em paralelo. Avaliar o grupo ativo.
  const coletaAtiva = Boolean(partida.ocioso.atividadeAtiva)
  const trabalhos = coletaAtiva ? trabalhosDeColeta(partida) : trabalhosDeFabricacao(partida)
  if (trabalhos.length < 2) return null

  const materiaisCobertos = [...new Set(trabalhos.map(trabalho => trabalho.idDoItem))]
    .filter(id => faltantes.has(id))
  if (!materiaisCobertos.length) return null

  const atual = (coletaAtiva ? partida.ocioso.prioridade : partida.fabricacao.prioridade) ?? 'equilibrado'
  const ignorados = faltantes.size - materiaisCobertos.length
  const alternativas = PRIORIDADES_DE_OFICIO.map(prioridade => {
    const taxas = new Map<string, number>()
    for (const trabalho of trabalhos) {
      if (!faltantes.has(trabalho.idDoItem)) continue
      const duracao = segundosPorAcaoComPrioridade(trabalho.segundosPorAcao, prioridade, trabalho.espaco)
      taxas.set(trabalho.idDoItem, (taxas.get(trabalho.idDoItem) ?? 0) + trabalho.quantidade / duracao)
    }

    // Uma meta é limitada pelo ingrediente mais lento. O prazo é apenas do
    // subconjunto atendido pelos trabalhos ativos, não de toda a fabricação.
    const segundos = Math.max(...materiaisCobertos.map(id => (faltantes.get(id) ?? 0) / (taxas.get(id) ?? 1)))
    return {
      id: prioridade,
      utilidade: 1 / (1 + segundos / 60),
      alinhamento: prioridade === atual ? 1 : 0.985,
      motivo: descricaoDaEstimativa(segundos, materiaisCobertos, ignorados),
    }
  })
  const opcoes = classificarDecisoes(alternativas)
  const escolhida = opcoes[0]
  return escolhida ? { prioridade: escolhida.id, motivo: escolhida.motivo, opcoes } : null
}
