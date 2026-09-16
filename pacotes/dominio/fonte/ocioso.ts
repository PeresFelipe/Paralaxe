import type { PilhaDoInventario, PartidaLocal } from './personagem'
import { obterEspacoParaPilhaNoInventario } from './armazenamento'

export const IDS_DAS_PROFISSOES = [
  "mineracao",
  "lenhador",
  "pesca",
  "herbologia",
  "metalurgia",
  "forja",
  "culinaria",
] as const

export type IdDaProfissao = (typeof IDS_DAS_PROFISSOES)[number]

export interface ProgressoDeProfissao {
  nivel: number
  xp: number
  prestigio: number
}

export type ProgressoDeProfissaoPorId = Record<IdDaProfissao, ProgressoDeProfissao>

export interface DefinicaoDeAtividadeOciosa {
  id: string
  idDaProfissao: IdDaProfissao
  nome: string
  idDaDefinicaoDoItemProduzido: string
  nomeDoResultado: string
  nivelExigidoDaProfissao: number
  segundosPorAcao: number
  xpDeProfissaoPorAcao: number
}

export interface AtividadeOciosaAtiva {
  idDaDefinicaoDaAtividade: string
  iniciadoEm: string
  processadoPorUltimoEm: string
  segundosRestantes: number
}

export interface EstadoOcioso {
  atividadeAtiva: AtividadeOciosaAtiva | null
}

export interface ResultadoDoProgressoOcioso {
  partida: PartidaLocal
  acoesConcluidas: number
  itensConcedidos: number
  xpDeProfissaoConcedido: number
  xpGeralConcedido: number
  niveisDeProfissaoGanhos: number
  segundosProcessados: number
  segundosLimitados: number
  interrompidoPorCapacidade: boolean
}

const XP_DE_PROFISSAO_PARA_PROXIMO_NIVEL = [40, 60, 80, 110, 140, 180, 220, 270, 320] as const
const LIMITE_BASE_DE_AUSENCIA_EM_SEGUNDOS = 4 * 60 * 60
const BONUS_DE_AUSENCIA_POR_DEZ_NIVEIS_EM_SEGUNDOS = 2 * 60 * 60

export function obterXpDeProfissaoParaProximoNivel(nivel: number): number | null {
  return XP_DE_PROFISSAO_PARA_PROXIMO_NIVEL[nivel - 1] ?? null
}

export function criarProgressoInicialDasProfissoes(): ProgressoDeProfissaoPorId {
  return Object.fromEntries(
    IDS_DAS_PROFISSOES.map((idDaProfissao) => [idDaProfissao, { nivel: 1, xp: 0, prestigio: 0 }]),
  ) as ProgressoDeProfissaoPorId
}

export function obterLimiteDeAusenciaEmSegundos(personagemNivel: number) {
  const obtidoBonusAdicionais = Math.floor(Math.max(0, personagemNivel) / 10)
  return LIMITE_BASE_DE_AUSENCIA_EM_SEGUNDOS + obtidoBonusAdicionais * BONUS_DE_AUSENCIA_POR_DEZ_NIVEIS_EM_SEGUNDOS
}

function adicionarInventarioItem(inventario: PilhaDoInventario[], idDaDefinicao: string, quantidade: number) {
  const existente = inventario.find((pilha) => pilha.idDaDefinicao === idDaDefinicao)

  if (existente) {
    return inventario.map((pilha) =>
      pilha.idDaDefinicao === idDaDefinicao
        ? { ...pilha, quantidade: pilha.quantidade + quantidade }
        : pilha,
    )
  }

  return [...inventario, { idDaDefinicao, quantidade }]
}

export function aplicarXpDeProfissao(progresso: ProgressoDeProfissao, ganhoXp: number) {
  let nivel = progresso.nivel
  let xp = progresso.xp + ganhoXp
  let niveisGanhos = 0

  while (nivel < 10) {
    const requisito = XP_DE_PROFISSAO_PARA_PROXIMO_NIVEL[nivel - 1]

    if (requisito === undefined || xp < requisito) break

    xp -= requisito
    nivel += 1
    niveisGanhos += 1
  }

  return {
    progresso: { ...progresso, nivel, xp },
    niveisGanhos,
  }
}

export function iniciarAtividadeOciosa(
  partida: PartidaLocal,
  atividade: DefinicaoDeAtividadeOciosa,
  agora: string,
): PartidaLocal {
  if (partida.fabricacao.receitaAtiva) {
    throw new Error('Interrompa a produção antes de iniciar uma coleta.')
  }

  const profissao = partida.profissoes[atividade.idDaProfissao]

  if (profissao.nivel < atividade.nivelExigidoDaProfissao) {
    throw new Error(`${atividade.nome} exige nível ${atividade.nivelExigidoDaProfissao} de Profissão.`)
  }
  if (obterEspacoParaPilhaNoInventario(partida, atividade.idDaDefinicaoDoItemProduzido) <= 0) {
    throw new Error('O Inventário não possui capacidade para o resultado dessa coleta.')
  }

  return {
    ...partida,
    atualizadoEm: agora,
    ocioso: {
      atividadeAtiva: {
        idDaDefinicaoDaAtividade: atividade.id,
        iniciadoEm: agora,
        processadoPorUltimoEm: agora,
        segundosRestantes: 0,
      },
    },
  }
}

export function interromperAtividadeOciosa(partida: PartidaLocal, agora: string): PartidaLocal {
  return {
    ...partida,
    atualizadoEm: agora,
    ocioso: { atividadeAtiva: null },
  }
}

export function processarProgressoOcioso(
  partida: PartidaLocal,
  atividade: DefinicaoDeAtividadeOciosa,
  agora: string,
): ResultadoDoProgressoOcioso {
  const ativo = partida.ocioso.atividadeAtiva

  if (!ativo || ativo.idDaDefinicaoDaAtividade !== atividade.id) {
    return {
      partida,
      acoesConcluidas: 0,
      itensConcedidos: 0,
      xpDeProfissaoConcedido: 0,
      xpGeralConcedido: 0,
      niveisDeProfissaoGanhos: 0,
      segundosProcessados: 0,
      segundosLimitados: 0,
      interrompidoPorCapacidade: false,
    }
  }

  const ultimoProcessadoMs = Date.parse(ativo.processadoPorUltimoEm)
  const agoraMs = Date.parse(agora)

  if (!Number.isFinite(ultimoProcessadoMs) || !Number.isFinite(agoraMs) || agoraMs <= ultimoProcessadoMs) {
    return {
      partida,
      acoesConcluidas: 0,
      itensConcedidos: 0,
      xpDeProfissaoConcedido: 0,
      xpGeralConcedido: 0,
      niveisDeProfissaoGanhos: 0,
      segundosProcessados: 0,
      segundosLimitados: 0,
      interrompidoPorCapacidade: false,
    }
  }

  const decorridoSegundos = Math.floor((agoraMs - ultimoProcessadoMs) / 1000)
  const ausenteLimite = obterLimiteDeAusenciaEmSegundos(partida.personagem.nivel)
  const segundosProcessados = Math.min(decorridoSegundos, ausenteLimite)
  const segundosLimitados = Math.max(0, decorridoSegundos - segundosProcessados)
  const totalSegundos = ativo.segundosRestantes + segundosProcessados
  const tempoAcoes = Math.floor(totalSegundos / atividade.segundosPorAcao)
  const inventarioSala = obterEspacoParaPilhaNoInventario(partida, atividade.idDaDefinicaoDoItemProduzido)
  const acoesConcluidas = Math.min(tempoAcoes, inventarioSala)
  const interrompidoPorCapacidade =
    (inventarioSala === 0 && tempoAcoes > 0) ||
    (inventarioSala > 0 && acoesConcluidas === inventarioSala)
  const segundosRestantes = interrompidoPorCapacidade ? 0 : totalSegundos % atividade.segundosPorAcao

  const profissaoXp = acoesConcluidas * atividade.xpDeProfissaoPorAcao
  const atualProfissao = partida.profissoes[atividade.idDaProfissao]
  const profissaoResultado = aplicarXpDeProfissao(atualProfissao, profissaoXp)
  const geralXp = profissaoResultado.niveisGanhos * 5

  const proximoPartida: PartidaLocal = {
    ...partida,
    atualizadoEm: agora,
    personagem: {
      ...partida.personagem,
      xp: partida.personagem.xp + geralXp,
      inventario:
        acoesConcluidas > 0
          ? adicionarInventarioItem(partida.personagem.inventario, atividade.idDaDefinicaoDoItemProduzido, acoesConcluidas)
          : partida.personagem.inventario,
    },
    profissoes: {
      ...partida.profissoes,
      [atividade.idDaProfissao]: profissaoResultado.progresso,
    },
    ocioso: {
      atividadeAtiva: interrompidoPorCapacidade
        ? null
        : {
            ...ativo,
            processadoPorUltimoEm: agora,
            segundosRestantes,
          },
    },
  }

  return {
    partida: proximoPartida,
    acoesConcluidas,
    itensConcedidos: acoesConcluidas,
    xpDeProfissaoConcedido: profissaoXp,
    xpGeralConcedido: geralXp,
    niveisDeProfissaoGanhos: profissaoResultado.niveisGanhos,
    segundosProcessados,
    segundosLimitados,
    interrompidoPorCapacidade,
  }
}
