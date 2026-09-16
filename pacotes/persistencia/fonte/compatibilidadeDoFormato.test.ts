import { beforeEach, describe, expect, it } from 'vitest'
import { indexedDB } from 'fake-indexeddb'
import type { PartidaLocal } from '@greywake/dominio'
import { criarRepositorioDePartidasIndexedDb } from './repositorioDePartidasIndexedDb'
import { gravarFormatoLegado, lerFormatoLegado } from './formatoLegado'
import { partidaLegadaV10 } from './amostras/partidaLegadaV10'

Object.defineProperty(globalThis, 'indexedDB', { configurable: true, value: indexedDB })

function abrirBanco(): Promise<IDBDatabase> {
  return new Promise((resolver, rejeitar) => {
    const requisicao = indexedDB.open('greywake', 1)
    requisicao.onupgradeneeded = () => requisicao.result.createObjectStore('saves', { keyPath: 'saveId' })
    requisicao.onsuccess = () => resolver(requisicao.result)
    requisicao.onerror = () => rejeitar(requisicao.error)
  })
}

async function inserirPartidaAntiga(partida: unknown) {
  const banco = await abrirBanco()
  try {
    await new Promise<void>((resolver, rejeitar) => {
      const transacao = banco.transaction('saves', 'readwrite')
      transacao.oncomplete = () => resolver()
      transacao.onerror = () => rejeitar(transacao.error)
      transacao.objectStore('saves').put(partida)
    })
  } finally { banco.close() }
}

async function lerGravacaoBruta() {
  const banco = await abrirBanco()
  try {
    return await new Promise<unknown>((resolver, rejeitar) => {
      const requisicao = banco.transaction('saves', 'readonly').objectStore('saves').get('warrior')
      requisicao.onsuccess = () => resolver(requisicao.result)
      requisicao.onerror = () => rejeitar(requisicao.error)
    })
  } finally { banco.close() }
}

describe('compatibilidade com a main anterior à tradução', () => {
  beforeEach(async () => {
    await new Promise<void>((resolver, rejeitar) => {
      const requisicao = indexedDB.deleteDatabase('greywake')
      requisicao.onsuccess = () => resolver()
      requisicao.onerror = () => rejeitar(requisicao.error)
    })
  })

  it('lê uma partida antiga sem modificar os dados armazenados', async () => {
    await inserirPartidaAntiga(partidaLegadaV10)
    const repositorio = criarRepositorioDePartidasIndexedDb()
    const partida = await repositorio.obter('warrior')
    expect(partida?.idDaPartida).toBe('warrior')
    expect(partida?.personagem.nome).toBe('warrior')
    expect(partida?.personagem.idDaClasse).toBe('guerreiro')
    expect(partida?.personagem.ouro).toBe(321)
    expect(partida?.personagem.prestigio.idsDosNosDesbloqueados).toEqual(['prestigio.corpo.constituicao'])
    expect(partida?.personagem.banco.inventario).toEqual([{ idDaDefinicao: 'item.comida.assado-scadan', quantidade: 2 }])
    expect(partida?.ocioso.atividadeAtiva?.idDaDefinicaoDaAtividade).toBe('coletar.mineracao.cloch')
    expect(partida?.masmorra.expedicaoAtiva?.semente).toBe(777)
    expect(partida?.masmorra.expedicaoAtiva?.idDaSalaAtual).toBe('sala.entrada')
    expect(partida?.jornada.idsDasReceitasFabricadas).toEqual(['receita.metalurgia.tratada-cloch'])
    expect(await repositorio.listar()).toEqual([partida])
    expect(await lerGravacaoBruta()).toEqual(partidaLegadaV10)
  })

  it('grava novamente no formato exato que a versão anterior consegue ler', async () => {
    await inserirPartidaAntiga(partidaLegadaV10)
    const repositorio = criarRepositorioDePartidasIndexedDb()
    const partida = await repositorio.obter('warrior')
    expect(partida).not.toBeNull()
    await repositorio.salvar(partida!)
    expect(await lerGravacaoBruta()).toEqual(partidaLegadaV10)
    expect(await criarRepositorioDePartidasIndexedDb().obter('warrior')).toEqual(partida)
  })

  it('preserva dados livres mesmo quando o nome coincide com palavras do domínio', () => {
    const partida = lerFormatoLegado(partidaLegadaV10) as PartidaLocal
    partida.personagem.nome = 'guerreiro'
    partida.personagem.itensDeEquipamento[0]!.idDaInstancia = 'mago'
    partida.personagem.equipamento.maoPrincipal = 'mago'
    const bruto = gravarFormatoLegado(partida) as typeof partidaLegadaV10
    expect(bruto.character.equipment.mainHand).toBe('mago')
    expect(lerFormatoLegado(gravarFormatoLegado(partida))).toEqual(partida)
  })

  it.each([
    ['warrior', 'guerreiro'], ['mage', 'mago'], ['hunter', 'cacador'],
    ['acolyte', 'acolito'], ['rogue', 'ladino'], ['wanderer', 'errante'],
  ])('preserva a classe legada %s ao traduzir para %s', (antiga, atual) => {
    const original = structuredClone(partidaLegadaV10)
    original.character.classId = antiga
    const partida = lerFormatoLegado(original) as PartidaLocal
    expect(partida.personagem.idDaClasse).toBe(atual)
    expect(gravarFormatoLegado(partida)).toEqual(original)
  })

  it('migra uma gravação v9 sem inventar fabricações anteriores', async () => {
    const { journey: jornadaAntiga, ...legado } = partidaLegadaV10
    expect(jornadaAntiga.craftedRecipeIds.length).toBeGreaterThan(0)
    await inserirPartidaAntiga({ ...legado, saveSchemaVersion: 9 })
    const partida = await criarRepositorioDePartidasIndexedDb().obter('warrior')
    expect(partida?.versaoDoEsquemaDaPartida).toBe(10)
    expect(partida?.jornada).toEqual({ meta: null, idsDasReceitasFabricadas: [] })
    expect(partida?.personagem).toEqual((lerFormatoLegado(partidaLegadaV10) as PartidaLocal).personagem)
  })
})
