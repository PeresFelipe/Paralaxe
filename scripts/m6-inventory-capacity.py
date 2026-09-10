from pathlib import Path

# Idle: cap stack growth and stop explicitly when capacity is reached.
p = Path('packages/domain/src/idle.ts')
t = p.read_text()
t = t.replace(
    "import type { InventoryStack, OfflineGameSave } from './character'\n",
    "import type { InventoryStack, OfflineGameSave } from './character'\nimport { getInventoryStackRoom } from './storage'\n",
    1,
)
t = t.replace(
    "  cappedSeconds: number\n}",
    "  cappedSeconds: number\n  stoppedForCapacity: boolean\n}",
    1,
)
t = t.replace(
    "      cappedSeconds: 0,\n    }",
    "      cappedSeconds: 0,\n      stoppedForCapacity: false,\n    }",
    2,
)
t = t.replace(
    """  if (skill.level < activity.requiredSkillLevel) {\n    throw new Error(`${activity.name} exige nível ${activity.requiredSkillLevel} de Skill.`)\n  }\n\n  return {""",
    """  if (skill.level < activity.requiredSkillLevel) {\n    throw new Error(`${activity.name} exige nível ${activity.requiredSkillLevel} de Skill.`)\n  }\n  if (getInventoryStackRoom(save, activity.resultItemDefinitionId) <= 0) {\n    throw new Error('O Inventário não possui capacidade para o resultado dessa coleta.')\n  }\n\n  return {""",
    1,
)
old = """  const totalSeconds = active.remainderSeconds + processedSeconds\n  const completedActions = Math.floor(totalSeconds / activity.actionSeconds)\n  const remainderSeconds = totalSeconds % activity.actionSeconds\n\n  const skillXp = completedActions * activity.skillXpPerAction"""
new = """  const totalSeconds = active.remainderSeconds + processedSeconds\n  const timeActions = Math.floor(totalSeconds / activity.actionSeconds)\n  const inventoryRoom = getInventoryStackRoom(save, activity.resultItemDefinitionId)\n  const completedActions = Math.min(timeActions, inventoryRoom)\n  const stoppedForCapacity =\n    (inventoryRoom === 0 && timeActions > 0) ||\n    (inventoryRoom > 0 && completedActions === inventoryRoom)\n  const remainderSeconds = stoppedForCapacity ? 0 : totalSeconds % activity.actionSeconds\n\n  const skillXp = completedActions * activity.skillXpPerAction"""
if old not in t:
    raise SystemExit('idle cycle anchor missing')
t = t.replace(old, new, 1)
t = t.replace(
    """    idle: {\n      activeActivity: {\n        ...active,\n        lastProcessedAt: now,\n        remainderSeconds,\n      },\n    },""",
    """    idle: {\n      activeActivity: stoppedForCapacity\n        ? null\n        : {\n            ...active,\n            lastProcessedAt: now,\n            remainderSeconds,\n          },\n    },""",
    1,
)
t = t.replace(
    """    processedSeconds,\n    cappedSeconds,\n  }\n}""",
    """    processedSeconds,\n    cappedSeconds,\n    stoppedForCapacity,\n  }\n}""",
    1,
)
p.write_text(t)

# Crafting: complete cycles atomically and never consume ingredients if output cannot fit.
p = Path('packages/domain/src/crafting.ts')
t = p.read_text()
t = t.replace(
    "import { applySkillXp, getOfflineLimitSeconds, type SkillId } from './idle'\n",
    "import { applySkillXp, getOfflineLimitSeconds, type SkillId } from './idle'\nimport { getInventoryEquipmentRoom, getInventoryStackRoom } from './storage'\n",
    1,
)
t = t.replace(
    "  stoppedForMaterials: boolean\n}",
    "  stoppedForMaterials: boolean\n  stoppedForCapacity: boolean\n}",
    1,
)
start = t.index('export function processCraftingProgress(')
new_function = r'''export function processCraftingProgress(
  save: OfflineGameSave,
  recipe: CraftingRecipeDefinition,
  now: string,
): CraftingProgressResult {
  const active = save.crafting.activeRecipe

  const emptyResult = (currentSave: OfflineGameSave): CraftingProgressResult => ({
    save: currentSave,
    completedActions: 0,
    producedItems: 0,
    producedEquipment: 0,
    upgradedEquipment: 0,
    grantedSkillXp: 0,
    grantedGeneralXp: 0,
    gainedSkillLevels: 0,
    processedSeconds: 0,
    cappedSeconds: 0,
    stoppedForMaterials: false,
    stoppedForCapacity: false,
  })

  if (!active || active.recipeDefinitionId !== recipe.id) return emptyResult(save)

  const lastProcessedMs = Date.parse(active.lastProcessedAt)
  const nowMs = Date.parse(now)
  if (!Number.isFinite(lastProcessedMs) || !Number.isFinite(nowMs) || nowMs <= lastProcessedMs) {
    return emptyResult(save)
  }

  const elapsedSeconds = Math.floor((nowMs - lastProcessedMs) / 1000)
  const offlineLimit = getOfflineLimitSeconds(save.character.level)
  const processedSeconds = Math.min(elapsedSeconds, offlineLimit)
  const cappedSeconds = Math.max(0, elapsedSeconds - processedSeconds)
  const totalSeconds = active.remainderSeconds + processedSeconds
  const timeCycles = Math.floor(totalSeconds / recipe.actionSeconds)

  let inventory = save.character.inventory
  let equipmentItems = save.character.equipmentItems
  let nextEquipmentSequence = save.character.nextEquipmentSequence
  let completedActions = 0
  let producedItems = 0
  let producedEquipment = 0
  let upgradedEquipment = 0
  let stoppedForMaterials = false
  let stoppedForCapacity = false

  const prospectiveSave = (
    nextInventory: OfflineGameSave['character']['inventory'],
    nextEquipment: OfflineGameSave['character']['equipmentItems'],
  ): OfflineGameSave => ({
    ...save,
    character: { ...save.character, inventory: nextInventory, equipmentItems: nextEquipment },
  })

  const canFitOutputAfterConsumption = (consumedInventory: InventoryStack[]) => {
    const preview = prospectiveSave(consumedInventory, equipmentItems)
    if (recipe.output.kind === 'item') {
      return getInventoryStackRoom(preview, recipe.output.definitionId) >= recipe.output.quantity
    }
    if (recipe.output.kind === 'equipment') {
      return getInventoryEquipmentRoom(preview) >= 1
    }
    return true
  }

  for (let index = 0; index < timeCycles; index += 1) {
    if (recipe.output.kind === 'equipment-upgrade' && completedActions >= 1) break
    if (getMaxCraftableCycles(inventory, recipe.ingredients) < 1) {
      stoppedForMaterials = true
      break
    }

    const consumedInventory = consumeIngredients(inventory, recipe.ingredients, 1)
    if (!canFitOutputAfterConsumption(consumedInventory)) {
      stoppedForCapacity = true
      break
    }

    inventory = consumedInventory
    completedActions += 1

    if (recipe.output.kind === 'item') {
      producedItems += recipe.output.quantity
      inventory = addInventoryItem(inventory, recipe.output.definitionId, recipe.output.quantity)
    } else if (recipe.output.kind === 'equipment') {
      equipmentItems = [
        ...equipmentItems,
        {
          instanceId: `eq-${nextEquipmentSequence}`,
          definitionId: recipe.output.definitionId,
          upgradeLevel: 0 as const,
        },
      ]
      nextEquipmentSequence += 1
      producedEquipment += 1
    } else {
      const targetId = active.targetEquipmentInstanceId
      if (!targetId) throw new Error('Produção de reforço perdeu a referência do equipamento alvo.')
      equipmentItems = equipmentItems.map((instance) =>
        instance.instanceId === targetId && instance.upgradeLevel === 0
          ? { ...instance, upgradeLevel: 1 as const }
          : instance,
      )
      upgradedEquipment = 1
      break
    }
  }

  let cannotRepeat = recipe.output.kind === 'equipment-upgrade' && completedActions > 0
  if (!cannotRepeat && !stoppedForCapacity) {
    if (getMaxCraftableCycles(inventory, recipe.ingredients) < 1) {
      stoppedForMaterials = true
      cannotRepeat = true
    } else {
      const nextConsumed = consumeIngredients(inventory, recipe.ingredients, 1)
      if (!canFitOutputAfterConsumption(nextConsumed)) {
        stoppedForCapacity = true
        cannotRepeat = true
      }
    }
  }
  if (stoppedForCapacity || stoppedForMaterials) cannotRepeat = true

  const skillXp = completedActions * recipe.skillXpPerAction
  const skillResult = applySkillXp(save.skills[recipe.skillId], skillXp)
  const generalXp = skillResult.gainedLevels * 5
  const remainderSeconds = cannotRepeat ? 0 : totalSeconds % recipe.actionSeconds

  const nextSave: OfflineGameSave = {
    ...save,
    updatedAt: now,
    character: {
      ...save.character,
      xp: save.character.xp + generalXp,
      inventory,
      equipmentItems,
      nextEquipmentSequence,
    },
    skills: {
      ...save.skills,
      [recipe.skillId]: skillResult.progress,
    },
    crafting: {
      activeRecipe: cannotRepeat
        ? null
        : { ...active, lastProcessedAt: now, remainderSeconds },
    },
  }

  return {
    save: nextSave,
    completedActions,
    producedItems,
    producedEquipment,
    upgradedEquipment,
    grantedSkillXp: skillXp,
    grantedGeneralXp: generalXp,
    gainedSkillLevels: skillResult.gainedLevels,
    processedSeconds,
    cappedSeconds,
    stoppedForMaterials,
    stoppedForCapacity,
  }
}
'''
t = t[:start] + new_function
p.write_text(t)

# Market: reject purchases before charging when output cannot fit.
p = Path('packages/domain/src/economy.ts')
t = p.read_text()
t = t.replace(
    "import type { EquipmentSlot } from './equipment'\n",
    "import type { EquipmentSlot } from './equipment'\nimport { assertInventoryCanReceiveEquipment, assertInventoryCanReceiveStack } from './storage'\n",
    1,
)
t = t.replace(
    """  if (listing.product.kind === 'item') {\n    return {""",
    """  if (listing.product.kind === 'item') {\n    assertInventoryCanReceiveStack(save, listing.product.definitionId, listing.product.quantity)\n    return {""",
    1,
)
t = t.replace(
    """  const instanceId = `eq-${save.character.nextEquipmentSequence}`""",
    """  assertInventoryCanReceiveEquipment(save)\n  const instanceId = `eq-${save.character.nextEquipmentSequence}`""",
    1,
)
p.write_text(t)

# Dungeon contract/extraction: all transfers are capacity-checked before persisting.
p = Path('packages/domain/src/dungeon.ts')
t = p.read_text()
t = t.replace(
    "import type { OfflineGameSave } from './character'\n",
    "import type { OfflineGameSave } from './character'\nimport { assertInventoryCanReceiveEquipment, assertInventoryCanReceiveStack } from './storage'\n",
    1,
)
t = t.replace(
    """export function acceptDunLiathContract(save: OfflineGameSave, now: string): OfflineGameSave {\n  if (save.dungeon.contractAccepted) return save\n  if (save.dungeon.contractCompleted) return save\n\n  return {""",
    """export function acceptDunLiathContract(save: OfflineGameSave, now: string): OfflineGameSave {\n  if (save.dungeon.contractAccepted) return save\n  if (save.dungeon.contractCompleted) return save\n  assertInventoryCanReceiveStack(save, 'item.consumable.field-preparation', 2)\n\n  return {""",
    1,
)
old = """  let inventory = save.character.inventory\n  for (const stack of run.expeditionBag) {\n    inventory = addInventoryStack(inventory, stack.definitionId, stack.quantity)\n  }\n\n  const equipment = materializeExpeditionEquipment(save, run.expeditionEquipment)"""
new = """  let inventory = save.character.inventory\n  for (const stack of run.expeditionBag) {\n    const preview: OfflineGameSave = {\n      ...save,\n      character: { ...save.character, inventory },\n    }\n    assertInventoryCanReceiveStack(preview, stack.definitionId, stack.quantity)\n    inventory = addInventoryStack(inventory, stack.definitionId, stack.quantity)\n  }\n\n  const equipmentPreview: OfflineGameSave = {\n    ...save,\n    character: { ...save.character, inventory },\n  }\n  if (run.expeditionEquipment.length > 0) {\n    assertInventoryCanReceiveEquipment(equipmentPreview, run.expeditionEquipment.length)\n  }\n  const equipment = materializeExpeditionEquipment(save, run.expeditionEquipment)"""
if old not in t:
    raise SystemExit('dungeon extraction anchor missing')
t = t.replace(old, new, 1)
p.write_text(t)

# App feedback: a stopped bar must always explain why it stopped.
p = Path('apps/game/src/App.tsx')
t = p.read_text()
t = t.replace(
    """      const cappedText = result.cappedSeconds > 0 ? ' · limite offline atingido' : ''\n      return {\n        save: result.save,\n        text: result.completedActions > 0\n          ? `+${result.completedActions} ${activity.resultName} · +${result.grantedSkillXp} XP de Skill${levelText}${cappedText}`\n          : null,""",
    """      const cappedText = result.cappedSeconds > 0 ? ' · limite offline atingido' : ''\n      const capacityText = result.stoppedForCapacity ? ' · Inventário sem capacidade; coleta interrompida' : ''\n      return {\n        save: result.save,\n        text: result.completedActions > 0\n          ? `+${result.completedActions} ${activity.resultName} · +${result.grantedSkillXp} XP de Skill${levelText}${cappedText}${capacityText}`\n          : result.stoppedForCapacity\n            ? `${activity.name} foi interrompida: Inventário sem capacidade.`\n            : null,""",
    1,
)
t = t.replace(
    """      const stoppedText = result.stoppedForMaterials ? ' · produção interrompida por materiais insuficientes' : ''\n      return {\n        save: result.save,\n        text: result.completedActions > 0\n          ? `${recipe.name}: ${totalOutput || result.completedActions} concluído(s) · +${result.grantedSkillXp} XP de Skill${stoppedText}`\n          : result.stoppedForMaterials\n            ? `${recipe.name} foi interrompida por materiais insuficientes.`\n            : null,""",
    """      const stoppedText = result.stoppedForMaterials ? ' · produção interrompida por materiais insuficientes' : ''\n      const capacityText = result.stoppedForCapacity ? ' · produção interrompida por Inventário sem capacidade' : ''\n      return {\n        save: result.save,\n        text: result.completedActions > 0\n          ? `${recipe.name}: ${totalOutput || result.completedActions} concluído(s) · +${result.grantedSkillXp} XP de Skill${stoppedText}${capacityText}`\n          : result.stoppedForMaterials\n            ? `${recipe.name} foi interrompida por materiais insuficientes.`\n            : result.stoppedForCapacity\n              ? `${recipe.name} foi interrompida: Inventário sem capacidade.`\n              : null,""",
    1,
)
p.write_text(t)

# Dedicated cross-system capacity regression tests.
p = Path('packages/domain/src/inventoryCapacity.test.ts')
p.write_text(r'''import { describe, expect, it } from 'vitest'
import { createOfflineGameSave, type CharacterClassDefinition, type GiftDefinition, type OfflineGameSave } from './character'
import { processIdleProgress, startIdleActivity, type IdleActivityDefinition } from './idle'
import { processCraftingProgress, startCraftingRecipe, type CraftingRecipeDefinition } from './crafting'
import { buyNpcMarketListing } from './economy'
import { acceptDunLiathContract, createDungeonRun, extractDungeonRun, type DungeonDefinition } from './dungeon'
import { BUILD_01_CONSUMABLE_STACK_LIMIT, BUILD_01_INVENTORY_SLOT_LIMIT } from './storage'

const characterClass: CharacterClassDefinition = {
  id: 'wanderer',
  name: 'Errante',
  summary: 'Teste',
  attributes: { vitality: 5, mind: 5, vigor: 5, strength: 5, dexterity: 5, intelligence: 5, faith: 5 },
  startingEquipment: { mainHand: 'weapon.travel-spear' },
  startingAbilityId: 'ability.opening',
}
const gift: GiftDefinition = { id: 'none', name: 'Nenhum', summary: 'Teste', grants: [] }

function createSave() {
  return createOfflineGameSave({
    saveId: 'capacity-test', createdAt: '2026-09-10T12:00:00.000Z', contentVersion: '0.1.0-dev',
    characterName: 'Ailith', characterClass, gift,
  })
}

function withFullDistinctInventory(save: OfflineGameSave, first = { definitionId: 'material.cloch', quantity: 2 }) {
  const filler = Array.from({ length: BUILD_01_INVENTORY_SLOT_LIMIT - 1 }, (_, index) => ({
    definitionId: `material.filler-${index}`,
    quantity: 1,
  }))
  return { ...save, character: { ...save.character, inventory: [first, ...filler] } }
}

const mining: IdleActivityDefinition = {
  id: 'gather.mining.cloch', skillId: 'mining', name: 'Extrair Cloch', resultItemDefinitionId: 'material.cloch',
  resultName: 'Cloch', requiredSkillLevel: 1, actionSeconds: 4, skillXpPerAction: 8,
}
const treatment: CraftingRecipeDefinition = {
  id: 'recipe.test.treated-cloch', skillId: 'metallurgy', name: 'Cloch Tratada', requiredSkillLevel: 1,
  actionSeconds: 6, skillXpPerAction: 12, ingredients: [{ definitionId: 'material.cloch', quantity: 1 }],
  output: { kind: 'item', definitionId: 'material.treated-cloch', name: 'Cloch Tratada', quantity: 1 },
}
const dungeon: DungeonDefinition = {
  id: 'dungeon.capacity', name: 'Dungeon Capacidade', difficulty: 'easy', startRoomId: 'room.start',
  rooms: [{ id: 'room.start', name: 'Entrada', kind: 'entrance', nextRoomIds: [] }],
}

describe('Build 0.1 inventory capacity across acquisition flows', () => {
  it('caps gathering at the material stack limit and stops the activity explicitly', () => {
    const base = createSave()
    const stocked = {
      ...base,
      character: { ...base.character, inventory: [{ definitionId: 'material.cloch', quantity: 9_998 }] },
    }
    const started = startIdleActivity(stocked, mining, '2026-09-10T12:00:00.000Z')
    const result = processIdleProgress(started, mining, '2026-09-10T12:00:08.000Z')
    expect(result.completedActions).toBe(1)
    expect(result.save.character.inventory[0]?.quantity).toBe(9_999)
    expect(result.stoppedForCapacity).toBe(true)
    expect(result.save.idle.activeActivity).toBeNull()
  })

  it('does not consume crafting ingredients when the resulting item cannot fit', () => {
    const full = withFullDistinctInventory(createSave())
    const started = startCraftingRecipe(full, treatment, '2026-09-10T12:00:00.000Z')
    const result = processCraftingProgress(started, treatment, '2026-09-10T12:00:06.000Z')
    expect(result.completedActions).toBe(0)
    expect(result.stoppedForCapacity).toBe(true)
    expect(result.save.character.inventory.find((stack) => stack.definitionId === 'material.cloch')?.quantity).toBe(2)
    expect(result.save.character.inventory.some((stack) => stack.definitionId === 'material.treated-cloch')).toBe(false)
  })

  it('rejects market purchases that would overflow a consumable stack or equipment slot', () => {
    const base = createSave()
    const capped = {
      ...base,
      character: {
        ...base.character,
        gold: 100,
        inventory: [{ definitionId: 'item.consumable.field-preparation', quantity: BUILD_01_CONSUMABLE_STACK_LIMIT }],
      },
    }
    expect(() => buyNpcMarketListing(capped, {
      id: 'market.field-preparation', name: 'Preparado', price: 15,
      product: { kind: 'item', definitionId: 'item.consumable.field-preparation', quantity: 1 },
    }, '2026-09-10T12:01:00.000Z')).toThrow('capacidade')

    const full = { ...withFullDistinctInventory(base), character: { ...withFullDistinctInventory(base).character, gold: 100 } }
    expect(() => buyNpcMarketListing(full, {
      id: 'market.gloves', name: 'Luvas', price: 20,
      product: { kind: 'equipment', definitionId: 'armor.simple-gloves', slot: 'gloves' },
    }, '2026-09-10T12:01:00.000Z')).toThrow('slots livres')
  })

  it('requires room for contract supplies and for all Dungeon loot before extraction', () => {
    const full = withFullDistinctInventory(createSave(), { definitionId: 'material.cloch', quantity: 1 })
    expect(() => acceptDunLiathContract(full, '2026-09-10T12:01:00.000Z')).toThrow('capacidade')

    const run = {
      ...createDungeonRun(full, dungeon, 7, '2026-09-10T12:02:00.000Z'),
      safeExtractionAvailable: true,
      expeditionBag: [{ definitionId: 'item.dun-liath.beam', quantity: 1 }],
    }
    const active = { ...full, dungeon: { ...full.dungeon, activeRun: run } }
    expect(() => extractDungeonRun(active, '2026-09-10T12:03:00.000Z')).toThrow('capacidade')
    expect(active.dungeon.activeRun).not.toBeNull()
  })
})
''')
