import { describe, expect, it } from 'vitest'
import { DUN_LIATH_FACIL } from '@paralaxe/conteudo'
import type { ExpedicaoNaMasmorra } from '@paralaxe/dominio'
import { criarMapaVisual, revelarMapa } from './visualizacaoDaMasmorra'
import { DungeonGenerator } from '../terceiros/dungeonCrawlerNow/DungeonGenerator'
import { projectHex } from '../terceiros/hexaBattle/projecaoIsometrica'

describe('apresentação da masmorra com código MIT', () => {
  it('cobre todas as salas sem alterar as conexões do domínio, para 100 sementes', () => {
    const antes = JSON.stringify(DUN_LIATH_FACIL)
    for (let seed = 0; seed < 100; seed++) {
      const pontos = criarMapaVisual(DUN_LIATH_FACIL, seed)
      expect(pontos.map(p => p.id)).toEqual(DUN_LIATH_FACIL.salas.map(s => s.id))
      expect(new Set(pontos.map(p => `${p.x},${p.y}`)).size).toBe(pontos.length)
      expect(pontos.every(p => p.x > 0 && p.x < 240 && p.y > 0 && p.y < 180)).toBe(true)
    }
    expect(JSON.stringify(DUN_LIATH_FACIL)).toBe(antes)
  })
  it('mantém a geometria ao recarregar e ao reutilizar o gerador', () => {
    expect(criarMapaVisual(DUN_LIATH_FACIL, 42)).toEqual(criarMapaVisual(DUN_LIATH_FACIL, 42))
    const gerador = new DungeonGenerator(240, 180, '42', 20)
    expect(gerador.generate()).toEqual(gerador.generate())
  })
  it('não revela nomes, estados ou geometrias das salas distantes', () => {
    const entrada = DUN_LIATH_FACIL.salas.find(s => s.id === DUN_LIATH_FACIL.idDaSalaInicial)!
    const expedicao = { semente: 42, idDaSalaAtual: entrada.id, idsDasSalasVisitadas: [entrada.id], idsDasSalasResolvidas: [] } as unknown as ExpedicaoNaMasmorra
    const reveladas = revelarMapa(DUN_LIATH_FACIL, expedicao)
    expect(reveladas.map(s => s.id).sort()).toEqual([entrada.id, ...entrada.idsDasProximasSalas].sort())
    expect(reveladas.find(s => s.id === entrada.id)?.estado).toBe('active')
    expedicao.idsDasSalasResolvidas.push(entrada.id)
    expect(revelarMapa(DUN_LIATH_FACIL, expedicao).find(s => s.id === entrada.id)?.estado).toBe('cleared')
  })
  it('projeta o piso sem depender do motor original e rejeita dimensões inválidas', () => {
    expect(projectHex({ q: 0, r: 0 })).toEqual({ x: 0, y: 0 })
    expect(projectHex({ q: 1, r: 1 }).x).toBe(30)
    expect(() => new DungeonGenerator(1, 1)).toThrow()
  })
})
