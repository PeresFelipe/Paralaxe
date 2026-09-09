import type { NpcMarketListing } from '@greywake/domain'

export const INITIAL_NPC_MARKET_LISTINGS = [
  {
    id: 'market.field-preparation',
    name: 'Preparado de Campo',
    price: 15,
    product: {
      kind: 'item',
      definitionId: 'item.consumable.field-preparation',
      quantity: 1,
    },
  },
  {
    id: 'market.simple-gloves',
    name: 'Luvas Simples',
    price: 20,
    product: {
      kind: 'equipment',
      definitionId: 'armor.simple-gloves',
      slot: 'gloves',
    },
  },
  {
    id: 'market.simple-boots',
    name: 'Botas Simples',
    price: 20,
    product: {
      kind: 'equipment',
      definitionId: 'armor.simple-boots',
      slot: 'boots',
    },
  },
] as const satisfies readonly NpcMarketListing[]

export function getNpcMarketListing(listingId: string): NpcMarketListing | null {
  return INITIAL_NPC_MARKET_LISTINGS.find((listing) => listing.id === listingId) ?? null
}
