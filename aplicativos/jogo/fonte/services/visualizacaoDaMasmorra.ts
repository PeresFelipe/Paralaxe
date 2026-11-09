import type { DefinicaoDeMasmorra, ExpedicaoNaMasmorra } from '@paralaxe/dominio'
import { DungeonGenerator } from '../terceiros/dungeonCrawlerNow/DungeonGenerator'
import { obterEstadoDaSala } from '../terceiros/dungeonCrawlerNow/RoomState'

export function gerarGeometriaDaExpedicao(mapa: DefinicaoDeMasmorra, semente: number) {
  return new DungeonGenerator(240, 180, String(semente), Math.max(2, mapa.salas.length)).generate()
}

/** Geometria de apresentação. As ligações e permissões pertencem ao grafo do domínio. */
export function criarMapaVisual(mapa: DefinicaoDeMasmorra, semente: number, gerado = gerarGeometriaDaExpedicao(mapa, semente)) {
  if (mapa.salas.length === 0) return []
  if (gerado.rooms.length < mapa.salas.length) throw new Error('Geometria insuficiente para o mapa da expedição.')
  return mapa.salas.map((sala, indice) => {
    const geometria = gerado.rooms[indice]!
    return { id: sala.id, x: geometria.centerX, y: geometria.centerY }
  })
}

export function revelarMapa(mapa: DefinicaoDeMasmorra, expedicao: ExpedicaoNaMasmorra, geometria?: ReturnType<typeof gerarGeometriaDaExpedicao>) {
  const visitadas = new Set(expedicao.idsDasSalasVisitadas)
  const atual = mapa.salas.find(sala => sala.id === expedicao.idDaSalaAtual)
  const visiveis = new Set([...visitadas, ...(atual?.idsDasProximasSalas ?? [])])
  return criarMapaVisual(mapa, expedicao.semente, geometria).filter(sala => visiveis.has(sala.id)).map(sala => ({
    ...sala, visitada: visitadas.has(sala.id),
    estado: obterEstadoDaSala(sala.id, expedicao.idDaSalaAtual, expedicao.idsDasSalasResolvidas),
  }))
}
