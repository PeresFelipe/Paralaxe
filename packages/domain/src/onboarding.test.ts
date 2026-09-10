import { describe, expect, it } from 'vitest'
import { createOfflineGameSave, type CharacterClassDefinition, type GiftDefinition } from './character'
import type { CombatResult } from './combat'
import { applyRoadServiceCombatResult } from './onboarding'

const characterClass: CharacterClassDefinition = {
  id: 'wanderer', name: 'Errante', summary: 'Teste',
  attributes: { vitality: 5, mind: 5, vigor: 5, strength: 5, dexterity: 5, intelligence: 5, faith: 5 },
  startingEquipment: { mainHand: 'weapon.travel-spear' },
  startingAbilityId: 'ability.opening',
}
const gift: GiftDefinition = { id: 'none', name: 'Nenhum', summary: 'Teste', grants: [] }
const victory: CombatResult = {
  outcome: 'victory', durationSeconds: 10, enemyHealth: 0, xpGranted: 35, consumedItems: [], log: [], seed: 10,
  player: { health: 100, maxHealth: 160, mana: 80, maxMana: 80, stamina: 80, maxStamina: 100 },
}

function createSave() {
  return createOfflineGameSave({
    saveId: 'service-test', createdAt: '2026-09-10T12:00:00.000Z', contentVersion: '0.1.0-dev',
    characterName: 'Ailith', characterClass, gift,
  })
}

describe('Serviço — Estrada Baixa', () => {
  it('grants the service reward only on the first victory', () => {
    const first = applyRoadServiceCombatResult(createSave(), victory, '2026-09-10T12:01:00.000Z')
    expect(first.character.xp).toBe(60)
    expect(first.character.gold).toBe(40)
    expect(first.combat.wolfDefeated).toBe(true)

    const repeat = applyRoadServiceCombatResult(first, victory, '2026-09-10T12:02:00.000Z')
    expect(repeat.character.xp).toBe(95)
    expect(repeat.character.gold).toBe(40)
  })
})
