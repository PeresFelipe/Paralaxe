import { describe, expect, it } from 'vitest'
import {
  acceptDunLiathContract,
  applyCombatResult,
  configureCombatConsumableSlot,
  createOfflineGameSave,
  derivePlayerCombatStats,
  simulateCombat,
  type CombatResources,
  type OfflineGameSave,
} from '@greywake/domain'
import { CHARACTER_CLASSES, INITIAL_GIFTS } from './characterCreation'
import { getCombatAbilityDefinition, getCombatConsumableDefinition, getEnemyDefinition } from './combat'
import { getEquipmentDefinition } from './equipment'

const catalog = {
  getEquipmentDefinition,
  getAbilityDefinition: getCombatAbilityDefinition,
  getEnemyDefinition,
  getConsumableDefinition: getCombatConsumableDefinition,
}

const routes = ['mining', 'woodcutting', 'fishing', 'herbology'] as const
type RouteId = (typeof routes)[number]

type MatrixResult = {
  outcome: 'victory' | 'defeat' | 'timeout'
  stage: string
}

function addItem(save: OfflineGameSave, definitionId: string, quantity: number): OfflineGameSave {
  const current = save.character.inventory.find((stack) => stack.definitionId === definitionId)
  const inventory = current
    ? save.character.inventory.map((stack) =>
        stack.definitionId === definitionId ? { ...stack, quantity: stack.quantity + quantity } : stack,
      )
    : [...save.character.inventory, { definitionId, quantity }]
  return { ...save, character: { ...save.character, inventory } }
}

function prepareRoute(save: OfflineGameSave, route: RouteId): OfflineGameSave {
  let prepared = acceptDunLiathContract(save, '2026-09-09T12:01:00.000Z')

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
    prepared = configureCombatConsumableSlot(prepared, 0, 'item.food.roasted-scadan', 'health', 70, '2026-09-09T12:01:01.000Z')
  }

  if (route === 'herbology') {
    prepared = addItem(prepared, 'item.consumable.neantog-preparation', 6)
    prepared = configureCombatConsumableSlot(prepared, 0, 'item.consumable.neantog-preparation', 'health', 70, '2026-09-09T12:01:01.000Z')
  }

  return configureCombatConsumableSlot(prepared, 1, 'item.consumable.field-preparation', 'health', 40, '2026-09-09T12:01:02.000Z')
}

function equipGuaranteedHelmet(save: OfflineGameSave): OfflineGameSave {
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
  const persisted = applyCombatResult(
    save,
    enemyId,
    result,
    `2026-09-09T12:${String(seed % 60).padStart(2, '0')}:00.000Z`,
  )
  return { save: persisted, result }
}

function runConservativeDungeon(save: OfflineGameSave, seedBase: number): MatrixResult {
  let currentSave = save
  let resources = fullResources(currentSave)
  const encounters = [
    ['Crúbach 1', 'enemy.crubach'],
    ['Crúbach 2', 'enemy.crubach'],
    ['Tromghiallach', 'enemy.tromghiallach'],
  ] as const

  for (const [index, [stage, enemyId]] of encounters.entries()) {
    const encounter = fight(currentSave, enemyId, seedBase + index, resources)
    if (encounter.result.outcome !== 'victory') return { outcome: encounter.result.outcome, stage }
    currentSave = encounter.save
    resources = encounter.result.player
  }

  currentSave = equipGuaranteedHelmet(currentSave)
  const guardian = fight(currentSave, 'enemy.cosantoir', seedBase + 10, resources)
  if (guardian.result.outcome !== 'victory') return { outcome: guardian.result.outcome, stage: 'Cosantóir' }
  currentSave = guardian.save

  resources = fullResources(currentSave)
  const phase1 = fight(currentSave, 'enemy.fairtheoir-phase1', seedBase + 20, resources)
  if (phase1.result.outcome !== 'victory') return { outcome: phase1.result.outcome, stage: 'Fairtheoir Fase 1' }
  currentSave = phase1.save

  const phase2 = fight(currentSave, 'enemy.fairtheoir-phase2', seedBase + 21, phase1.result.player)
  return {
    outcome: phase2.result.outcome,
    stage: phase2.result.outcome === 'victory' ? 'clear' : 'Fairtheoir Fase 2',
  }
}

describe('Build 0.1 — matriz 6 classes × 4 rotas', () => {
  const noGift = INITIAL_GIFTS.find((gift) => gift.id === 'none')
  if (!noGift) throw new Error('Presente Nenhum não encontrado.')

  for (const [classIndex, characterClass] of CHARACTER_CLASSES.entries()) {
    for (const [routeIndex, route] of routes.entries()) {
      it(`${characterClass.name} × ${route} completa a rota conservadora`, () => {
        const base = createOfflineGameSave({
          saveId: `matrix-${characterClass.id}-${route}`,
          createdAt: '2026-09-09T12:00:00.000Z',
          contentVersion: '0.1.0-dev',
          characterName: `${characterClass.name}-${route}`,
          characterClass,
          gift: noGift,
        })
        const prepared = prepareRoute(base, route)
        const result = runConservativeDungeon(prepared, 1000 + classIndex * 100 + routeIndex * 10)
        expect(result).toEqual({ outcome: 'victory', stage: 'clear' })
      })
    }
  }
})
