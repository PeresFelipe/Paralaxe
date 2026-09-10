import { beforeEach, describe, expect, it } from 'vitest'
import { indexedDB } from 'fake-indexeddb'
import {
  acceptDunLiathContract,
  createOfflineGameSave,
  startDungeon,
  type CharacterClassDefinition,
  type DungeonDefinition,
  type GiftDefinition,
  type OfflineGameSave,
} from '@greywake/domain'
import { createIndexedDbSaveRepository } from './indexedDbSaveRepository'

Object.defineProperty(globalThis, 'indexedDB', {
  configurable: true,
  writable: true,
  value: indexedDB,
})

const characterClass: CharacterClassDefinition = {
  id: 'wanderer',
  name: 'Errante',
  summary: 'Equilibrado.',
  attributes: {
    vitality: 5,
    mind: 5,
    vigor: 5,
    strength: 5,
    dexterity: 5,
    intelligence: 5,
    faith: 5,
  },
  startingEquipment: { mainHand: 'weapon.travel-spear' },
  startingAbilityId: 'ability.opening',
}

const gift: GiftDefinition = {
  id: 'none',
  name: 'Nenhum',
  summary: 'Sem presente.',
  grants: [],
}

const dungeon: DungeonDefinition = {
  id: 'dungeon.dun-liath.easy',
  name: 'Dún Liath — Fácil',
  difficulty: 'easy',
  startRoomId: 'room.entrance',
  rooms: [
    { id: 'room.entrance', name: 'Entrada', kind: 'entrance', nextRoomIds: ['room.courtyard'] },
    { id: 'room.courtyard', name: 'Pátio', kind: 'event', nextRoomIds: [] },
  ],
}

function deleteDatabase() {
  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase('greywake')
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
    request.onblocked = () => resolve()
  })
}

describe('IndexedDB save repository', () => {
  beforeEach(async () => {
    await deleteDatabase()
  })

  it('reopens an active DungeonRun with its seed, room, bag and resources intact', async () => {
    let save = createOfflineGameSave({
      saveId: 'reload-dungeon',
      createdAt: '2026-09-09T12:00:00.000Z',
      contentVersion: '0.1.0-dev',
      characterName: 'Ailith',
      characterClass,
      gift,
    })
    save = {
      ...save,
      combat: { ...save.combat, wolfDefeated: true },
    }
    save = acceptDunLiathContract(save, '2026-09-09T12:01:00.000Z')
    save = startDungeon(save, dungeon, 991337, '2026-09-09T12:02:00.000Z')

    const run = save.dungeon.activeRun
    if (!run) throw new Error('DungeonRun ausente no teste.')

    save = {
      ...save,
      dungeon: {
        ...save.dungeon,
        activeRun: {
          ...run,
          currentRoomId: 'room.courtyard',
          visitedRoomIds: ['room.entrance', 'room.courtyard'],
          resolvedRoomIds: ['room.entrance'],
          expeditionBag: [{ definitionId: 'item.treaty-fragment', quantity: 1 }],
          resources: { ...run.resources, health: run.resources.maxHealth - 37, stamina: 41 },
        },
      },
    }

    const repositoryBeforeClose = createIndexedDbSaveRepository()
    await repositoryBeforeClose.put(save)

    const repositoryAfterReload = createIndexedDbSaveRepository()
    const loaded = await repositoryAfterReload.get(save.saveId)

    expect(loaded?.saveSchemaVersion).toBe(8)
    expect(loaded?.character.bank).toEqual({ inventory: [], equipmentItems: [] })
    expect(loaded?.dungeon.contractAccepted).toBe(true)
    expect(loaded?.dungeon.activeRun?.seed).toBe(991337)
    expect(loaded?.dungeon.activeRun?.currentRoomId).toBe('room.courtyard')
    expect(loaded?.dungeon.activeRun?.visitedRoomIds).toEqual(['room.entrance', 'room.courtyard'])
    expect(loaded?.dungeon.activeRun?.resolvedRoomIds).toEqual(['room.entrance'])
    expect(loaded?.dungeon.activeRun?.expeditionBag).toEqual([
      { definitionId: 'item.treaty-fragment', quantity: 1 },
    ])
    expect(loaded?.dungeon.activeRun?.resources.health).toBe(run.resources.maxHealth - 37)
    expect(loaded?.dungeon.activeRun?.resources.stamina).toBe(41)
  })

  it('migrates a v7 Traveller Ring stack into an equipped ring instance', async () => {
    const current = createOfflineGameSave({
      saveId: 'legacy-ring',
      createdAt: '2026-09-09T12:00:00.000Z',
      contentVersion: '0.1.0-dev',
      characterName: 'Ailith',
      characterClass,
      gift,
    })
    const legacy = {
      ...current,
      saveSchemaVersion: 7 as const,
      character: {
        ...current.character,
        giftId: 'traveller-ring' as const,
        inventory: [{ definitionId: 'item.equipment.traveller-ring', quantity: 1 }],
      },
    }
    const repository = createIndexedDbSaveRepository()
    await repository.put(legacy as unknown as OfflineGameSave)
    const loaded = await repository.get('legacy-ring')
    const ringId = loaded?.character.equipment.ring1
    const ring = loaded?.character.equipmentItems.find((item) => item.instanceId === ringId)

    expect(loaded?.saveSchemaVersion).toBe(8)
    expect(ring?.definitionId).toBe('item.equipment.traveller-ring')
    expect(loaded?.character.inventory.some((stack) => stack.definitionId === 'item.equipment.traveller-ring')).toBe(false)
  })

})
