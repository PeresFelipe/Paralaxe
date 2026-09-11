import {
  SAVE_SCHEMA_VERSION,
  createDefaultConsumableSlots,
  createInitialCharacterPrestige,
  createInitialSkillProgress,
  createStartingEquipmentState,
  type CombatState,
  type CraftingState,
  type IdleState,
  type OfflineGameSave,
  type SkillProgressById,
  type StartingEquipmentLoadout,
} from '@greywake/domain'
import type { OfflineSaveRepository } from './saveRepository'

const DATABASE_NAME = 'greywake'
const DATABASE_VERSION = 1
const SAVE_STORE = 'saves'

interface LegacyCharacterState {
  name: string
  classId: OfflineGameSave['character']['classId']
  giftId: OfflineGameSave['character']['giftId']
  level: number
  xp: number
  unspentAttributePoints: number
  attributes: OfflineGameSave['character']['attributes']
  gold: number
  inventory: OfflineGameSave['character']['inventory']
  equipment: StartingEquipmentLoadout
  knownAbilityIds: string[]
  activeAbilitySlots: [string | null, string | null, string | null, string | null]
  currentLocationId: string
}

interface LegacyOfflineGameSaveV1 {
  saveId: string
  saveMode: 'OFFLINE'
  saveSchemaVersion: 1
  contentVersion: string
  createdAt: string
  updatedAt: string
  playtimeSeconds: number
  character: LegacyCharacterState
}

interface LegacyOfflineGameSaveV2 extends Omit<LegacyOfflineGameSaveV1, 'saveSchemaVersion'> {
  saveSchemaVersion: 2
  skills: SkillProgressById
  idle: IdleState
}

interface LegacyOfflineGameSaveV3
  extends Omit<OfflineGameSave, 'saveSchemaVersion' | 'combat' | 'dungeon'> {
  saveSchemaVersion: 3
  crafting: CraftingState
}

interface LegacyOfflineGameSaveV4
  extends Omit<OfflineGameSave, 'saveSchemaVersion' | 'combat' | 'dungeon'> {
  saveSchemaVersion: 4
  combat: Omit<CombatState, 'preferences'> & {
    preferences: Omit<CombatState['preferences'], 'consumableSlots'>
  }
}

interface LegacyOfflineGameSaveV5
  extends Omit<OfflineGameSave, 'saveSchemaVersion' | 'combat' | 'dungeon'> {
  saveSchemaVersion: 5
  combat: LegacyOfflineGameSaveV4['combat']
  dungeon: Omit<OfflineGameSave['dungeon'], 'contractAccepted'>
}

interface LegacyOfflineGameSaveV6 extends Omit<OfflineGameSave, 'saveSchemaVersion' | 'character'> {
  saveSchemaVersion: 6
  character: Omit<OfflineGameSave['character'], 'bank'>
}

interface LegacyOfflineGameSaveV7 extends Omit<OfflineGameSave, 'saveSchemaVersion' | 'character'> {
  saveSchemaVersion: 7
  character: Omit<OfflineGameSave['character'], 'prestige'>
}

interface LegacyOfflineGameSaveV8 extends Omit<OfflineGameSave, 'saveSchemaVersion' | 'character'> {
  saveSchemaVersion: 8
  character: Omit<OfflineGameSave['character'], 'prestige'>
}

function requestToPromise<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.addEventListener('success', () => resolve(request.result), { once: true })
    request.addEventListener(
      'error',
      () => reject(request.error ?? new Error('Falha em uma operação do IndexedDB.')),
      { once: true },
    )
  })
}

function transactionToPromise(transaction: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    transaction.addEventListener('complete', () => resolve(), { once: true })
    transaction.addEventListener(
      'error',
      () => reject(transaction.error ?? new Error('Falha na transação do IndexedDB.')),
      { once: true },
    )
    transaction.addEventListener(
      'abort',
      () => reject(transaction.error ?? new Error('Transação do IndexedDB abortada.')),
      { once: true },
    )
  })
}

function createDefaultCombatState(): OfflineGameSave['combat'] {
  return {
    preferences: {
      style: 'mixed',
      defensiveHealthThresholdPercent: 60,
      consumableSlots: createDefaultConsumableSlots(),
    },
    lastRun: null,
    wolfDefeated: false,
  }
}

function migrateCombatState(combat: LegacyOfflineGameSaveV4['combat']): OfflineGameSave['combat'] {
  return {
    ...combat,
    preferences: {
      ...combat.preferences,
      consumableSlots: createDefaultConsumableSlots(),
    },
  }
}

function createDefaultDungeonState(): OfflineGameSave['dungeon'] {
  return {
    activeRun: null,
    dunLiathEasyCleared: false,
    dunLiathProtector: null,
    contractAccepted: false,
    contractCompleted: false,
    instinctiveGuardUnlocked: false,
  }
}

function normalizeTravellerRingGift(
  character: OfflineGameSave['character'],
): OfflineGameSave['character'] {
  if (character.giftId !== 'traveller-ring') return character

  const existingRing = character.equipmentItems.find(
    (item) => item.definitionId === 'item.equipment.traveller-ring',
  )
  if (existingRing) {
    return character.equipment.ring1
      ? character
      : { ...character, equipment: { ...character.equipment, ring1: existingRing.instanceId } }
  }

  const ringStack = character.inventory.find(
    (stack) => stack.definitionId === 'item.equipment.traveller-ring',
  )
  if (!ringStack || ringStack.quantity <= 0) return character

  const instanceId = `eq-${character.nextEquipmentSequence}`
  const inventory = character.inventory
    .map((stack) =>
      stack.definitionId === 'item.equipment.traveller-ring'
        ? { ...stack, quantity: stack.quantity - 1 }
        : stack,
    )
    .filter((stack) => stack.quantity > 0)

  return {
    ...character,
    inventory,
    equipmentItems: [
      ...character.equipmentItems,
      { instanceId, definitionId: 'item.equipment.traveller-ring', upgradeLevel: 0 },
    ],
    nextEquipmentSequence: character.nextEquipmentSequence + 1,
    equipment: character.equipment.ring1
      ? character.equipment
      : { ...character.equipment, ring1: instanceId },
  }
}

function withInitialCharacterPrestige(
  character: Omit<OfflineGameSave['character'], 'prestige'> | OfflineGameSave['character'],
): OfflineGameSave['character'] {
  const existing = (character as Partial<OfflineGameSave['character']>).prestige

  return {
    ...character,
    prestige: existing ?? createInitialCharacterPrestige(),
  } as OfflineGameSave['character']
}

function withEmptyBank(
  character:
    | Omit<OfflineGameSave['character'], 'bank'>
    | Omit<OfflineGameSave['character'], 'bank' | 'prestige'>,
): OfflineGameSave['character'] {
  return normalizeTravellerRingGift(withInitialCharacterPrestige({
    ...character,
    bank: { inventory: [], equipmentItems: [] },
  }))
}

function migrateLegacyCharacter(character: LegacyCharacterState): OfflineGameSave['character'] {
  const startingEquipment = createStartingEquipmentState(character.equipment)

  return normalizeTravellerRingGift({
    ...character,
    bank: { inventory: [], equipmentItems: [] },
    equipment: startingEquipment.equipped,
    equipmentItems: startingEquipment.equipmentItems,
    nextEquipmentSequence: startingEquipment.nextEquipmentSequence,
    prestige: createInitialCharacterPrestige(),
  })
}

function migrateSave(rawSave: unknown): OfflineGameSave {
  if (!rawSave || typeof rawSave !== 'object') {
    throw new Error('Save local inválido.')
  }

  const candidate = rawSave as Record<string, unknown>

  if (candidate.saveSchemaVersion === SAVE_SCHEMA_VERSION) {
    return rawSave as OfflineGameSave
  }

  if (candidate.saveSchemaVersion === 8) {
    const legacy = rawSave as LegacyOfflineGameSaveV8
    return {
      ...legacy,
      saveSchemaVersion: SAVE_SCHEMA_VERSION,
      character: normalizeTravellerRingGift(withInitialCharacterPrestige(legacy.character)),
    }
  }

  if (candidate.saveSchemaVersion === 7) {
    const legacy = rawSave as LegacyOfflineGameSaveV7
    return {
      ...legacy,
      saveSchemaVersion: SAVE_SCHEMA_VERSION,
      character: normalizeTravellerRingGift(withInitialCharacterPrestige(legacy.character)),
    }
  }

  if (candidate.saveSchemaVersion === 6) {
    const legacy = rawSave as LegacyOfflineGameSaveV6
    return {
      ...legacy,
      saveSchemaVersion: SAVE_SCHEMA_VERSION,
      character: withEmptyBank(legacy.character),
    }
  }

  if (candidate.saveSchemaVersion === 5) {
    const legacy = rawSave as LegacyOfflineGameSaveV5
    return {
      ...legacy,
      saveSchemaVersion: SAVE_SCHEMA_VERSION,
      character: withEmptyBank(legacy.character),
      combat: migrateCombatState(legacy.combat),
      dungeon: {
        ...legacy.dungeon,
        contractAccepted:
          legacy.dungeon.contractCompleted || legacy.dungeon.activeRun !== null,
      },
    }
  }

  if (candidate.saveSchemaVersion === 4) {
    const legacy = rawSave as LegacyOfflineGameSaveV4
    return {
      ...legacy,
      saveSchemaVersion: SAVE_SCHEMA_VERSION,
      character: withEmptyBank(legacy.character),
      combat: migrateCombatState(legacy.combat),
      dungeon: createDefaultDungeonState(),
    }
  }

  if (candidate.saveSchemaVersion === 3) {
    const legacy = rawSave as LegacyOfflineGameSaveV3
    return {
      ...legacy,
      saveSchemaVersion: SAVE_SCHEMA_VERSION,
      character: withEmptyBank(legacy.character),
      combat: createDefaultCombatState(),
      dungeon: createDefaultDungeonState(),
    }
  }

  if (candidate.saveSchemaVersion === 2) {
    const legacy = rawSave as LegacyOfflineGameSaveV2

    return {
      ...legacy,
      saveSchemaVersion: SAVE_SCHEMA_VERSION,
      character: migrateLegacyCharacter(legacy.character),
      crafting: { activeRecipe: null },
      combat: createDefaultCombatState(),
      dungeon: createDefaultDungeonState(),
    }
  }

  if (candidate.saveSchemaVersion === 1) {
    const legacy = rawSave as LegacyOfflineGameSaveV1

    return {
      ...legacy,
      saveSchemaVersion: SAVE_SCHEMA_VERSION,
      character: migrateLegacyCharacter(legacy.character),
      skills: createInitialSkillProgress(),
      idle: { activeActivity: null },
      crafting: { activeRecipe: null },
      combat: createDefaultCombatState(),
      dungeon: createDefaultDungeonState(),
    }
  }

  throw new Error(`Schema de save não suportado: ${String(candidate.saveSchemaVersion)}.`)
}

function openDatabase() {
  if (!globalThis.indexedDB) {
    return Promise.reject(new Error('IndexedDB não está disponível neste navegador.'))
  }

  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = globalThis.indexedDB.open(DATABASE_NAME, DATABASE_VERSION)

    request.addEventListener(
      'upgradeneeded',
      () => {
        const database = request.result

        if (!database.objectStoreNames.contains(SAVE_STORE)) {
          database.createObjectStore(SAVE_STORE, { keyPath: 'saveId' })
        }
      },
      { once: true },
    )

    request.addEventListener('success', () => resolve(request.result), { once: true })
    request.addEventListener(
      'error',
      () => reject(request.error ?? new Error('Não foi possível abrir o banco local.')),
      { once: true },
    )
  })
}

export function createIndexedDbSaveRepository(): OfflineSaveRepository {
  return {
    async list() {
      const database = await openDatabase()

      try {
        const transaction = database.transaction(SAVE_STORE, 'readonly')
        const done = transactionToPromise(transaction)
        const request = transaction.objectStore(SAVE_STORE).getAll()
        const rawSaves = await requestToPromise(request)
        await done

        return rawSaves
          .map((save) => migrateSave(save))
          .toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      } finally {
        database.close()
      }
    },

    async get(saveId) {
      const database = await openDatabase()

      try {
        const transaction = database.transaction(SAVE_STORE, 'readonly')
        const done = transactionToPromise(transaction)
        const request = transaction.objectStore(SAVE_STORE).get(saveId)
        const rawSave = await requestToPromise(request)
        await done

        return rawSave === undefined ? null : migrateSave(rawSave)
      } finally {
        database.close()
      }
    },

    async put(save) {
      const database = await openDatabase()

      try {
        const transaction = database.transaction(SAVE_STORE, 'readwrite')
        const done = transactionToPromise(transaction)
        const request = transaction.objectStore(SAVE_STORE).put(save)
        await requestToPromise(request)
        await done
      } finally {
        database.close()
      }
    },
  }
}
