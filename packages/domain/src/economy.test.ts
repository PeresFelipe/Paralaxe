import { describe, expect, it } from 'vitest'
import { createOfflineGameSave } from './character'
import { buyNpcMarketListing } from './economy'

const characterClass = {
  id: 'wanderer' as const,
  name: 'Errante',
  summary: 'Teste',
  attributes: { vitality: 5, mind: 5, vigor: 5, strength: 5, dexterity: 5, intelligence: 5, faith: 5 },
  startingEquipment: { mainHand: 'weapon.travel-spear', chest: 'armor.travel-protection' },
  startingAbilityId: 'ability.opening',
}

const gift = { id: 'coin-pouch' as const, name: 'Bolsa', summary: 'Teste', grants: [{ kind: 'gold' as const, amount: 60 }] }

function createSave() {
  return createOfflineGameSave({
    saveId: 'economy-test',
    createdAt: '2026-09-09T12:00:00.000Z',
    contentVersion: '0.1.0-dev',
    characterName: 'Teste',
    characterClass,
    gift,
  })
}

describe('Mercado NPC', () => {
  it('compra equipamento como instância individual e desconta ouro', () => {
    const base = createSave()
    const save = buyNpcMarketListing(base, {
      id: 'market.simple-gloves',
      name: 'Luvas Simples',
      price: 20,
      product: { kind: 'equipment', definitionId: 'armor.simple-gloves', slot: 'gloves' },
    }, '2026-09-09T12:01:00.000Z')

    expect(save.character.gold).toBe(40)
    expect(save.character.equipmentItems.at(-1)?.definitionId).toBe('armor.simple-gloves')
    expect(save.character.nextEquipmentSequence).toBe(base.character.nextEquipmentSequence + 1)
  })

  it('rejeita compra sem moedas suficientes', () => {
    const base = { ...createSave(), character: { ...createSave().character, gold: 0 } }
    expect(() => buyNpcMarketListing(base, {
      id: 'market.simple-boots',
      name: 'Botas Simples',
      price: 20,
      product: { kind: 'equipment', definitionId: 'armor.simple-boots', slot: 'boots' },
    }, '2026-09-09T12:01:00.000Z')).toThrow('Moedas insuficientes')
  })
})
