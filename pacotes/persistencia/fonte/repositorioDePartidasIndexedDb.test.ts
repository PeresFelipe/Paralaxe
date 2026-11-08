/**
 * @file Testes de gravação, reabertura e migração usando IndexedDB em memória.
 * Verificam expedições interrompidas e a introdução de equipamentos, prestígio e jornada
 * em partidas antigas. Não dependem de um navegador nem acessam partidas reais.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { indexedDB, IDBDatabase } from 'fake-indexeddb'
import {
  aceitarContratoDeDunLiath,
  criarPartidaLocal,
  iniciarMasmorra,
  type DefinicaoDeClasseDoPersonagem,
  type DefinicaoDeMasmorra,
  type DefinicaoDePresente,
  type PartidaLocal,
  iniciarIncursaoAutomatica,
  finalizarIncursaoAutomatica,
} from '@paralaxe/dominio'
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

  it('propaga aborto de transação sem rejeição órfã e preserva o registro anterior', async () => {
    const repo = criarRepositorioDePartidasIndexedDb()
    const atual = criarPartidaLocal({ idDaPartida: 'aborto-debug', criadoEm: '2026-11-08T00:00:00.000Z',
      versaoDoConteudo: 'teste', nomeDoPersonagem: 'Aedan', classeDoPersonagem, presente })
    await repo.salvar(atual)
    const transacionar = IDBDatabase.prototype.transaction
    const spy = vi.spyOn(IDBDatabase.prototype, 'transaction').mockImplementationOnce(function (this: IDBDatabase, ...args) {
      const tx = transacionar.apply(this, args)
      queueMicrotask(() => tx.abort())
      return tx
    })
    try {
      await expect(repo.salvar({ ...atual, personagem: { ...atual.personagem, ouro: 99 } })).rejects.toThrow()
    } finally { spy.mockRestore() }
    expect(await repo.obter(atual.idDaPartida)).toEqual(atual)
  })

  it('preserva a marca de debug no formato histórico e mantém saves normais separados', async () => {
    const repo = criarRepositorioDePartidasIndexedDb()
    const original = criarPartidaLocal({ idDaPartida: 'original-debug', criadoEm: '2026-11-08T00:00:00.000Z',
      versaoDoConteudo: 'teste', nomeDoPersonagem: 'Aedan', classeDoPersonagem, presente })
    const debug = { ...original, idDaPartida: 'copia-debug', depuracao: { idDaPartidaOriginal: original.idDaPartida } }
    await repo.salvar(original)
    await repo.salvar(debug)
    expect(await repo.obter(debug.idDaPartida)).toEqual(debug)
    expect(await repo.obter(original.idDaPartida)).toEqual(original)
    await expect(repo.salvar({ ...debug, depuracao: { idDaPartidaOriginal: debug.idDaPartida } })).rejects.toThrow('ID próprio')
  })

  it('recusa uma gravação corrompida antes de substituir o último save válido', async () => {
    const atual = criarPartidaLocal({ idDaPartida: 'integridade-na-gravacao', criadoEm: '2026-11-07T00:00:00.000Z',
      versaoDoConteudo: 'teste', nomeDoPersonagem: 'Aedan', classeDoPersonagem, presente })
    const repo = criarRepositorioDePartidasIndexedDb()
    await repo.salvar(atual)
    await expect(repo.salvar({ ...atual, personagem: { ...atual.personagem, ouro: -1 } })).rejects.toThrow('personagem.ouro')
    expect(await repo.obter(atual.idDaPartida)).toEqual(atual)
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
    expect(migrado?.versaoDoEsquemaDaPartida).toBe(18)
    expect(migrado?.legado.distritos.ferreiro).toBe(2)
    expect(migrado?.legado.distritos.taverna).toBe(1)
    expect(migrado?.legado.creditosDeTransicao).toBe(9)
    expect(migrado?.personagem.ouro).toBe(37)
    expect(migrado?.vigilia.brasasAcumuladas).toBe(12)
    await repositorio.salvar(migrado!)
    expect(await repositorio.obter('migra-v12-legado')).toEqual(migrado)
  })


  it('migra o save v15 para v16 mantendo ambos os relógios, prioridades e saldos', async () => {
    const base = criarPartidaLocal({ idDaPartida: 'migra-v15-terceiro-relogio',
      criadoEm: '2026-11-04T12:00:00.000Z', versaoDoConteudo: 'test',
      nomeDoPersonagem: 'Ailith', classeDoPersonagem, presente })
    const primeira = { idDaDefinicaoDaAtividade: 'coletar.mineracao.cloch',
      iniciadoEm: '2026-11-04T12:00:00.000Z', processadoPorUltimoEm: '2026-11-04T12:00:11.000Z',
      segundosRestantes: 3 }
    const segunda = { ...primeira, idDaDefinicaoDaAtividade: 'coletar.mineracao.stan', segundosRestantes: 7 }
    const antigo = { ...base, versaoDoEsquemaDaPartida: 15 as const,
      ocioso: { atividadeAtiva: primeira, atividadeSecundaria: segunda, prioridade: 'secundaria' as const },
      fabricacao: { receitaAtiva: null, receitaSecundaria: null, prioridade: 'equilibrado' as const },
      profissoes: { ...base.profissoes, mineracao: { nivel: 30, xp: 17, prestigio: 2 } } }
    const repo = criarRepositorioDePartidasIndexedDb()
    await repo.salvar(antigo as unknown as PartidaLocal)
    const atual = await repo.obter('migra-v15-terceiro-relogio')
    expect(atual?.versaoDoEsquemaDaPartida).toBe(18)
    expect(atual?.ocioso.atividadeAtiva).toEqual(primeira)
    expect(atual?.ocioso.atividadeSecundaria).toEqual(segunda)
    expect(atual?.ocioso.atividadeTerciaria).toBeNull()
    expect(atual?.ocioso.prioridade).toBe('secundaria')
    expect(atual?.fabricacao.receitaTerciaria).toBeNull()
    expect(atual?.profissoes.mineracao).toEqual(antigo.profissoes.mineracao)
    await repo.salvar(atual!)
    expect(await repo.obter('migra-v15-terceiro-relogio')).toEqual(atual)
  })

  it('migra save v14 para v15 sem perder o trabalho de fabricação principal', async () => {
    const atual = criarPartidaLocal({
      idDaPartida: 'migra-v14-producao-paralela',
      criadoEm: '2026-11-04T12:00:00.000Z', versaoDoConteudo: '0.1.0-dev',
      nomeDoPersonagem: 'Ailith', classeDoPersonagem, presente,
    })
    const receitaAtiva = {
      idDaDefinicaoDaReceita: 'receita.metalurgia.tratada-cloch',
      iniciadoEm: '2026-11-04T12:00:00.000Z',
      processadoPorUltimoEm: '2026-11-04T12:00:09.000Z',
      segundosRestantes: 3,
      idDaInstanciaDoEquipamentoAlvo: null,
    }
    const antigo = {
      ...atual, versaoDoEsquemaDaPartida: 14 as const,
      fabricacao: { receitaAtiva },
      profissoes: { ...atual.profissoes, metalurgia: { nivel: 20, xp: 41, prestigio: 1 } },
      personagem: { ...atual.personagem, ouro: 121, inventario: [
        { idDaDefinicao: 'material.cloch', quantidade: 17 },
      ] },
    }
    const repo = criarRepositorioDePartidasIndexedDb()
    await repo.salvar(antigo as unknown as PartidaLocal)
    const migrada = await repo.obter('migra-v14-producao-paralela')
    expect(migrada?.versaoDoEsquemaDaPartida).toBe(18)
    expect(migrada?.fabricacao.receitaAtiva).toEqual(receitaAtiva)
    expect(migrada?.fabricacao.receitaSecundaria).toBeNull()
    expect(migrada?.personagem.ouro).toBe(121)
    expect(migrada?.personagem.inventario).toEqual(antigo.personagem.inventario)
    expect(migrada?.profissoes.metalurgia).toEqual(antigo.profissoes.metalurgia)
    await repo.salvar(migrada!)
    expect(await repo.obter('migra-v14-producao-paralela')).toEqual(migrada)
  })

  it('migra v13 para v14 sem perder o relógio e a experiência do trabalho principal', async () => {
    const atual = criarPartidaLocal({
      idDaPartida: 'migra-v13-segundo-relogio',
      criadoEm: '2026-11-04T12:00:00.000Z',
      versaoDoConteudo: '0.1.0-dev', nomeDoPersonagem: 'Ailith',
      classeDoPersonagem, presente,
    })
    const atividade = {
      idDaDefinicaoDaAtividade: 'coletar.mineracao.cloch',
      iniciadoEm: '2026-11-04T12:00:00.000Z',
      processadoPorUltimoEm: '2026-11-04T12:00:07.000Z',
      segundosRestantes: 3,
    }
    const antigo = {
      ...atual,
      versaoDoEsquemaDaPartida: 13 as const,
      ocioso: { atividadeAtiva: atividade },
      profissoes: { ...atual.profissoes, mineracao: { nivel: 39, xp: 37, prestigio: 1 } },
      personagem: { ...atual.personagem, ouro: 57 },
    }
    const repositorio = criarRepositorioDePartidasIndexedDb()
    await repositorio.salvar(antigo as unknown as PartidaLocal)
    const migrado = await repositorio.obter('migra-v13-segundo-relogio')
    expect(migrado?.versaoDoEsquemaDaPartida).toBe(18)
    expect(migrado?.ocioso.atividadeAtiva).toEqual(atividade)
    expect(migrado?.ocioso.atividadeSecundaria).toBeNull()
    expect(migrado?.profissoes.mineracao).toEqual({ nivel: 39, xp: 37, prestigio: 1 })
    expect(migrado?.personagem.ouro).toBe(57)
    await repositorio.salvar(migrado!)
    expect(await repositorio.obter('migra-v13-segundo-relogio')).toEqual(migrado)
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
    expect(restaurado?.versaoDoEsquemaDaPartida).toBe(18)
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

    expect(carregado?.versaoDoEsquemaDaPartida).toBe(18)
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

    expect(carregado?.versaoDoEsquemaDaPartida).toBe(18)
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

    expect(carregado?.versaoDoEsquemaDaPartida).toBe(18)
    expect(carregado?.personagem.prestigio).toEqual({ nivel: 0, pontos: 0, idsDosNosDesbloqueados: [] })
  })

  it('migra a versão 10 sem apagar a Jornada e sem inventar registros novos', async () => {
    const original = criarPartidaLocal({ idDaPartida: 'legado-v10', criadoEm: '2026-10-29T12:00:00.000Z', versaoDoConteudo: 'test', nomeDoPersonagem: 'Aedan', classeDoPersonagem, presente })
    const legado = Object.fromEntries(Object.entries(original).filter(([chave]) => chave !== 'codice' && chave !== 'desafios'))
    const repositorio = criarRepositorioDePartidasIndexedDb()
    await repositorio.salvar({ ...legado, versaoDoEsquemaDaPartida: 10 } as unknown as PartidaLocal)
    const migrado = await repositorio.obter(original.idDaPartida)
    expect(migrado?.versaoDoEsquemaDaPartida).toBe(18)
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
    expect(migrado?.versaoDoEsquemaDaPartida).toBe(18)
    expect(migrado?.personagem).toEqual(original.personagem)
    expect(migrado?.jornada).toEqual({ meta: null, idsDasReceitasFabricadas: [] })
    if (!migrado) throw new Error("Partida ausente")
    const progredido = { ...migrado, jornada: { meta: { idDaDefinicaoDaReceita: "receita.metalurgia.tratada-cloch", selecionadoEm: original.criadoEm, concluidoEm: '2026-09-15T12:00:06.000Z' }, idsDasReceitasFabricadas: ["receita.metalurgia.tratada-cloch"] } }
    await repositorio.salvar(progredido)
    const reaberto = criarRepositorioDePartidasIndexedDb()
    expect((await reaberto.obter(original.idDaPartida))?.jornada).toEqual(progredido.jornada)
    expect((await reaberto.listar())[0]?.jornada).toEqual(progredido.jornada)
  })
  it('migra v16, conserva atributos e restaura uma incursão persistida até resgatá-la', async () => {
    const base = criarPartidaLocal({ idDaPartida: 'incursao-reabertura', criadoEm: '2026-11-04T12:00:00.000Z',
      versaoDoConteudo: 'test', nomeDoPersonagem: 'Ailith', classeDoPersonagem, presente })
    const antiga = { ...base, versaoDoEsquemaDaPartida: 16 as const,
      masmorra: { ...base.masmorra, dunLiathFacilConquistado: true } }
    delete (antiga.masmorra as Record<string, unknown>).incursaoAutomaticaAtiva
    delete (antiga.masmorra as Record<string, unknown>).ultimaIncursaoAutomatica
    const repo = criarRepositorioDePartidasIndexedDb()
    await repo.salvar(antiga as unknown as PartidaLocal)
    const migrada = await repo.obter('incursao-reabertura')
    expect(migrada?.versaoDoEsquemaDaPartida).toBe(18)
    expect(migrada?.masmorra.incursaoAutomaticaAtiva).toBeNull()
    expect(migrada?.masmorra.dunLiathFacilConquistado).toBe(true)
    expect(migrada?.personagem.atributos).toEqual(base.personagem.atributos)
    const ativa = iniciarIncursaoAutomatica(migrada!, 'cautelosa', 20, 15, '2026-11-04T12:10:00Z')
    await repo.salvar(ativa)
    const recarregada = await criarRepositorioDePartidasIndexedDb().obter('incursao-reabertura')
    expect(recarregada?.masmorra.incursaoAutomaticaAtiva).toEqual(ativa.masmorra.incursaoAutomaticaAtiva)
    const encerrada = finalizarIncursaoAutomatica(recarregada!, '2026-11-04T12:26:00Z')
    await repo.salvar(encerrada)
    const revisitada = await repo.obter('incursao-reabertura')
    expect(revisitada?.masmorra.incursaoAutomaticaAtiva).toBeNull()
    expect(revisitada?.masmorra.ultimaIncursaoAutomatica).toEqual(encerrada.masmorra.ultimaIncursaoAutomatica)
    expect(() => finalizarIncursaoAutomatica(revisitada!, '2026-11-04T12:27:00Z')).toThrow('Não existe')
  })

  it('migra v17 preservando Incursão Automática, inventário e progresso de Dún Liath', async () => {
    const base = criarPartidaLocal({ idDaPartida: 'grupo-migracao-v17',
      criadoEm: '2026-11-04T12:00:00.000Z', versaoDoConteudo: 'test',
      nomeDoPersonagem: 'Ailith', classeDoPersonagem, presente })
    const plano = { preset: 'cautelosa' as const, iniciadaEm: base.criadoEm,
      terminaEm: '2026-11-04T12:15:00.000Z', semente: 20, chanceDeSucesso: 0.83,
      recompensaPossivel: [{ idDaDefinicao: 'item.dun-liath.viga', quantidade: 1 }] }
    const v17 = { ...base, versaoDoEsquemaDaPartida: 17,
      personagem: { ...base.personagem, ouro: 127 },
      masmorra: { ...base.masmorra, dunLiathFacilConquistado: true, incursaoAutomaticaAtiva: plano } }
    delete (v17 as Partial<PartidaLocal>).grupo
    const repo = criarRepositorioDePartidasIndexedDb()
    await repo.salvar(v17 as unknown as PartidaLocal)
    const atual = await repo.obter('grupo-migracao-v17')
    expect(atual?.versaoDoEsquemaDaPartida).toBe(18)
    expect(atual?.grupo.idsDosParceirosAtivos).toEqual([])
    expect(atual?.grupo.marcoDeMira).toBe('desconhecida')
    expect(atual?.personagem.ouro).toBe(127)
    expect(atual?.masmorra.incursaoAutomaticaAtiva).toEqual(plano)
    await repo.salvar(atual!)
    expect(await repo.obter('grupo-migracao-v17')).toEqual(atual)
  })

})
