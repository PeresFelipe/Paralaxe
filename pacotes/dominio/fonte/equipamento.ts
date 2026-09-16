import type { ChaveDeAtributo, PartidaLocal } from './personagem'

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

export interface DefinicaoDeEquipamento {
  id: string
  nome: string
  espaco: EspacoDeEquipamento
  estatisticaPrincipal?: EstatisticaPrincipalDoEquipamento
  combateDaArma?: PerfilDeCombateDaArma
  bonusDeRecursos?: {
    vidaMaxima?: number
    manaMaxima?: number
    folegoMaximo?: number
  }
}

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

export function obterValorPrincipalDoEquipamento(
  definicao: DefinicaoDeEquipamento,
  nivelDeReforco: NivelDeReforcoDoEquipamento,
) {
  const baseValor = definicao.estatisticaPrincipal?.valor
  if (baseValor === undefined) return null

  if (nivelDeReforco === 0) return baseValor

  return Math.ceil(baseValor * 1.15)
}

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
