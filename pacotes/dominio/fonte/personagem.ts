import { criarEspacosPadraoDeConsumiveis, type EstadoDeCombate } from './combate'
import { type EstadoDeFabricacao } from './fabricacao'
import { type EstadoDeProgressoDaMasmorra } from './masmorra'
import {
  criarEstadoDosEquipamentosIniciais,
  type IdsDosItensEquipados,
  type InstanciaDeEquipamento,
  type EspacoDeEquipamento,
  type ConjuntoDeEquipamentosIniciais,
} from './equipamento'
import { criarProgressoInicialDasProfissoes, type EstadoOcioso, type ProgressoDeProfissaoPorId } from './ocioso'
import { criarJornadaInicial, type EstadoDaJornada } from './jornada'

export const CHAVES_DOS_ATRIBUTOS = [
  "vitalidade",
  "mente",
  'vigor',
  "forca",
  "destreza",
  "inteligencia",
  "fe",
] as const

export type ChaveDeAtributo = (typeof CHAVES_DOS_ATRIBUTOS)[number]

export interface AtributosDoPersonagem {
  vitalidade: number
  mente: number
  vigor: number
  forca: number
  destreza: number
  inteligencia: number
  fe: number
}

export interface EstadoDePrestigioDoPersonagem {
  nivel: number
  pontos: number
  idsDosNosDesbloqueados: string[]
}

export function criarPrestigioInicialDoPersonagem(): EstadoDePrestigioDoPersonagem {
  return {
    nivel: 0,
    pontos: 0,
    idsDosNosDesbloqueados: [],
  }
}

export type IdDaClasseDoPersonagem =
  | "guerreiro"
  | "mago"
  | "cacador"
  | "acolito"
  | "ladino"
  | "errante"

export type IdDoPresente =
  | "enferrujada-chave"
  | "moeda-bolsaDeMoedas"
  | "carmesim-frasco"
  | "viajante-anel"
  | "semNome-pedra"
  | "sobrevivencia-estojo"
  | "nenhum"

export interface DefinicaoDeClasseDoPersonagem {
  id: IdDaClasseDoPersonagem
  nome: string
  resumo: string
  atributos: AtributosDoPersonagem
  equipamentosIniciais: ConjuntoDeEquipamentosIniciais
  idDaHabilidadeInicial: string
}

export type ConcessaoInicial =
  | {
      tipo: "ouro"
      quantidadeTotal: number
    }
  | {
      tipo: 'item'
      idDaDefinicao: string
      quantidade: number
    }
  | {
      tipo: "equipamento"
      idDaDefinicao: string
      espacoParaEquipar?: EspacoDeEquipamento
    }

export interface DefinicaoDePresente {
  id: IdDoPresente
  nome: string
  resumo: string
  concessoes: readonly ConcessaoInicial[]
}

export interface PilhaDoInventario {
  idDaDefinicao: string
  quantidade: number
}

export interface EstadoDoBanco {
  inventario: PilhaDoInventario[]
  itensDeEquipamento: InstanciaDeEquipamento[]
}

export interface EstadoDoPersonagem {
  nome: string
  idDaClasse: IdDaClasseDoPersonagem
  idDoPresente: IdDoPresente
  nivel: number
  xp: number
  pontosDeAtributoDisponiveis: number
  atributos: AtributosDoPersonagem
  ouro: number
  inventario: PilhaDoInventario[]
  banco: EstadoDoBanco
  equipamento: IdsDosItensEquipados
  itensDeEquipamento: InstanciaDeEquipamento[]
  proximaSequenciaDeEquipamento: number
  idsDasHabilidadesConhecidas: string[]
  espacosDeHabilidadesAtivas: [string | null, string | null, string | null, string | null]
  idDaLocalizacaoAtual: string
  prestigio: EstadoDePrestigioDoPersonagem
}

export const VERSAO_DO_ESQUEMA_DA_PARTIDA = 10 as const

export interface PartidaLocal {
  idDaPartida: string
  modoDaPartida: "LOCAL"
  versaoDoEsquemaDaPartida: typeof VERSAO_DO_ESQUEMA_DA_PARTIDA
  versaoDoConteudo: string
  criadoEm: string
  atualizadoEm: string
  segundosDeJogo: number
  personagem: EstadoDoPersonagem
  profissoes: ProgressoDeProfissaoPorId
  ocioso: EstadoOcioso
  fabricacao: EstadoDeFabricacao
  combate: EstadoDeCombate
  masmorra: EstadoDeProgressoDaMasmorra
  jornada: EstadoDaJornada
}

export interface ParametrosDeCriacaoDaPartidaLocal {
  idDaPartida: string
  criadoEm: string
  versaoDoConteudo: string
  nomeDoPersonagem: string
  classeDoPersonagem: DefinicaoDeClasseDoPersonagem
  presente: DefinicaoDePresente
}

function atributoTotal(atributos: AtributosDoPersonagem) {
  return CHAVES_DOS_ATRIBUTOS.reduce((total, chave) => total + atributos[chave], 0)
}

function validarPersonagemClasse(definicao: DefinicaoDeClasseDoPersonagem) {
  for (const chave of CHAVES_DOS_ATRIBUTOS) {
    const valor = definicao.atributos[chave]

    if (!Number.isInteger(valor) || valor < 0) {
      throw new Error(`Atributo inicial inválido em ${definicao.id}: ${chave}.`)
    }
  }

  if (atributoTotal(definicao.atributos) !== 35) {
    throw new Error(`A classe ${definicao.id} precisa iniciar com exatamente 35 pontos.`)
  }
}

function versaoPresenteEstado(presente: DefinicaoDePresente) {
  const inventarioPorDefinicao = new Map<string, number>()
  const equipamentosConcedidos: Array<{ idDaDefinicao: string; espacoParaEquipar?: EspacoDeEquipamento }> = []
  let ouro = 0

  for (const conceder of presente.concessoes) {
    if (conceder.tipo === "ouro") {
      if (!Number.isInteger(conceder.quantidadeTotal) || conceder.quantidadeTotal < 0) {
        throw new Error(`Quantidade de moedas inválida no presente ${presente.id}.`)
      }
      ouro += conceder.quantidadeTotal
      continue
    }

    if (conceder.tipo === "equipamento") {
      if (!conceder.idDaDefinicao.trim()) {
        throw new Error(`Equipamento inválido no presente ${presente.id}.`)
      }
      equipamentosConcedidos.push(conceder.espacoParaEquipar ? { idDaDefinicao: conceder.idDaDefinicao, espacoParaEquipar: conceder.espacoParaEquipar } : { idDaDefinicao: conceder.idDaDefinicao })
      continue
    }

    if (!Number.isInteger(conceder.quantidade) || conceder.quantidade <= 0) {
      throw new Error(`Quantidade de item inválida no presente ${presente.id}.`)
    }

    const atualQuantidade = inventarioPorDefinicao.get(conceder.idDaDefinicao) ?? 0
    inventarioPorDefinicao.set(conceder.idDaDefinicao, atualQuantidade + conceder.quantidade)
  }

  const inventario = [...inventarioPorDefinicao.entries()].map(([idDaDefinicao, quantidade]) => ({
    idDaDefinicao,
    quantidade,
  }))

  return { ouro, inventario, equipamentosConcedidos }
}

export function criarPartidaLocal(entradaDeDados: ParametrosDeCriacaoDaPartidaLocal): PartidaLocal {
  const nomeDoPersonagem = entradaDeDados.nomeDoPersonagem.trim()

  if (!entradaDeDados.idDaPartida.trim()) throw new Error("O partida precisa possuir um identificador.")
  if (!entradaDeDados.versaoDoConteudo.trim()) throw new Error("O partida precisa registrar a versão do conteúdo.")
  if (!nomeDoPersonagem) throw new Error('O personagem precisa possuir um nome.')

  validarPersonagemClasse(entradaDeDados.classeDoPersonagem)

  const presenteEstado = versaoPresenteEstado(entradaDeDados.presente)
  const idDaHabilidadeInicial = entradaDeDados.classeDoPersonagem.idDaHabilidadeInicial
  const equipamentosIniciais = criarEstadoDosEquipamentosIniciais(entradaDeDados.classeDoPersonagem.equipamentosIniciais)
  const presenteEquipamentoItens: InstanciaDeEquipamento[] = presenteEstado.equipamentosConcedidos.map((conceder, indice) => ({
    idDaInstancia: `eq-${equipamentosIniciais.proximaSequenciaDeEquipamento + indice}`,
    idDaDefinicao: conceder.idDaDefinicao,
    nivelDeReforco: 0,
  }))
  const equipado = { ...equipamentosIniciais.equipado }
  presenteEstado.equipamentosConcedidos.forEach((conceder, indice) => {
    const instancia = presenteEquipamentoItens[indice]
    if (conceder.espacoParaEquipar && instancia && !equipado[conceder.espacoParaEquipar]) {
      equipado[conceder.espacoParaEquipar] = instancia.idDaInstancia
    }
  })

  return {
    idDaPartida: entradaDeDados.idDaPartida,
    modoDaPartida: "LOCAL",
    versaoDoEsquemaDaPartida: VERSAO_DO_ESQUEMA_DA_PARTIDA,
    versaoDoConteudo: entradaDeDados.versaoDoConteudo,
    criadoEm: entradaDeDados.criadoEm,
    atualizadoEm: entradaDeDados.criadoEm,
    segundosDeJogo: 0,
    personagem: {
      nome: nomeDoPersonagem,
      idDaClasse: entradaDeDados.classeDoPersonagem.id,
      idDoPresente: entradaDeDados.presente.id,
      nivel: 1,
      xp: 0,
      pontosDeAtributoDisponiveis: 0,
      atributos: { ...entradaDeDados.classeDoPersonagem.atributos },
      ouro: presenteEstado.ouro,
      inventario: presenteEstado.inventario,
      banco: { inventario: [], itensDeEquipamento: [] },
      equipamento: equipado,
      itensDeEquipamento: [...equipamentosIniciais.itensDeEquipamento, ...presenteEquipamentoItens],
      proximaSequenciaDeEquipamento: equipamentosIniciais.proximaSequenciaDeEquipamento + presenteEquipamentoItens.length,
      idsDasHabilidadesConhecidas: [idDaHabilidadeInicial],
      espacosDeHabilidadesAtivas: [idDaHabilidadeInicial, null, null, null],
      idDaLocalizacaoAtual: "cidade-livre.taverna",
      prestigio: criarPrestigioInicialDoPersonagem(),
    },
    profissoes: criarProgressoInicialDasProfissoes(),
    ocioso: { atividadeAtiva: null },
    fabricacao: { receitaAtiva: null },
    jornada: criarJornadaInicial(),
    combate: {
      preferencias: {
        estilo: "misto",
        porcentagemDoLimiarDeVidaDefensiva: 60,
        espacosDeConsumiveis: criarEspacosPadraoDeConsumiveis(),
      },
      ultimaExpedicao: null,
      loboDerrotado: false,
    },
    masmorra: {
      expedicaoAtiva: null,
      dunLiathFacilConquistado: false,
      dunLiathProtetor: null,
      contratoConcluido: false,
      guardaInstintivaDesbloqueada: false,
      contratoAceito: false,
    },
  }
}
