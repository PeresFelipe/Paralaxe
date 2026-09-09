import type { EquipmentDefinition } from '@greywake/domain'

export const EQUIPMENT_DEFINITIONS = [
  { id: 'weapon.militia-sword', name: 'Espada de Milícia', slot: 'mainHand', primaryStat: { kind: 'attack', value: 14 }, weaponCombat: { damageType: 'slash', actionIntervalSeconds: 2.1, scaling: { strength: 'B', dexterity: 'C' } } },
  { id: 'shield.militia-shield', name: 'Escudo de Milícia', slot: 'offHand', primaryStat: { kind: 'defense', value: 8 } },
  { id: 'armor.militia-chest', name: 'Peitoral de Milícia', slot: 'chest', primaryStat: { kind: 'defense', value: 18 } },
  { id: 'weapon.simple-staff', name: 'Cajado Simples', slot: 'mainHand', primaryStat: { kind: 'attack', value: 9 }, weaponCombat: { damageType: 'arcane', actionIntervalSeconds: 2.4, scaling: { intelligence: 'C' } } },
  { id: 'armor.simple-robes', name: 'Vestes Simples', slot: 'chest', primaryStat: { kind: 'defense', value: 6 } },
  { id: 'weapon.short-bow', name: 'Arco Curto', slot: 'mainHand', primaryStat: { kind: 'attack', value: 12 }, weaponCombat: { damageType: 'pierce', actionIntervalSeconds: 2.3, scaling: { strength: 'D', dexterity: 'A' } } },
  { id: 'armor.hunting-jerkin', name: 'Gibão de Caça', slot: 'chest', primaryStat: { kind: 'defense', value: 10 } },
  { id: 'weapon.simple-mace', name: 'Maça Simples', slot: 'mainHand', primaryStat: { kind: 'attack', value: 14 }, weaponCombat: { damageType: 'impact', actionIntervalSeconds: 2.3, scaling: { strength: 'C', dexterity: 'D' } } },
  { id: 'catalyst.simple', name: 'Catalisador Simples', slot: 'offHand' },
  { id: 'armor.acolyte-robes', name: 'Vestes do Acólito', slot: 'chest', primaryStat: { kind: 'defense', value: 8 } },
  { id: 'weapon.hunting-dagger', name: 'Adaga de Caça', slot: 'mainHand', primaryStat: { kind: 'attack', value: 7 }, weaponCombat: { damageType: 'pierce', actionIntervalSeconds: 1.45, scaling: { strength: 'D', dexterity: 'B' } } },
  { id: 'armor.light-outfit', name: 'Traje Leve', slot: 'chest', primaryStat: { kind: 'defense', value: 9 } },
  { id: 'weapon.travel-spear', name: 'Lança de Viagem', slot: 'mainHand', primaryStat: { kind: 'attack', value: 13 }, weaponCombat: { damageType: 'pierce', actionIntervalSeconds: 2.1, scaling: { strength: 'B', dexterity: 'C' } } },
  { id: 'armor.travel-protection', name: 'Proteção de Viagem', slot: 'chest', primaryStat: { kind: 'defense', value: 12 } },
  { id: 'armor.giuis-bracers', name: 'Braçadeiras de Giúis', slot: 'gloves', primaryStat: { kind: 'defense', value: 6 } },
  { id: 'item.equipment.traveller-ring', name: 'Anel do Viajante', slot: 'ring1' },

  { id: 'armor.garrison-helmet', name: 'Capacete da Guarnição', slot: 'head', primaryStat: { kind: 'defense', value: 7 } },
  { id: 'armor.garrison-gloves', name: 'Luvas da Guarnição', slot: 'gloves', primaryStat: { kind: 'defense', value: 7 } },
  { id: 'armor.garrison-legs', name: 'Perneiras da Guarnição', slot: 'legs', primaryStat: { kind: 'defense', value: 10 } },
  { id: 'armor.garrison-boots', name: 'Botas da Guarnição', slot: 'boots', primaryStat: { kind: 'defense', value: 7 } },
  { id: 'weapon.garrison-sword', name: 'Espada da Guarnição', slot: 'mainHand', primaryStat: { kind: 'attack', value: 16 }, weaponCombat: { damageType: 'slash', actionIntervalSeconds: 2.1, scaling: { strength: 'B', dexterity: 'C' } } },
  { id: 'weapon.bastion-mace', name: 'Maça do Bastião', slot: 'mainHand', primaryStat: { kind: 'attack', value: 16 }, weaponCombat: { damageType: 'impact', actionIntervalSeconds: 2.4, scaling: { strength: 'B', dexterity: 'D' } } },
  { id: 'weapon.watch-spear', name: 'Lança do Vigia', slot: 'mainHand', primaryStat: { kind: 'attack', value: 15 }, weaponCombat: { damageType: 'pierce', actionIntervalSeconds: 2.15, scaling: { strength: 'B', dexterity: 'B' } } },
  { id: 'weapon.patrol-bow', name: 'Arco de Patrulha', slot: 'mainHand', primaryStat: { kind: 'attack', value: 13 }, weaponCombat: { damageType: 'pierce', actionIntervalSeconds: 2.25, scaling: { strength: 'D', dexterity: 'A' } } },
  { id: 'weapon.campaign-staff', name: 'Cajado de Campanha', slot: 'mainHand', primaryStat: { kind: 'attack', value: 11 }, weaponCombat: { damageType: 'arcane', actionIntervalSeconds: 2.4, scaling: { intelligence: 'B' } } },
  { id: 'shield.watch-shield', name: 'Escudo do Vigia', slot: 'offHand', primaryStat: { kind: 'defense', value: 11 } },
] as const satisfies readonly EquipmentDefinition[]

export function getEquipmentDefinition(definitionId: string) {
  return EQUIPMENT_DEFINITIONS.find((definition) => definition.id === definitionId) ?? null
}
