import { describe, expect, it } from 'vitest'
import { createOfflineGameSave, type CharacterClassDefinition, type GiftDefinition } from './character'
import {
  getOfflineLimitSeconds,
  processIdleProgress,
  startIdleActivity,
  type IdleActivityDefinition,
} from './idle'

const classDefinition: CharacterClassDefinition = {
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

const giftDefinition: GiftDefinition = {
  id: 'none',
  name: 'Nenhum Presente',
  summary: 'Sem vantagem.',
  grants: [],
}

const miningActivity: IdleActivityDefinition = {
  id: 'gather.mining.cloch',
  skillId: 'mining',
  name: 'Extrair Cloch',
  resultItemDefinitionId: 'material.cloch',
  resultName: 'Cloch',
  requiredSkillLevel: 1,
  actionSeconds: 4,
  skillXpPerAction: 8,
}

function createSave() {
  return createOfflineGameSave({
    saveId: 'save-idle',
    createdAt: '2026-09-09T12:00:00.000Z',
    contentVersion: '0.1.0-dev',
    characterName: 'Ailith',
    characterClass: classDefinition,
    gift: giftDefinition,
  })
}

describe('idle progress', () => {
  it('converts elapsed time into only the selected resource and Skill XP', () => {
    const started = startIdleActivity(createSave(), miningActivity, '2026-09-09T12:00:00.000Z')
    const result = processIdleProgress(started, miningActivity, '2026-09-09T12:00:12.000Z')

    expect(result.completedActions).toBe(3)
    expect(result.grantedItems).toBe(3)
    expect(result.grantedSkillXp).toBe(24)
    expect(result.save.character.inventory).toContainEqual({ definitionId: 'material.cloch', quantity: 3 })
    expect(result.save.skills.mining.xp).toBe(24)
  })

  it('carries an incomplete action into the next processing pass', () => {
    const started = startIdleActivity(createSave(), miningActivity, '2026-09-09T12:00:00.000Z')
    const first = processIdleProgress(started, miningActivity, '2026-09-09T12:00:03.000Z')
    const second = processIdleProgress(first.save, miningActivity, '2026-09-09T12:00:05.000Z')

    expect(first.completedActions).toBe(0)
    expect(first.save.idle.activeActivity?.remainderSeconds).toBe(3)
    expect(second.completedActions).toBe(1)
    expect(second.save.idle.activeActivity?.remainderSeconds).toBe(1)
  })

  it('grants 5 general XP when the Skill gains a level', () => {
    const started = startIdleActivity(createSave(), miningActivity, '2026-09-09T12:00:00.000Z')
    const result = processIdleProgress(started, miningActivity, '2026-09-09T12:00:20.000Z')

    expect(result.gainedSkillLevels).toBe(1)
    expect(result.save.skills.mining.level).toBe(2)
    expect(result.save.skills.mining.xp).toBe(0)
    expect(result.save.character.xp).toBe(5)
  })

  it('caps a level-1 character at four hours of offline progress', () => {
    const started = startIdleActivity(createSave(), miningActivity, '2026-09-09T00:00:00.000Z')
    const result = processIdleProgress(started, miningActivity, '2026-09-09T12:00:00.000Z')

    expect(getOfflineLimitSeconds(1)).toBe(14_400)
    expect(result.processedSeconds).toBe(14_400)
    expect(result.cappedSeconds).toBe(28_800)
    expect(result.completedActions).toBe(3_600)
    expect(result.save.idle.activeActivity?.lastProcessedAt).toBe('2026-09-09T12:00:00.000Z')
  })
})
