import { describe, expect, it } from 'vitest'
import { createOfflineGameSave, type CharacterClassDefinition, type GiftDefinition } from './character'
import {
  BUILD_01_BANK_SLOT_LIMIT,
  BUILD_01_INVENTORY_SLOT_LIMIT,
  depositEquipmentToBank,
  depositInventoryStackToBank,
  getBankSlotUsage,
  getInventorySlotUsage,
  withdrawEquipmentFromBank,
  withdrawInventoryStackFromBank,
} from './storage'

const characterClass: CharacterClassDefinition = {
  id: 'wanderer',
  name: 'Errante',
  summary: 'Equilibrado.',
  attributes: { vitality: 5, mind: 5, vigor: 5, strength: 5, dexterity: 5, intelligence: 5, faith: 5 },
  startingEquipment: {
    mainHand: 'weapon.travel-spear',
    chest: 'armor.travel-protection',
  },
  startingAbilityId: 'ability.opening',
}

const gift: GiftDefinition = {
  id: 'survival-kit',
  name: 'Kit de Sobrevivência',
  summary: 'Itens de teste.',
  grants: [
    { kind: 'item', definitionId: 'item.consumable.field-preparation', quantity: 2 },
    { kind: 'item', definitionId: 'item.food.roasted-scadan', quantity: 2 },
  ],
}

function createSave() {
  return createOfflineGameSave({
    saveId: 'bank-test',
    createdAt: '2026-09-10T10:00:00.000Z',
    contentVersion: '0.1.0-dev',
    characterName: 'Ailith',
    characterClass,
    gift,
  })
}

describe('Build 0.1 bank', () => {
  it('starts empty and uses the approved 24/80 slot limits', () => {
    const save = createSave()
    expect(BUILD_01_INVENTORY_SLOT_LIMIT).toBe(24)
    expect(BUILD_01_BANK_SLOT_LIMIT).toBe(80)
    expect(save.character.bank).toEqual({ inventory: [], equipmentItems: [] })
    expect(getInventorySlotUsage(save)).toBe(2)
    expect(getBankSlotUsage(save)).toBe(0)
  })

  it('deposits and withdraws stack quantities without charging currency', () => {
    const base = createSave()
    const deposited = depositInventoryStackToBank(
      base,
      'item.consumable.field-preparation',
      1,
      '2026-09-10T10:01:00.000Z',
    )
    expect(deposited.character.gold).toBe(base.character.gold)
    expect(deposited.character.inventory.find((stack) => stack.definitionId === 'item.consumable.field-preparation')?.quantity).toBe(1)
    expect(deposited.character.bank.inventory).toContainEqual({ definitionId: 'item.consumable.field-preparation', quantity: 1 })

    const withdrawn = withdrawInventoryStackFromBank(
      deposited,
      'item.consumable.field-preparation',
      1,
      '2026-09-10T10:02:00.000Z',
    )
    expect(withdrawn.character.gold).toBe(base.character.gold)
    expect(withdrawn.character.inventory.find((stack) => stack.definitionId === 'item.consumable.field-preparation')?.quantity).toBe(2)
    expect(withdrawn.character.bank.inventory).toEqual([])
  })

  it('requires equipment to be unequipped before deposit and preserves its instance on withdrawal', () => {
    const base = createSave()
    const chestId = base.character.equipment.chest
    if (!chestId) throw new Error('Peitoral inicial ausente.')
    expect(() => depositEquipmentToBank(base, chestId, '2026-09-10T10:01:00.000Z')).toThrow('Desequipe')

    const unequipped = {
      ...base,
      character: {
        ...base.character,
        equipment: { ...base.character.equipment, chest: undefined },
      },
    }
    const deposited = depositEquipmentToBank(unequipped, chestId, '2026-09-10T10:02:00.000Z')
    expect(deposited.character.equipmentItems.some((item) => item.instanceId === chestId)).toBe(false)
    expect(deposited.character.bank.equipmentItems.some((item) => item.instanceId === chestId)).toBe(true)

    const withdrawn = withdrawEquipmentFromBank(deposited, chestId, '2026-09-10T10:03:00.000Z')
    expect(withdrawn.character.bank.equipmentItems).toEqual([])
    expect(withdrawn.character.equipmentItems.some((item) => item.instanceId === chestId)).toBe(true)
  })
})
