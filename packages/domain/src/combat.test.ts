import { describe, expect, it } from 'vitest'
import { createOfflineGameSave, type CharacterClassDefinition, type GiftDefinition } from './character'
import {
  applyCombatResult,
  derivePlayerCombatStats,
  simulateCombat,
  type CombatAbilityDefinition,
  type EnemyDefinition,
} from './combat'
import type { EquipmentDefinition } from './equipment'

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
  startingEquipment: {
    mainHand: 'weapon.travel-spear',
    chest: 'armor.travel-protection',
  },
  startingAbilityId: 'ability.opening',
}

const gift: GiftDefinition = {
  id: 'none',
  name: 'Nenhum Presente',
  summary: 'Sem vantagem.',
  grants: [],
}

const equipment: EquipmentDefinition[] = [
  {
    id: 'weapon.travel-spear',
    name: 'Lança de Viagem',
    slot: 'mainHand',
    primaryStat: { kind: 'attack', value: 13 },
    weaponCombat: {
      damageType: 'pierce',
      actionIntervalSeconds: 2.1,
      scaling: { strength: 'B', dexterity: 'C' },
    },
  },
  {
    id: 'armor.travel-protection',
    name: 'Proteção de Viagem',
    slot: 'chest',
    primaryStat: { kind: 'defense', value: 12 },
  },
]

const abilities: CombatAbilityDefinition[] = [
  {
    id: 'ability.opening',
    name: 'Abertura',
    profile: 'aggressive',
    cooldownSeconds: 7,
    damage: {
      kind: 'weapon-multiplier',
      multiplier: 1.35,
      damageType: 'pierce',
      accuracyBonusPercentagePoints: 10,
    },
  },
]

const roadWolf: EnemyDefinition = {
  id: 'enemy.road-wolf',
  name: 'Lobo de Estrada',
  combatLevel: 2,
  maxHealth: 60,
  defense: 4,
  evasion: 98,
  accuracy: 102,
  power: 8,
  actionIntervalSeconds: 2.25,
  basicDamageType: 'slash',
  abilities: [
    {
      id: 'enemy.road-wolf.pounce',
      name: 'Bote',
      cooldownSeconds: 7,
      initialDelaySeconds: 2.5,
      damageMultiplier: 1.5,
      telegraphSeconds: 1.2,
      interruptible: true,
    },
  ],
  xpReward: 35,
}

const catalog = {
  getEquipmentDefinition(definitionId: string) {
    return equipment.find((definition) => definition.id === definitionId) ?? null
  },
  getAbilityDefinition(abilityId: string) {
    return abilities.find((definition) => definition.id === abilityId) ?? null
  },
  getEnemyDefinition(enemyId: string) {
    return enemyId === roadWolf.id ? roadWolf : null
  },
}

function createSave() {
  return createOfflineGameSave({
    saveId: 'combat-save',
    createdAt: '2026-09-09T12:00:00.000Z',
    contentVersion: '0.1.0-dev',
    characterName: 'Ailith',
    characterClass,
    gift,
  })
}

describe('combat engine', () => {
  it('derives the provisional Build 0.1 resources from attributes and equipment', () => {
    const stats = derivePlayerCombatStats(createSave(), catalog)

    expect(stats.maxHealth).toBe(160)
    expect(stats.maxMana).toBe(80)
    expect(stats.maxStamina).toBe(100)
    expect(stats.defense).toBe(12)
    expect(stats.accuracy).toBe(110)
  })

  it('replays identically with the same seed and starting state', () => {
    const first = simulateCombat(createSave(), catalog, roadWolf.id, 123456)
    const second = simulateCombat(createSave(), catalog, roadWolf.id, 123456)

    expect(second).toEqual(first)
    expect(first.log.some((entry) => entry.kind === 'telegraph' && entry.message.includes('Bote'))).toBe(true)
  })

  it('resolves the first fight and grants the wolf XP only on victory', () => {
    const save = createSave()
    const result = simulateCombat(save, catalog, roadWolf.id, 42)

    expect(result.outcome).toBe('victory')
    expect(result.xpGranted).toBe(35)

    const persisted = applyCombatResult(save, roadWolf.id, result, '2026-09-09T12:01:00.000Z')
    expect(persisted.character.xp).toBe(35)
    expect(persisted.combat.wolfDefeated).toBe(true)
    expect(persisted.combat.lastRun?.seed).toBe(42)
  })
})
