/**
 * @file Entrada pública da persistência local.
 * Exporta o contrato e a fábrica IndexedDB; o adaptador de vocabulário legado permanece interno ao pacote.
 */
export const DESTINO_DA_PERSISTENCIA_LOCAL = 'indexeddb' as const

export * from './repositorioDePartidas'
export * from './repositorioDePartidasIndexedDb'
