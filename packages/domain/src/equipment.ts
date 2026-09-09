import type { AttributeKey, OfflineGameSave } from './character'

export const EQUIPMENT_SLOTS = [
  'head',
  'chest',
  'gloves',
  'legs',
  'boots',
  'mainHand',
  'offHand',
  'amulet',
  'ring1',
  'ring2',
] as const

export type EquipmentSlot = (typeof EQUIPMENT_SLOTS)[number]

export type StartingEquipmentLoadout = Partial<Record<EquipmentSlot, string>>
export type EquippedItemIds = Partial<Record<EquipmentSlot, string>>

export type EquipmentUpgradeLevel = 0 | 1
export type EquipmentPrimaryStatKind = 'attack' | 'defense'
export type EquipmentRarity = 'common' | 'uncommon' | 'rare'
export type ScalingGrade = 'S' | 'A' | 'B' | 'C' | 'D' | 'E'
export type DamageType = 'slash' | 'pierce' | 'impact' | 'fire' | 'ice' | 'arcane' | 'holy'

export interface EquipmentPrimaryStat {
  kind: EquipmentPrimaryStatKind
  value: number
}

export interface WeaponCombatProfile {
  damageType: DamageType
  actionIntervalSeconds: number
  scaling: Partial<Record<AttributeKey, ScalingGrade>>
}

export interface EquipmentDefinition {
  id: string
  name: string
  slot: EquipmentSlot
  primaryStat?: EquipmentPrimaryStat
  weaponCombat?: WeaponCombatProfile
}

export interface EquipmentInstance {
  instanceId: string
  definitionId: string
  upgradeLevel: EquipmentUpgradeLevel
  rarity?: EquipmentRarity
  affixIds?: string[]
}

export interface StartingEquipmentState {
  equipped: EquippedItemIds
  equipmentItems: EquipmentInstance[]
  nextEquipmentSequence: number
}

export function createStartingEquipmentState(
  loadout: StartingEquipmentLoadout,
): StartingEquipmentState {
  const equipped: EquippedItemIds = {}
  const equipmentItems: EquipmentInstance[] = []
  let nextEquipmentSequence = 1

  for (const slot of EQUIPMENT_SLOTS) {
    const definitionId = loadout[slot]
    if (!definitionId) continue

    const instanceId = `eq-${nextEquipmentSequence}`
    nextEquipmentSequence += 1
    equipmentItems.push({ instanceId, definitionId, upgradeLevel: 0 })
    equipped[slot] = instanceId
  }

  return { equipped, equipmentItems, nextEquipmentSequence }
}

export function getEquipmentPrimaryValue(
  definition: EquipmentDefinition,
  upgradeLevel: EquipmentUpgradeLevel,
) {
  const baseValue = definition.primaryStat?.value
  if (baseValue === undefined) return null

  if (upgradeLevel === 0) return baseValue

  return Math.ceil(baseValue * 1.15)
}

export function equipEquipment(
  save: OfflineGameSave,
  instanceId: string,
  definition: EquipmentDefinition,
  now: string,
): OfflineGameSave {
  const instance = save.character.equipmentItems.find((item) => item.instanceId === instanceId)

  if (!instance) {
    throw new Error('Equipamento não encontrado no inventário do personagem.')
  }

  if (instance.definitionId !== definition.id) {
    throw new Error('A Definition do equipamento não corresponde à instância selecionada.')
  }

  return {
    ...save,
    updatedAt: now,
    character: {
      ...save.character,
      equipment: {
        ...save.character.equipment,
        [definition.slot]: instanceId,
      },
    },
  }
}
