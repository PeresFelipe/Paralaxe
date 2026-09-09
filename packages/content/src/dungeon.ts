import type { DungeonDefinition } from '@greywake/domain'

export const DUN_LIATH_EASY = {
  id: 'dungeon.dun-liath.easy',
  name: 'Dún Liath — A Fortaleza Cinzenta',
  difficulty: 'easy',
  startRoomId: 'room.entrance',
  rooms: [
    { id: 'room.entrance', name: 'Portão Quebrado', kind: 'entrance', nextRoomIds: ['room.courtyard'] },
    { id: 'room.courtyard', name: 'Pátio Afundado', kind: 'event', nextRoomIds: ['room.barracks', 'room.administration'] },
    { id: 'room.barracks', name: 'Alojamentos em Ruínas', kind: 'combat', enemyDefinitionId: 'enemy.crubach', nextRoomIds: ['room.stores'] },
    { id: 'room.administration', name: 'Ala Administrativa', kind: 'event', nextRoomIds: ['room.treaty'] },
    { id: 'room.treaty', name: 'Arquivo Partido', kind: 'treasure', nextRoomIds: ['room.stores'] },
    { id: 'room.stores', name: 'Depósito Vazio', kind: 'event', nextRoomIds: ['room.crubach'] },
    { id: 'room.crubach', name: 'Galeria de Pedra', kind: 'combat', enemyDefinitionId: 'enemy.crubach', nextRoomIds: ['room.protector'] },
    { id: 'room.protector', name: 'Abrigo Improvisado', kind: 'event', nextRoomIds: ['room.tromghiallach'] },
    { id: 'room.tromghiallach', name: 'Salão Partido', kind: 'elite', enemyDefinitionId: 'enemy.tromghiallach', nextRoomIds: ['room.arsenal'] },
    { id: 'room.arsenal', name: 'Arsenal Abandonado', kind: 'treasure', nextRoomIds: ['room.register'] },
    { id: 'room.register', name: 'Intendência', kind: 'treasure', nextRoomIds: ['room.lower-hall'] },
    { id: 'room.lower-hall', name: 'Salão Inferior', kind: 'event', nextRoomIds: ['room.rampart'] },
    { id: 'room.rampart', name: 'Muralha Interna', kind: 'event', nextRoomIds: ['room.passage'] },
    { id: 'room.passage', name: 'Passagem do Bastião', kind: 'event', nextRoomIds: ['room.cosantoir'] },
    { id: 'room.cosantoir', name: 'Porta do Guardião', kind: 'elite', enemyDefinitionId: 'enemy.cosantoir', nextRoomIds: ['room.recovery'] },
    { id: 'room.recovery', name: 'Capela Silenciosa', kind: 'recovery', nextRoomIds: ['room.boss-gate'] },
    { id: 'room.boss-gate', name: 'Porta do Último Vigia', kind: 'event', nextRoomIds: ['room.fairtheoir'] },
    { id: 'room.fairtheoir', name: 'Salão do Último Vigia', kind: 'boss', enemyDefinitionId: 'enemy.fairtheoir-phase1', nextRoomIds: [] },
  ],
} as const satisfies DungeonDefinition

export const DUNGEONS = [DUN_LIATH_EASY] as const

export function getDungeonDefinition(dungeonId: string) {
  return DUNGEONS.find((dungeon) => dungeon.id === dungeonId) ?? null
}
