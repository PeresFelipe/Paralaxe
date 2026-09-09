import { describe, expect, it } from 'vitest'
import {
  createOfflineGameSave,
  type CharacterClassDefinition,
  type GiftDefinition,
} from './character'

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
  startingEquipment: {
    mainHand: 'weapon.travel-spear',
    chest: 'armor.travel-protection',
  },
  startingAbilityId: 'ability.opening',
}

const giftDefinition: GiftDefinition = {
  id: 'coin-pouch',
  name: 'Bolsa de Moedas',
  summary: 'Vantagem econômica inicial.',
  grants: [{ kind: 'gold', amount: 60 }],
}

describe('character creation', () => {
  it('creates a versioned offline save with the selected class and gift', () => {
    const save = createOfflineGameSave({
      saveId: 'save-1',
      createdAt: '2026-09-09T12:00:00.000Z',
      contentVersion: '0.1.0-dev',
      characterName: '  Ailith  ',
      characterClass: classDefinition,
      gift: giftDefinition,
    })

    expect(save.saveMode).toBe('OFFLINE')
    expect(save.saveSchemaVersion).toBe(6)
    expect(save.character.name).toBe('Ailith')
    expect(save.character.classId).toBe('wanderer')
    expect(save.character.giftId).toBe('coin-pouch')
    expect(save.character.gold).toBe(60)
    expect(save.character.level).toBe(1)
    expect(save.character.activeAbilitySlots).toEqual(['ability.opening', null, null, null])
    expect(save.character.currentLocationId).toBe('free-city.tavern')
    expect(save.skills.mining).toEqual({ level: 1, xp: 0, prestige: 0 })
    expect(save.idle.activeActivity).toBeNull()
    expect(save.crafting.activeRecipe).toBeNull()
    expect(save.character.equipmentItems).toHaveLength(2)

    const mainHandInstanceId = save.character.equipment.mainHand
    const mainHand = save.character.equipmentItems.find(
      (item) => item.instanceId === mainHandInstanceId,
    )
    expect(mainHand?.definitionId).toBe('weapon.travel-spear')

    expect(save.combat.preferences).toEqual({
      style: 'mixed',
      defensiveHealthThresholdPercent: 60,
      consumableSlots: [
        { definitionId: null, autoUseResource: null, autoUseThresholdPercent: null },
        { definitionId: null, autoUseResource: null, autoUseThresholdPercent: null },
      ],
    })
    expect(save.combat.wolfDefeated).toBe(false)
    expect(save.dungeon.activeRun).toBeNull()
    expect(save.dungeon.dunLiathEasyCleared).toBe(false)
    expect(save.dungeon.contractAccepted).toBe(false)
  })

  it('rejects a blank character name', () => {
    expect(() =>
      createOfflineGameSave({
        saveId: 'save-1',
        createdAt: '2026-09-09T12:00:00.000Z',
        contentVersion: '0.1.0-dev',
        characterName: '   ',
        characterClass: classDefinition,
        gift: giftDefinition,
      }),
    ).toThrow('O personagem precisa possuir um nome.')
  })

  it('protects the 35-point class budget', () => {
    const invalidClass: CharacterClassDefinition = {
      ...classDefinition,
      attributes: {
        ...classDefinition.attributes,
        vitality: 6,
      },
    }

    expect(() =>
      createOfflineGameSave({
        saveId: 'save-1',
        createdAt: '2026-09-09T12:00:00.000Z',
        contentVersion: '0.1.0-dev',
        characterName: 'Ailith',
        characterClass: invalidClass,
        gift: giftDefinition,
      }),
    ).toThrow('precisa iniciar com exatamente 35 pontos')
  })
})
