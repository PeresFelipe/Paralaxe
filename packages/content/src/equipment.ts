import type { EquipmentDefinition } from '@greywake/domain'

export const EQUIPMENT_DEFINITIONS = [
  { id: 'weapon.militia-sword', name: 'Espada de Milícia', slot: 'mainHand', primaryStat: { kind: 'attack', value: 14 } },
  { id: 'shield.militia-shield', name: 'Escudo de Milícia', slot: 'offHand', primaryStat: { kind: 'defense', value: 8 } },
  { id: 'armor.militia-chest', name: 'Peitoral de Milícia', slot: 'chest', primaryStat: { kind: 'defense', value: 18 } },
  { id: 'weapon.simple-staff', name: 'Cajado Simples', slot: 'mainHand', primaryStat: { kind: 'attack', value: 9 } },
  { id: 'armor.simple-robes', name: 'Vestes Simples', slot: 'chest', primaryStat: { kind: 'defense', value: 6 } },
  { id: 'weapon.short-bow', name: 'Arco Curto', slot: 'mainHand', primaryStat: { kind: 'attack', value: 12 } },
  { id: 'armor.hunting-jerkin', name: 'Gibão de Caça', slot: 'chest', primaryStat: { kind: 'defense', value: 10 } },
  { id: 'weapon.simple-mace', name: 'Maça Simples', slot: 'mainHand', primaryStat: { kind: 'attack', value: 14 } },
  { id: 'catalyst.simple', name: 'Catalisador Simples', slot: 'offHand' },
  { id: 'armor.acolyte-robes', name: 'Vestes do Acólito', slot: 'chest', primaryStat: { kind: 'defense', value: 8 } },
  { id: 'weapon.hunting-dagger', name: 'Adaga de Caça', slot: 'mainHand', primaryStat: { kind: 'attack', value: 7 } },
  { id: 'armor.light-outfit', name: 'Traje Leve', slot: 'chest', primaryStat: { kind: 'defense', value: 9 } },
  { id: 'weapon.travel-spear', name: 'Lança de Viagem', slot: 'mainHand', primaryStat: { kind: 'attack', value: 13 } },
  { id: 'armor.travel-protection', name: 'Proteção de Viagem', slot: 'chest', primaryStat: { kind: 'defense', value: 12 } },
  { id: 'armor.giuis-bracers', name: 'Braçadeiras de Giúis', slot: 'gloves', primaryStat: { kind: 'defense', value: 6 } },
  { id: 'item.equipment.traveller-ring', name: 'Anel do Viajante', slot: 'ring1' },
] as const satisfies readonly EquipmentDefinition[]

export function getEquipmentDefinition(definitionId: string) {
  return EQUIPMENT_DEFINITIONS.find((definition) => definition.id === definitionId) ?? null
}
