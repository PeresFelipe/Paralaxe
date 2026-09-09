import { describe, expect, it } from 'vitest'
import { createOfflineGameSave, type CharacterClassDefinition, type GiftDefinition } from './character'
import {
  applyCombatResult,
  configureCombatConsumableSlot,
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
  attributes: { vitality: 5, mind: 5, vigor: 5, strength: 5, dexterity: 5, intelligence: 5, faith: 5 },
  startingEquipment: { mainHand: 'weapon.travel-spear', chest: 'armor.travel-protection' },
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
    weaponCombat: { damageType: 'pierce', actionIntervalSeconds: 2.1, scaling: { strength: 'B', dexterity: 'C' } },
  },
  { id: 'armor.travel-protection', name: 'Proteção de Viagem', slot: 'chest', primaryStat: { kind: 'defense', value: 12 } },
]

const abilities: CombatAbilityDefinition[] = [
  {
    id: 'ability.opening',
    name: 'Abertura',
    profile: 'aggressive',
    cooldownSeconds: 7,
    damage: { kind: 'weapon-multiplier', multiplier: 1.35, damageType: 'pierce', accuracyBonusPercentagePoints: 10 },
  },
]

const roadWolf: EnemyDefinition = {
  id: 'enemy.road-wolf', name: 'Lobo de Estrada', combatLevel: 2, maxHealth: 60, defense: 4,
  evasion: 98, accuracy: 102, power: 8, actionIntervalSeconds: 2.25, basicDamageType: 'slash',
  abilities: [{ id: 'enemy.road-wolf.pounce', name: 'Bote', cooldownSeconds: 7, initialDelaySeconds: 2.5, damageMultiplier: 1.5, telegraphSeconds: 1.2, interruptible: true }],
  xpReward: 35,
}

const buildupDummy: EnemyDefinition = {
  id: 'enemy.buildup-dummy', name: 'Dummy de Buildup', combatLevel: 1, maxHealth: 999, defense: 0,
  evasion: 95, accuracy: 200, power: 1, actionIntervalSeconds: 1, basicDamageType: 'impact',
  abilities: [{ id: 'dummy.bleed', name: 'Talho de Teste', cooldownSeconds: 1, damageMultiplier: 0.1, statusApplications: [{ status: 'bleed', buildup: 100 }] }],
  xpReward: 0,
}

const postureDummy: EnemyDefinition = {
  id: 'enemy.posture-dummy', name: 'Dummy de Postura', combatLevel: 1, maxHealth: 999, defense: 0,
  evasion: 95, accuracy: 100, power: 1, actionIntervalSeconds: 1, basicDamageType: 'impact',
  abilities: [{ id: 'dummy.guard', name: 'Firmar Posição', cooldownSeconds: 2, selfDamageTakenMultiplier: 0.65, selfEffectDurationSeconds: 3 }],
  xpReward: 0,
}

const catalog = {
  getEquipmentDefinition(definitionId: string) {
    return equipment.find((definition) => definition.id === definitionId) ?? null
  },
  getAbilityDefinition(abilityId: string) {
    return abilities.find((definition) => definition.id === abilityId) ?? null
  },
  getEnemyDefinition(enemyId: string) {
    return [roadWolf, buildupDummy, postureDummy].find((enemy) => enemy.id === enemyId) ?? null
  },
  getConsumableDefinition(definitionId: string) {
    return definitionId === 'item.consumable.field-preparation'
      ? { id: definitionId, name: 'Preparado de Campo', restore: { health: 45 } }
      : null
  },
}

function createSave() {
  return createOfflineGameSave({
    saveId: 'combat-save', createdAt: '2026-09-09T12:00:00.000Z', contentVersion: '0.1.0-dev',
    characterName: 'Ailith', characterClass, gift,
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

  it('starts a fight from persisted expedition resources instead of refilling Vida', () => {
    const result = simulateCombat(createSave(), catalog, roadWolf.id, 4242, 180, {
      health: 120, maxHealth: 160, mana: 20, maxMana: 80, stamina: 30, maxStamina: 100,
    })
    expect(result.player.maxHealth).toBe(160)
    expect(result.player.health).toBeLessThanOrEqual(120)
  })

  it('uses an automatic consumable at its threshold, spends the action and removes the item', () => {
    let save = createSave()
    save = {
      ...save,
      character: { ...save.character, inventory: [{ definitionId: 'item.consumable.field-preparation', quantity: 1 }] },
    }
    save = configureCombatConsumableSlot(save, 0, 'item.consumable.field-preparation', 'health', 90, '2026-09-09T12:00:01.000Z')

    const result = simulateCombat(save, catalog, roadWolf.id, 99, 180, {
      health: 60, maxHealth: 160, mana: 80, maxMana: 80, stamina: 100, maxStamina: 100,
    })
    const consumableEntry = result.log.find((entry) => entry.kind === 'consumable')
    const firstAttack = result.log.find((entry) => entry.actor === 'player' && (entry.kind === 'basic' || entry.kind === 'ability'))

    expect(result.consumedItems).toEqual([{ definitionId: 'item.consumable.field-preparation', quantity: 1 }])
    expect(consumableEntry).toBeDefined()
    expect(firstAttack && consumableEntry ? firstAttack.atSeconds > consumableEntry.atSeconds : false).toBe(true)

    const persisted = applyCombatResult(save, roadWolf.id, result, '2026-09-09T12:01:00.000Z')
    expect(persisted.character.inventory).toEqual([])
  })

  it('procs buildup and exposes defensive posture events in the deterministic log', () => {
    const bleed = simulateCombat(createSave(), catalog, buildupDummy.id, 1, 3)
    const posture = simulateCombat(createSave(), catalog, postureDummy.id, 2, 3)

    expect(bleed.log.some((entry) => entry.kind === 'status' && entry.message.includes('Sangramento'))).toBe(true)
    expect(posture.log.some((entry) => entry.kind === 'posture' && entry.message.includes('Firmar Posição'))).toBe(true)
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
