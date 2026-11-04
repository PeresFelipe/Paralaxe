/**
 * @file Definições e instâncias de equipamento.
 * Uma definição descreve o modelo do item; uma instância identifica a cópia do jogador,
 * com reforço, raridade e afixos próprios. As operações devolvem novos estados.
 */
import type { ChaveDeAtributo, PartidaLocal } from './personagem'
import type { IdDaProfissao } from './ocioso'

/** Lista canônica de espaços, também usada para criar os equipamentos em ordem estável. */
/** Ferramentas de profissão ocupam espaços separados dos equipamentos de combate. */
export const ESPACOS_DE_FERRAMENTAS = [
  'ferramentaMineracao', 'ferramentaLenhador', 'ferramentaPesca', 'ferramentaHerbologia',
] as const
export type EspacoDeFerramenta = (typeof ESPACOS_DE_FERRAMENTAS)[number]

export const ESPACOS_DE_EQUIPAMENTO = [
  "cabeca",
  "peitoral",
  "luvas",
  'pernas',
  "botas",
  "maoPrincipal",
  "maoSecundaria",
  "amuleto",
  "anel1",
  "anel2",
  ...ESPACOS_DE_FERRAMENTAS,
] as const

export type EspacoDeEquipamento = (typeof ESPACOS_DE_EQUIPAMENTO)[number]

export type ConjuntoDeEquipamentosIniciais = Partial<Record<EspacoDeEquipamento, string>>
export type IdsDosItensEquipados = Partial<Record<EspacoDeEquipamento, string>>

export type NivelDeReforcoDoEquipamento = 0 | 1
export type TipoDeEstatisticaPrincipalDoEquipamento = "ataque" | "defesa"
export type RaridadeDoEquipamento = "comum" | "incomum" | "raro"
export type GrauDeEscalonamento = 'S' | 'A' | 'B' | 'C' | 'D' | 'E'
export type TipoDeDano = "corte" | "perfuracao" | "impacto" | "fogo" | "gelo" | "arcano" | "sagrado"

export interface EstatisticaPrincipalDoEquipamento {
  tipo: TipoDeEstatisticaPrincipalDoEquipamento
  valor: number
}

export interface PerfilDeCombateDaArma {
  tipoDeDano: TipoDeDano
  intervaloDeAcaoEmSegundos: number
  escalonamento: Partial<Record<ChaveDeAtributo, GrauDeEscalonamento>>
}

/** Modelo compartilhado pelo catálogo; não recebe progresso individual do jogador. */
export interface DefinicaoDeEquipamento {
  id: string
  nome: string
  espaco: EspacoDeEquipamento
  estatisticaPrincipal?: EstatisticaPrincipalDoEquipamento
  combateDaArma?: PerfilDeCombateDaArma
  /** Bônus determinístico de XP de coleta no ofício da ferramenta. */
  bonusDeColeta?: { idDaProfissao: IdDaProfissao; xpAdicionalPorAcao: number }
  bonusDeRecursos?: {
    vidaMaxima?: number
    manaMaxima?: number
    folegoMaximo?: number
  }
}

/** Cópia possuída pelo jogador. O ID da instância continua o mesmo ao equipar ou guardar no banco. */
export interface InstanciaDeEquipamento {
  idDaInstancia: string
  idDaDefinicao: string
  nivelDeReforco: NivelDeReforcoDoEquipamento
  raridade?: RaridadeDoEquipamento
  idsDosAfixos?: string[]
}

export interface EstadoDosEquipamentosIniciais {
  equipado: IdsDosItensEquipados
  itensDeEquipamento: InstanciaDeEquipamento[]
  proximaSequenciaDeEquipamento: number
}

/** Materializa o conjunto da classe em instâncias eq-N e associa cada uma ao seu espaço. */
export function criarEstadoDosEquipamentosIniciais(
  conjunto: ConjuntoDeEquipamentosIniciais,
): EstadoDosEquipamentosIniciais {
  const equipado: IdsDosItensEquipados = {}
  const itensDeEquipamento: InstanciaDeEquipamento[] = []
  let proximaSequenciaDeEquipamento = 1

  for (const espaco of ESPACOS_DE_EQUIPAMENTO) {
    const idDaDefinicao = conjunto[espaco]
    if (!idDaDefinicao) continue

    const idDaInstancia = `eq-${proximaSequenciaDeEquipamento}`
    proximaSequenciaDeEquipamento += 1
    itensDeEquipamento.push({ idDaInstancia, idDaDefinicao, nivelDeReforco: 0 })
    equipado[espaco] = idDaInstancia
  }

  return { equipado, itensDeEquipamento, proximaSequenciaDeEquipamento }
}

/** Aplica a regra atual do reforço +1: aumento de 15%, arredondado para cima; ausência de estatística retorna null. */
export function obterValorPrincipalDoEquipamento(
  definicao: DefinicaoDeEquipamento,
  nivelDeReforco: NivelDeReforcoDoEquipamento,
) {
  const baseValor = definicao.estatisticaPrincipal?.valor
  if (baseValor === undefined) return null

  if (nivelDeReforco === 0) return baseValor

  return Math.ceil(baseValor * 1.15)
}

/**
 * Confere a posse e a definição antes de trocar a referência do espaço correspondente.
 * A instância continua em itensDeEquipamento; a contagem de capacidade distingue itens equipados e guardados.
 */
export function equiparItem(
  partida: PartidaLocal,
  idDaInstancia: string,
  definicao: DefinicaoDeEquipamento,
  agora: string,
): PartidaLocal {
  const instancia = partida.personagem.itensDeEquipamento.find((item) => item.idDaInstancia === idDaInstancia)

  if (!instancia) {
    throw new Error('Equipamento não encontrado no inventário do personagem.')
  }

  if (instancia.idDaDefinicao !== definicao.id) {
    throw new Error('A Definition do equipamento não corresponde à instância selecionada.')
  }

  return {
    ...partida,
    atualizadoEm: agora,
    personagem: {
      ...partida.personagem,
      equipamento: {
        ...partida.personagem.equipamento,
        [definicao.espaco]: idDaInstancia,
      },
    },
  }
}
