/**
 * @file Motor de fabricação e reforço de equipamentos.
 * Consome ingredientes apenas para ciclos completos cujo resultado cabe no inventário.
 * A entrada é preservada e o resultado descreve produção, experiência e motivo de parada.
 */
import type { PilhaDoInventario, PartidaLocal } from './personagem'
import { aplicarXpDeProfissao, obterLimiteDeAusenciaEmSegundos, type IdDaProfissao } from './ocioso'
import { obterEspacoParaEquipamentoNoInventario, obterEspacoParaPilhaNoInventario } from './armazenamento'
import { registrarFabricacaoDaJornada } from './jornada'
import { segundosPorAcaoComPrioridade, type PrioridadeDeOficio } from './prioridadesDeOficio'

export interface IngredienteDaReceita {
  idDaDefinicao: string
  quantidade: number
}

/** A saída determina se o ciclo cria uma pilha, uma instância nova ou reforça uma instância existente. */
export type ResultadoDaReceita =
  | {
      tipo: 'item'
      idDaDefinicao: string
      nome: string
      quantidade: number
    }
  | {
      tipo: "equipamento"
      idDaDefinicao: string
      nome: string
    }
  | {
      tipo: "equipamento-reforco"
      nome: string
      /** Nível de destino explícito; receitas antigas sem essa propriedade continuam +1. */
      nivelDeReforcoAlvo?: 1 | 2
    }

export interface DefinicaoDeReceitaDeFabricacao {
  id: string
  idDaProfissao: IdDaProfissao
  nome: string
  nivelExigidoDaProfissao: number
  segundosPorAcao: number
  xpDeProfissaoPorAcao: number
  ingredientes: readonly IngredienteDaReceita[]
  saida: ResultadoDaReceita
}

/** Mantém o relógio da produção e, no reforço, o ID exato do equipamento escolhido. */
export interface ReceitaDeFabricacaoAtiva {
  idDaDefinicaoDaReceita: string
  iniciadoEm: string
  processadoPorUltimoEm: string
  segundosRestantes: number
  idDaInstanciaDoEquipamentoAlvo: string | null
}

export interface EstadoDeFabricacao {
  receitaAtiva: ReceitaDeFabricacaoAtiva | null
  /** Prestígio I: segundo relógio independente; nos saves v14 é inicializado como null. */
  receitaSecundaria?: ReceitaDeFabricacaoAtiva | null
  prioridade?: PrioridadeDeOficio
}

export interface ResultadoDoProgressoDeFabricacao {
  partida: PartidaLocal
  acoesConcluidas: number
  itensProduzidos: number
  equipamentosProduzidos: number
  equipamentosReforcados: number
  xpDeProfissaoConcedido: number
  xpGeralConcedido: number
  niveisDeProfissaoGanhos: number
  segundosProcessados: number
  segundosLimitados: number
  interrompidoPorMateriais: boolean
  interrompidoPorCapacidade: boolean
}

function obterInventarioQuantidade(inventario: PilhaDoInventario[], idDaDefinicao: string) {
  return inventario.find((pilha) => pilha.idDaDefinicao === idDaDefinicao)?.quantidade ?? 0
}

/** O ingrediente mais escasso limita o número de ciclos; receitas sem ingredientes não têm esse limite. */
function obterMaximoFabricavelCiclos(inventario: PilhaDoInventario[], ingredientes: readonly IngredienteDaReceita[]) {
  if (ingredientes.length === 0) return Number.POSITIVE_INFINITY

  return Math.min(
    ...ingredientes.map((ingrediente) =>
      Math.floor(obterInventarioQuantidade(inventario, ingrediente.idDaDefinicao) / ingrediente.quantidade),
    ),
  )
}

/** Calcula o consumo por definição e elimina pilhas zeradas em uma nova lista. */
function consumirIngredientes(
  inventario: PilhaDoInventario[],
  ingredientes: readonly IngredienteDaReceita[],
  ciclos: number,
) {
  if (ciclos <= 0) return inventario

  const exigidoPorDefinicao = new Map<string, number>()

  for (const ingrediente of ingredientes) {
    exigidoPorDefinicao.set(
      ingrediente.idDaDefinicao,
      (exigidoPorDefinicao.get(ingrediente.idDaDefinicao) ?? 0) + ingrediente.quantidade * ciclos,
    )
  }

  return inventario
    .map((pilha) => ({
      ...pilha,
      quantidade: pilha.quantidade - (exigidoPorDefinicao.get(pilha.idDaDefinicao) ?? 0),
    }))
    .filter((pilha) => pilha.quantidade > 0)
}

function adicionarInventarioItem(
  inventario: PilhaDoInventario[],
  idDaDefinicao: string,
  quantidade: number,
) {
  if (quantidade <= 0) return inventario

  const existente = inventario.find((pilha) => pilha.idDaDefinicao === idDaDefinicao)

  if (!existente) {
    return [...inventario, { idDaDefinicao, quantidade }]
  }

  return inventario.map((pilha) =>
    pilha.idDaDefinicao === idDaDefinicao
      ? { ...pilha, quantidade: pilha.quantidade + quantidade }
      : pilha,
  )
}

/** Valida exclusividade com a coleta, nível, ingredientes e alvo de reforço antes de iniciar o relógio. */
export function iniciarReceitaDeFabricacao(
  partida: PartidaLocal,
  receita: DefinicaoDeReceitaDeFabricacao,
  agora: string,
  idDaInstanciaDoEquipamentoAlvo: string | null = null,
): PartidaLocal {
  if (partida.ocioso.atividadeAtiva || partida.ocioso.atividadeSecundaria) {
    throw new Error('Interrompa a atividade de coleta antes de iniciar uma produção.')
  }

  const profissao = partida.profissoes[receita.idDaProfissao]

  if (profissao.nivel < receita.nivelExigidoDaProfissao) {
    throw new Error(`${receita.nome} exige nível ${receita.nivelExigidoDaProfissao} de Profissão.`)
  }

  if (obterMaximoFabricavelCiclos(partida.personagem.inventario, receita.ingredientes) < 1) {
    throw new Error('Materiais insuficientes para iniciar essa produção.')
  }

  if (receita.saida.tipo === "equipamento-reforco") {
    if (!idDaInstanciaDoEquipamentoAlvo) {
      throw new Error('Selecione o equipamento que receberá o reforço.')
    }

    const alvo = partida.personagem.itensDeEquipamento.find(
      (instancia) => instancia.idDaInstancia === idDaInstanciaDoEquipamentoAlvo,
    )

    if (!alvo) {
      throw new Error('Equipamento selecionado para reforço não foi encontrado.')
    }

    const anterior = receita.saida.nivelDeReforcoAlvo === 2 ? 1 : 0
    if (alvo.nivelDeReforco !== anterior) {
      throw new Error(`Este reforço exige equipamento +${anterior}.`)
    }
  }

  return {
    ...partida,
    atualizadoEm: agora,
    fabricacao: {
      receitaSecundaria: null,
      receitaAtiva: {
        idDaDefinicaoDaReceita: receita.id,
        iniciadoEm: agora,
        processadoPorUltimoEm: agora,
        segundosRestantes: 0,
        idDaInstanciaDoEquipamentoAlvo,
      },
    },
  }
}

/** P1: velocidade secundária provisória; a quantidade e o XP por ciclo não mudam. */
export const EFICIENCIA_PRODUCAO_SECUNDARIA_PRESTIGIO_I = 0.5

export function ajustarReceitaParaSegundoEspaco(receita: DefinicaoDeReceitaDeFabricacao, prioridade?: PrioridadeDeOficio): DefinicaoDeReceitaDeFabricacao {
  return { ...receita, segundosPorAcao: segundosPorAcaoComPrioridade(receita.segundosPorAcao, prioridade, 'secundaria') }
}
export function ajustarReceitaPrincipalPorPrioridade(receita: DefinicaoDeReceitaDeFabricacao, prioridade?: PrioridadeDeOficio): DefinicaoDeReceitaDeFabricacao {
  return { ...receita, segundosPorAcao: segundosPorAcaoComPrioridade(receita.segundosPorAcao, prioridade, 'principal') }
}
export function configurarPrioridadeDaFabricacao(partida: PartidaLocal, receita: DefinicaoDeReceitaDeFabricacao, prioridade: PrioridadeDeOficio, agora: string): PartidaLocal {
  if (partida.fabricacao.receitaAtiva?.idDaDefinicaoDaReceita !== receita.id || partida.profissoes[receita.idDaProfissao].prestigio < 2) {
    throw new Error('Prioridade exige Prestígio II com produção principal ativa.')
  }
  return { ...partida, atualizadoEm: agora, fabricacao: { ...partida.fabricacao, prioridade } }
}

/**
 * Abre a segunda receita do mesmo Ofício. Receber a definição principal
 * evita adivinhar profissão a partir da sintaxe do ID da receita.
 */
export function iniciarReceitaSecundaria(
  partida: PartidaLocal,
  principal: DefinicaoDeReceitaDeFabricacao,
  secundaria: DefinicaoDeReceitaDeFabricacao,
  agora: string,
): PartidaLocal {
  const ativa = partida.fabricacao.receitaAtiva
  if (!ativa || ativa.idDaDefinicaoDaReceita !== principal.id || partida.ocioso.atividadeAtiva || partida.ocioso.atividadeSecundaria) {
    throw new Error('Inicie uma receita principal antes da produção secundária.')
  }
  if (principal.id === secundaria.id) throw new Error('Selecione outra receita para o segundo espaço.')
  if (principal.idDaProfissao !== secundaria.idDaProfissao) throw new Error('A segunda receita deve pertencer ao mesmo Ofício.')
  if (principal.saida.tipo === 'equipamento-reforco' || secundaria.saida.tipo === 'equipamento-reforco') {
    throw new Error('Reforços de equipamentos não podem ser produzidos em paralelo.')
  }
  const progresso = partida.profissoes[secundaria.idDaProfissao]
  if (progresso.prestigio < 1) throw new Error('Produção paralela exige Prestígio I desse Ofício.')
  if (progresso.nivel < secundaria.nivelExigidoDaProfissao) {
    throw new Error(`${secundaria.nome} exige nível ${secundaria.nivelExigidoDaProfissao} de Profissão.`)
  }
  if (obterMaximoFabricavelCiclos(partida.personagem.inventario, secundaria.ingredientes) < 1) {
    throw new Error('Materiais insuficientes para iniciar a produção secundária.')
  }
  return {
    ...partida, atualizadoEm: agora,
    fabricacao: { ...partida.fabricacao, receitaSecundaria: {
      idDaDefinicaoDaReceita: secundaria.id, iniciadoEm: agora,
      processadoPorUltimoEm: agora, segundosRestantes: 0,
      idDaInstanciaDoEquipamentoAlvo: null,
    } },
  }
}

/** Encerra só o segundo relógio após a aplicação registrar os ciclos pendentes. */
export function interromperReceitaSecundaria(partida: PartidaLocal, agora: string): PartidaLocal {
  return { ...partida, atualizadoEm: agora, fabricacao: { ...partida.fabricacao, receitaSecundaria: null } }
}

/**
 * Reutiliza a fabricação normal em um relógio temporário. A aplicação processa
 * primeiro a principal e depois a secundária: estoque, capacidade e IDs são únicos.
 */
export function processarProgressoDaReceitaSecundaria(
  partida: PartidaLocal,
  receita: DefinicaoDeReceitaDeFabricacao,
  agora: string,
): ResultadoDoProgressoDeFabricacao {
  const secundaria = partida.fabricacao.receitaSecundaria
  if (!secundaria || secundaria.idDaDefinicaoDaReceita !== receita.id) {
    return {
      partida, acoesConcluidas: 0, itensProduzidos: 0, equipamentosProduzidos: 0,
      equipamentosReforcados: 0, xpDeProfissaoConcedido: 0, xpGeralConcedido: 0,
      niveisDeProfissaoGanhos: 0, segundosProcessados: 0, segundosLimitados: 0,
      interrompidoPorMateriais: false, interrompidoPorCapacidade: false,
    }
  }
  if (receita.saida.tipo === 'equipamento-reforco') throw new Error('Reforço secundário inválido.')
  const simulada: PartidaLocal = { ...partida, fabricacao: { ...partida.fabricacao, receitaAtiva: secundaria } }
  const resultado = processarProgressoDeFabricacao(simulada, ajustarReceitaParaSegundoEspaco(receita, partida.fabricacao.prioridade), agora)
  return {
    ...resultado,
    partida: {
      ...resultado.partida,
      fabricacao: {
        ...partida.fabricacao,
        receitaAtiva: partida.fabricacao.receitaAtiva,
        receitaSecundaria: resultado.partida.fabricacao.receitaAtiva,
      },
    },
  }
}

/** Cancela a seleção da receita; não executa ciclos nem devolve ingredientes já consumidos. */
export function interromperReceitaDeFabricacao(partida: PartidaLocal, agora: string): PartidaLocal {
  return {
    ...partida,
    atualizadoEm: agora,
    fabricacao: { ...partida.fabricacao, receitaAtiva: null, receitaSecundaria: null },
  }
}

/**
 * Avança a produção por ciclos, respeitando tempo, ingredientes e capacidade.
 * Reforço termina após uma aplicação; receitas repetíveis continuam enquanto houver condições.
 */
export function processarProgressoDeFabricacao(
  partida: PartidaLocal,
  receita: DefinicaoDeReceitaDeFabricacao,
  agora: string,
): ResultadoDoProgressoDeFabricacao {
  const ativo = partida.fabricacao.receitaAtiva

  const vazioResultado = (atualPartida: PartidaLocal): ResultadoDoProgressoDeFabricacao => ({
    partida: atualPartida,
    acoesConcluidas: 0,
    itensProduzidos: 0,
    equipamentosProduzidos: 0,
    equipamentosReforcados: 0,
    xpDeProfissaoConcedido: 0,
    xpGeralConcedido: 0,
    niveisDeProfissaoGanhos: 0,
    segundosProcessados: 0,
    segundosLimitados: 0,
    interrompidoPorMateriais: false,
    interrompidoPorCapacidade: false,
  })

  if (!ativo || ativo.idDaDefinicaoDaReceita !== receita.id) return vazioResultado(partida)

  const ultimoProcessadoMs = Date.parse(ativo.processadoPorUltimoEm)
  const agoraMs = Date.parse(agora)
  if (!Number.isFinite(ultimoProcessadoMs) || !Number.isFinite(agoraMs) || agoraMs <= ultimoProcessadoMs) {
    return vazioResultado(partida)
  }

  const decorridoSegundos = Math.floor((agoraMs - ultimoProcessadoMs) / 1000)
  const ausenteLimite = obterLimiteDeAusenciaEmSegundos(partida.personagem.nivel)
  const segundosProcessados = Math.min(decorridoSegundos, ausenteLimite)
  const segundosLimitados = Math.max(0, decorridoSegundos - segundosProcessados)
  const totalSegundos = ativo.segundosRestantes + segundosProcessados
  const tempoCiclos = Math.floor(totalSegundos / receita.segundosPorAcao)

  let inventario = partida.personagem.inventario
  let itensDeEquipamento = partida.personagem.itensDeEquipamento
  let proximaSequenciaDeEquipamento = partida.personagem.proximaSequenciaDeEquipamento
  let acoesConcluidas = 0
  let itensProduzidos = 0
  let equipamentosProduzidos = 0
  let equipamentosReforcados = 0
  let interrompidoPorMateriais = false
  let interrompidoPorCapacidade = false

  const previstoPartida = (
    proximoInventario: PartidaLocal["personagem"]["inventario"],
    proximoEquipamento: PartidaLocal["personagem"]["itensDeEquipamento"],
  ): PartidaLocal => ({
    ...partida,
    personagem: { ...partida.personagem, inventario: proximoInventario, itensDeEquipamento: proximoEquipamento },
  })

  /** Simula o espaço depois do consumo: uma pilha de ingredientes esvaziada pode liberar o espaço necessário. */
  const podeAjusteSaidaAposConsumo = (consumidoInventario: PilhaDoInventario[]) => {
    const previa = previstoPartida(consumidoInventario, itensDeEquipamento)
    if (receita.saida.tipo === 'item') {
      return obterEspacoParaPilhaNoInventario(previa, receita.saida.idDaDefinicao) >= receita.saida.quantidade
    }
    if (receita.saida.tipo === "equipamento") {
      return obterEspacoParaEquipamentoNoInventario(previa) >= 1
    }
    return true
  }

  // A capacidade é reavaliada a cada ciclo: um resultado pode ocupar o último espaço ou completar uma pilha.
  for (let indice = 0; indice < tempoCiclos; indice += 1) {
    if (receita.saida.tipo === "equipamento-reforco" && acoesConcluidas >= 1) break
    if (obterMaximoFabricavelCiclos(inventario, receita.ingredientes) < 1) {
      interrompidoPorMateriais = true
      break
    }

    const consumidoInventario = consumirIngredientes(inventario, receita.ingredientes, 1)
    if (!podeAjusteSaidaAposConsumo(consumidoInventario)) {
      interrompidoPorCapacidade = true
      break
    }

    // Só confirma o consumo depois de validar a saída; uma produção bloqueada não destrói ingredientes.
    inventario = consumidoInventario
    acoesConcluidas += 1

    if (receita.saida.tipo === 'item') {
      itensProduzidos += receita.saida.quantidade
      inventario = adicionarInventarioItem(inventario, receita.saida.idDaDefinicao, receita.saida.quantidade)
    } else if (receita.saida.tipo === "equipamento") {
      itensDeEquipamento = [
        ...itensDeEquipamento,
        {
          idDaInstancia: `eq-${proximaSequenciaDeEquipamento}`,
          idDaDefinicao: receita.saida.idDaDefinicao,
          nivelDeReforco: 0 as const,
        },
      ]
      proximaSequenciaDeEquipamento += 1
      equipamentosProduzidos += 1
    } else {
      const alvoId = ativo.idDaInstanciaDoEquipamentoAlvo
      if (!alvoId) throw new Error('Produção de reforço perdeu a referência do equipamento alvo.')
      const anterior = receita.saida.nivelDeReforcoAlvo === 2 ? 1 : 0
      const novoNivel = receita.saida.nivelDeReforcoAlvo === 2 ? 2 as const : 1 as const
      itensDeEquipamento = itensDeEquipamento.map((instancia) =>
        instancia.idDaInstancia === alvoId && instancia.nivelDeReforco === anterior
          ? { ...instancia, nivelDeReforco: novoNivel }
          : instancia,
      )
      equipamentosReforcados = 1
      break
    }
  }

  // Verifica também o próximo ciclo, para informar imediatamente por que a produção parou.
  let naoPodeRepetir = receita.saida.tipo === "equipamento-reforco" && acoesConcluidas > 0
  if (!naoPodeRepetir && !interrompidoPorCapacidade) {
    if (obterMaximoFabricavelCiclos(inventario, receita.ingredientes) < 1) {
      interrompidoPorMateriais = true
      naoPodeRepetir = true
    } else {
      const proximoConsumido = consumirIngredientes(inventario, receita.ingredientes, 1)
      if (!podeAjusteSaidaAposConsumo(proximoConsumido)) {
        interrompidoPorCapacidade = true
        naoPodeRepetir = true
      }
    }
  }
  if (interrompidoPorCapacidade || interrompidoPorMateriais) naoPodeRepetir = true

  const profissaoXp = acoesConcluidas * receita.xpDeProfissaoPorAcao
  const profissaoResultado = aplicarXpDeProfissao(partida.profissoes[receita.idDaProfissao], profissaoXp)
  const geralXp = profissaoResultado.niveisGanhos * 5
  // O resto do tempo acompanha apenas uma receita que pode continuar; uma receita encerrada perde o saldo.
  const segundosRestantes = naoPodeRepetir ? 0 : totalSegundos % receita.segundosPorAcao

  const proximoPartida: PartidaLocal = {
    ...partida,
    atualizadoEm: agora,
    jornada: acoesConcluidas > 0 ? registrarFabricacaoDaJornada(partida.jornada, receita.id, agora) : partida.jornada,
    personagem: {
      ...partida.personagem,
      xp: partida.personagem.xp + geralXp,
      inventario,
      itensDeEquipamento,
      proximaSequenciaDeEquipamento,
    },
    profissoes: {
      ...partida.profissoes,
      [receita.idDaProfissao]: profissaoResultado.progresso,
    },
    fabricacao: {
      ...partida.fabricacao,
      receitaAtiva: naoPodeRepetir
        ? null
        : { ...ativo, processadoPorUltimoEm: agora, segundosRestantes },
    },
  }

  return {
    partida: proximoPartida,
    acoesConcluidas,
    itensProduzidos,
    equipamentosProduzidos,
    equipamentosReforcados,
    xpDeProfissaoConcedido: profissaoXp,
    xpGeralConcedido: geralXp,
    niveisDeProfissaoGanhos: profissaoResultado.niveisGanhos,
    segundosProcessados,
    segundosLimitados,
    interrompidoPorMateriais,
    interrompidoPorCapacidade,
  }
}
