/**
 * @file Catálogo da árvore de prestígio e regras de desbloqueio do personagem.
 * Controla requisitos, custos e reinício de nível/atributos, preservando os nós comprados.
 * Os bônus persistentes da árvore são interpretados pela derivação e simulação de combate.
 */
import type { AtributosDoPersonagem, EstadoDePrestigioDoPersonagem, PartidaLocal } from './personagem'

export const NIVEL_MAXIMO_DE_PRESTIGIO_DO_PERSONAGEM = 3
export const PONTOS_DE_PRESTIGIO_POR_NIVEL = 5
export const PONTOS_MAXIMOS_DE_PRESTIGIO = NIVEL_MAXIMO_DE_PRESTIGIO_DO_PERSONAGEM * PONTOS_DE_PRESTIGIO_POR_NIVEL

export const RAMOS_PUROS_DE_PRESTIGIO = ["corpo", "arcano", "espirito", "tecnica"] as const
export type RamoPuroDePrestigio = (typeof RAMOS_PUROS_DE_PRESTIGIO)[number]
export type GrupoDoNoDePrestigio = RamoPuroDePrestigio | "hibrido"
export type TipoDeNoDePrestigio = "puro" | "hibrido"

export interface RequisitoDoRamoDePrestigio {
  ramo: RamoPuroDePrestigio
  contagem: number
}

export interface DefinicaoDeNoDePrestigio {
  id: string
  grupo: GrupoDoNoDePrestigio
  nome: string
  descricao: string
  custo: number
  camada: number
  tipo: TipoDeNoDePrestigio
  preRequisitos: readonly string[]
  requisitosDeRamo?: readonly RequisitoDoRamoDePrestigio[]
  caminhoHibrido?: string
}

/** Monta um nó de um único ramo com custo, ordem de apresentação e pré-requisitos explícitos. */
const puroNo = (
  grupo: RamoPuroDePrestigio,
  id: string,
  nome: string,
  descricao: string,
  custo: number,
  camada: number,
  preRequisitos: readonly string[],
): DefinicaoDeNoDePrestigio => ({
  id,
  grupo,
  nome,
  descricao,
  custo,
  camada,
  tipo: "puro",
  preRequisitos,
})

/** Monta um nó que combina ramos, incluindo a quantidade mínima de nós puros de cada origem. */
const hibridoNo = (
  id: string,
  caminhoHibrido: string,
  nome: string,
  descricao: string,
  custo: number,
  camada: number,
  preRequisitos: readonly string[],
  requisitosDeRamo: readonly RequisitoDoRamoDePrestigio[],
): DefinicaoDeNoDePrestigio => ({
  id,
  grupo: "hibrido",
  caminhoHibrido,
  nome,
  descricao,
  custo,
  camada,
  tipo: "hibrido",
  preRequisitos,
  requisitosDeRamo,
})

/** Árvore declarativa: IDs persistidos conectam pré-requisitos e escolhas já gravadas. */
export const NOS_DE_PRESTIGIO: readonly DefinicaoDeNoDePrestigio[] = [
  puroNo("corpo", "prestigio.corpo.constituicao", 'Constituição', 'Concede +2 Vitalidade e +24 de Vida máxima.', 1, 1, []),
  puroNo("corpo", "prestigio.corpo.folego-de-guerra", 'Fôlego de Guerra', "Concede +16 Fôlego máximo e +2 de recuperação por segundo.", 1, 2, ["prestigio.corpo.constituicao"]),
  puroNo("corpo", "prestigio.corpo.impeto", 'Ímpeto', '+1 Força.', 2, 3, ["prestigio.corpo.folego-de-guerra"]),
  puroNo("corpo", "prestigio.corpo.inabalavel", 'Inabalável', '+8 Defesa e redução de 20% no primeiro golpe relevante recebido no combate.', 2, 4, ["prestigio.corpo.impeto"]),
  puroNo("corpo", "prestigio.corpo.segundo-folego", 'Segundo Fôlego', "+1 Vitalidade. Uma vez por combate, sobreviver a um golpe com até 25% de Vida restaura 20% da Vida e do Fôlego máximos.", 2, 5, ["prestigio.corpo.inabalavel"]),
  puroNo("corpo", "prestigio.corpo.ultimo-resistenciaFinal", 'Último Bastião', "+1 Vitalidade, +12 Defesa e +1 recuperação de Fôlego. A Defesa aumenta 25% abaixo de 35% de Vida.", 2, 6, ["prestigio.corpo.segundo-folego"]),

  puroNo("arcano", "prestigio.arcano.mental-reserva", 'Reserva Mental', '+2 Mente e +20 Mana máxima.', 1, 1, []),
  puroNo("arcano", "prestigio.arcano.fluxo-arcano", 'Fluxo Arcano', '+1,5 de regeneração de Mana por segundo.', 1, 2, ["prestigio.arcano.mental-reserva"]),
  puroNo("arcano", "prestigio.arcano.canalizacao", 'Canalização', '+1 Inteligência.', 2, 3, ["prestigio.arcano.fluxo-arcano"]),
  puroNo("arcano", "prestigio.arcano.ressonancia", 'Ressonância', '+1 Inteligência.', 2, 4, ["prestigio.arcano.canalizacao"]),
  puroNo("arcano", "prestigio.arcano.arcano-reserva", 'Reserva Arcana', '+12 Mana máxima e +1 de regeneração de Mana por segundo.', 2, 5, ["prestigio.arcano.ressonancia"]),
  puroNo("arcano", "prestigio.arcano.sobrecarga", 'Sobrecarga', '+2 Inteligência.', 2, 6, ["prestigio.arcano.arcano-reserva"]),

  puroNo("espirito", "prestigio.espirito.conviccao", 'Convicção', '+2 Fé.', 1, 1, []),
  puroNo("espirito", "prestigio.espirito.restauradora-graca", 'Graça Restauradora', '+1 Fé, ampliando efeitos que escalam com esse atributo.', 1, 2, ["prestigio.espirito.conviccao"]),
  puroNo("espirito", "prestigio.espirito.espiritual-resistencia", 'Resistência Espiritual', '+1 Fé e redução de 20% no acúmulo recebido dos cinco estados de combate.', 2, 3, ["prestigio.espirito.restauradora-graca"]),
  puroNo("espirito", "prestigio.espirito.intercessao", 'Intercessão', '+1 Vitalidade e +6 Defesa.', 2, 4, ["prestigio.espirito.espiritual-resistencia"]),
  puroNo("espirito", "prestigio.espirito.companhia-laco", 'Vínculo de Companhia', '+1 Fé; o bônus funciona também na configuração solo atual.', 2, 5, ["prestigio.espirito.intercessao"]),
  puroNo("espirito", "prestigio.espirito.comunhao", 'Comunhão', '+2 Fé e +4 Defesa; o bônus funciona também na configuração solo atual.', 2, 6, ["prestigio.espirito.companhia-laco"]),

  puroNo("tecnica", "prestigio.tecnica.firme-mao", 'Mão Firme', '+1 Destreza e +8 Precisão.', 1, 1, []),
  puroNo("tecnica", "prestigio.tecnica.preciso-golpe", 'Golpe Preciso', '+1 Destreza e +3 pontos percentuais de chance crítica.', 1, 2, ["prestigio.tecnica.firme-mao"]),
  puroNo("tecnica", "prestigio.tecnica.combate-ritmo", 'Ritmo de Combate', '+1 Destreza.', 2, 3, ["prestigio.tecnica.preciso-golpe"]),
  puroNo("tecnica", "prestigio.tecnica.oportunismo", 'Oportunismo', '+1 Destreza e +2 pontos percentuais de chance crítica.', 2, 4, ["prestigio.tecnica.combate-ritmo"]),
  puroNo("tecnica", "prestigio.tecnica.execucao", 'Execução', '+1 Destreza.', 2, 5, ["prestigio.tecnica.oportunismo"]),
  puroNo("tecnica", "prestigio.tecnica.ritmo-mestre", 'Mestre do Ritmo', '+2 Destreza.', 2, 6, ["prestigio.tecnica.execucao"]),

  hibridoNo("prestigio.hibrido.corpo-arcano.encantada-arma", "corpo-arcano", 'Arma Encantada', '+1 Força e +1 Inteligência.', 1, 1, [], [{ ramo: "corpo", contagem: 3 }, { ramo: "arcano", contagem: 3 }]),
  hibridoNo("prestigio.hibrido.corpo-arcano.arcano-guerreiro", "corpo-arcano", 'Guerreiro Arcano', '+1 Força e +1 Inteligência.', 2, 2, ["prestigio.hibrido.corpo-arcano.encantada-arma"], [{ ramo: "corpo", contagem: 4 }, { ramo: "arcano", contagem: 4 }]),
  hibridoNo("prestigio.hibrido.corpo-espirito.zelo", "corpo-espirito", 'Zelo', '+1 Vitalidade e +1 Fé.', 1, 1, [], [{ ramo: "corpo", contagem: 3 }, { ramo: "espirito", contagem: 3 }]),
  hibridoNo("prestigio.hibrido.corpo-espirito.sagrado-bastiao", "corpo-espirito", 'Bastião Sagrado', '+1 Vitalidade e +1 Fé.', 2, 2, ["prestigio.hibrido.corpo-espirito.zelo"], [{ ramo: "corpo", contagem: 4 }, { ramo: "espirito", contagem: 4 }]),
  hibridoNo("prestigio.hibrido.tecnica-arcano.arcano-lamina", "tecnica-arcano", 'Lâmina Arcana', '+1 Destreza e +1 Inteligência.', 1, 1, [], [{ ramo: "tecnica", contagem: 3 }, { ramo: "arcano", contagem: 3 }]),
  hibridoNo("prestigio.hibrido.tecnica-arcano.rapido-conjuracao", "tecnica-arcano", 'Conjuração Rápida', '+1 Destreza e +1 Inteligência.', 2, 2, ["prestigio.hibrido.tecnica-arcano.arcano-lamina"], [{ ramo: "tecnica", contagem: 4 }, { ramo: "arcano", contagem: 4 }]),
  hibridoNo("prestigio.hibrido.tecnica-espirito.conviccao-golpe", "tecnica-espirito", 'Golpe de Convicção', '+1 Destreza e +1 Fé.', 1, 1, [], [{ ramo: "tecnica", contagem: 3 }, { ramo: "espirito", contagem: 3 }]),
  hibridoNo("prestigio.hibrido.tecnica-espirito.inquisidor", "tecnica-espirito", 'Inquisidor', '+1 Destreza e +1 Fé.', 2, 2, ["prestigio.hibrido.tecnica-espirito.conviccao-golpe"], [{ ramo: "tecnica", contagem: 4 }, { ramo: "espirito", contagem: 4 }]),
] as const

export type IdDoNoDePrestigio = (typeof NOS_DE_PRESTIGIO)[number]['id']

export const ROTULOS_DOS_RAMOS_DE_PRESTIGIO: Record<RamoPuroDePrestigio, string> = {
  corpo: 'Corpo',
  arcano: 'Arcano',
  espirito: 'Espírito',
  tecnica: 'Técnica',
}

export const ROTULOS_DOS_HIBRIDOS_DE_PRESTIGIO: Record<string, string> = {
  "corpo-arcano": 'Corpo + Arcano',
  "corpo-espirito": 'Corpo + Espírito',
  "tecnica-arcano": 'Técnica + Arcano',
  "tecnica-espirito": 'Técnica + Espírito',
}

/** Localiza a definição pelo ID persistido; IDs desconhecidos permanecem sem definição. */
export function obterNoDePrestigio(noId: string) {
  return NOS_DE_PRESTIGIO.find((no) => no.id === noId)
}

/** A condição atual exige ao menos Prestígio I em todas as profissões. */
export function personagemPodeRealizarPrestigio(partida: PartidaLocal) {
  return Object.values(partida.profissoes).every((profissao) => profissao.prestigio >= 1)
}

/** Resume quantas profissões cumprem a condição para a interface explicar o bloqueio. */
export function obterProntidaoParaPrestigioDoPersonagem(partida: PartidaLocal) {
  const totalDeProfissoes = Object.keys(partida.profissoes).length
  const profissoesProntas = Object.values(partida.profissoes).filter((profissao) => profissao.prestigio >= 1).length

  return {
    pronto: profissoesProntas === totalDeProfissoes,
    profissoesProntas,
    totalDeProfissoes,
  }
}

function possuiDesbloqueadoNo(estado: EstadoDePrestigioDoPersonagem, noId: string) {
  return estado.idsDosNosDesbloqueados.includes(noId)
}

function contagemDesbloqueadoRamoNos(estado: EstadoDePrestigioDoPersonagem, ramo: RamoPuroDePrestigio) {
  return NOS_DE_PRESTIGIO.filter((no) => no.tipo === "puro" && no.grupo === ramo && possuiDesbloqueadoNo(estado, no.id)).length
}

function formatoNoNomes(noIds: readonly string[]) {
  return noIds
    .map((id) => obterNoDePrestigio(id)?.nome)
    .filter((nome): nome is string => Boolean(nome))
    .join(', ')
}

export type SituacaoDoNoDePrestigio = "bloqueado" | "disponivel" | "desbloqueado"

/** Centraliza a decisão de compra e o motivo do bloqueio: profissão, nível, pontos, nós e ramos. */
export function obterDisponibilidadeDoNoDePrestigio(
  partida: PartidaLocal,
  noId: string,
): { situacao: SituacaoDoNoDePrestigio; motivo?: string } {
  const no = obterNoDePrestigio(noId)
  const estado = partida.personagem.prestigio

  if (!no) return { situacao: "bloqueado", motivo: 'Nó de Prestígio não encontrado.' }
  if (possuiDesbloqueadoNo(estado, no.id)) return { situacao: "desbloqueado" }
  if (!personagemPodeRealizarPrestigio(partida)) {
    return { situacao: "bloqueado", motivo: "Exige todas as Profissões com Prestígio I." }
  }
  if (estado.nivel < 1) {
    return { situacao: "bloqueado", motivo: 'Realize o Prestígio I do personagem.' }
  }
  if (estado.pontos < no.custo) {
    return { situacao: "bloqueado", motivo: `Faltam ${no.custo - estado.pontos} ponto(s) de Prestígio.` }
  }
  if (no.preRequisitos.some((preRequisito) => !possuiDesbloqueadoNo(estado, preRequisito))) {
    return { situacao: "bloqueado", motivo: `Requer: ${formatoNoNomes(no.preRequisitos)}.` }
  }
  if (no.requisitosDeRamo?.some((requisito) => contagemDesbloqueadoRamoNos(estado, requisito.ramo) < requisito.contagem)) {
    const faltante = no.requisitosDeRamo
      .filter((requisito) => contagemDesbloqueadoRamoNos(estado, requisito.ramo) < requisito.contagem)
      .map((requisito) => `${requisito.contagem} nós de ${ROTULOS_DOS_RAMOS_DE_PRESTIGIO[requisito.ramo]}`)
      .join(' e ')
    return { situacao: "bloqueado", motivo: `Requer ${faltante}.` }
  }

  return { situacao: "disponivel" }
}

/** Revalida os requisitos no momento da compra, desconta o custo e registra o ID do nó. */
export function desbloquearNoDePrestigioDoPersonagem(
  partida: PartidaLocal,
  noId: string,
  agora: string,
): PartidaLocal {
  const no = obterNoDePrestigio(noId)
  if (!no) throw new Error('Nó de Prestígio não encontrado.')

  const disponibilidade = obterDisponibilidadeDoNoDePrestigio(partida, no.id)
  if (disponibilidade.situacao !== "disponivel") {
    throw new Error(disponibilidade.motivo ?? 'Esse nó de Prestígio ainda não está disponível.')
  }

  return {
    ...partida,
    atualizadoEm: agora,
    personagem: {
      ...partida.personagem,
      prestigio: {
        ...partida.personagem.prestigio,
        pontos: partida.personagem.prestigio.pontos - no.custo,
        idsDosNosDesbloqueados: [...partida.personagem.prestigio.idsDosNosDesbloqueados, no.id],
      },
    },
  }
}

/**
 * Eleva o prestígio e acrescenta pontos, reiniciando nível, XP e atributos para a base da classe.
 * Os demais campos são preservados pelo espalhamento do estado; trabalhos ativos impedem a operação.
 */
export function realizarPrestigioDoPersonagem(
  partida: PartidaLocal,
  baseAtributos: AtributosDoPersonagem,
  agora: string,
): PartidaLocal {
  if (!personagemPodeRealizarPrestigio(partida)) {
    throw new Error("Todas as Profissões precisam ter Prestígio I antes do Prestígio do personagem.")
  }
  if (partida.personagem.prestigio.nivel >= NIVEL_MAXIMO_DE_PRESTIGIO_DO_PERSONAGEM) {
    throw new Error('O Prestígio do personagem já atingiu o limite desta versão.')
  }
  if (partida.ocioso.atividadeAtiva || partida.fabricacao.receitaAtiva) {
    throw new Error('Pare a atividade atual antes de realizar o Prestígio do personagem.')
  }

  const proximoNivel = partida.personagem.prestigio.nivel + 1
  const proximoPontos = Math.min(
    PONTOS_MAXIMOS_DE_PRESTIGIO,
    partida.personagem.prestigio.pontos + PONTOS_DE_PRESTIGIO_POR_NIVEL,
  )

  return {
    ...partida,
    atualizadoEm: agora,
    personagem: {
      ...partida.personagem,
      nivel: 1,
      xp: 0,
      pontosDeAtributoDisponiveis: 0,
      atributos: { ...baseAtributos },
      prestigio: {
        ...partida.personagem.prestigio,
        nivel: proximoNivel,
        pontos: proximoPontos,
      },
    },
  }
}
