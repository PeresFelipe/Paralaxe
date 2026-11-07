/** Relato puro do período reconciliado pelo domínio, sem alterar recompensas nem saves. */
import { obterLimiteDeAusenciaEmSegundos, type PartidaLocal } from '@paralaxe/dominio'
import { rotulosDosItens, rotulosDasProfissoes } from '../rotulosDoJogo'

export function obterDetalhesDoRetorno(
  anterior: PartidaLocal,
  posterior: PartidaLocal,
  ausenciaEmMilissegundos: number,
  relato: string | null,
): readonly string[] {
  const detalhes: string[] = []
  const anteriorPorItem = new Map(anterior.personagem.inventario.map(p => [p.idDaDefinicao, p.quantidade]))
  const ganhosLiquidos = posterior.personagem.inventario
    .map(p => ({ id: p.idDaDefinicao, quantidade: p.quantidade - (anteriorPorItem.get(p.idDaDefinicao) ?? 0) }))
    .filter(p => p.quantidade > 0)
    .sort((a, b) => b.quantidade - a.quantidade || a.id.localeCompare(b.id))
  if (ganhosLiquidos.length) {
    const texto = ganhosLiquidos.slice(0, 4).map(p => `+${p.quantidade} ${rotulosDosItens[p.id] ?? p.id}`).join(' · ')
    detalhes.push(`Saldo positivo do inventário: ${texto}${ganhosLiquidos.length > 4 ? ` e mais ${ganhosLiquidos.length - 4} tipos` : ''}.`)
  }
  const niveis = Object.entries(posterior.profissoes).flatMap(([id, agora]) => {
    const antes = anterior.profissoes[id as keyof typeof anterior.profissoes]
    const quantidade = agora.nivel - antes.nivel
    return quantidade > 0 ? [`${rotulosDasProfissoes[id as keyof typeof rotulosDasProfissoes]}: +${quantidade} nível(is).`] : []
  })
  detalhes.push(...niveis.slice(0, 4))
  if (niveis.length > 4) detalhes.push(`Mais ${niveis.length - 4} ofícios ganharam níveis.`)
  const ativo = Boolean(anterior.ocioso.atividadeAtiva || anterior.fabricacao.receitaAtiva)
  if (ativo && ausenciaEmMilissegundos > obterLimiteDeAusenciaEmSegundos(anterior.personagem.nivel) * 1000) {
    detalhes.push('Limite de progresso sem conexão alcançado; o tempo excedente não gera recompensas.')
  }
  if (relato && /capacidade|inventário cheio/i.test(relato)) {
    detalhes.push('A atividade foi interrompida por falta de espaço no inventário.')
  } else if (relato && /interrompid[ao].*materiais|falta de materiais/i.test(relato)) {
    detalhes.push('A produção foi interrompida por falta de materiais.')
  }
  return detalhes
}
