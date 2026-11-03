/**
 * @file Testes de gravação, reabertura e migração usando IndexedDB em memória.
 * Verificam expedições interrompidas e a introdução de equipamentos, prestígio e jornada
 * em partidas antigas. Não dependem de um navegador nem acessam partidas reais.
 */
import { beforeEach, describe, expect, it } from 'vitest'
import { indexedDB } from 'fake-indexeddb'
import {
  aceitarContratoDeDunLiath,
  criarPartidaLocal,
  iniciarMasmorra,
  type DefinicaoDeClasseDoPersonagem,
  type DefinicaoDeMasmorra,
  type DefinicaoDePresente,
  type PartidaLocal,
} from '@greywake/dominio'
import { criarRepositorioDePartidasIndexedDb } from './repositorioDePartidasIndexedDb'

Object.defineProperty(globalThis, 'indexedDB', {
  configurable: true,
  writable: true,
  value: indexedDB,
})

const classeDoPersonagem: DefinicaoDeClasseDoPersonagem = {
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

const presente: DefinicaoDePresente = {
  id: "nenhum",
  nome: 'Nenhum',
  resumo: 'Sem presente.',
  concessoes: [],
}

const masmorra: DefinicaoDeMasmorra = {
  id: "masmorra.dun-liath.facil",
  nome: 'Dún Liath — Fácil',
  dificuldade: "facil",
  idDaSalaInicial: "sala.entrada",
  salas: [
    { id: "sala.entrada", nome: 'Entrada', tipo: "entrada", idsDasProximasSalas: ["sala.patio"] },
    { id: "sala.patio", nome: 'Pátio', tipo: "evento", idsDasProximasSalas: [] },
  ],
}

/** Solicita a limpeza do banco simulado entre os cenários de gravação e migração. */
function excluirBancoDeDados() {
  return new Promise<void>((resolver, rejeitar) => {
    const requisicao = indexedDB.deleteDatabase('greywake')
    requisicao.onsuccess = () => resolver()
    requisicao.onerror = () => rejeitar(requisicao.error)
    requisicao.onblocked = () => resolver()
  })
}

describe("repositório de partidas em IndexedDB", () => {
  beforeEach(async () => {
    await excluirBancoDeDados()
  })

  it('migra v12 para o Legado preservando os níveis, ouro e Brasas não gastas', async () => {
    const atual = criarPartidaLocal({
      idDaPartida: 'migra-v12-legado', criadoEm: '2026-11-03T12:00:00.000Z',
      versaoDoConteudo: '0.1.0-dev', nomeDoPersonagem: 'Ailith', classeDoPersonagem, presente,
    })
    const anterior = {
      ...atual, versaoDoEsquemaDaPartida: 12 as const,
      personagem: { ...atual.personagem, ouro: 37 },
      vigilia: { ...atual.vigilia, saldoBrasas: 9, brasasAcumuladas: 12,
        distritos: { ...atual.vigilia.distritos, ferreiro: 2, taverna: 1 } },
    }
    delete (anterior as unknown as Partial<PartidaLocal>).legado
    const repositorio = criarRepositorioDePartidasIndexedDb()
    await repositorio.salvar(anterior as unknown as PartidaLocal)
    const migrado = await repositorio.obter('migra-v12-legado')
    expect(migrado?.versaoDoEsquemaDaPartida).toBe(13)
    expect(migrado?.legado.distritos.ferreiro).toBe(2)
    expect(migrado?.legado.distritos.taverna).toBe(1)
    expect(migrado?.legado.creditosDeTransicao).toBe(9)
    expect(migrado?.personagem.ouro).toBe(37)
    expect(migrado?.vigilia.brasasAcumuladas).toBe(12)
    await repositorio.salvar(migrado!)
    expect(await repositorio.obter('migra-v12-legado')).toEqual(migrado)
  })

  it('migra um save v11 sem inventar sessões de foco', async () => {
    const atual = criarPartidaLocal({
      idDaPartida: 'migra-v11', criadoEm: '2026-10-29T12:00:00.000Z',
      versaoDoConteudo: '0.1.0-dev', nomeDoPersonagem: 'Ailith',
      classeDoPersonagem, presente,
    })
    const legado = { ...atual, versaoDoEsquemaDaPartida: 11 as const }
    delete (legado as unknown as Partial<PartidaLocal>).vigilia
    delete (legado as unknown as Partial<PartidaLocal>).legado
    const repositorio = criarRepositorioDePartidasIndexedDb()
    await repositorio.salvar(legado as unknown as PartidaLocal)
    const restaurado = await repositorio.obter('migra-v11')
    expect(restaurado?.versaoDoEsquemaDaPartida).toBe(13)
    expect(restaurado?.vigilia.sessoesConcluidas).toBe(0)
    expect(restaurado?.vigilia.saldoBrasas).toBe(0)
    expect(restaurado?.vigilia.sessaoAtiva).toBeNull()
    expect(restaurado?.personagem).toEqual(atual.personagem)
    expect(restaurado?.jornada).toEqual(atual.jornada)
  })

  it("reabre uma expedição ativa com semente, sala, bolsa e recursos intactos", async () => {
    let partida = criarPartidaLocal({
      idDaPartida: "recarregar-masmorra",
      criadoEm: '2026-09-09T12:00:00.000Z',
      versaoDoConteudo: '0.1.0-dev',
      nomeDoPersonagem: 'Ailith',
      classeDoPersonagem,
      presente,
    })
    partida = {
      ...partida,
      combate: { ...partida.combate, loboDerrotado: true },
    }
    partida = aceitarContratoDeDunLiath(partida, '2026-09-09T12:01:00.000Z')
    partida = iniciarMasmorra(partida, masmorra, 991337, '2026-09-09T12:02:00.000Z')

    const execucao = partida.masmorra.expedicaoAtiva
    if (!execucao) throw new Error("Expedição na Masmorra ausente no teste.")

    partida = {
      ...partida,
      masmorra: {
        ...partida.masmorra,
        expedicaoAtiva: {
          ...execucao,
          idDaSalaAtual: "sala.patio",
          idsDasSalasVisitadas: ["sala.entrada", "sala.patio"],
          idsDasSalasResolvidas: ["sala.entrada"],
          bolsaDaExpedicao: [{ idDaDefinicao: "item.tratado-fragmento", quantidade: 1 }],
          recursos: { ...execucao.recursos, vida: execucao.recursos.vidaMaxima - 37, folego: 41 },
        },
      },
    }

    const repositorioAntesFechar = criarRepositorioDePartidasIndexedDb()
    await repositorioAntesFechar.salvar(partida)

    // Uma nova fachada de repositório deve recuperar o mesmo estado salvo antes do fechamento.
    const repositorioAposRecarregar = criarRepositorioDePartidasIndexedDb()
    const carregado = await repositorioAposRecarregar.obter(partida.idDaPartida)

    expect(carregado?.versaoDoEsquemaDaPartida).toBe(13)
    expect(carregado?.personagem.prestigio).toEqual({ nivel: 0, pontos: 0, idsDosNosDesbloqueados: [] })
    expect(carregado?.personagem.banco).toEqual({ inventario: [], itensDeEquipamento: [] })
    expect(carregado?.masmorra.contratoAceito).toBe(true)
    expect(carregado?.masmorra.expedicaoAtiva?.semente).toBe(991337)
    expect(carregado?.masmorra.expedicaoAtiva?.idDaSalaAtual).toBe("sala.patio")
    expect(carregado?.masmorra.expedicaoAtiva?.idsDasSalasVisitadas).toEqual(["sala.entrada", "sala.patio"])
    expect(carregado?.masmorra.expedicaoAtiva?.idsDasSalasResolvidas).toEqual(["sala.entrada"])
    expect(carregado?.masmorra.expedicaoAtiva?.bolsaDaExpedicao).toEqual([
      { idDaDefinicao: "item.tratado-fragmento", quantidade: 1 },
    ])
    expect(carregado?.masmorra.expedicaoAtiva?.recursos.vida).toBe(execucao.recursos.vidaMaxima - 37)
    expect(carregado?.masmorra.expedicaoAtiva?.recursos.folego).toBe(41)
  })

  it("migra uma pilha do Anel do Viajante da versão 7 para uma instância equipada", async () => {
    const atual = criarPartidaLocal({
      idDaPartida: "legado-anel",
      criadoEm: '2026-09-09T12:00:00.000Z',
      versaoDoConteudo: '0.1.0-dev',
      nomeDoPersonagem: 'Ailith',
      classeDoPersonagem,
      presente,
    })
    const legado = {
      ...atual,
      versaoDoEsquemaDaPartida: 7 as const,
      personagem: {
        ...atual.personagem,
        idDoPresente: "viajante-anel" as const,
        inventario: [{ idDaDefinicao: "item.equipamento.viajante-anel", quantidade: 1 }],
      },
    }
    const repositorio = criarRepositorioDePartidasIndexedDb()
    await repositorio.salvar(legado as unknown as PartidaLocal)
    const carregado = await repositorio.obter("legado-anel")
    const anelId = carregado?.personagem.equipamento.anel1
    const anel = carregado?.personagem.itensDeEquipamento.find((item) => item.idDaInstancia === anelId)

    expect(carregado?.versaoDoEsquemaDaPartida).toBe(13)
    expect(carregado?.personagem.prestigio).toEqual({ nivel: 0, pontos: 0, idsDosNosDesbloqueados: [] })
    expect(anel?.idDaDefinicao).toBe("item.equipamento.viajante-anel")
    expect(carregado?.personagem.inventario.some((pilha) => pilha.idDaDefinicao === "item.equipamento.viajante-anel")).toBe(false)
  })

  it("adiciona o estado de prestígio vazio ao carregar uma partida da versão 8", async () => {
    const atual = criarPartidaLocal({
      idDaPartida: "legado-prestigio",
      criadoEm: '2026-09-09T12:00:00.000Z',
      versaoDoConteudo: '0.1.0-dev',
      nomeDoPersonagem: 'Ailith',
      classeDoPersonagem,
      presente,
    })
    const legadoPersonagem = Object.fromEntries(
      Object.entries(atual.personagem).filter(([chave]) => chave !== "prestigio"),
    )
    const legado = {
      ...atual,
      versaoDoEsquemaDaPartida: 8 as const,
      personagem: legadoPersonagem,
    }
    const repositorio = criarRepositorioDePartidasIndexedDb()
    await repositorio.salvar(legado as unknown as PartidaLocal)
    const carregado = await repositorio.obter("legado-prestigio")

    expect(carregado?.versaoDoEsquemaDaPartida).toBe(13)
    expect(carregado?.personagem.prestigio).toEqual({ nivel: 0, pontos: 0, idsDosNosDesbloqueados: [] })
  })

  it('migra a versão 10 sem apagar a Jornada e sem inventar registros novos', async () => {
    const original = criarPartidaLocal({ idDaPartida: 'legado-v10', criadoEm: '2026-10-29T12:00:00.000Z', versaoDoConteudo: 'test', nomeDoPersonagem: 'Aedan', classeDoPersonagem, presente })
    const legado = Object.fromEntries(Object.entries(original).filter(([chave]) => chave !== 'codice' && chave !== 'desafios'))
    const repositorio = criarRepositorioDePartidasIndexedDb()
    await repositorio.salvar({ ...legado, versaoDoEsquemaDaPartida: 10 } as unknown as PartidaLocal)
    const migrado = await repositorio.obter(original.idDaPartida)
    expect(migrado?.versaoDoEsquemaDaPartida).toBe(13)
    expect(migrado?.jornada).toEqual(original.jornada)
    expect(migrado?.codice).toEqual({ idsDescobertos: ['classe.errante'] })
    expect(migrado?.desafios).toEqual({ idsConcluidos: [] })
  })

  it("migra a versão 9 sem inferir fabricações pelo inventário e preserva a meta após reabrir", async () => {
    const original = criarPartidaLocal({ idDaPartida: "legado-jornada", criadoEm: '2026-09-15T12:00:00.000Z', versaoDoConteudo: 'test', nomeDoPersonagem: 'Aedan', classeDoPersonagem, presente })
    original.personagem.inventario = [{ idDaDefinicao: "material.tratada-cloch", quantidade: 10 }]
    const legado = Object.fromEntries(Object.entries(original).filter(([chave]) => chave !== "jornada"))
    const repositorio = criarRepositorioDePartidasIndexedDb()
    await repositorio.salvar({ ...legado, versaoDoEsquemaDaPartida: 9 } as unknown as PartidaLocal)
    const migrado = await repositorio.obter(original.idDaPartida)
    expect(migrado?.versaoDoEsquemaDaPartida).toBe(13)
    expect(migrado?.personagem).toEqual(original.personagem)
    expect(migrado?.jornada).toEqual({ meta: null, idsDasReceitasFabricadas: [] })
    if (!migrado) throw new Error("Partida ausente")
    const progredido = { ...migrado, jornada: { meta: { idDaDefinicaoDaReceita: "receita.metalurgia.tratada-cloch", selecionadoEm: original.criadoEm, concluidoEm: '2026-09-15T12:00:06.000Z' }, idsDasReceitasFabricadas: ["receita.metalurgia.tratada-cloch"] } }
    await repositorio.salvar(progredido)
    const reaberto = criarRepositorioDePartidasIndexedDb()
    expect((await reaberto.obter(original.idDaPartida))?.jornada).toEqual(progredido.jornada)
    expect((await reaberto.listar())[0]?.jornada).toEqual(progredido.jornada)
  })
})
