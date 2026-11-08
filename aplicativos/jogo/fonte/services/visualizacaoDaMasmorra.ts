import type { DefinicaoDeMasmorra, ExpedicaoNaMasmorra } from '@paralaxe/dominio'
import { DungeonGenerator } from '../terceiros/dungeonCrawlerNow/DungeonGenerator'
import { obterEstadoDaSala } from '../terceiros/dungeonCrawlerNow/RoomState'

/** Geometria de apresentação. As ligações e permissões pertencem ao grafo do domínio. */
export function criarMapaVisual(mapa: DefinicaoDeMasmorra, semente: number) {
  if (mapa.salas.length === 0) return []
  const gerado = new DungeonGenerator(240, 180, String(semente), Math.max(2, mapa.salas.length)).generate()
  if (gerado.rooms.length < mapa.salas.length) throw new Error('Geometria insuficiente para o mapa da expedição.')
  return mapa.salas.map((sala, indice) => {
    const geometria = gerado.rooms[indice]!
    return { id: sala.id, x: geometria.centerX, y: geometria.centerY }
  })
}

export function revelarMapa(mapa: DefinicaoDeMasmorra, expedicao: ExpedicaoNaMasmorra) {
  const visitadas = new Set(expedicao.idsDasSalasVisitadas)
  const atual = mapa.salas.find(sala => sala.id === expedicao.idDaSalaAtual)
  const visiveis = new Set([...visitadas, ...(atual?.idsDasProximasSalas ?? [])])
  return criarMapaVisual(mapa, expedicao.semente).filter(sala => visiveis.has(sala.id)).map(sala => ({
    ...sala, visitada: visitadas.has(sala.id),
    estado: obterEstadoDaSala(sala.id, expedicao.idDaSalaAtual, expedicao.idsDasSalasResolvidas),
  }))
}
