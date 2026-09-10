import { describe, expect, it } from 'vitest'
import { createOfflineGameSave } from './character'
import { allocateAttributePoints, grantGeneralXp } from './progression'

const characterClass = {
  id: 'wanderer' as const,
  name: 'Errante',
  summary: 'Teste',
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

const gift = {
  id: 'none' as const,
  name: 'Nenhum Presente',
  summary: 'Teste',
  grants: [],
}

function createSave() {
  return createOfflineGameSave({
    saveId: 'progression-test',
    createdAt: '2026-09-09T12:00:00.000Z',
    contentVersion: '0.1.0-dev',
    characterName: 'Teste',
    characterClass,
    gift,
  })
}

describe('progressão geral da Build 0.1', () => {
  it('sobe para o nível 2 aos 100 XP e concede um ponto', () => {
    const save = grantGeneralXp(createSave(), 100, '2026-09-09T12:01:00.000Z')
    expect(save.character.xp).toBe(100)
    expect(save.character.level).toBe(2)
    expect(save.character.unspentAttributePoints).toBe(1)
  })

  it('usa XP total acumulado para atravessar múltiplos níveis', () => {
    const save = grantGeneralXp(createSave(), 475, '2026-09-09T12:01:00.000Z')
    expect(save.character.level).toBe(4)
    expect(save.character.unspentAttributePoints).toBe(3)
  })

  it('não reduz nível de saves já avançados', () => {
    const base = createSave()
    const advanced = {
      ...base,
      character: { ...base.character, level: 5, xp: 10, unspentAttributePoints: 4 },
    }
    const save = grantGeneralXp(advanced, 5, '2026-09-09T12:01:00.000Z')
    expect(save.character.level).toBe(5)
    expect(save.character.unspentAttributePoints).toBe(4)
  })

  it('confirma uma distribuição de atributos e consome apenas os pontos usados', () => {
    const leveled = grantGeneralXp(createSave(), 475, '2026-09-09T12:01:00.000Z')
    const save = allocateAttributePoints(
      leveled,
      { vitality: 1, strength: 1 },
      '2026-09-09T12:02:00.000Z',
    )

    expect(save.character.attributes.vitality).toBe(6)
    expect(save.character.attributes.strength).toBe(6)
    expect(save.character.unspentAttributePoints).toBe(1)
  })

  it('rejeita uma distribuição acima dos pontos disponíveis', () => {
    const leveled = grantGeneralXp(createSave(), 100, '2026-09-09T12:01:00.000Z')
    expect(() => allocateAttributePoints(
      leveled,
      { vitality: 2 },
      '2026-09-09T12:02:00.000Z',
    )).toThrow('excede os pontos')
  })
})
