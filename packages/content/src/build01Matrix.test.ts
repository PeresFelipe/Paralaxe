import { describe, expect, it } from 'vitest'
import {
  acceptDunLiathContract,
  applyCombatResult,
  configureCombatConsumableSlot,
  createOfflineGameSave,
  derivePlayerCombatStats,
  simulateCombat,
  teachAndEquipCombatAbilities,
  type CombatResources,
  type OfflineGameSave,
} from '@greywake/domain'
import { CHARACTER_CLASSES, INITIAL_GIFTS } from './characterCreation'
import {
  getCombatAbilityDefinition,
  getCombatConsumableDefinition,
  getEnemyDefinition,
  getPreDungeonAbilityLoadout,
} from './combat'
import { getEquipmentDefinition } from './equipment'

const catalog = {
  getEquipmentDefinition,
  getAbilityDefinition: getCombatAbilityDefinition,
  getEnemyDefinition,
  getConsumableDefinition: getCombatConsumableDefinition,
}

const routes = ['mining', 'woodcutting', 'fishing', 'herbology'] as const
type RouteId = (typeof routes)[number]

function addItem(save: OfflineGameSave, definitionId: string, quantity: number) {
  const existing = save.character.inventory.find((item) => item.definitionId === definitionId)
  const inventory = existing
    ? save.character.inventory.map((item) =>
        item.definitionId === definitionId ? { ...item, quantity: item.quantity + quantity } : item,
      )
    : [...save.character.inventory, { definitionId, quantity }]
  return { ...save, character: { ...save.character, inventory } }
}

function prepareRoute(save: OfflineGameSave, route: RouteId) {
  let prepared = teachAndEquipCombatAbilities(
    save,
    getPreDungeonAbilityLoadout(save.character.classId),
    '2026-09-09T12:00:59.000Z',
  )
  prepared = acceptDunLiathContract(prepared, '2026-09-09T12:01:00.000Z')

  if (route === 'mining') {
    const mainHandId = prepared.character.equipment.mainHand
    prepared = {
      ...prepared,
      character: {
        ...prepared.character,
        equipmentItems: prepared.character.equipmentItems.map((item) =>
          item.instanceId === mainHandId ? { ...item, upgradeLevel: 1 as const } : item,
        ),
      },
    }
  }

  if (route === 'woodcutting') {
    const instanceId = `eq-${prepared.character.nextEquipmentSequence}`
    prepared = {
      ...prepared,
      character: {
        ...prepared.character,
        equipmentItems: [
          ...prepared.character.equipmentItems,
          { instanceId, definitionId: 'armor.giuis-bracers', upgradeLevel: 0 as const },
        ],
        nextEquipmentSequence: prepared.character.nextEquipmentSequence + 1,
        equipment: { ...prepared.character.equipment, gloves: instanceId },
      },
    }
  }

  if (route === 'fishing') {
    prepared = addItem(prepared, 'item.food.roasted-scadan', 6)
    prepared = configureCombatConsumableSlot(
      prepared,
      0,
      'item.food.roasted-scadan',
      'health',
      70,
      '2026-09-09T12:01:01.000Z',
    )
  }

  if (route === 'herbology') {
    prepared = addItem(prepared, 'item.consumable.neantog-preparation', 6)
    prepared = configureCombatConsumableSlot(
      prepared,
      0,
      'item.consumable.neantog-preparation',
      'health',
      70,
      '2026-09-09T12:01:01.000Z',
    )
  }

  return configureCombatConsumableSlot(
    prepared,
    1,
    'item.consumable.field-preparation',
    'health',
    70,
    '2026-09-09T12:01:02.000Z',
  )
}

function fullResources(save: OfflineGameSave): CombatResources {
  const stats = derivePlayerCombatStats(save, catalog)
  return {
    health: stats.maxHealth,
    maxHealth: stats.maxHealth,
    mana: stats.maxMana,
    maxMana: stats.maxMana,
    stamina: stats.maxStamina,
    maxStamina: stats.maxStamina,
  }
}

function fight(save: OfflineGameSave, enemyId: string, seed: number, resources: CombatResources) {
  const result = simulateCombat(save, catalog, enemyId, seed, 180, resources)
  return {
    result,
    save: applyCombatResult(save, enemyId, result, '2026-09-09T12:30:00.000Z'),
  }
}

function equipGuaranteedHelmet(save: OfflineGameSave) {
  const instanceId = `eq-${save.character.nextEquipmentSequence}`
  return {
    ...save,
    character: {
      ...save.character,
      equipmentItems: [
        ...save.character.equipmentItems,
        { instanceId, definitionId: 'armor.garrison-helmet', upgradeLevel: 0 as const },
      ],
      nextEquipmentSequence: save.character.nextEquipmentSequence + 1,
      equipment: { ...save.character.equipment, head: instanceId },
    },
  }
}

function completesReferenceRoute(save: OfflineGameSave, seedBase: number) {
  let current = save
  let resources = fullResources(current)

  for (const [offset, enemyId] of ['enemy.crubach', 'enemy.tromghiallach'].entries()) {
    const encounter = fight(current, enemyId, seedBase + offset, resources)
    if (encounter.result.outcome !== 'victory') return false
    current = encounter.save
    resources = encounter.result.player
  }

  current = equipGuaranteedHelmet(current)
  const guardian = fight(current, 'enemy.cosantoir', seedBase + 10, resources)
  if (guardian.result.outcome !== 'victory') return false
  current = guardian.save

  // Sala de recuperação: recursos cheios + 3 Preparados de Campo.
  current = addItem(current, 'item.consumable.field-preparation', 3)
  resources = fullResources(current)

  const phase1 = fight(current, 'enemy.fairtheoir-phase1', seedBase + 20, resources)
  if (phase1.result.outcome !== 'victory') return false

  const phase2 = fight(phase1.save, 'enemy.fairtheoir-phase2', seedBase + 21, phase1.result.player)
  return phase2.result.outcome === 'victory'
}

describe('Build 0.1 — matriz 6 classes × 4 rotas', () => {
  const noGift = INITIAL_GIFTS.find((gift) => gift.id === 'none')
  if (!noGift) throw new Error('Presente Nenhum não encontrado.')

  for (const [classIndex, characterClass] of CHARACTER_CLASSES.entries()) {
    for (const [routeIndex, route] of routes.entries()) {
      it(`${characterClass.name} × ${route} é estruturalmente completável`, () => {
        const base = createOfflineGameSave({
          saveId: `matrix-${characterClass.id}-${route}`,
          createdAt: '2026-09-09T12:00:00.000Z',
          contentVersion: '0.1.0-dev',
          characterName: `${characterClass.name}-${route}`,
          characterClass,
          gift: noGift,
        })
        const prepared = prepareRoute(base, route)
        const baseSeed = 1000 + classIndex * 100 + routeIndex * 10

        const canComplete = Array.from({ length: 8 }, (_, attempt) =>
          completesReferenceRoute(prepared, baseSeed + attempt * 10_000),
        ).some(Boolean)

        expect(canComplete).toBe(true)
      })
    }
  }
})
