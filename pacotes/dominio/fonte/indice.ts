export const FASE_DA_VERSAO = "fase-1-local" as const
export const MODO_DA_PARTIDA = "LOCAL" as const

export type FaseDaVersao = typeof FASE_DA_VERSAO
export type ModoDaPartida = typeof MODO_DA_PARTIDA

export * from './personagem'
export * from './ocioso'
export * from './equipamento'
export * from './fabricacao'
export * from './jornada'
export * from './combate'
export * from './masmorra'
export * from './progressao'
export * from './prestigio'
export * from './economia'
export * from './introducao'
export * from './continuidade'
export * from './armazenamento'
