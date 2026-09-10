import { describe, expect, it } from 'vitest'
import { createOfflineGameSave, type CharacterClassDefinition, type GiftDefinition } from './character'
import { acceptDunLiathContract, type DungeonDefinition } from './dungeon'
import { startIdleActivity, type IdleActivityDefinition } from './idle'
import {
  pauseCurrentWorkForRisk,
  resumeCurrentWorkAfterRisk,
  startDungeonWithContinuity,
} from './continuity'

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

const activity: IdleActivityDefinition = {
  id: 'activity.test.mining',
  skillId: 'mining',
  name: 'Minerar Cloch',
  resultItemDefinitionId: 'material.cloch',
  resultName: 'Cloch',
  requiredSkillLevel: 1,
  actionSeconds: 2,
  skillXpPerAction: 4,
}

const dungeon: DungeonDefinition = {
  id: 'dungeon.test.continuity',
  name: 'Dungeon de Continuidade',
  difficulty: 'easy',
  startRoomId: 'room.start',
  rooms: [
    { id: 'room.start', name: 'Entrada', kind: 'entrance', nextRoomIds: [] },
  ],
}

function createSave() {
  return createOfflineGameSave({
    saveId: 'save-continuity',
    createdAt: '2026-09-10T10:00:00.000Z',
    contentVersion: '0.1.0-dev',
    characterName: 'Ailith',
    characterClass: classDefinition,
    gift: giftDefinition,
  })
}

function createWorkingAcceptedSave() {
  let save = createSave()
  save = acceptDunLiathContract(save, '2026-09-10T10:00:01.000Z')
  return startIdleActivity(save, activity, '2026-09-10T10:00:02.000Z')
}

describe('risk continuity', () => {
  it('keeps the selected Idle activity while freezing its elapsed-time anchor', () => {
    const save = createWorkingAcceptedSave()
    const paused = pauseCurrentWorkForRisk(save, '2026-09-10T10:05:00.000Z')

    expect(paused.idle.activeActivity?.activityDefinitionId).toBe(activity.id)
    expect(paused.idle.activeActivity?.lastProcessedAt).toBe('2026-09-10T10:05:00.000Z')
  })

  it('starts a Dungeon without forcing the selected Idle activity to be stopped', () => {
    const save = createWorkingAcceptedSave()
    const started = startDungeonWithContinuity(
      save,
      dungeon,
      42,
      '2026-09-10T10:05:00.000Z',
    )

    expect(started.dungeon.activeRun?.dungeonDefinitionId).toBe(dungeon.id)
    expect(started.idle.activeActivity?.activityDefinitionId).toBe(activity.id)
    expect(started.idle.activeActivity?.lastProcessedAt).toBe('2026-09-10T10:05:00.000Z')
  })

  it('reanchors the same selected work when returning to a safe context', () => {
    const started = startDungeonWithContinuity(
      createWorkingAcceptedSave(),
      dungeon,
      42,
      '2026-09-10T10:05:00.000Z',
    )
    const resumed = resumeCurrentWorkAfterRisk(started, '2026-09-10T10:20:00.000Z')

    expect(resumed.idle.activeActivity?.activityDefinitionId).toBe(activity.id)
    expect(resumed.idle.activeActivity?.lastProcessedAt).toBe('2026-09-10T10:20:00.000Z')
  })
})
