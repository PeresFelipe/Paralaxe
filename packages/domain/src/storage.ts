import type { OfflineGameSave } from './character'

export const BUILD_01_INVENTORY_SLOT_LIMIT = 24
export const BUILD_01_BANK_SLOT_LIMIT = 80

function validateQuantity(quantity: number) {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error('A quantidade transferida precisa ser um inteiro positivo.')
  }
}

function equippedInstanceIds(save: OfflineGameSave) {
  return new Set(Object.values(save.character.equipment))
}

export function getInventorySlotUsage(save: OfflineGameSave) {
  const equipped = equippedInstanceIds(save)
  const unequippedEquipment = save.character.equipmentItems.filter(
    (item) => !equipped.has(item.instanceId),
  ).length
  return save.character.inventory.length + unequippedEquipment
}

export function getBankSlotUsage(save: OfflineGameSave) {
  return save.character.bank.inventory.length + save.character.bank.equipmentItems.length
}

export function depositInventoryStackToBank(
  save: OfflineGameSave,
  definitionId: string,
  quantity: number,
  now: string,
): OfflineGameSave {
  validateQuantity(quantity)
  const source = save.character.inventory.find((stack) => stack.definitionId === definitionId)
  if (!source || source.quantity < quantity) {
    throw new Error('Quantidade insuficiente no Inventário.')
  }

  const existingBankStack = save.character.bank.inventory.find(
    (stack) => stack.definitionId === definitionId,
  )
  if (!existingBankStack && getBankSlotUsage(save) >= BUILD_01_BANK_SLOT_LIMIT) {
    throw new Error('O Banco está sem slots livres.')
  }

  const inventory = save.character.inventory
    .map((stack) =>
      stack.definitionId === definitionId ? { ...stack, quantity: stack.quantity - quantity } : stack,
    )
    .filter((stack) => stack.quantity > 0)
  const bankInventory = existingBankStack
    ? save.character.bank.inventory.map((stack) =>
        stack.definitionId === definitionId ? { ...stack, quantity: stack.quantity + quantity } : stack,
      )
    : [...save.character.bank.inventory, { definitionId, quantity }]

  return {
    ...save,
    updatedAt: now,
    character: {
      ...save.character,
      inventory,
      bank: { ...save.character.bank, inventory: bankInventory },
    },
  }
}

export function withdrawInventoryStackFromBank(
  save: OfflineGameSave,
  definitionId: string,
  quantity: number,
  now: string,
): OfflineGameSave {
  validateQuantity(quantity)
  const source = save.character.bank.inventory.find((stack) => stack.definitionId === definitionId)
  if (!source || source.quantity < quantity) {
    throw new Error('Quantidade insuficiente no Banco.')
  }

  const existingInventoryStack = save.character.inventory.find(
    (stack) => stack.definitionId === definitionId,
  )
  if (!existingInventoryStack && getInventorySlotUsage(save) >= BUILD_01_INVENTORY_SLOT_LIMIT) {
    throw new Error('O Inventário está sem slots livres.')
  }

  const bankInventory = save.character.bank.inventory
    .map((stack) =>
      stack.definitionId === definitionId ? { ...stack, quantity: stack.quantity - quantity } : stack,
    )
    .filter((stack) => stack.quantity > 0)
  const inventory = existingInventoryStack
    ? save.character.inventory.map((stack) =>
        stack.definitionId === definitionId ? { ...stack, quantity: stack.quantity + quantity } : stack,
      )
    : [...save.character.inventory, { definitionId, quantity }]

  return {
    ...save,
    updatedAt: now,
    character: {
      ...save.character,
      inventory,
      bank: { ...save.character.bank, inventory: bankInventory },
    },
  }
}

export function depositEquipmentToBank(
  save: OfflineGameSave,
  instanceId: string,
  now: string,
): OfflineGameSave {
  const instance = save.character.equipmentItems.find((item) => item.instanceId === instanceId)
  if (!instance) throw new Error('Equipamento não encontrado no Inventário.')
  if (equippedInstanceIds(save).has(instanceId)) {
    throw new Error('Desequipe o item antes de depositá-lo no Banco.')
  }
  if (getBankSlotUsage(save) >= BUILD_01_BANK_SLOT_LIMIT) {
    throw new Error('O Banco está sem slots livres.')
  }

  return {
    ...save,
    updatedAt: now,
    character: {
      ...save.character,
      equipmentItems: save.character.equipmentItems.filter((item) => item.instanceId !== instanceId),
      bank: {
        ...save.character.bank,
        equipmentItems: [...save.character.bank.equipmentItems, instance],
      },
    },
  }
}

export function withdrawEquipmentFromBank(
  save: OfflineGameSave,
  instanceId: string,
  now: string,
): OfflineGameSave {
  const instance = save.character.bank.equipmentItems.find((item) => item.instanceId === instanceId)
  if (!instance) throw new Error('Equipamento não encontrado no Banco.')
  if (getInventorySlotUsage(save) >= BUILD_01_INVENTORY_SLOT_LIMIT) {
    throw new Error('O Inventário está sem slots livres.')
  }
  if (save.character.equipmentItems.some((item) => item.instanceId === instanceId)) {
    throw new Error('A instância de equipamento já existe no Inventário.')
  }

  return {
    ...save,
    updatedAt: now,
    character: {
      ...save.character,
      equipmentItems: [...save.character.equipmentItems, instance],
      bank: {
        ...save.character.bank,
        equipmentItems: save.character.bank.equipmentItems.filter((item) => item.instanceId !== instanceId),
      },
    },
  }
}
