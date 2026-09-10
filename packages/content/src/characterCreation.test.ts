import { describe, expect, it } from 'vitest'
import { createOfflineGameSave, derivePlayerCombatStats } from '@greywake/domain'
import { CHARACTER_CLASSES, INITIAL_GIFTS } from './characterCreation'
import { getEquipmentDefinition } from './equipment'

describe('presentes iniciais da Build 0.1', () => {
  it('cria e equipa o Anel do Viajante com seus bônus aprovados', () => {
    const characterClass = CHARACTER_CLASSES.find((entry) => entry.id === 'wanderer')
    const gift = INITIAL_GIFTS.find((entry) => entry.id === 'traveller-ring')
    if (!characterClass || !gift) throw new Error('Conteúdo de teste ausente.')

    const save = createOfflineGameSave({
      saveId: 'ring-content-test',
      createdAt: '2026-09-10T12:00:00.000Z',
      contentVersion: '0.1.0-dev',
      characterName: 'Ailith',
      characterClass,
      gift,
    })
    const ringId = save.character.equipment.ring1
    const ring = save.character.equipmentItems.find((item) => item.instanceId === ringId)
    const stats = derivePlayerCombatStats(save, { getEquipmentDefinition })

    expect(ring?.definitionId).toBe('item.equipment.traveller-ring')
    expect(save.character.inventory.some((stack) => stack.definitionId === 'item.equipment.traveller-ring')).toBe(false)
    expect(stats.maxHealth).toBe(168)
    expect(stats.maxMana).toBe(85)
    expect(stats.maxStamina).toBe(108)
  })
})
