export const BUILD_PHASE = 'phase-1-local' as const
export const BUILD_SAVE_MODE = 'OFFLINE' as const

export type BuildPhase = typeof BUILD_PHASE
export type BuildSaveMode = typeof BUILD_SAVE_MODE

export * from './character'
export * from './idle'
export * from './equipment'
export * from './crafting'
export * from './combat'
export * from './dungeon'
export * from './progression'
export * from './economy'
export * from './onboarding'
export * from './continuity'
export * from './storage'
