import type { PilhaDoInventario, PartidaLocal } from './personagem'
import { aplicarXpDeProfissao, obterLimiteDeAusenciaEmSegundos, type IdDaProfissao } from './ocioso'
import { obterEspacoParaEquipamentoNoInventario, obterEspacoParaPilhaNoInventario } from './armazenamento'
import { registrarFabricacaoDaJornada } from './jornada'

export interface IngredienteDaReceita {
  idDaDefinicao: string
  quantidade: number
}

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

export interface ReceitaDeFabricacaoAtiva {
  idDaDefinicaoDaReceita: string
  iniciadoEm: string
  processadoPorUltimoEm: string
  segundosRestantes: number
  idDaInstanciaDoEquipamentoAlvo: string | null
}

export interface EstadoDeFabricacao {
  receitaAtiva: ReceitaDeFabricacaoAtiva | null
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

function obterMaximoFabricavelCiclos(inventario: PilhaDoInventario[], ingredientes: readonly IngredienteDaReceita[]) {
  if (ingredientes.length === 0) return Number.POSITIVE_INFINITY

  return Math.min(
    ...ingredientes.map((ingrediente) =>
      Math.floor(obterInventarioQuantidade(inventario, ingrediente.idDaDefinicao) / ingrediente.quantidade),
    ),
  )
}

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

export function iniciarReceitaDeFabricacao(
  partida: PartidaLocal,
  receita: DefinicaoDeReceitaDeFabricacao,
  agora: string,
  idDaInstanciaDoEquipamentoAlvo: string | null = null,
): PartidaLocal {
  if (partida.ocioso.atividadeAtiva) {
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

    if (alvo.nivelDeReforco !== 0) {
      throw new Error("Na Versão 0.1, o Reforço Simples só pode elevar equipamento +0 para +1.")
    }
  }

  return {
    ...partida,
    atualizadoEm: agora,
    fabricacao: {
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

export function interromperReceitaDeFabricacao(partida: PartidaLocal, agora: string): PartidaLocal {
  return {
    ...partida,
    atualizadoEm: agora,
    fabricacao: { receitaAtiva: null },
  }
}

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
      itensDeEquipamento = itensDeEquipamento.map((instancia) =>
        instancia.idDaInstancia === alvoId && instancia.nivelDeReforco === 0
          ? { ...instancia, nivelDeReforco: 1 as const }
          : instancia,
      )
      equipamentosReforcados = 1
      break
    }
  }

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
