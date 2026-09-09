import { describe, expect, it } from 'vitest'
import { createOfflineGameSave, type CharacterClassDefinition, type GiftDefinition } from './character'
import { processCraftingProgress, startCraftingRecipe, type CraftingRecipeDefinition } from './crafting'
import { getEquipmentPrimaryValue, type EquipmentDefinition } from './equipment'

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

const treatedClochRecipe: CraftingRecipeDefinition = {
  id: 'recipe.metallurgy.treated-cloch',
  skillId: 'metallurgy',
  name: 'Cloch Tratada',
  requiredSkillLevel: 1,
  actionSeconds: 6,
  skillXpPerAction: 12,
  ingredients: [{ definitionId: 'material.cloch', quantity: 3 }],
  output: { kind: 'item', definitionId: 'material.treated-cloch', name: 'Cloch Tratada', quantity: 1 },
}

const upgradeRecipe: CraftingRecipeDefinition = {
  id: 'recipe.smithing.simple-upgrade-1',
  skillId: 'smithing',
  name: 'Reforço Simples +1',
  requiredSkillLevel: 1,
  actionSeconds: 15,
  skillXpPerAction: 30,
  ingredients: [{ definitionId: 'material.treated-cloch', quantity: 2 }],
  output: { kind: 'equipment-upgrade', name: 'Reforço Simples +1' },
}

function createSave() {
  return createOfflineGameSave({
    saveId: 'save-crafting',
    createdAt: '2026-09-09T12:00:00.000Z',
    contentVersion: '0.1.0-dev',
    characterName: 'Ailith',
    characterClass: classDefinition,
    gift: giftDefinition,
  })
}

describe('crafting', () => {
  it('consumes ingredients and produces deterministic output', () => {
    const base = createSave()
    const withMaterials = {
      ...base,
      character: {
        ...base.character,
        inventory: [{ definitionId: 'material.cloch', quantity: 6 }],
      },
    }

    const started = startCraftingRecipe(withMaterials, treatedClochRecipe, '2026-09-09T12:00:00.000Z')
    const result = processCraftingProgress(started, treatedClochRecipe, '2026-09-09T12:00:12.000Z')

    expect(result.completedActions).toBe(2)
    expect(result.producedItems).toBe(2)
    expect(result.save.character.inventory).toContainEqual({ definitionId: 'material.treated-cloch', quantity: 2 })
    expect(result.save.character.inventory).not.toContainEqual({ definitionId: 'material.cloch', quantity: 6 })
    expect(result.save.skills.metallurgy.xp).toBe(24)
  })

  it('stops production when materials run out', () => {
    const base = createSave()
    const withMaterials = {
      ...base,
      character: {
        ...base.character,
        inventory: [{ definitionId: 'material.cloch', quantity: 3 }],
      },
    }

    const started = startCraftingRecipe(withMaterials, treatedClochRecipe, '2026-09-09T12:00:00.000Z')
    const result = processCraftingProgress(started, treatedClochRecipe, '2026-09-09T12:00:12.000Z')

    expect(result.completedActions).toBe(1)
    expect(result.stoppedForMaterials).toBe(true)
    expect(result.save.crafting.activeRecipe).toBeNull()
  })

  it('upgrades one concrete equipment instance from +0 to +1', () => {
    const base = createSave()
    const targetId = base.character.equipment.mainHand
    if (!targetId) throw new Error('Equipamento inicial ausente no teste.')

    const withMaterials = {
      ...base,
      character: {
        ...base.character,
        inventory: [{ definitionId: 'material.treated-cloch', quantity: 2 }],
      },
    }

    const started = startCraftingRecipe(withMaterials, upgradeRecipe, '2026-09-09T12:00:00.000Z', targetId)
    const result = processCraftingProgress(started, upgradeRecipe, '2026-09-09T12:00:15.000Z')

    expect(result.upgradedEquipment).toBe(1)
    expect(result.save.character.equipmentItems.find((item) => item.instanceId === targetId)?.upgradeLevel).toBe(1)
    expect(result.save.crafting.activeRecipe).toBeNull()
  })

  it('applies the provisional +15% primary-stat rule with ceiling', () => {
    const spear: EquipmentDefinition = {
      id: 'weapon.travel-spear',
      name: 'Lança de Viagem',
      slot: 'mainHand',
      primaryStat: { kind: 'attack', value: 13 },
    }

    expect(getEquipmentPrimaryValue(spear, 0)).toBe(13)
    expect(getEquipmentPrimaryValue(spear, 1)).toBe(15)
  })
})
