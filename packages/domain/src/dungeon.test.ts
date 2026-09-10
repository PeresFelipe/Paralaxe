import { describe, expect, it } from 'vitest'
import { createOfflineGameSave, type CharacterClassDefinition, type GiftDefinition } from './character'
import {
  acceptDunLiathContract,
  chooseDungeonPath,
  decideProtector,
  extractDungeonRun,
  failDungeonRun,
  resolveDungeonRoom,
  startDungeon,
  type DungeonContentCatalog,
  type DungeonDefinition,
} from './dungeon'

const classDefinition: CharacterClassDefinition = {
  id: 'wanderer',
  name: 'Errante',
  summary: 'Equilibrado.',
  attributes: { vitality: 5, mind: 5, vigor: 5, strength: 5, dexterity: 5, intelligence: 5, faith: 5 },
  startingEquipment: { mainHand: 'weapon.travel-spear' },
  startingAbilityId: 'ability.opening',
}

const giftDefinition: GiftDefinition = {
  id: 'none',
  name: 'Nenhum',
  summary: 'Sem presente.',
  grants: [],
}

const dungeon: DungeonDefinition = {
  id: 'dungeon.test.easy',
  name: 'Dungeon Teste',
  difficulty: 'easy',
  startRoomId: 'room.start',
  rooms: [
    { id: 'room.start', name: 'Entrada', kind: 'entrance', nextRoomIds: ['room.left', 'room.right'] },
    { id: 'room.left', name: 'Esquerda', kind: 'event', nextRoomIds: ['room.recovery'] },
    { id: 'room.right', name: 'Direita', kind: 'event', nextRoomIds: ['room.recovery'] },
    { id: 'room.recovery', name: 'Recuperação', kind: 'recovery', nextRoomIds: [] },
  ],
}

const catalog: DungeonContentCatalog = {
  getDungeonDefinition: () => dungeon,
  getAbilityDefinition: () => null,
  getEnemyDefinition: () => null,
  getEquipmentDefinition: () => null,
}

function createSave() {
  return createOfflineGameSave({
    saveId: 'save-dungeon',
    createdAt: '2026-09-09T12:00:00.000Z',
    contentVersion: '0.1.0-dev',
    characterName: 'Ailith',
    characterClass: classDefinition,
    gift: giftDefinition,
  })
}

function createAcceptedSave() {
  return acceptDunLiathContract(createSave(), '2026-09-09T11:59:00.000Z')
}

describe('DungeonRun', () => {
  it('grants contract supplies once and requires the contract before entering', () => {
    expect(() => startDungeon(createSave(), dungeon, 1, '2026-09-09T12:00:00.000Z')).toThrow('Aceite primeiro')

    const accepted = createAcceptedSave()
    const acceptedAgain = acceptDunLiathContract(accepted, '2026-09-09T11:59:30.000Z')
    expect(acceptedAgain.character.inventory).toContainEqual({ definitionId: 'item.consumable.field-preparation', quantity: 2 })
  })

  it('requires the current room to be resolved and makes branches irreversible', () => {
    const started = startDungeon(createAcceptedSave(), dungeon, 123, '2026-09-09T12:00:00.000Z')
    expect(() => chooseDungeonPath(started, dungeon, 'room.left', '2026-09-09T12:00:01.000Z')).toThrow('Resolva a sala atual')
    const resolved = resolveDungeonRoom(started, dungeon, catalog, '2026-09-09T12:00:01.000Z').save
    const left = chooseDungeonPath(resolved, dungeon, 'room.left', '2026-09-09T12:00:02.000Z')
    expect(left.dungeon.activeRun?.chosenBranches['room.start']).toBe('room.left')
    expect(left.dungeon.activeRun?.visitedRoomIds).toEqual(['room.start', 'room.left'])
    expect(() => chooseDungeonPath(left, dungeon, 'room.right', '2026-09-09T12:00:03.000Z')).toThrow()
  })

  it('prevents resolving the same room twice', () => {
    const started = startDungeon(createAcceptedSave(), dungeon, 7, '2026-09-09T12:00:00.000Z')
    const first = resolveDungeonRoom(started, dungeon, catalog, '2026-09-09T12:00:01.000Z').save
    expect(() => resolveDungeonRoom(first, dungeon, catalog, '2026-09-09T12:00:02.000Z')).toThrow('Essa sala já foi resolvida.')
  })

  it('makes recovery the first safe extraction point and transfers the expedition bag', () => {
    let save = startDungeon(createAcceptedSave(), dungeon, 9, '2026-09-09T12:00:00.000Z')
    save = resolveDungeonRoom(save, dungeon, catalog, '2026-09-09T12:00:01.000Z').save
    save = chooseDungeonPath(save, dungeon, 'room.left', '2026-09-09T12:00:02.000Z')
    save = resolveDungeonRoom(save, dungeon, catalog, '2026-09-09T12:00:03.000Z').save
    save = chooseDungeonPath(save, dungeon, 'room.recovery', '2026-09-09T12:00:04.000Z')
    save = resolveDungeonRoom(save, dungeon, catalog, '2026-09-09T12:00:05.000Z').save
    expect(save.dungeon.activeRun?.safeExtractionAvailable).toBe(true)
    const extracted = extractDungeonRun(save, '2026-09-09T12:00:06.000Z')
    expect(extracted.character.inventory).toContainEqual({ definitionId: 'item.consumable.field-preparation', quantity: 5 })
  })

  it('loses expedition loot on failure but preserves a protector decision already made', () => {
    let save = startDungeon(createAcceptedSave(), dungeon, 11, '2026-09-09T12:00:00.000Z')
    const run = save.dungeon.activeRun
    if (!run) throw new Error('run ausente')
    save = { ...save, dungeon: { ...save.dungeon, activeRun: { ...run, currentRoomId: 'room.protector', visitedRoomIds: [...run.visitedRoomIds, 'room.protector'], expeditionBag: [{ definitionId: 'item.loot', quantity: 3 }] } } }
    save = decideProtector(save, 'spared', '2026-09-09T12:00:01.000Z')
    const failed = failDungeonRun(save, '2026-09-09T12:00:02.000Z')
    expect(failed.dungeon.dunLiathProtector).toBe('spared')
    expect(failed.character.inventory.some((stack) => stack.definitionId === 'item.loot')).toBe(false)
  })

  it('grants first-clear rewards and contract reward only when the run is completed', () => {
    let save = startDungeon(createAcceptedSave(), dungeon, 13, '2026-09-09T12:00:00.000Z')
    const run = save.dungeon.activeRun
    if (!run) throw new Error('run ausente')
    save = { ...save, dungeon: { ...save.dungeon, activeRun: { ...run, safeExtractionAvailable: true, completed: true, supplyRegisterRecovered: true, protectorDecision: 'killed', expeditionBag: [{ definitionId: 'item.garrison-supply-register', quantity: 1 }] } } }
    const extracted = extractDungeonRun(save, '2026-09-09T12:00:01.000Z')
    expect(extracted.dungeon.dunLiathEasyCleared).toBe(true)
    expect(extracted.dungeon.contractCompleted).toBe(true)
    expect(extracted.dungeon.instinctiveGuardUnlocked).toBe(true)
    expect(extracted.character.gold).toBe(150)
    expect(extracted.character.xp).toBe(150)
    expect(extracted.character.knownAbilityIds).toContain('ability.instinctive-guard')
    expect(extracted.dungeon.dunLiathProtector).toBe('killed')
  })
  it('starts with explicitly derived resource maxima when provided by the runtime', () => {
    const resources = { health: 168, maxHealth: 168, mana: 85, maxMana: 85, stamina: 108, maxStamina: 108 }
    const started = startDungeon(createAcceptedSave(), dungeon, 5, '2026-09-09T12:00:00.000Z', resources)
    expect(started.dungeon.activeRun?.resources).toEqual(resources)
  })

})
