/**
 * @file Testes de elegibilidade, custo e dependências da árvore de prestígio.
 * As partidas preparadas antecipam requisitos para isolar o desbloqueio e o reinício;
 * esses testes não comprovam a aplicação dos efeitos de cada nó no combate.
 */
import { describe, expect, it } from 'vitest'
import { criarPartidaLocal, type PartidaLocal } from './personagem'
import { realizarPrestigioDaProfissao } from './ocioso'
import {
  NOS_DE_PRESTIGIO,
  obterProntidaoParaPrestigioDoPersonagem,
  obterPreviaDoPrestigioDoPersonagem,
  obterDisponibilidadeDoNoDePrestigio,
  personagemPodeRealizarPrestigio,
  realizarPrestigioDoPersonagem,
  desbloquearNoDePrestigioDoPersonagem,
} from './prestigio'

const classeDoPersonagem = {
  id: "errante" as const,
  nome: 'Errante',
  resumo: 'Teste',
  atributos: {
    vitalidade: 5,
    mente: 5,
    vigor: 5,
    forca: 5,
    destreza: 5,
    inteligencia: 5,
    fe: 5,
  },
  equipamentosIniciais: {
    maoPrincipal: "arma.viagem-lanca",
  },
  idDaHabilidadeInicial: "habilidade.abertura",
}

const presente = {
  id: "nenhum" as const,
  nome: 'Nenhum',
  resumo: 'Teste',
  concessoes: [],
}

/** Cria um estado novo com identidade e horário fixos, isolando as alterações de cada caso. */
function criarPartida() {
  return criarPartidaLocal({
    idDaPartida: "prestigio-test",
    criadoEm: '2026-09-09T12:00:00.000Z',
    versaoDoConteudo: '0.1.0-dev',
    nomeDoPersonagem: 'Teste',
    classeDoPersonagem,
    presente,
  })
}

/** Monta profissões com Prestígio I e saldo configurável para testar requisitos da árvore. */
function prontoPartida(pontos = 5): PartidaLocal {
  const partida = criarPartida()

  return {
    ...partida,
    profissoes: Object.fromEntries(
      Object.entries(partida.profissoes).map(([idDaProfissao, progresso]) => [idDaProfissao, { ...progresso, prestigio: 1 }]),
    ) as typeof partida.profissoes,
    personagem: {
      ...partida.personagem,
      prestigio: { nivel: 1, pontos, idsDosNosDesbloqueados: [] },
    },
  }
}

describe("Árvore de Prestígio do personagem", () => {
  it("define os 32 nós previstos e mantém o personagem bloqueado antes das profissões", () => {
    const partida = criarPartida()
    const prontidao = obterProntidaoParaPrestigioDoPersonagem(partida)

    expect(NOS_DE_PRESTIGIO).toHaveLength(32)
    expect(personagemPodeRealizarPrestigio(partida)).toBe(false)
    expect(prontidao).toEqual({ pronto: false, profissoesProntas: 0, totalDeProfissoes: 7 })
    expect(obterDisponibilidadeDoNoDePrestigio(partida, NOS_DE_PRESTIGIO[0]!.id)).toEqual({
      situacao: "bloqueado",
      motivo: "Exige todas as Profissões com Prestígio I.",
    })

    const prontoBase = prontoPartida(0)
    const pronto = {
      ...prontoBase,
      personagem: {
        ...prontoBase.personagem,
        prestigio: { nivel: 0, pontos: 0, idsDosNosDesbloqueados: [] },
      },
    }
    expect(obterDisponibilidadeDoNoDePrestigio(pronto, NOS_DE_PRESTIGIO[0]!.id)).toEqual({
      situacao: "bloqueado",
      motivo: 'Realize o Prestígio I do personagem.',
    })
  })

  it("desbloqueia nós puros em sequência e consome os pontos corretos", () => {
    let partida = prontoPartida()
    partida = desbloquearNoDePrestigioDoPersonagem(partida, "prestigio.corpo.constituicao", '2026-09-09T12:01:00.000Z')

    expect(partida.personagem.prestigio.pontos).toBe(4)
    expect(partida.personagem.prestigio.idsDosNosDesbloqueados).toEqual(["prestigio.corpo.constituicao"])
    expect(obterDisponibilidadeDoNoDePrestigio(partida, "prestigio.corpo.impeto").motivo).toBe('Requer: Fôlego de Guerra.')

    expect(() => desbloquearNoDePrestigioDoPersonagem(partida, "prestigio.corpo.impeto", '2026-09-09T12:02:00.000Z'))
      .toThrow('Requer: Fôlego de Guerra')
  })

  it("libera um híbrido após os requisitos dos dois ramos", () => {
    let partida = prontoPartida(20)
    const corpoNos = [
      "prestigio.corpo.constituicao",
      "prestigio.corpo.folego-de-guerra",
      "prestigio.corpo.impeto",
    ]
    const arcanoNos = [
      "prestigio.arcano.mental-reserva",
      "prestigio.arcano.fluxo-arcano",
      "prestigio.arcano.canalizacao",
    ]

    for (const noId of [...corpoNos, ...arcanoNos]) {
      partida = desbloquearNoDePrestigioDoPersonagem(partida, noId, '2026-09-09T12:01:00.000Z')
    }

    expect(obterDisponibilidadeDoNoDePrestigio(partida, "prestigio.hibrido.corpo-arcano.encantada-arma").situacao).toBe("disponivel")
    partida = desbloquearNoDePrestigioDoPersonagem(partida, "prestigio.hibrido.corpo-arcano.encantada-arma", '2026-09-09T12:02:00.000Z')
    expect(partida.personagem.prestigio.pontos).toBe(11)
  })

  it("a prévia reproduz o saldo e o nível futuros sem modificar a partida", () => {
    const original = prontoPartida(2)
    const antes = JSON.stringify(original)
    const previa = obterPreviaDoPrestigioDoPersonagem(original)
    const realizado = realizarPrestigioDoPersonagem(original, classeDoPersonagem.atributos, '2026-09-09T12:10:00.000Z')
    expect(previa.podeRealizar).toBe(true)
    expect(previa.nivelPrestigioPosterior).toBe(realizado.personagem.prestigio.nivel)
    expect(previa.pontosPosteriores).toBe(realizado.personagem.prestigio.pontos)
    expect(previa.nivelPersonagemPosterior).toBe(realizado.personagem.nivel)
    expect(previa.nosPreservados).toBe(realizado.personagem.prestigio.idsDosNosDesbloqueados.length)
    expect(JSON.stringify(original)).toBe(antes)
  })

  it("realiza o primeiro Prestígio, reinicia a jornada e preserva a árvore", () => {
    const pronto = prontoPartida(0)
    const partida = {
      ...pronto,
      personagem: {
        ...pronto.personagem,
        nivel: 8,
        xp: 1_200,
        pontosDeAtributoDisponiveis: 3,
        atributos: {
          vitalidade: 8,
          mente: 6,
          vigor: 7,
          forca: 5,
          destreza: 5,
          inteligencia: 5,
          fe: 5,
        },
        prestigio: { nivel: 0, pontos: 0, idsDosNosDesbloqueados: [] },
      },
    }
    const baseAtributos = classeDoPersonagem.atributos
    const proximo = realizarPrestigioDoPersonagem(partida, baseAtributos, '2026-09-09T12:10:00.000Z')

    expect(proximo.personagem.nivel).toBe(1)
    expect(proximo.personagem.xp).toBe(0)
    expect(proximo.personagem.pontosDeAtributoDisponiveis).toBe(0)
    expect(proximo.personagem.atributos).toEqual(baseAtributos)
    expect(proximo.personagem.prestigio).toEqual({ nivel: 1, pontos: 5, idsDosNosDesbloqueados: [] })
  })
})

describe('Prestígio de ofício', () => {
  it('exige nível 99, reinicia o ofício e mantém o restante da partida', () => {
    const partida = criarPartida()
    const pronto = { ...partida, profissoes: { ...partida.profissoes, mineracao: { nivel: 99, xp: 12, prestigio: 0 } } }
    const promovido = realizarPrestigioDaProfissao(pronto, 'mineracao', '2026-09-09T12:01:00.000Z')
    expect(promovido.profissoes.mineracao).toEqual({ nivel: 1, xp: 0, prestigio: 1 })
    expect(promovido.personagem).toEqual(partida.personagem)
    expect(() => realizarPrestigioDaProfissao(partida, 'mineracao', '2026-09-09T12:01:00.000Z')).toThrow('nível 99')
  })
})
