/**
 * @file Testes do estado inicial da partida e das validações de criação.
 * As verificações detalhadas protegem o contrato consumido por todos os demais sistemas:
 * inventário, equipamentos individuais, profissões, combate, banco e jornada.
 */
import { describe, expect, it } from 'vitest'
import {
  criarPartidaLocal,
  type DefinicaoDeClasseDoPersonagem,
  type DefinicaoDePresente,
} from './personagem'

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
  equipamentosIniciais: {
    maoPrincipal: "arma.viagem-lanca",
    peitoral: "armadura.viagem-protecao",
  },
  idDaHabilidadeInicial: "habilidade.abertura",
}

const presenteDefinicao: DefinicaoDePresente = {
  id: "moeda-bolsaDeMoedas",
  nome: 'Bolsa de Moedas',
  resumo: 'Vantagem econômica inicial.',
  concessoes: [{ tipo: "ouro", quantidadeTotal: 60 }],
}

describe("criação de personagem", () => {
  it("cria uma partida local versionada com a classe e o presente selecionados", () => {
    const partida = criarPartidaLocal({
      idDaPartida: "partida-1",
      criadoEm: '2026-09-09T12:00:00.000Z',
      versaoDoConteudo: '0.1.0-dev',
      nomeDoPersonagem: '  Ailith  ',
      classeDoPersonagem: classeDefinicao,
      presente: presenteDefinicao,
    })

    expect(partida.modoDaPartida).toBe("LOCAL")
    expect(partida.versaoDoEsquemaDaPartida).toBe(18)
    expect(partida.ocioso.atividadeSecundaria).toBeNull()
    expect(partida.jornada).toEqual({ meta: null, idsDasReceitasFabricadas: [] })
    expect(partida.personagem.prestigio).toEqual({ nivel: 0, pontos: 0, idsDosNosDesbloqueados: [] })
    expect(partida.personagem.nome).toBe('Ailith')
    expect(partida.personagem.idDaClasse).toBe("errante")
    expect(partida.personagem.idDoPresente).toBe("moeda-bolsaDeMoedas")
    expect(partida.personagem.ouro).toBe(60)
    expect(partida.personagem.nivel).toBe(1)
    expect(partida.personagem.espacosDeHabilidadesAtivas).toEqual(["habilidade.abertura", null, null, null])
    expect(partida.personagem.idDaLocalizacaoAtual).toBe("cidade-livre.taverna")
    expect(partida.profissoes.mineracao).toEqual({ nivel: 1, xp: 0, prestigio: 0 })
    expect(partida.ocioso.atividadeAtiva).toBeNull()
    expect(partida.fabricacao.receitaAtiva).toBeNull()
    expect(partida.fabricacao.receitaSecundaria).toBeNull()
    expect(partida.personagem.itensDeEquipamento).toHaveLength(2)
    expect(partida.personagem.banco).toEqual({ inventario: [], itensDeEquipamento: [] })

    const principalMaoInstanciaId = partida.personagem.equipamento.maoPrincipal
    const maoPrincipal = partida.personagem.itensDeEquipamento.find(
      (item) => item.idDaInstancia === principalMaoInstanciaId,
    )
    expect(maoPrincipal?.idDaDefinicao).toBe("arma.viagem-lanca")

    expect(partida.combate.preferencias).toEqual({
      estilo: "misto",
      porcentagemDoLimiarDeVidaDefensiva: 60,
      espacosDeConsumiveis: [
        { idDaDefinicao: null, recursoDeUsoAutomatico: null, porcentagemDoLimiarDeUsoAutomatico: null },
        { idDaDefinicao: null, recursoDeUsoAutomatico: null, porcentagemDoLimiarDeUsoAutomatico: null },
      ],
    })
    expect(partida.combate.loboDerrotado).toBe(false)
    expect(partida.masmorra.expedicaoAtiva).toBeNull()
    expect(partida.masmorra.dunLiathFacilConquistado).toBe(false)
    expect(partida.masmorra.contratoAceito).toBe(false)
  })

  it("rejeita nome de personagem vazio", () => {
    expect(() =>
      criarPartidaLocal({
        idDaPartida: "partida-1",
        criadoEm: '2026-09-09T12:00:00.000Z',
        versaoDoConteudo: '0.1.0-dev',
        nomeDoPersonagem: '   ',
        classeDoPersonagem: classeDefinicao,
        presente: presenteDefinicao,
      }),
    ).toThrow('O personagem precisa possuir um nome.')
  })

  it("protege o orçamento de 35 pontos da classe", () => {
    const invalidoClasse: DefinicaoDeClasseDoPersonagem = {
      ...classeDefinicao,
      atributos: {
        ...classeDefinicao.atributos,
        vitalidade: 6,
      },
    }

    expect(() =>
      criarPartidaLocal({
        idDaPartida: "partida-1",
        criadoEm: '2026-09-09T12:00:00.000Z',
        versaoDoConteudo: '0.1.0-dev',
        nomeDoPersonagem: 'Ailith',
        classeDoPersonagem: invalidoClasse,
        presente: presenteDefinicao,
      }),
    ).toThrow('precisa iniciar com exatamente 35 pontos')
  })
})
