/**
 * @file Motor de coleta e experiência das profissões.
 * O progresso é calculado pela diferença entre horários, permitindo o mesmo processamento
 * com a página aberta ou após uma ausência. Nenhum temporizador é criado neste módulo.
 */
import type { PilhaDoInventario, PartidaLocal } from './personagem'
import { obterEspacoParaPilhaNoInventario } from './armazenamento'
import type { DefinicaoDeEquipamento, EspacoDeFerramenta } from './equipamento'

export const IDS_DAS_PROFISSOES = [
  "mineracao",
  "lenhador",
  "pesca",
  "herbologia",
  "metalurgia",
  "forja",
  "culinaria",
] as const
export const NIVEL_MAXIMO_DE_PROFISSAO = 99

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

/** Referência persistida do trabalho. segundosRestantes guarda o tempo já acumulado de uma ação incompleta. */
export interface AtividadeOciosaAtiva {
  idDaDefinicaoDaAtividade: string
  iniciadoEm: string
  processadoPorUltimoEm: string
  segundosRestantes: number
}

export interface EstadoOcioso {
  atividadeAtiva: AtividadeOciosaAtiva | null
}

/** Combina a nova partida com um resumo usado nas mensagens de retorno e interrupção. */
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

/** Os nove primeiros custos são históricos; a extensão até 99 é balanceamento provisório. */
const XP_DE_PROFISSAO_PARA_PROXIMO_NIVEL = [
  40, 60, 80, 110, 140, 180, 220, 270, 320,
  ...Array.from({ length: NIVEL_MAXIMO_DE_PROFISSAO - 10 }, (_, indice) => {
    const faixa = indice + 1
    return Math.round(320 + faixa * 35 + Math.pow(faixa, 1.55) * 7)
  }),
] as const
const FERRAMENTA_POR_PROFISSAO: Partial<Record<IdDaProfissao, EspacoDeFerramenta>> = {
  mineracao: 'ferramentaMineracao',
  lenhador: 'ferramentaLenhador',
  pesca: 'ferramentaPesca',
  herbologia: 'ferramentaHerbologia',
}

/** Consulta o bônus da ferramenta sem acoplar o motor de coleta ao catálogo do jogo. */
export function obterBonusDaFerramentaDeColeta(
  partida: PartidaLocal,
  atividade: DefinicaoDeAtividadeOciosa,
  resolver?: (idDaDefinicao: string) => DefinicaoDeEquipamento | null,
): number {
  const espaco = FERRAMENTA_POR_PROFISSAO[atividade.idDaProfissao]
  if (!espaco || !resolver) return 0
  const id = partida.personagem.equipamento[espaco]
  if (!id) return 0
  const instancia = partida.personagem.itensDeEquipamento.find((item) => item.idDaInstancia === id)
  if (!instancia) return 0
  const definicao = resolver(instancia.idDaDefinicao)
  if (definicao?.espaco !== espaco || definicao.bonusDeColeta?.idDaProfissao !== atividade.idDaProfissao) return 0
  return Math.max(0, Math.floor(definicao.bonusDeColeta.xpAdicionalPorAcao))
}

const LIMITE_BASE_DE_AUSENCIA_EM_SEGUNDOS = 4 * 60 * 60
const BONUS_DE_AUSENCIA_POR_DEZ_NIVEIS_EM_SEGUNDOS = 2 * 60 * 60

/** Retorna o custo do próximo nível; null indica que a tabela não possui outra transição. */
export function obterXpDeProfissaoParaProximoNivel(nivel: number): number | null {
  if (!Number.isInteger(nivel) || nivel < 1 || nivel >= NIVEL_MAXIMO_DE_PROFISSAO) return null
  return XP_DE_PROFISSAO_PARA_PROXIMO_NIVEL[nivel - 1] ?? null
}

/** Cria objetos independentes para as sete profissões, todas inicialmente no nível 1. */
export function criarProgressoInicialDasProfissoes(): ProgressoDeProfissaoPorId {
  return Object.fromEntries(
    IDS_DAS_PROFISSOES.map((idDaProfissao) => [idDaProfissao, { nivel: 1, xp: 0, prestigio: 0 }]),
  ) as ProgressoDeProfissaoPorId
}

/** Limite de quatro horas, acrescido de duas horas a cada dez níveis gerais completos. */
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

/** Consome o custo de cada nível e transporta o excedente; a XP da profissão é relativa ao nível atual. */
export function aplicarXpDeProfissao(progresso: ProgressoDeProfissao, ganhoXp: number) {
  let nivel = progresso.nivel
  let xp = progresso.xp + ganhoXp
  let niveisGanhos = 0

  while (nivel < NIVEL_MAXIMO_DE_PROFISSAO) {
    const requisito = obterXpDeProfissaoParaProximoNivel(nivel)

    if (requisito === null || xp < requisito) break

    xp -= requisito
    nivel += 1
    niveisGanhos += 1
  }

  return {
    progresso: { ...progresso, nivel, xp },
    niveisGanhos,
  }
}

/** Prestígio só no nível 99; progressos históricos de Prestígio permanecem válidos. */
export function realizarPrestigioDaProfissao(partida: PartidaLocal, idDaProfissao: IdDaProfissao, agora: string): PartidaLocal {
  const progresso = partida.profissoes[idDaProfissao]
  if (progresso.nivel < NIVEL_MAXIMO_DE_PROFISSAO) throw new Error(`Leve o ofício ao nível ${NIVEL_MAXIMO_DE_PROFISSAO} antes de realizar Prestígio.`)
  if (progresso.prestigio >= 3) throw new Error('Esse ofício já atingiu Prestígio III.')
  if (partida.ocioso.atividadeAtiva || partida.fabricacao.receitaAtiva) throw new Error('Pare o trabalho atual antes de realizar Prestígio.')
  return {
    ...partida,
    atualizadoEm: agora,
    profissoes: {
      ...partida.profissoes,
      [idDaProfissao]: { nivel: 1, xp: 0, prestigio: progresso.prestigio + 1 },
    },
  }
}

/** Exige nível, espaço para o recurso e ausência de fabricação ativa antes de registrar o horário inicial. */
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

/** Remove a atividade selecionada; o chamador deve processar o tempo pendente antes, se desejar creditá-lo. */
export function interromperAtividadeOciosa(partida: PartidaLocal, agora: string): PartidaLocal {
  return {
    ...partida,
    atualizadoEm: agora,
    ocioso: { atividadeAtiva: null },
  }
}

/**
 * Converte segundos válidos em ações completas, limitadas pela ausência permitida e pela capacidade.
 * Não modifica a entrada; devolve a partida e os ganhos para a aplicação persistir.
 */
export function processarProgressoOcioso(
  partida: PartidaLocal,
  atividade: DefinicaoDeAtividadeOciosa,
  agora: string,
  resolverEquipamento?: (idDaDefinicao: string) => DefinicaoDeEquipamento | null,
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

  // Só segundos inteiros entram na conta. Horários inválidos ou anteriores já foram descartados acima.
  const decorridoSegundos = Math.floor((agoraMs - ultimoProcessadoMs) / 1000)
  const ausenteLimite = obterLimiteDeAusenciaEmSegundos(partida.personagem.nivel)
  const segundosProcessados = Math.min(decorridoSegundos, ausenteLimite)
  const segundosLimitados = Math.max(0, decorridoSegundos - segundosProcessados)
  // Soma o saldo de uma ação incompleta; ignorá-lo faria o jogador perder progresso a cada atualização.
  const totalSegundos = ativo.segundosRestantes + segundosProcessados
  const tempoAcoes = Math.floor(totalSegundos / atividade.segundosPorAcao)
  const inventarioSala = obterEspacoParaPilhaNoInventario(partida, atividade.idDaDefinicaoDoItemProduzido)
  const acoesConcluidas = Math.min(tempoAcoes, inventarioSala)
  // Ao atingir o limite da pilha ou dos espaços, encerra o trabalho em vez de acumular ganhos impossíveis.
  const interrompidoPorCapacidade =
    (inventarioSala === 0 && tempoAcoes > 0) ||
    (inventarioSala > 0 && acoesConcluidas === inventarioSala)
  const segundosRestantes = interrompidoPorCapacidade ? 0 : totalSegundos % atividade.segundosPorAcao

  const bonusFerramenta = obterBonusDaFerramentaDeColeta(partida, atividade, resolverEquipamento)
  const profissaoXp = acoesConcluidas * (atividade.xpDeProfissaoPorAcao + bonusFerramenta)
  const atualProfissao = partida.profissoes[atividade.idDaProfissao]
  const profissaoResultado = aplicarXpDeProfissao(atualProfissao, profissaoXp)
  // Cada nível de profissão concede 5 XP gerais. Aqui só o total de XP é somado,
  // sem recalcular o nível geral; esse cálculo pertence a progressao.ts.
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
