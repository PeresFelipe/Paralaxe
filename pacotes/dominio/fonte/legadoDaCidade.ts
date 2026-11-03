/** Regras puras do Legado da Cidade Livre; a partida é a fonte de verdade. */
import type { PartidaLocal, PilhaDoInventario } from './personagem'
import type { IdDaProfissao } from './ocioso'
import {
  IDS_DOS_DISTRITOS, NIVEL_MAXIMO_DO_DISTRITO, LIMIARES_DOS_ESTAGIOS,
  type IdDoDistrito, type EstadoDaVigilia,
} from './vigiliaDaCidade'

export interface RegistroDeReconstrucao { idDoProjeto: string; idDoDistrito: IdDoDistrito; nivel: number; concluidoEm: string }
export interface EstadoDoLegado {
  distritos: Record<IdDoDistrito, number>
  /** Créditos não renováveis convertidos das Brasas da versão 12, nunca liberam um marco. */
  creditosDeTransicao: number
  historico: RegistroDeReconstrucao[]
}
export type MarcoDaCidade =
  | { tipo: 'desafio'; id: string }
  | { tipo: 'receita'; id: string }
  | { tipo: 'codice'; quantidade: number }
  | { tipo: 'profissao'; id: IdDaProfissao; nivel: number }
  | { tipo: 'combate-vitoria' }
  | { tipo: 'dun-liath' }
  | { tipo: 'nivel-personagem'; nivel: number }
  | { tipo: 'prestigio-profissao'; id: IdDaProfissao; nivel: number }
  | { tipo: 'material-descoberto'; id: string }

export interface MaterialDoProjeto { idDaDefinicao: string; nome: string; quantidade: number }
export interface DefinicaoDeProjetoDaCidade {
  id: string
  distrito: IdDoDistrito
  nivel: 1 | 2 | 3 | 4
  nome: string
  descricao: string
  conclusao: string
  requisitos: readonly MarcoDaCidade[]
  materiais: readonly MaterialDoProjeto[]
  ouro: number
  dependencias?: ReadonlyArray<{ distrito: IdDoDistrito; nivel: number }> | undefined
}
export type SituacaoDoProjeto = 'bloqueado' | 'disponivel' | 'pronto' | 'concluido'
export interface ConsultaDoProjeto {
  situacao: SituacaoDoProjeto
  motivo: string | null
  requisitos: readonly { nome: string; cumprido: boolean }[]
  materiais: readonly (MaterialDoProjeto & { possuido: number })[]
  ouroDisponivel: number
  ouroNecessario: number
  descontoEmOuro: number
  creditosAplicaveis: number
}

export function criarLegadoInicial(vigilia?: EstadoDaVigilia): EstadoDoLegado {
  return {
    distritos: Object.fromEntries(IDS_DOS_DISTRITOS.map(id => [id, vigilia?.distritos[id] ?? 0])) as Record<IdDoDistrito, number>,
    creditosDeTransicao: vigilia?.saldoBrasas ?? 0,
    historico: [],
  }
}

export function validarLegado(valor: unknown): asserts valor is EstadoDoLegado {
  if (!valor || typeof valor !== 'object') throw new Error('Legado ausente ou inválido no save.')
  const estado = valor as Partial<EstadoDoLegado>
  if (!estado.distritos || typeof estado.distritos !== 'object') throw new Error('Distritos do Legado inválidos.')
  for (const id of IDS_DOS_DISTRITOS) {
    const nivel = estado.distritos[id]
    if (!Number.isSafeInteger(nivel) || nivel < 0 || nivel > NIVEL_MAXIMO_DO_DISTRITO) throw new Error(`Nível inválido no distrito ${id}.`)
  }
  if (!Number.isSafeInteger(estado.creditosDeTransicao) || estado.creditosDeTransicao! < 0) throw new Error('Créditos do Legado inválidos.')
  if (!Array.isArray(estado.historico) || estado.historico.length > 120) throw new Error('Histórico do Legado inválido.')
  const vistos = new Set<string>()
  for (const registro of estado.historico) {
    if (!registro || typeof registro.idDoProjeto !== 'string' || !registro.idDoProjeto || !IDS_DOS_DISTRITOS.includes(registro.idDoDistrito) || !Number.isInteger(registro.nivel) || registro.nivel < 1 || registro.nivel > 4 || !Number.isFinite(Date.parse(registro.concluidoEm)) || vistos.has(registro.idDoProjeto)) throw new Error('Registro de construção inválido.')
    vistos.add(registro.idDoProjeto)
  }
}

export function totalDeMelhoriasDaCidade(estado: EstadoDoLegado): number {
  return IDS_DOS_DISTRITOS.reduce((soma, id) => soma + estado.distritos[id], 0)
}
export function estagioDoLegado(estado: EstadoDoLegado): 0 | 1 | 2 | 3 | 4 {
  const total = totalDeMelhoriasDaCidade(estado)
  for (let i = LIMIARES_DOS_ESTAGIOS.length - 1; i >= 0; i--) if (total >= LIMIARES_DOS_ESTAGIOS[i]!) return i as 0 | 1 | 2 | 3 | 4
  return 0
}

export function quantidadeDeMaterial(partida: PartidaLocal, id: string): number {
  return [...partida.personagem.inventario, ...partida.personagem.banco.inventario]
    .filter(pilha => pilha.idDaDefinicao === id).reduce((acc, pilha) => acc + pilha.quantidade, 0)
}

export function descreverMarco(marco: MarcoDaCidade): string {
  switch (marco.tipo) {
    case 'desafio': return `Concluir o desafio ${marco.id.replace('desafio.', '').replaceAll('-', ' ')}`
    case 'receita': return 'Fabricar uma receita da Jornada'
    case 'codice': return `Registrar ${marco.quantidade} descobertas no Códice`
    case 'profissao': return `Alcançar nível ${marco.nivel} em ${marco.id}`
    case 'combate-vitoria': return 'Vencer o primeiro combate'
    case 'dun-liath': return 'Concluir o contrato de Dún Liath'
    case 'nivel-personagem': return `Alcançar nível ${marco.nivel} do personagem`
    case 'prestigio-profissao': return `Alcançar Prestígio ${marco.nivel} em ${marco.id}`
    case 'material-descoberto': return `Descobrir o recurso ${marco.id.replace('material.', '')}`
  }
}

export function marcoCumprido(partida: PartidaLocal, marco: MarcoDaCidade): boolean {
  switch (marco.tipo) {
    case 'desafio': return partida.desafios.idsConcluidos.includes(marco.id)
    case 'receita': return partida.jornada.idsDasReceitasFabricadas.includes(marco.id)
    case 'codice': return partida.codice.idsDescobertos.length >= marco.quantidade
    case 'profissao': return partida.profissoes[marco.id].nivel >= marco.nivel || partida.profissoes[marco.id].prestigio > 0
    case 'combate-vitoria': return partida.combate.loboDerrotado
    case 'dun-liath': return partida.masmorra.contratoConcluido
    case 'nivel-personagem': return partida.personagem.nivel >= marco.nivel
    case 'prestigio-profissao': return partida.profissoes[marco.id].prestigio >= marco.nivel
    case 'material-descoberto': return partida.codice.idsDescobertos.includes(marco.id)
  }
}

/** Desconto de até 50% do ouro; somente créditos legados e nunca dispensa materiais ou conquistas. */
function descontoDeTransicao(estado: EstadoDoLegado, ouro: number): { creditos: number; desconto: number } {
  const creditos = Math.min(estado.creditosDeTransicao, Math.floor(ouro / 4))
  return { creditos, desconto: creditos * 2 }
}

export function consultarProjeto(partida: PartidaLocal, projeto: DefinicaoDeProjetoDaCidade): ConsultaDoProjeto {
  const nivelAtual = partida.legado.distritos[projeto.distrito]
  const creditos = descontoDeTransicao(partida.legado, projeto.ouro)
  const requisitos = projeto.requisitos.map(marco => ({ nome: descreverMarco(marco), cumprido: marcoCumprido(partida, marco) }))
  const materiais = projeto.materiais.map(material => ({ ...material, possuido: quantidadeDeMaterial(partida, material.idDaDefinicao) }))
  const ouroNecessario = projeto.ouro - creditos.desconto
  const base = { requisitos, materiais, ouroDisponivel: partida.personagem.ouro, ouroNecessario, descontoEmOuro: creditos.desconto, creditosAplicaveis: creditos.creditos }
  if (nivelAtual >= projeto.nivel) return { ...base, situacao: 'concluido', motivo: null }
  if (nivelAtual !== projeto.nivel - 1) return { ...base, situacao: 'bloqueado', motivo: 'Conclua antes as etapas anteriores deste distrito.' }
  if (projeto.dependencias?.some(item => partida.legado.distritos[item.distrito] < item.nivel)) return { ...base, situacao: 'bloqueado', motivo: 'Restaure primeiro os distritos exigidos.' }
  if (requisitos.some(item => !item.cumprido)) return { ...base, situacao: 'bloqueado', motivo: 'Conclua as conquistas necessárias.' }
  if (materiais.some(item => item.possuido < item.quantidade) || partida.personagem.ouro < ouroNecessario) return { ...base, situacao: 'disponivel', motivo: 'Reúna os materiais e moedas indicados.' }
  return { ...base, situacao: 'pronto', motivo: null }
}

function consumirPilha(pilhas: readonly PilhaDoInventario[], id: string, quantidade: number): { pilhas: PilhaDoInventario[]; restante: number } {
  let restante = quantidade
  const resultado = pilhas.map(pilha => {
    if (pilha.idDaDefinicao !== id || restante <= 0) return pilha
    const desconto = Math.min(restante, pilha.quantidade)
    restante -= desconto
    return { ...pilha, quantidade: pilha.quantidade - desconto }
  }).filter(pilha => pilha.quantidade > 0)
  return { pilhas: resultado, restante }
}

/** Um comando sobre a última partida: verifica tudo antes do débito e da única melhoria. */
export function concluirProjeto(partida: PartidaLocal, projeto: DefinicaoDeProjetoDaCidade, agora: string): PartidaLocal {
  if (!Number.isFinite(Date.parse(agora))) throw new Error('Horário inválido para concluir a construção.')
  if (!IDS_DOS_DISTRITOS.includes(projeto.distrito) || !Number.isInteger(projeto.nivel) || projeto.nivel < 1 || projeto.nivel > 4 || projeto.ouro < 0) throw new Error('Projeto inválido.')
  const consulta = consultarProjeto(partida, projeto)
  if (consulta.situacao === 'concluido') return partida // idempotência: não desconta de novo
  if (consulta.situacao !== 'pronto') throw new Error(consulta.motivo ?? 'Projeto indisponível.')
  let inventario = partida.personagem.inventario
  let banco = partida.personagem.banco.inventario
  for (const material of projeto.materiais) {
    const retirada = consumirPilha(inventario, material.idDaDefinicao, material.quantidade)
    inventario = retirada.pilhas
    const noBanco = consumirPilha(banco, material.idDaDefinicao, retirada.restante)
    banco = noBanco.pilhas
    if (noBanco.restante) throw new Error('Materiais insuficientes. Nenhum recurso foi consumido.')
  }
  const historico = [...partida.legado.historico, {
    idDoProjeto: projeto.id, idDoDistrito: projeto.distrito, nivel: projeto.nivel, concluidoEm: agora,
  }].slice(-120)
  return {
    ...partida, atualizadoEm: agora,
    personagem: { ...partida.personagem, ouro: partida.personagem.ouro - consulta.ouroNecessario,
      inventario, banco: { ...partida.personagem.banco, inventario: banco } },
    legado: { ...partida.legado,
      creditosDeTransicao: partida.legado.creditosDeTransicao - consulta.creditosAplicaveis,
      distritos: { ...partida.legado.distritos, [projeto.distrito]: projeto.nivel }, historico },
  }
}
