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

export const NOS_DE_PRESTIGIO: readonly DefinicaoDeNoDePrestigio[] = [
  puroNo("corpo", "prestigio.corpo.constituicao", 'Constituição', 'Aumenta a Vida máxima.', 1, 1, []),
  puroNo("corpo", "prestigio.corpo.folego-de-guerra", 'Fôlego de Guerra', "Aumenta o Fôlego máximo e sua recuperação.", 1, 2, ["prestigio.corpo.constituicao"]),
  puroNo("corpo", "prestigio.corpo.impeto", 'Ímpeto', 'Física Agressiva concede eficiência física temporária.', 2, 3, ["prestigio.corpo.folego-de-guerra"]),
  puroNo("corpo", "prestigio.corpo.inabalavel", 'Inabalável', 'Um golpe relevante concede redução temporária de dano.', 2, 4, ["prestigio.corpo.impeto"]),
  puroNo("corpo", "prestigio.corpo.segundo-folego", 'Segundo Fôlego', "Uma vez por combate, uma condição crítica recupera Vida e Fôlego.", 2, 5, ["prestigio.corpo.inabalavel"]),
  puroNo("corpo", "prestigio.corpo.ultimo-resistenciaFinal", 'Último Bastião', "Habilidade final: Vida baixa concede resistência e recuperação de Fôlego progressivas e limitadas.", 2, 6, ["prestigio.corpo.segundo-folego"]),

  puroNo("arcano", "prestigio.arcano.mental-reserva", 'Reserva Mental', 'Aumenta a Mana máxima.', 1, 1, []),
  puroNo("arcano", "prestigio.arcano.fluxo-arcano", 'Fluxo Arcano', 'Aumenta a regeneração de Mana.', 1, 2, ["prestigio.arcano.mental-reserva"]),
  puroNo("arcano", "prestigio.arcano.canalizacao", 'Canalização', 'Magias diferentes em sequência fortalecem a eficiência da próxima.', 2, 3, ["prestigio.arcano.fluxo-arcano"]),
  puroNo("arcano", "prestigio.arcano.ressonancia", 'Ressonância', 'Uma sequência diversa acumula Ressonância.', 2, 4, ["prestigio.arcano.canalizacao"]),
  puroNo("arcano", "prestigio.arcano.arcano-reserva", 'Reserva Arcana', 'Uma vez por combate em Mana crítica, oferece recuperação e uma janela excepcional.', 2, 5, ["prestigio.arcano.ressonancia"]),
  puroNo("arcano", "prestigio.arcano.sobrecarga", 'Sobrecarga', 'Habilidade final: Ressonância máxima permite uma Magia Sobrecarregada.', 2, 6, ["prestigio.arcano.arcano-reserva"]),

  puroNo("espirito", "prestigio.espirito.conviccao", 'Convicção', 'Aumenta a Fé.', 1, 1, []),
  puroNo("espirito", "prestigio.espirito.restauradora-graca", 'Graça Restauradora', 'Aumenta o efeito de cura realizada.', 1, 2, ["prestigio.espirito.conviccao"]),
  puroNo("espirito", "prestigio.espirito.espiritual-resistencia", 'Resistência Espiritual', "Aumenta a resistência ao acúmulo dos cinco situação.", 2, 3, ["prestigio.espirito.restauradora-graca"]),
  puroNo("espirito", "prestigio.espirito.intercessao", 'Intercessão', 'Converte parte do overheal em proteção temporária limitada.', 2, 4, ["prestigio.espirito.espiritual-resistencia"]),
  puroNo("espirito", "prestigio.espirito.companhia-laco", 'Vínculo de Companhia', "O suporte pode beneficiar parcialmente outros membros da Grupo.", 2, 5, ["prestigio.espirito.intercessao"]),
  puroNo("espirito", "prestigio.espirito.comunhao", 'Comunhão', 'Habilidade final: cura e proteção excedentes são parcialmente redirecionadas, com equivalente Solo.', 2, 6, ["prestigio.espirito.companhia-laco"]),

  puroNo("tecnica", "prestigio.tecnica.firme-mao", 'Mão Firme', 'Aumenta a Precisão.', 1, 1, []),
  puroNo("tecnica", "prestigio.tecnica.preciso-golpe", 'Golpe Preciso', 'Aumenta o Crítico.', 1, 2, ["prestigio.tecnica.firme-mao"]),
  puroNo("tecnica", "prestigio.tecnica.combate-ritmo", 'Ritmo de Combate', 'Ativos diferentes geram Ritmo.', 2, 3, ["prestigio.tecnica.preciso-golpe"]),
  puroNo("tecnica", "prestigio.tecnica.oportunismo", 'Oportunismo', 'Críticos aceleram ou preservam Ritmo dentro de limites.', 2, 4, ["prestigio.tecnica.combate-ritmo"]),
  puroNo("tecnica", "prestigio.tecnica.execucao", 'Execução', 'Crítico contra inimigos em Vida baixa recebe efeito adicional.', 2, 5, ["prestigio.tecnica.oportunismo"]),
  puroNo("tecnica", "prestigio.tecnica.ritmo-mestre", 'Mestre do Ritmo', 'Habilidade final: Ritmo máximo fortalece o próximo ativo e é consumido.', 2, 6, ["prestigio.tecnica.execucao"]),

  hibridoNo("prestigio.hibrido.corpo-arcano.encantada-arma", "corpo-arcano", 'Arma Encantada', 'Física Agressiva fortalece a próxima Magia.', 1, 1, [], [{ ramo: "corpo", contagem: 3 }, { ramo: "arcano", contagem: 3 }]),
  hibridoNo("prestigio.hibrido.corpo-arcano.arcano-guerreiro", "corpo-arcano", 'Guerreiro Arcano', 'Interação bidirecional entre Física e Magia.', 2, 2, ["prestigio.hibrido.corpo-arcano.encantada-arma"], [{ ramo: "corpo", contagem: 4 }, { ramo: "arcano", contagem: 4 }]),
  hibridoNo("prestigio.hibrido.corpo-espirito.zelo", "corpo-espirito", 'Zelo', 'Habilidade Defensiva ligada a Fé fortalece a próxima ação Física apropriada.', 1, 1, [], [{ ramo: "corpo", contagem: 3 }, { ramo: "espirito", contagem: 3 }]),
  hibridoNo("prestigio.hibrido.corpo-espirito.sagrado-bastiao", "corpo-espirito", 'Bastião Sagrado', 'Ações físicas geram Guarda; Milagre ou defesa consome Guarda para fortalecer proteção ou cura.', 2, 2, ["prestigio.hibrido.corpo-espirito.zelo"], [{ ramo: "corpo", contagem: 4 }, { ramo: "espirito", contagem: 4 }]),
  hibridoNo("prestigio.hibrido.tecnica-arcano.arcano-lamina", "tecnica-arcano", 'Lâmina Arcana', 'Crítico físico fortalece a próxima Magia.', 1, 1, [], [{ ramo: "tecnica", contagem: 3 }, { ramo: "arcano", contagem: 3 }]),
  hibridoNo("prestigio.hibrido.tecnica-arcano.rapido-conjuracao", "tecnica-arcano", 'Conjuração Rápida', 'Magia fortalecida abre uma janela para ação física precisa.', 2, 2, ["prestigio.hibrido.tecnica-arcano.arcano-lamina"], [{ ramo: "tecnica", contagem: 4 }, { ramo: "arcano", contagem: 4 }]),
  hibridoNo("prestigio.hibrido.tecnica-espirito.conviccao-golpe", "tecnica-espirito", 'Golpe de Convicção', 'Crítico fortalece o próximo Milagre.', 1, 1, [], [{ ramo: "tecnica", contagem: 3 }, { ramo: "espirito", contagem: 3 }]),
  hibridoNo("prestigio.hibrido.tecnica-espirito.inquisidor", "tecnica-espirito", 'Inquisidor', 'Milagre apropriado fortalece a próxima ação física precisa.', 2, 2, ["prestigio.hibrido.tecnica-espirito.conviccao-golpe"], [{ ramo: "tecnica", contagem: 4 }, { ramo: "espirito", contagem: 4 }]),
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

export function obterNoDePrestigio(noId: string) {
  return NOS_DE_PRESTIGIO.find((no) => no.id === noId)
}

export function personagemPodeRealizarPrestigio(partida: PartidaLocal) {
  return Object.values(partida.profissoes).every((profissao) => profissao.prestigio >= 1)
}

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
