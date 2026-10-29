/**
 * @file Catálogo de conhecimento e desafios da campanha local.
 * Descobertas vêm de fatos do save; desafios concedem apenas registros no Códice,
 * sem introduzir uma moeda ou alterar as recompensas existentes.
 */
import type { PartidaLocal } from '@greywake/dominio'
import { CLASSES_DE_PERSONAGEM } from './criacaoDePersonagem'
import { ATIVIDADES_OCIOSAS_INICIAIS } from './atividadesOciosas'
import { RECEITAS_INICIAIS_DE_FABRICACAO } from './receitasDeFabricacao'
import { DEFINICOES_DE_EQUIPAMENTO } from './equipamento'
import { HABILIDADES_DE_COMBATE, INIMIGOS } from './combate'
import { DUN_LIATH_FACIL } from './masmorra'

export type CategoriaDoCodice = 'classe' | 'oficio' | 'atividade' | 'receita' | 'material' | 'equipamento' | 'tecnica' | 'inimigo' | 'masmorra' | 'sala'
export interface EntradaDoCodice { id: string; categoria: CategoriaDoCodice; nome: string; descricao: string }

/** Catálogo ordenado por categoria; IDs são persistidos, nomes/descrições permanecem atualizáveis. */
export const ENTRADAS_DO_CODICE: readonly EntradaDoCodice[] = [
  ...CLASSES_DE_PERSONAGEM.map((item) => ({ id: `classe.${item.id}`, categoria: 'classe' as const, nome: item.nome, descricao: item.resumo })),
  ...(['mineracao', 'lenhador', 'pesca', 'herbologia', 'metalurgia', 'forja', 'culinaria'] as const).map((id) => ({ id: `oficio.${id}`, categoria: 'oficio' as const, nome: id, descricao: 'Um dos ofícios da Cidade Livre.' })),
  ...ATIVIDADES_OCIOSAS_INICIAIS.map((item) => ({ id: `atividade.${item.id}`, categoria: 'atividade' as const, nome: item.nome, descricao: `${item.segundosPorAcao}s por ciclo · ${item.xpDeProfissaoPorAcao} XP de ofício.` })),
  ...RECEITAS_INICIAIS_DE_FABRICACAO.map((item) => ({ id: `receita.${item.id}`, categoria: 'receita' as const, nome: item.nome, descricao: `Receita de ${item.idDaProfissao}.` })),
  ...[...new Set([
    ...ATIVIDADES_OCIOSAS_INICIAIS.map((item) => item.idDaDefinicaoDoItemProduzido),
    ...RECEITAS_INICIAIS_DE_FABRICACAO.flatMap((item) => [...item.ingredientes.map((ingrediente) => ingrediente.idDaDefinicao), ...(item.saida.tipo === 'item' ? [item.saida.idDaDefinicao] : item.saida.tipo === 'equipamento' ? [item.saida.idDaDefinicao] : [])]),
  ])].map((id) => ({ id: `material.${id}`, categoria: 'material' as const, nome: id.replace(/^(material|item)\./, '').replaceAll('.', ' '), descricao: 'Recurso usado em coleta, fabricação ou preparação.' })),
  ...DEFINICOES_DE_EQUIPAMENTO.map((item) => ({ id: `equipamento.${item.id}`, categoria: 'equipamento' as const, nome: item.nome, descricao: `Equipamento para o espaço ${item.espaco}.` })),
  ...HABILIDADES_DE_COMBATE.map((item) => ({ id: `tecnica.${item.id}`, categoria: 'tecnica' as const, nome: item.nome, descricao: `Técnica de perfil ${item.perfil}.` })),
  ...INIMIGOS.map((item) => ({ id: `inimigo.${item.id}`, categoria: 'inimigo' as const, nome: item.nome, descricao: `Ameaça de nível ${item.nivelDeCombate}.` })),
  { id: `masmorra.${DUN_LIATH_FACIL.id}`, categoria: 'masmorra' as const, nome: DUN_LIATH_FACIL.nome, descricao: `${DUN_LIATH_FACIL.salas.length} salas conhecidas na Fortaleza Cinzenta.` },
  ...DUN_LIATH_FACIL.salas.map((item) => ({ id: `sala.${item.id}`, categoria: 'sala' as const, nome: item.nome, descricao: `Sala do tipo ${item.tipo}.` })),
]

/** Reúne as descobertas que o estado atual prova, sem inferir ações só pela posse de itens iniciais. */
export function obterDescobertasComprovadas(partida: PartidaLocal): string[] {
  const ids = new Set<string>([`classe.${partida.personagem.idDaClasse}`])
  const profissoesComProgresso = Object.entries(partida.profissoes).filter(([, p]) => p.xp > 0 || p.nivel > 1 || p.prestigio > 0).map(([id]) => `oficio.${id}`)
  profissoesComProgresso.forEach((id) => ids.add(id))
  for (const atividade of ATIVIDADES_OCIOSAS_INICIAIS) {
    if (partida.ocioso.atividadeAtiva?.idDaDefinicaoDaAtividade === atividade.id) ids.add(`atividade.${atividade.id}`)
  }
  partida.jornada.idsDasReceitasFabricadas.forEach((id) => ids.add(`receita.${id}`))
  partida.personagem.idsDasHabilidadesConhecidas.forEach((id) => ids.add(`tecnica.${id}`))
  const itens = new Set([
    ...partida.personagem.inventario.map((item) => item.idDaDefinicao),
    ...partida.personagem.banco.inventario.map((item) => item.idDaDefinicao),
    ...partida.personagem.itensDeEquipamento.map((item) => item.idDaDefinicao),
    ...partida.personagem.banco.itensDeEquipamento.map((item) => item.idDaDefinicao),
    ...(partida.masmorra.expedicaoAtiva?.bolsaDaExpedicao.map((item) => item.idDaDefinicao) ?? []),
    ...Object.values(partida.personagem.equipamento).flatMap((id) => {
      const instancia = partida.personagem.itensDeEquipamento.find((item) => item.idDaInstancia === id)
      return instancia ? [instancia.idDaDefinicao] : []
    }),
  ])
  for (const id of itens) {
    if (DEFINICOES_DE_EQUIPAMENTO.some((equipamento) => equipamento.id === id)) ids.add(`equipamento.${id}`)
    else ids.add(`material.${id}`)
  }
  if (partida.combate.ultimaExpedicao?.desfecho === 'vitoria') ids.add(`inimigo.${partida.combate.ultimaExpedicao.idDaDefinicaoDoInimigo}`)
  const salasVisitadas = partida.masmorra.expedicaoAtiva?.idsDasSalasVisitadas ?? []
  salasVisitadas.forEach((id) => ids.add(`sala.${id}`))
  if (partida.masmorra.expedicaoAtiva || partida.masmorra.dunLiathFacilConquistado) ids.add(`masmorra.${DUN_LIATH_FACIL.id}`)
  if (partida.masmorra.dunLiathFacilConquistado) DUN_LIATH_FACIL.salas.forEach((sala) => ids.add(`sala.${sala.id}`))
  return [...ids].filter((id) => ENTRADAS_DO_CODICE.some((entrada) => entrada.id === id))
}

export interface Desafio { id: string; nome: string; descricao: string; alvo: number; progresso(partida: PartidaLocal): number }
/** Metas que podem ser calculadas de registros persistidos; nenhuma premia recursos ou acelera o jogo. */
export const DESAFIOS: readonly Desafio[] = [
  { id: 'desafio.primeira-receita', nome: 'Mãos à obra', descricao: 'Fabrique sua primeira receita.', alvo: 1, progresso: (p) => Math.min(1, p.jornada.idsDasReceitasFabricadas.length) },
  { id: 'desafio.primeira-vitoria', nome: 'A estrada não perdoa', descricao: 'Vença um combate de serviço.', alvo: 1, progresso: (p) => Number(p.combate.loboDerrotado) },
  { id: 'desafio.contrato-dun-liath', nome: 'A Fortaleza Cinzenta', descricao: 'Conclua o contrato de Dún Liath.', alvo: 1, progresso: (p) => Number(p.masmorra.contratoConcluido) },
  { id: 'desafio.primeiro-oficio-prestigio', nome: 'Mestre de ofício', descricao: 'Alcance Prestígio I em um ofício.', alvo: 1, progresso: (p) => Number(Object.values(p.profissoes).some((oficio) => oficio.prestigio >= 1)) },
  { id: 'desafio.codice-10', nome: 'Olhos atentos', descricao: 'Descubra 10 entradas do Códice.', alvo: 10, progresso: (p) => p.codice.idsDescobertos.length },
  { id: 'desafio.primeiro-prestigio', nome: 'Um novo legado', descricao: 'Realize Prestígio I do personagem.', alvo: 1, progresso: (p) => Number(p.personagem.prestigio.nivel > 0) },
]

/** Descobertas e desafios são monotônicos: uma vez registrados, permanecem na partida. */
export function atualizarCodiceEDesafios(partida: PartidaLocal): PartidaLocal {
  const idsDescobertos = [...new Set([...partida.codice.idsDescobertos, ...obterDescobertasComprovadas(partida)])]
  const idsConcluidos = new Set(partida.desafios.idsConcluidos)
  for (const desafio of DESAFIOS) if (desafio.progresso({ ...partida, codice: { idsDescobertos } }) >= desafio.alvo) idsConcluidos.add(desafio.id)
  if (idsDescobertos.length === partida.codice.idsDescobertos.length && idsConcluidos.size === partida.desafios.idsConcluidos.length) return partida
  return { ...partida, codice: { idsDescobertos }, desafios: { idsConcluidos: [...idsConcluidos] } }
}
