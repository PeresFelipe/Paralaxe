/**
 * @file Entrada pública dos catálogos de Greywake.
 * A versão do conteúdo identifica as definições usadas ao criar a partida, enquanto
 * a versão do esquema no domínio descreve a estrutura dos dados salvos.
 */
export const VERSAO_DO_CONTEUDO = '0.1.0-dev' as const

export * from './criacaoDePersonagem'
export * from './atividadesOciosas'
export * from './receitasDeFabricacao'
export * from './equipamento'
export * from './combate'
export * from './masmorra'
export * from './mercado'
export * from './jornada'
