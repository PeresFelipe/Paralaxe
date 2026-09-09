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

type RouteDiagnostic = {
  complete: boolean
  stage: string
  health: number
  fieldPreparations: number
}

function itemQuantity(save: OfflineGameSave, definitionId: string) {
  return save.character.inventory.find((item) => item.definitionId === definitionId)?.quantity ?? 0
}

function addItem(save: OfflineGameSave, definitionId: string, quantity: number) {
  const existing = save.character.inventory.find((item) => item.definitionId === definitionId)
  const inventory = existing
    ? save.character.inventory.map((item) =>
        item.definitionId === definitionId ? { ...item, quantity: item.quantity + quantity } : item,
      )
    : [...save.character.inventory, { definitionId, quantity }]
  return { ...save, character: { ...save.character, inventory } }
}

function addAndEquip(save: OfflineGameSave, definitionId: string, slot: 'gloves' | 'boots') {
  const instanceId = `eq-${save.character.nextEquipmentSequence}`
  return {
    ...save,
    character: {
      ...save.character,
      equipmentItems: [
        ...save.character.equipmentItems,
        { instanceId, definitionId, upgradeLevel: 0 as const },
      ],
      nextEquipmentSequence: save.character.nextEquipmentSequence + 1,
      equipment: { ...save.character.equipment, [slot]: instanceId },
    },
  }
}

function prepareRoute(save: OfflineGameSave, route: RouteId) {
  const mageUsesFirstPoint = save.character.classId === 'mage'
  // Estado previsto após a coleta, primeira produção, Lobo e Serviço — Estrada Baixa.
  // O Mago usa o primeiro ponto em Vitalidade; as demais classes ainda passam sem gastar o ponto.
  let prepared: OfflineGameSave = {
    ...save,
    character: {
      ...save.character,
      level: 2,
      xp: 100,
      unspentAttributePoints: mageUsesFirstPoint ? 0 : 1,
      attributes: mageUsesFirstPoint
        ? { ...save.character.attributes, vitality: save.character.attributes.vitality + 1 }
        : save.character.attributes,
      gold: save.character.gold + 40,
    },
  }

  prepared = teachAndEquipCombatAbilities(
    prepared,
    getPreDungeonAbilityLoadout(prepared.character.classId),
    '2026-09-09T12:00:59.000Z',
  )

  // O Mercado vende Luvas Simples e Botas Simples por 20 moedas cada.
  // Lenhador já converge para Braçadeiras de Giúis, então compra apenas as botas.
  prepared = addAndEquip(prepared, 'armor.simple-boots', 'boots')
  prepared = {
    ...prepared,
    character: { ...prepared.character, gold: prepared.character.gold - 20 },
  }
  if (route !== 'woodcutting') {
    prepared = addAndEquip(prepared, 'armor.simple-gloves', 'gloves')
    prepared = {
      ...prepared,
      character: { ...prepared.character, gold: prepared.character.gold - 20 },
    }
  }

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
    prepared = addAndEquip(prepared, 'armor.giuis-bracers', 'gloves')
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

function diagnostic(save: OfflineGameSave, stage: string, health: number): RouteDiagnostic {
  return {
    complete: false,
    stage,
    health: Math.round(health),
    fieldPreparations: itemQuantity(save, 'item.consumable.field-preparation'),
  }
}

function runReferenceRoute(save: OfflineGameSave, seedBase: number): RouteDiagnostic {
  let current = save
  let resources = fullResources(current)

  const crubach = fight(current, 'enemy.crubach', seedBase, resources)
  if (crubach.result.outcome !== 'victory') return diagnostic(crubach.save, 'Crúbach', crubach.result.player.health)
  current = crubach.save
  resources = crubach.result.player

  const tromghiallach = fight(current, 'enemy.tromghiallach', seedBase + 1, resources)
  if (tromghiallach.result.outcome !== 'victory') {
    return diagnostic(tromghiallach.save, 'Tromghiallach', tromghiallach.result.player.health)
  }
  current = tromghiallach.save
  resources = tromghiallach.result.player

  current = equipGuaranteedHelmet(current)
  const guardian = fight(current, 'enemy.cosantoir', seedBase + 10, resources)
  if (guardian.result.outcome !== 'victory') {
    return diagnostic(guardian.save, 'Cosantóir', guardian.result.player.health)
  }
  current = guardian.save

  current = addItem(current, 'item.consumable.field-preparation', 3)
  resources = fullResources(current)

  const phase1 = fight(current, 'enemy.fairtheoir-phase1', seedBase + 20, resources)
  if (phase1.result.outcome !== 'victory') {
    return diagnostic(phase1.save, 'Fairtheoir Fase 1', phase1.result.player.health)
  }

  const phase2 = fight(phase1.save, 'enemy.fairtheoir-phase2', seedBase + 21, phase1.result.player)
  if (phase2.result.outcome !== 'victory') {
    return diagnostic(phase2.save, 'Fairtheoir Fase 2', phase2.result.player.health)
  }

  return {
    complete: true,
    stage: 'clear',
    health: Math.round(phase2.result.player.health),
    fieldPreparations: itemQuantity(phase2.save, 'item.consumable.field-preparation'),
  }
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
        const attempts = Array.from({ length: 8 }, (_, attempt) =>
          runReferenceRoute(prepared, baseSeed + attempt * 10_000),
        )

        expect(
          attempts.some((attempt) => attempt.complete),
          `Falhas: ${JSON.stringify(attempts)}`,
        ).toBe(true)
      })
    }
  }
})
