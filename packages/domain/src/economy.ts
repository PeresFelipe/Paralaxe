import type { OfflineGameSave } from './character'
import type { EquipmentSlot } from './equipment'
import { assertInventoryCanReceiveEquipment, assertInventoryCanReceiveStack } from './storage'

export type NpcMarketProduct =
  | {
      kind: 'item'
      definitionId: string
      quantity: number
    }
  | {
      kind: 'equipment'
      definitionId: string
      slot: EquipmentSlot
    }

export interface NpcMarketListing {
  id: string
  name: string
  price: number
  product: NpcMarketProduct
}

function addInventoryItem(
  inventory: OfflineGameSave['character']['inventory'],
  definitionId: string,
  quantity: number,
) {
  const existing = inventory.find((stack) => stack.definitionId === definitionId)
  if (!existing) return [...inventory, { definitionId, quantity }]
  return inventory.map((stack) =>
    stack.definitionId === definitionId
      ? { ...stack, quantity: stack.quantity + quantity }
      : stack,
  )
}

export function buyNpcMarketListing(
  save: OfflineGameSave,
  listing: NpcMarketListing,
  now: string,
): OfflineGameSave {
  if (!Number.isInteger(listing.price) || listing.price < 0) {
    throw new Error('Preço inválido no Mercado NPC.')
  }
  if (save.character.gold < listing.price) {
    throw new Error('Moedas insuficientes para essa compra.')
  }

  if (listing.product.kind === 'item') {
    assertInventoryCanReceiveStack(save, listing.product.definitionId, listing.product.quantity)
    return {
      ...save,
      updatedAt: now,
      character: {
        ...save.character,
        gold: save.character.gold - listing.price,
        inventory: addInventoryItem(
          save.character.inventory,
          listing.product.definitionId,
          listing.product.quantity,
        ),
      },
    }
  }

  assertInventoryCanReceiveEquipment(save)
  const instanceId = `eq-${save.character.nextEquipmentSequence}`
  return {
    ...save,
    updatedAt: now,
    character: {
      ...save.character,
      gold: save.character.gold - listing.price,
      equipmentItems: [
        ...save.character.equipmentItems,
        {
          instanceId,
          definitionId: listing.product.definitionId,
          upgradeLevel: 0,
        },
      ],
      nextEquipmentSequence: save.character.nextEquipmentSequence + 1,
    },
  }
}
