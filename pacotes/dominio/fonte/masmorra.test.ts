import { describe, expect, it } from 'vitest'
import { criarPartidaLocal, type DefinicaoDeClasseDoPersonagem, type DefinicaoDePresente } from './personagem'
import {
  aceitarContratoDeDunLiath,
  escolherCaminhoNaMasmorra,
  decidirDestinoDoProtetor,
  extrairExpedicaoDaMasmorra,
  encerrarExpedicaoComDerrota,
  resolverSalaDaMasmorra,
  iniciarMasmorra,
  type CatalogoDeConteudoDaMasmorra,
  type DefinicaoDeMasmorra,
} from './masmorra'

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

const masmorra: DefinicaoDeMasmorra = {
  id: "masmorra.test.facil",
  nome: "Masmorra Teste",
  dificuldade: "facil",
  idDaSalaInicial: "sala.iniciar",
  salas: [
    { id: "sala.iniciar", nome: 'Entrada', tipo: "entrada", idsDasProximasSalas: ["sala.esquerdo", "sala.right"] },
    { id: "sala.esquerdo", nome: 'Esquerda', tipo: "evento", idsDasProximasSalas: ["sala.recuperacao"] },
    { id: "sala.right", nome: 'Direita', tipo: "evento", idsDasProximasSalas: ["sala.recuperacao"] },
    { id: "sala.recuperacao", nome: 'Recuperação', tipo: "recuperacao", idsDasProximasSalas: [] },
  ],
}

const catalogo: CatalogoDeConteudoDaMasmorra = {
  obterDefinicaoDeMasmorra: () => masmorra,
  obterDefinicaoDeHabilidade: () => null,
  obterDefinicaoDeInimigo: () => null,
  obterDefinicaoDeEquipamento: () => null,
}

function criarPartida() {
  return criarPartidaLocal({
    idDaPartida: "partida-masmorra",
    criadoEm: '2026-09-09T12:00:00.000Z',
    versaoDoConteudo: '0.1.0-dev',
    nomeDoPersonagem: 'Ailith',
    classeDoPersonagem: classeDefinicao,
    presente: presenteDefinicao,
  })
}

function criarAceitoPartida() {
  return aceitarContratoDeDunLiath(criarPartida(), '2026-09-09T11:59:00.000Z')
}

describe("expedição na masmorra", () => {
  it("concede os suprimentos do contrato uma vez e exige o contrato antes da entrada", () => {
    expect(() => iniciarMasmorra(criarPartida(), masmorra, 1, '2026-09-09T12:00:00.000Z')).toThrow('Aceite primeiro')

    const aceito = criarAceitoPartida()
    const aceitoNovamente = aceitarContratoDeDunLiath(aceito, '2026-09-09T11:59:30.000Z')
    expect(aceitoNovamente.personagem.inventario).toContainEqual({ idDaDefinicao: "item.consumivel.campo-preparacao", quantidade: 2 })
  })

  it("exige a resolução da sala atual e torna as ramificações irreversíveis", () => {
    const iniciado = iniciarMasmorra(criarAceitoPartida(), masmorra, 123, '2026-09-09T12:00:00.000Z')
    expect(() => escolherCaminhoNaMasmorra(iniciado, masmorra, "sala.esquerdo", '2026-09-09T12:00:01.000Z')).toThrow('Resolva a sala atual')
    const resolvido = resolverSalaDaMasmorra(iniciado, masmorra, catalogo, '2026-09-09T12:00:01.000Z').partida
    const esquerdo = escolherCaminhoNaMasmorra(resolvido, masmorra, "sala.esquerdo", '2026-09-09T12:00:02.000Z')
    expect(esquerdo.masmorra.expedicaoAtiva?.ramificacoesEscolhidas["sala.iniciar"]).toBe("sala.esquerdo")
    expect(esquerdo.masmorra.expedicaoAtiva?.idsDasSalasVisitadas).toEqual(["sala.iniciar", "sala.esquerdo"])
    expect(() => escolherCaminhoNaMasmorra(esquerdo, masmorra, "sala.right", '2026-09-09T12:00:03.000Z')).toThrow()
  })

  it("impede resolver a mesma sala duas vezes", () => {
    const iniciado = iniciarMasmorra(criarAceitoPartida(), masmorra, 7, '2026-09-09T12:00:00.000Z')
    const primeiro = resolverSalaDaMasmorra(iniciado, masmorra, catalogo, '2026-09-09T12:00:01.000Z').partida
    expect(() => resolverSalaDaMasmorra(primeiro, masmorra, catalogo, '2026-09-09T12:00:02.000Z')).toThrow('Essa sala já foi resolvida.')
  })

  it("usa a recuperação como primeiro ponto seguro de extração e transfere a bolsa da expedição", () => {
    let partida = iniciarMasmorra(criarAceitoPartida(), masmorra, 9, '2026-09-09T12:00:00.000Z')
    partida = resolverSalaDaMasmorra(partida, masmorra, catalogo, '2026-09-09T12:00:01.000Z').partida
    partida = escolherCaminhoNaMasmorra(partida, masmorra, "sala.esquerdo", '2026-09-09T12:00:02.000Z')
    partida = resolverSalaDaMasmorra(partida, masmorra, catalogo, '2026-09-09T12:00:03.000Z').partida
    partida = escolherCaminhoNaMasmorra(partida, masmorra, "sala.recuperacao", '2026-09-09T12:00:04.000Z')
    partida = resolverSalaDaMasmorra(partida, masmorra, catalogo, '2026-09-09T12:00:05.000Z').partida
    expect(partida.masmorra.expedicaoAtiva?.extracaoSeguraDisponivel).toBe(true)
    const extraido = extrairExpedicaoDaMasmorra(partida, '2026-09-09T12:00:06.000Z')
    expect(extraido.personagem.inventario).toContainEqual({ idDaDefinicao: "item.consumivel.campo-preparacao", quantidade: 5 })
  })

  it("perde os saques da expedição na derrota mas preserva a decisão sobre o Protetor", () => {
    let partida = iniciarMasmorra(criarAceitoPartida(), masmorra, 11, '2026-09-09T12:00:00.000Z')
    const execucao = partida.masmorra.expedicaoAtiva
    if (!execucao) throw new Error("expedição ausente")
    partida = { ...partida, masmorra: { ...partida.masmorra, expedicaoAtiva: { ...execucao, idDaSalaAtual: "sala.protetor", idsDasSalasVisitadas: [...execucao.idsDasSalasVisitadas, "sala.protetor"], bolsaDaExpedicao: [{ idDaDefinicao: "item.saque", quantidade: 3 }] } } }
    partida = decidirDestinoDoProtetor(partida, "poupado", '2026-09-09T12:00:01.000Z')
    const falhou = encerrarExpedicaoComDerrota(partida, '2026-09-09T12:00:02.000Z')
    expect(falhou.masmorra.dunLiathProtetor).toBe("poupado")
    expect(falhou.personagem.inventario.some((pilha) => pilha.idDaDefinicao === "item.saque")).toBe(false)
  })

  it("concede as recompensas de primeira conclusão e do contrato somente ao concluir a expedição", () => {
    let partida = iniciarMasmorra(criarAceitoPartida(), masmorra, 13, '2026-09-09T12:00:00.000Z')
    const execucao = partida.masmorra.expedicaoAtiva
    if (!execucao) throw new Error("expedição ausente")
    partida = { ...partida, masmorra: { ...partida.masmorra, expedicaoAtiva: { ...execucao, extracaoSeguraDisponivel: true, concluido: true, registroDeSuprimentosRecuperado: true, decisaoSobreOProtetor: "morto", bolsaDaExpedicao: [{ idDaDefinicao: "item.guarnicao-suprimento-registroDeDados", quantidade: 1 }] } } }
    const extraido = extrairExpedicaoDaMasmorra(partida, '2026-09-09T12:00:01.000Z')
    expect(extraido.masmorra.dunLiathFacilConquistado).toBe(true)
    expect(extraido.masmorra.contratoConcluido).toBe(true)
    expect(extraido.masmorra.guardaInstintivaDesbloqueada).toBe(true)
    expect(extraido.personagem.ouro).toBe(150)
    expect(extraido.personagem.xp).toBe(150)
    expect(extraido.personagem.idsDasHabilidadesConhecidas).toContain("habilidade.instintiva-guarda")
    expect(extraido.masmorra.dunLiathProtetor).toBe("morto")
  })
  it("inicia com os máximos de recursos derivados explicitamente quando fornecidos", () => {
    const recursos = { vida: 168, vidaMaxima: 168, mana: 85, manaMaxima: 85, folego: 108, folegoMaximo: 108 }
    const iniciado = iniciarMasmorra(criarAceitoPartida(), masmorra, 5, '2026-09-09T12:00:00.000Z', recursos)
    expect(iniciado.masmorra.expedicaoAtiva?.recursos).toEqual(recursos)
  })

})
