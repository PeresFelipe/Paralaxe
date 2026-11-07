/** Prioridade sugerida a partir do ingrediente faltante da meta da Jornada. Não altera saves. */
import { ATIVIDADES_OCIOSAS_INICIAIS, RECEITAS_INICIAIS_DE_FABRICACAO } from '@paralaxe/conteudo'
import { obterProgressoDaMetaDaJornada, type PartidaLocal, type PrioridadeDeOficio } from '@paralaxe/dominio'
import { rotulosDosItens } from '../rotulosDoJogo'

export function obterSugestaoDePrioridadeDaJornada(partida: PartidaLocal): { prioridade: PrioridadeDeOficio; motivo: string } | null {
  const meta = partida.jornada.meta
  if (!meta || meta.concluidoEm) return null
  const receita = RECEITAS_INICIAIS_DE_FABRICACAO.find(r => r.id === meta.idDaDefinicaoDaReceita)
  if (!receita) return null
  const faltantes = new Set(obterProgressoDaMetaDaJornada(partida, receita).ingredientes.filter(i => i.faltante > 0).map(i => i.idDaDefinicao))
  if (!faltantes.size) return null
  const a = ATIVIDADES_OCIOSAS_INICIAIS.find(x => x.id === partida.ocioso.atividadeAtiva?.idDaDefinicaoDaAtividade)
  const b = ATIVIDADES_OCIOSAS_INICIAIS.find(x => x.id === partida.ocioso.atividadeSecundaria?.idDaDefinicaoDaAtividade)
  const x = RECEITAS_INICIAIS_DE_FABRICACAO.find(r => r.id === partida.fabricacao.receitaAtiva?.idDaDefinicaoDaReceita)
  const y = RECEITAS_INICIAIS_DE_FABRICACAO.find(r => r.id === partida.fabricacao.receitaSecundaria?.idDaDefinicaoDaReceita)
  if (!((a && b) || (x && y))) return null
  const saida = (r: typeof x) => r?.saida.tipo === 'item' ? r.saida.idDaDefinicao : null
  const idA = a?.idDaDefinicaoDoItemProduzido ?? saida(x)
  const idB = b?.idDaDefinicaoDoItemProduzido ?? saida(y)
  const ajudaA = !!idA && faltantes.has(idA)
  const ajudaB = !!idB && faltantes.has(idB)
  if (!ajudaA && !ajudaB) return null
  const prioridade: PrioridadeDeOficio = ajudaA && ajudaB ? 'equilibrado' : ajudaA ? 'principal' : 'secundaria'
  const materiais = [ajudaA ? idA : null, ajudaB ? idB : null].filter((id): id is string => !!id)
    .map(id => rotulosDosItens[id] ?? id).join(' e ')
  return { prioridade, motivo: ajudaA && ajudaB
    ? `Os dois trabalhos fornecem ${materiais} para a meta; equilibrá-los preserva ambos.`
    : `O trabalho ${ajudaA ? 'principal' : 'secundário'} fornece ${materiais}, necessário(s) à meta da Jornada.` }
}
