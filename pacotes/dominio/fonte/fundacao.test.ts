/**
 * @file Teste do contrato público que identifica esta fase como jogo com partidas locais.
 */
import { describe, expect, it } from 'vitest'
import { FASE_DA_VERSAO, MODO_DA_PARTIDA } from './indice'

describe("fundação da versão 0.1", () => {
  it("mantém a primeira fase de implementação local", () => {
    expect(FASE_DA_VERSAO).toBe("fase-1-local")
    expect(MODO_DA_PARTIDA).toBe("LOCAL")
  })
})
