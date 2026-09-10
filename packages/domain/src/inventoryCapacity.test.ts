import { describe, expect, it } from 'vitest'
import { createOfflineGameSave, type CharacterClassDefinition, type GiftDefinition, type OfflineGameSave } from './character'
import { processIdleProgress, startIdleActivity, type IdleActivityDefinition } from './idle'
import { processCraftingProgress, startCraftingRecipe, type CraftingRecipeDefinition } from './crafting'
import { buyNpcMarketListing } from './economy'
import { acceptDunLiathContract, createDungeonRun, extractDungeonRun, type DungeonDefinition } from './dungeon'
import { BUILD_01_CONSUMABLE_STACK_LIMIT, BUILD_01_INVENTORY_SLOT_LIMIT } from './storage'

const characterClass: CharacterClassDefinition = {
  id: 'wanderer',
  name: 'Errante',
  summary: 'Teste',
  attributes: { vitality: 5, mind: 5, vigor: 5, strength: 5, dexterity: 5, intelligence: 5, faith: 5 },
  startingEquipment: { mainHand: 'weapon.travel-spear' },
  startingAbilityId: 'ability.opening',
}
const gift: GiftDefinition = { id: 'none', name: 'Nenhum', summary: 'Teste', grants: [] }

function createSave() {
  return createOfflineGameSave({
    saveId: 'capacity-test', createdAt: '2026-09-10T12:00:00.000Z', contentVersion: '0.1.0-dev',
    characterName: 'Ailith', characterClass, gift,
  })
}

function withFullDistinctInventory(save: OfflineGameSave, first = { definitionId: 'material.cloch', quantity: 2 }) {
  const filler = Array.from({ length: BUILD_01_INVENTORY_SLOT_LIMIT - 1 }, (_, index) => ({
    definitionId: `material.filler-${index}`,
    quantity: 1,
  }))
  return { ...save, character: { ...save.character, inventory: [first, ...filler] } }
}

const mining: IdleActivityDefinition = {
  id: 'gather.mining.cloch', skillId: 'mining', name: 'Extrair Cloch', resultItemDefinitionId: 'material.cloch',
  resultName: 'Cloch', requiredSkillLevel: 1, actionSeconds: 4, skillXpPerAction: 8,
}
const treatment: CraftingRecipeDefinition = {
  id: 'recipe.test.treated-cloch', skillId: 'metallurgy', name: 'Cloch Tratada', requiredSkillLevel: 1,
  actionSeconds: 6, skillXpPerAction: 12, ingredients: [{ definitionId: 'material.cloch', quantity: 1 }],
  output: { kind: 'item', definitionId: 'material.treated-cloch', name: 'Cloch Tratada', quantity: 1 },
}
const dungeon: DungeonDefinition = {
  id: 'dungeon.capacity', name: 'Dungeon Capacidade', difficulty: 'easy', startRoomId: 'room.start',
  rooms: [{ id: 'room.start', name: 'Entrada', kind: 'entrance', nextRoomIds: [] }],
}

describe('Build 0.1 inventory capacity across acquisition flows', () => {
  it('caps gathering at the material stack limit and stops the activity explicitly', () => {
    const base = createSave()
    const stocked = {
      ...base,
      character: { ...base.character, inventory: [{ definitionId: 'material.cloch', quantity: 9_998 }] },
    }
    const started = startIdleActivity(stocked, mining, '2026-09-10T12:00:00.000Z')
    const result = processIdleProgress(started, mining, '2026-09-10T12:00:08.000Z')
    expect(result.completedActions).toBe(1)
    expect(result.save.character.inventory[0]?.quantity).toBe(9_999)
    expect(result.stoppedForCapacity).toBe(true)
    expect(result.save.idle.activeActivity).toBeNull()
  })

  it('does not consume crafting ingredients when the resulting item cannot fit', () => {
    const full = withFullDistinctInventory(createSave())
    const started = startCraftingRecipe(full, treatment, '2026-09-10T12:00:00.000Z')
    const result = processCraftingProgress(started, treatment, '2026-09-10T12:00:06.000Z')
    expect(result.completedActions).toBe(0)
    expect(result.stoppedForCapacity).toBe(true)
    expect(result.save.character.inventory.find((stack) => stack.definitionId === 'material.cloch')?.quantity).toBe(2)
    expect(result.save.character.inventory.some((stack) => stack.definitionId === 'material.treated-cloch')).toBe(false)
  })

  it('rejects market purchases that would overflow a consumable stack or equipment slot', () => {
    const base = createSave()
    const capped = {
      ...base,
      character: {
        ...base.character,
        gold: 100,
        inventory: [{ definitionId: 'item.consumable.field-preparation', quantity: BUILD_01_CONSUMABLE_STACK_LIMIT }],
      },
    }
    expect(() => buyNpcMarketListing(capped, {
      id: 'market.field-preparation', name: 'Preparado', price: 15,
      product: { kind: 'item', definitionId: 'item.consumable.field-preparation', quantity: 1 },
    }, '2026-09-10T12:01:00.000Z')).toThrow('capacidade')

    const full = { ...withFullDistinctInventory(base), character: { ...withFullDistinctInventory(base).character, gold: 100 } }
    expect(() => buyNpcMarketListing(full, {
      id: 'market.gloves', name: 'Luvas', price: 20,
      product: { kind: 'equipment', definitionId: 'armor.simple-gloves', slot: 'gloves' },
    }, '2026-09-10T12:01:00.000Z')).toThrow('slots livres')
  })

  it('requires room for contract supplies and for all Dungeon loot before extraction', () => {
    const full = withFullDistinctInventory(createSave(), { definitionId: 'material.cloch', quantity: 1 })
    expect(() => acceptDunLiathContract(full, '2026-09-10T12:01:00.000Z')).toThrow('capacidade')

    const run = {
      ...createDungeonRun(full, dungeon, 7, '2026-09-10T12:02:00.000Z'),
      safeExtractionAvailable: true,
      expeditionBag: [{ definitionId: 'item.dun-liath.beam', quantity: 1 }],
    }
    const active = { ...full, dungeon: { ...full.dungeon, activeRun: run } }
    expect(() => extractDungeonRun(active, '2026-09-10T12:03:00.000Z')).toThrow('capacidade')
    expect(active.dungeon.activeRun).not.toBeNull()
  })
})
