import { describe, expect, it } from 'vitest'
import { criarPartidaLocal, type DefinicaoDeClasseDoPersonagem, type DefinicaoDePresente } from './personagem'
import {
  obterLimiteDeAusenciaEmSegundos,
  processarProgressoOcioso,
  iniciarAtividadeOciosa,
  type DefinicaoDeAtividadeOciosa,
} from './ocioso'

const classeDefinicao: DefinicaoDeClasseDoPersonagem = {
  id: "errante",
  nome: 'Errante',
  resumo: 'Equilibrado.',
  atributos: {
    vitalidade: 5,
    mente: 5,
    vigor: 5,
    forca: 5,
    destreza: 5,
    inteligencia: 5,
    fe: 5,
  },
  equipamentosIniciais: { maoPrincipal: "arma.viagem-lanca" },
  idDaHabilidadeInicial: "habilidade.abertura",
}

const presenteDefinicao: DefinicaoDePresente = {
  id: "nenhum",
  nome: 'Nenhum Presente',
  resumo: 'Sem vantagem.',
  concessoes: [],
}

const mineracaoAtividade: DefinicaoDeAtividadeOciosa = {
  id: "coletar.mineracao.cloch",
  idDaProfissao: "mineracao",
  nome: 'Extrair Cloch',
  idDaDefinicaoDoItemProduzido: 'material.cloch',
  nomeDoResultado: 'Cloch',
  nivelExigidoDaProfissao: 1,
  segundosPorAcao: 4,
  xpDeProfissaoPorAcao: 8,
}

function criarPartida() {
  return criarPartidaLocal({
    idDaPartida: "partida-ocioso",
    criadoEm: '2026-09-09T12:00:00.000Z',
    versaoDoConteudo: '0.1.0-dev',
    nomeDoPersonagem: 'Ailith',
    classeDoPersonagem: classeDefinicao,
    presente: presenteDefinicao,
  })
}

describe("progresso ocioso", () => {
  it("converte o tempo decorrido apenas no recurso selecionado e na experiência da profissão", () => {
    const iniciado = iniciarAtividadeOciosa(criarPartida(), mineracaoAtividade, '2026-09-09T12:00:00.000Z')
    const resultado = processarProgressoOcioso(iniciado, mineracaoAtividade, '2026-09-09T12:00:12.000Z')

    expect(resultado.acoesConcluidas).toBe(3)
    expect(resultado.itensConcedidos).toBe(3)
    expect(resultado.xpDeProfissaoConcedido).toBe(24)
    expect(resultado.partida.personagem.inventario).toContainEqual({ idDaDefinicao: 'material.cloch', quantidade: 3 })
    expect(resultado.partida.profissoes.mineracao.xp).toBe(24)
  })

  it("transporta uma ação incompleta para o próximo processamento", () => {
    const iniciado = iniciarAtividadeOciosa(criarPartida(), mineracaoAtividade, '2026-09-09T12:00:00.000Z')
    const primeiro = processarProgressoOcioso(iniciado, mineracaoAtividade, '2026-09-09T12:00:03.000Z')
    const segundo = processarProgressoOcioso(primeiro.partida, mineracaoAtividade, '2026-09-09T12:00:05.000Z')

    expect(primeiro.acoesConcluidas).toBe(0)
    expect(primeiro.partida.ocioso.atividadeAtiva?.segundosRestantes).toBe(3)
    expect(segundo.acoesConcluidas).toBe(1)
    expect(segundo.partida.ocioso.atividadeAtiva?.segundosRestantes).toBe(1)
  })

  it("concede 5 de experiência geral quando a profissão sobe de nível", () => {
    const iniciado = iniciarAtividadeOciosa(criarPartida(), mineracaoAtividade, '2026-09-09T12:00:00.000Z')
    const resultado = processarProgressoOcioso(iniciado, mineracaoAtividade, '2026-09-09T12:00:20.000Z')

    expect(resultado.niveisDeProfissaoGanhos).toBe(1)
    expect(resultado.partida.profissoes.mineracao.nivel).toBe(2)
    expect(resultado.partida.profissoes.mineracao.xp).toBe(0)
    expect(resultado.partida.personagem.xp).toBe(5)
  })

  it("limita o personagem de nível 1 a quatro horas de progresso ausente", () => {
    const iniciado = iniciarAtividadeOciosa(criarPartida(), mineracaoAtividade, '2026-09-09T00:00:00.000Z')
    const resultado = processarProgressoOcioso(iniciado, mineracaoAtividade, '2026-09-09T12:00:00.000Z')

    expect(obterLimiteDeAusenciaEmSegundos(1)).toBe(14_400)
    expect(resultado.segundosProcessados).toBe(14_400)
    expect(resultado.segundosLimitados).toBe(28_800)
    expect(resultado.acoesConcluidas).toBe(3_600)
    expect(resultado.partida.ocioso.atividadeAtiva?.processadoPorUltimoEm).toBe('2026-09-09T12:00:00.000Z')
  })
})
