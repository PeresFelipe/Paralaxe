import { createDefaultConsumableSlots, type CombatState } from './combat'
import { type CraftingState } from './crafting'
import { type DungeonProgressState } from './dungeon'
import {
  createStartingEquipmentState,
  type EquippedItemIds,
  type EquipmentInstance,
  type EquipmentSlot,
  type StartingEquipmentLoadout,
} from './equipment'
import { createInitialSkillProgress, type IdleState, type SkillProgressById } from './idle'

export const ATTRIBUTE_KEYS = [
  'vitality',
  'mind',
  'vigor',
  'strength',
  'dexterity',
  'intelligence',
  'faith',
] as const

export type AttributeKey = (typeof ATTRIBUTE_KEYS)[number]

export interface CharacterAttributes {
  vitality: number
  mind: number
  vigor: number
  strength: number
  dexterity: number
  intelligence: number
  faith: number
}

export interface CharacterPrestigeState {
  level: number
  points: number
  unlockedNodeIds: string[]
}

export function createInitialCharacterPrestige(): CharacterPrestigeState {
  return {
    level: 0,
    points: 0,
    unlockedNodeIds: [],
  }
}

export type CharacterClassId =
  | 'warrior'
  | 'mage'
  | 'hunter'
  | 'acolyte'
  | 'rogue'
  | 'wanderer'

export type GiftId =
  | 'rusted-key'
  | 'coin-pouch'
  | 'crimson-flask'
  | 'traveller-ring'
  | 'nameless-stone'
  | 'survival-kit'
  | 'none'

export interface CharacterClassDefinition {
  id: CharacterClassId
  name: string
  summary: string
  attributes: CharacterAttributes
  startingEquipment: StartingEquipmentLoadout
  startingAbilityId: string
}

export type StartingGrant =
  | {
      kind: 'gold'
      amount: number
    }
  | {
      kind: 'item'
      definitionId: string
      quantity: number
    }
  | {
      kind: 'equipment'
      definitionId: string
      equipSlot?: EquipmentSlot
    }

export interface GiftDefinition {
  id: GiftId
  name: string
  summary: string
  grants: readonly StartingGrant[]
}

export interface InventoryStack {
  definitionId: string
  quantity: number
}

export interface BankState {
  inventory: InventoryStack[]
  equipmentItems: EquipmentInstance[]
}

export interface CharacterState {
  name: string
  classId: CharacterClassId
  giftId: GiftId
  level: number
  xp: number
  unspentAttributePoints: number
  attributes: CharacterAttributes
  gold: number
  inventory: InventoryStack[]
  bank: BankState
  equipment: EquippedItemIds
  equipmentItems: EquipmentInstance[]
  nextEquipmentSequence: number
  knownAbilityIds: string[]
  activeAbilitySlots: [string | null, string | null, string | null, string | null]
  currentLocationId: string
  prestige: CharacterPrestigeState
}

export const SAVE_SCHEMA_VERSION = 9 as const

export interface OfflineGameSave {
  saveId: string
  saveMode: 'OFFLINE'
  saveSchemaVersion: typeof SAVE_SCHEMA_VERSION
  contentVersion: string
  createdAt: string
  updatedAt: string
  playtimeSeconds: number
  character: CharacterState
  skills: SkillProgressById
  idle: IdleState
  crafting: CraftingState
  combat: CombatState
  dungeon: DungeonProgressState
}

export interface CreateOfflineGameSaveInput {
  saveId: string
  createdAt: string
  contentVersion: string
  characterName: string
  characterClass: CharacterClassDefinition
  gift: GiftDefinition
}

function attributeTotal(attributes: CharacterAttributes) {
  return ATTRIBUTE_KEYS.reduce((total, key) => total + attributes[key], 0)
}

function validateCharacterClass(definition: CharacterClassDefinition) {
  for (const key of ATTRIBUTE_KEYS) {
    const value = definition.attributes[key]

    if (!Number.isInteger(value) || value < 0) {
      throw new Error(`Atributo inicial inválido em ${definition.id}: ${key}.`)
    }
  }

  if (attributeTotal(definition.attributes) !== 35) {
    throw new Error(`A classe ${definition.id} precisa iniciar com exatamente 35 pontos.`)
  }
}

function buildGiftState(gift: GiftDefinition) {
  const inventoryByDefinition = new Map<string, number>()
  const equipmentGrants: Array<{ definitionId: string; equipSlot?: EquipmentSlot }> = []
  let gold = 0

  for (const grant of gift.grants) {
    if (grant.kind === 'gold') {
      if (!Number.isInteger(grant.amount) || grant.amount < 0) {
        throw new Error(`Quantidade de moedas inválida no presente ${gift.id}.`)
      }
      gold += grant.amount
      continue
    }

    if (grant.kind === 'equipment') {
      if (!grant.definitionId.trim()) {
        throw new Error(`Equipamento inválido no presente ${gift.id}.`)
      }
      equipmentGrants.push(grant.equipSlot ? { definitionId: grant.definitionId, equipSlot: grant.equipSlot } : { definitionId: grant.definitionId })
      continue
    }

    if (!Number.isInteger(grant.quantity) || grant.quantity <= 0) {
      throw new Error(`Quantidade de item inválida no presente ${gift.id}.`)
    }

    const currentQuantity = inventoryByDefinition.get(grant.definitionId) ?? 0
    inventoryByDefinition.set(grant.definitionId, currentQuantity + grant.quantity)
  }

  const inventory = [...inventoryByDefinition.entries()].map(([definitionId, quantity]) => ({
    definitionId,
    quantity,
  }))

  return { gold, inventory, equipmentGrants }
}

export function createOfflineGameSave(input: CreateOfflineGameSaveInput): OfflineGameSave {
  const characterName = input.characterName.trim()

  if (!input.saveId.trim()) throw new Error('O save precisa possuir um identificador.')
  if (!input.contentVersion.trim()) throw new Error('O save precisa registrar a versão do conteúdo.')
  if (!characterName) throw new Error('O personagem precisa possuir um nome.')

  validateCharacterClass(input.characterClass)

  const giftState = buildGiftState(input.gift)
  const startingAbilityId = input.characterClass.startingAbilityId
  const startingEquipment = createStartingEquipmentState(input.characterClass.startingEquipment)
  const giftEquipmentItems: EquipmentInstance[] = giftState.equipmentGrants.map((grant, index) => ({
    instanceId: `eq-${startingEquipment.nextEquipmentSequence + index}`,
    definitionId: grant.definitionId,
    upgradeLevel: 0,
  }))
  const equipped = { ...startingEquipment.equipped }
  giftState.equipmentGrants.forEach((grant, index) => {
    const instance = giftEquipmentItems[index]
    if (grant.equipSlot && instance && !equipped[grant.equipSlot]) {
      equipped[grant.equipSlot] = instance.instanceId
    }
  })

  return {
    saveId: input.saveId,
    saveMode: 'OFFLINE',
    saveSchemaVersion: SAVE_SCHEMA_VERSION,
    contentVersion: input.contentVersion,
    createdAt: input.createdAt,
    updatedAt: input.createdAt,
    playtimeSeconds: 0,
    character: {
      name: characterName,
      classId: input.characterClass.id,
      giftId: input.gift.id,
      level: 1,
      xp: 0,
      unspentAttributePoints: 0,
      attributes: { ...input.characterClass.attributes },
      gold: giftState.gold,
      inventory: giftState.inventory,
      bank: { inventory: [], equipmentItems: [] },
      equipment: equipped,
      equipmentItems: [...startingEquipment.equipmentItems, ...giftEquipmentItems],
      nextEquipmentSequence: startingEquipment.nextEquipmentSequence + giftEquipmentItems.length,
      knownAbilityIds: [startingAbilityId],
      activeAbilitySlots: [startingAbilityId, null, null, null],
      currentLocationId: 'free-city.tavern',
      prestige: createInitialCharacterPrestige(),
    },
    skills: createInitialSkillProgress(),
    idle: { activeActivity: null },
    crafting: { activeRecipe: null },
    combat: {
      preferences: {
        style: 'mixed',
        defensiveHealthThresholdPercent: 60,
        consumableSlots: createDefaultConsumableSlots(),
      },
      lastRun: null,
      wolfDefeated: false,
    },
    dungeon: {
      activeRun: null,
      dunLiathEasyCleared: false,
      dunLiathProtector: null,
      contractCompleted: false,
      instinctiveGuardUnlocked: false,
      contractAccepted: false,
    },
  }
}
