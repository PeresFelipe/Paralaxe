/**
 * @file Testes da conservação do trabalho selecionado durante situações de risco.
 * Verificam a referência temporal antes/depois da pausa e a entrada na masmorra;
 * não executam o combate nem a coordenação completa dos temporizadores da interface.
 */
import { describe, expect, it } from 'vitest'
import { criarPartidaLocal, type DefinicaoDeClasseDoPersonagem, type DefinicaoDePresente } from './personagem'
import { aceitarContratoDeDunLiath, type DefinicaoDeMasmorra } from './masmorra'
import { iniciarAtividadeOciosa, type DefinicaoDeAtividadeOciosa } from './ocioso'
import {
  pausarTrabalhoAtualDuranteRisco,
  retomarTrabalhoAposRisco,
  iniciarMasmorraComContinuidade,
} from './continuidade'

const classeDefinicao: DefinicaoDeClasseDoPersonagem = {
  id: "errante",
  nome: 'Errante',
  resumo: 'Equilibrado.',
  atributos: { vitalidade: 5, mente: 5, vigor: 5, forca: 5, destreza: 5, inteligencia: 5, fe: 5 },
  equipamentosIniciais: { maoPrincipal: "arma.viagem-lanca" },
  idDaHabilidadeInicial: "habilidade.abertura",
}

const presenteDefinicao: DefinicaoDePresente = {
  id: "nenhum",
  nome: 'Nenhum',
  resumo: 'Sem presente.',
  concessoes: [],
}

const atividade: DefinicaoDeAtividadeOciosa = {
  id: "atividade.test.mineracao",
  idDaProfissao: "mineracao",
  nome: 'Minerar Cloch',
  idDaDefinicaoDoItemProduzido: 'material.cloch',
  nomeDoResultado: 'Cloch',
  nivelExigidoDaProfissao: 1,
  segundosPorAcao: 2,
  xpDeProfissaoPorAcao: 4,
}

const masmorra: DefinicaoDeMasmorra = {
  id: "masmorra.test.continuidade",
  nome: "Masmorra de Continuidade",
  dificuldade: "facil",
  idDaSalaInicial: "sala.iniciar",
  salas: [
    { id: "sala.iniciar", nome: 'Entrada', tipo: "entrada", idsDasProximasSalas: [] },
  ],
}

/** Cria um estado novo com identidade e horário fixos, isolando as alterações de cada caso. */
function criarPartida() {
  return criarPartidaLocal({
    idDaPartida: "partida-continuidade",
    criadoEm: '2026-09-10T10:00:00.000Z',
    versaoDoConteudo: '0.1.0-dev',
    nomeDoPersonagem: 'Ailith',
    classeDoPersonagem: classeDefinicao,
    presente: presenteDefinicao,
  })
}

/** Prepara contrato aceito e coleta selecionada para testar sua continuidade na entrada. */
function criarTrabalhandoAceitoPartida() {
  let partida = criarPartida()
  partida = aceitarContratoDeDunLiath(partida, '2026-09-10T10:00:01.000Z')
  return iniciarAtividadeOciosa(partida, atividade, '2026-09-10T10:00:02.000Z')
}

describe("continuidade durante risco", () => {
  it("mantém a atividade ociosa selecionada enquanto congela sua referência de tempo", () => {
    const partida = criarTrabalhandoAceitoPartida()
    const pausado = pausarTrabalhoAtualDuranteRisco(partida, '2026-09-10T10:05:00.000Z')

    expect(pausado.ocioso.atividadeAtiva?.idDaDefinicaoDaAtividade).toBe(atividade.id)
    expect(pausado.ocioso.atividadeAtiva?.processadoPorUltimoEm).toBe('2026-09-10T10:05:00.000Z')
  })

  it("inicia uma masmorra sem exigir o cancelamento da atividade ociosa selecionada", () => {
    const partida = criarTrabalhandoAceitoPartida()
    const iniciado = iniciarMasmorraComContinuidade(
      partida,
      masmorra,
      42,
      '2026-09-10T10:05:00.000Z',
    )

    expect(iniciado.masmorra.expedicaoAtiva?.idDaDefinicaoDaMasmorra).toBe(masmorra.id)
    expect(iniciado.ocioso.atividadeAtiva?.idDaDefinicaoDaAtividade).toBe(atividade.id)
    expect(iniciado.ocioso.atividadeAtiva?.processadoPorUltimoEm).toBe('2026-09-10T10:05:00.000Z')
  })

  it("redefine a referência de tempo do mesmo trabalho ao retornar a um contexto seguro", () => {
    const iniciado = iniciarMasmorraComContinuidade(
      criarTrabalhandoAceitoPartida(),
      masmorra,
      42,
      '2026-09-10T10:05:00.000Z',
    )
    const retomado = retomarTrabalhoAposRisco(iniciado, '2026-09-10T10:20:00.000Z')

    expect(retomado.ocioso.atividadeAtiva?.idDaDefinicaoDaAtividade).toBe(atividade.id)
    expect(retomado.ocioso.atividadeAtiva?.processadoPorUltimoEm).toBe('2026-09-10T10:20:00.000Z')
  })
})
