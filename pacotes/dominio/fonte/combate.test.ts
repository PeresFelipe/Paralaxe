import { describe, expect, it } from 'vitest'
import { criarPartidaLocal, type DefinicaoDeClasseDoPersonagem, type DefinicaoDePresente, type PartidaLocal } from './personagem'
import {
  aplicarResultadoDeCombate,
  configurarEspacoDeConsumivelDeCombate,
  derivarEstatisticasDeCombateDoJogador,
  simularCombate,
  type DefinicaoDeHabilidadeDeCombate,
  type ResultadoDeCombate,
  type DefinicaoDeInimigo,
} from './combate'
import type { DefinicaoDeEquipamento } from './equipamento'

const classeDoPersonagem: DefinicaoDeClasseDoPersonagem = {
  id: "errante",
  nome: 'Errante',
  resumo: 'Equilibrado.',
  atributos: { vitalidade: 5, mente: 5, vigor: 5, forca: 5, destreza: 5, inteligencia: 5, fe: 5 },
  equipamentosIniciais: { maoPrincipal: "arma.viagem-lanca", peitoral: "armadura.viagem-protecao" },
  idDaHabilidadeInicial: "habilidade.abertura",
}

const presente: DefinicaoDePresente = {
  id: "nenhum",
  nome: 'Nenhum Presente',
  resumo: 'Sem vantagem.',
  concessoes: [],
}

const equipamento: DefinicaoDeEquipamento[] = [
  {
    id: "arma.viagem-lanca",
    nome: 'Lança de Viagem',
    espaco: "maoPrincipal",
    estatisticaPrincipal: { tipo: "ataque", valor: 13 },
    combateDaArma: { tipoDeDano: "perfuracao", intervaloDeAcaoEmSegundos: 2.1, escalonamento: { forca: 'B', destreza: 'C' } },
  },
  { id: "armadura.viagem-protecao", nome: 'Proteção de Viagem', espaco: "peitoral", estatisticaPrincipal: { tipo: "defesa", valor: 12 } },
]

const habilidades: DefinicaoDeHabilidadeDeCombate[] = [
  {
    id: "habilidade.abertura",
    nome: 'Abertura',
    perfil: "agressivo",
    segundosDeRecarga: 7,
    dano: { tipo: "arma-multiplicador", multiplicador: 1.35, tipoDeDano: "perfuracao", bonusDePrecisaoEmPontosPercentuais: 10 },
  },
  {
    id: "habilidade.folego-de-combate",
    nome: 'Fôlego de Combate',
    perfil: "defensivo",
    segundosDeRecarga: 12,
    restaurar: { folego: 24 },
  },
]

const estradaLobo: DefinicaoDeInimigo = {
  id: "inimigo.estrada-lobo", nome: 'Lobo de Estrada', nivelDeCombate: 2, vidaMaxima: 60, defesa: 4,
  evasao: 98, precisao: 102, poder: 8, intervaloDeAcaoEmSegundos: 2.25, tipoDeDanoBasico: "corte",
  habilidades: [{ id: "inimigo.estrada-lobo.bote", nome: 'Bote', segundosDeRecarga: 7, atrasoInicialEmSegundos: 2.5, multiplicadorDeDano: 1.5, segundosDeAvisoDeAtaque: 1.2, interrompivel: true }],
  recompensaDeXp: 35,
}

const acumuloBoneco: DefinicaoDeInimigo = {
  id: "inimigo.acumulo-boneco", nome: "Boneco de Acúmulo", nivelDeCombate: 1, vidaMaxima: 999, defesa: 0,
  evasao: 95, precisao: 200, poder: 1, intervaloDeAcaoEmSegundos: 1, tipoDeDanoBasico: "impacto",
  habilidades: [{ id: "boneco.sangramento", nome: 'Talho de Teste', segundosDeRecarga: 1, multiplicadorDeDano: 0.1, aplicacoesDeEfeito: [{ situacao: "sangramento", acumulo: 100 }] }],
  recompensaDeXp: 0,
}

const posturaBoneco: DefinicaoDeInimigo = {
  id: "inimigo.postura-boneco", nome: "Boneco de Postura", nivelDeCombate: 1, vidaMaxima: 999, defesa: 0,
  evasao: 95, precisao: 100, poder: 1, intervaloDeAcaoEmSegundos: 1, tipoDeDanoBasico: "impacto",
  habilidades: [{ id: "boneco.guarda", nome: 'Firmar Posição', segundosDeRecarga: 2, multiplicadorDoDanoRecebidoPeloProprio: 0.65, duracaoDoEfeitoProprioEmSegundos: 3 }],
  recompensaDeXp: 0,
}

const catalogo = {
  obterDefinicaoDeEquipamento(idDaDefinicao: string) {
    return equipamento.find((definicao) => definicao.id === idDaDefinicao) ?? null
  },
  obterDefinicaoDeHabilidade(habilidadeId: string) {
    return habilidades.find((definicao) => definicao.id === habilidadeId) ?? null
  },
  obterDefinicaoDeInimigo(inimigoId: string) {
    return [estradaLobo, acumuloBoneco, posturaBoneco].find((inimigo) => inimigo.id === inimigoId) ?? null
  },
  obterDefinicaoDeConsumivel(idDaDefinicao: string) {
    return idDaDefinicao === "item.consumivel.campo-preparacao"
      ? { id: idDaDefinicao, nome: 'Preparado de Campo', restaurar: { vida: 45 } }
      : null
  },
}

function criarPartida() {
  return criarPartidaLocal({
    idDaPartida: "combate-partida", criadoEm: '2026-09-09T12:00:00.000Z', versaoDoConteudo: '0.1.0-dev',
    nomeDoPersonagem: 'Ailith', classeDoPersonagem, presente,
  })
}

describe("motor de combate", () => {
  it("deriva os recursos provisórios da versão 0.1 a partir dos atributos e equipamentos", () => {
    const estatisticas = derivarEstatisticasDeCombateDoJogador(criarPartida(), catalogo)
    expect(estatisticas.vidaMaxima).toBe(160)
    expect(estatisticas.manaMaxima).toBe(80)
    expect(estatisticas.folegoMaximo).toBe(100)
    expect(estatisticas.defesa).toBe(12)
    expect(estatisticas.precisao).toBe(110)
  })

  it("repete o resultado com a mesma semente e o mesmo estado inicial", () => {
    const primeiro = simularCombate(criarPartida(), catalogo, estradaLobo.id, 123456)
    const segundo = simularCombate(criarPartida(), catalogo, estradaLobo.id, 123456)
    expect(segundo).toEqual(primeiro)
    expect(primeiro.registro.some((entrada) => entrada.tipo === "avisoDeAtaque" && entrada.mensagem.includes('Bote'))).toBe(true)
  })

  it("inicia o combate com os recursos persistidos da expedição sem restaurar a vida", () => {
    const resultado = simularCombate(criarPartida(), catalogo, estradaLobo.id, 4242, 180, {
      vida: 120, vidaMaxima: 160, mana: 20, manaMaxima: 80, folego: 30, folegoMaximo: 100,
    })
    expect(resultado.jogador.vidaMaxima).toBe(160)
    expect(resultado.jogador.vida).toBeLessThanOrEqual(120)
  })

  it("usa um consumível automático no limiar, gasta a ação e remove o item", () => {
    let partida = criarPartida()
    partida = {
      ...partida,
      personagem: { ...partida.personagem, inventario: [{ idDaDefinicao: "item.consumivel.campo-preparacao", quantidade: 1 }] },
    }
    partida = configurarEspacoDeConsumivelDeCombate(partida, 0, "item.consumivel.campo-preparacao", "vida", 90, '2026-09-09T12:00:01.000Z')

    const resultado = simularCombate(partida, catalogo, estradaLobo.id, 99, 180, {
      vida: 60, vidaMaxima: 160, mana: 80, manaMaxima: 80, folego: 100, folegoMaximo: 100,
    })
    const consumivelEntrada = resultado.registro.find((entrada) => entrada.tipo === "consumivel")
    const primeiroAtaque = resultado.registro.find((entrada) => entrada.agente === "jogador" && (entrada.tipo === "basico" || entrada.tipo === "habilidade"))

    expect(resultado.itensConsumidos).toEqual([{ idDaDefinicao: "item.consumivel.campo-preparacao", quantidade: 1 }])
    expect(consumivelEntrada).toBeDefined()
    expect(primeiroAtaque && consumivelEntrada ? primeiroAtaque.instanteEmSegundos > consumivelEntrada.instanteEmSegundos : false).toBe(true)

    const persistido = aplicarResultadoDeCombate(partida, estradaLobo.id, resultado, '2026-09-09T12:01:00.000Z')
    expect(persistido.personagem.inventario).toEqual([])
  })

  it("ignora uma habilidade defensiva que não restauraria nenhum recurso", () => {
    const base = criarPartida()
    const partida = {
      ...base,
      personagem: {
        ...base.personagem,
        idsDasHabilidadesConhecidas: ["habilidade.folego-de-combate", "habilidade.abertura"],
        espacosDeHabilidadesAtivas: ["habilidade.folego-de-combate", "habilidade.abertura", null, null] as [string | null, string | null, string | null, string | null],
      },
    }
    const resultado = simularCombate(partida, catalogo, posturaBoneco.id, 7, 2.2, {
      vida: 80, vidaMaxima: 160, mana: 80, manaMaxima: 80, folego: 100, folegoMaximo: 100,
    })

    expect(resultado.registro.some((entrada) => entrada.mensagem.includes('Fôlego de Combate'))).toBe(false)
    expect(resultado.registro.some((entrada) => entrada.mensagem.includes('Abertura'))).toBe(true)
  })

  it("ativa acúmulos e expõe eventos de postura defensiva no registro determinístico", () => {
    const sangramento = simularCombate(criarPartida(), catalogo, acumuloBoneco.id, 1, 3)
    const postura = simularCombate(criarPartida(), catalogo, posturaBoneco.id, 2, 3)

    expect(sangramento.registro.some((entrada) => entrada.tipo === "situacao" && entrada.mensagem.includes('Sangramento'))).toBe(true)
    expect(postura.registro.some((entrada) => entrada.tipo === "postura" && entrada.mensagem.includes('Firmar Posição'))).toBe(true)
  })

  it("resolve o primeiro combate e concede a experiência do lobo somente na vitória", () => {
    const partida = criarPartida()
    const resultado = simularCombate(partida, catalogo, estradaLobo.id, 42)
    expect(resultado.desfecho).toBe("vitoria")
    expect(resultado.xpConcedido).toBe(35)

    const persistido = aplicarResultadoDeCombate(partida, estradaLobo.id, resultado, '2026-09-09T12:01:00.000Z')
    expect(persistido.personagem.xp).toBe(35)
    expect(persistido.combate.loboDerrotado).toBe(true)
    expect(persistido.combate.ultimaExpedicao?.semente).toBe(42)
  })
  it("aplica afixos equipados aos atributos efetivos, à precisão e à defesa", () => {
    const base = criarPartida()
    const peitoralId = base.personagem.equipamento.peitoral
    const principalMaoId = base.personagem.equipamento.maoPrincipal
    const partida = {
      ...base,
      personagem: {
        ...base.personagem,
        itensDeEquipamento: base.personagem.itensDeEquipamento.map((item) => {
          if (item.idDaInstancia === peitoralId) return { ...item, idsDosAfixos: ["afixo.vitalidade-1", "afixo.forca-1", "afixo.precisao-4"] }
          if (item.idDaInstancia === principalMaoId) return { ...item, idsDosAfixos: ["afixo.defesa-2"] }
          return item
        }),
      },
    }
    const estatisticas = derivarEstatisticasDeCombateDoJogador(partida, catalogo)
    expect(estatisticas.atributos.vitalidade).toBe(6)
    expect(estatisticas.atributos.forca).toBe(6)
    expect(estatisticas.vidaMaxima).toBe(172)
    expect(estatisticas.precisao).toBe(114)
    expect(estatisticas.defesa).toBe(14)
  })

  it("perde as moedas aprovadas na derrota fora da masmorra e nenhuma moeda extra dentro dela", () => {
    const base = criarPartida()
    const detalhado = { ...base, personagem: { ...base.personagem, nivel: 3, ouro: 95 } }
    const derrota: ResultadoDeCombate = {
      desfecho: "derrota", duracaoEmSegundos: 1, vidaDoInimigo: 10, xpConcedido: 0, itensConsumidos: [], registro: [], semente: 1,
      jogador: { vida: 0, vidaMaxima: 160, mana: 80, manaMaxima: 80, folego: 100, folegoMaximo: 100 },
    }
    const fora = aplicarResultadoDeCombate(detalhado, estradaLobo.id, derrota, '2026-09-10T12:01:00.000Z')
    expect(fora.personagem.ouro).toBe(85)

    const emMasmorra: PartidaLocal = {
      ...detalhado,
      masmorra: { ...detalhado.masmorra, expedicaoAtiva: { bolsaDaExpedicao: [] } as unknown as NonNullable<PartidaLocal["masmorra"]["expedicaoAtiva"]> },
    }
    const dentro = aplicarResultadoDeCombate(emMasmorra, estradaLobo.id, derrota, '2026-09-10T12:01:00.000Z')
    expect(dentro.personagem.ouro).toBe(95)
  })

})
