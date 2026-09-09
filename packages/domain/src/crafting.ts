import type { InventoryStack, OfflineGameSave } from './character'
import { applySkillXp, getOfflineLimitSeconds, type SkillId } from './idle'

export interface RecipeIngredient {
  definitionId: string
  quantity: number
}

export type RecipeOutput =
  | {
      kind: 'item'
      definitionId: string
      name: string
      quantity: number
    }
  | {
      kind: 'equipment'
      definitionId: string
      name: string
    }
  | {
      kind: 'equipment-upgrade'
      name: string
    }

export interface CraftingRecipeDefinition {
  id: string
  skillId: SkillId
  name: string
  requiredSkillLevel: number
  actionSeconds: number
  skillXpPerAction: number
  ingredients: readonly RecipeIngredient[]
  output: RecipeOutput
}

export interface ActiveCraftingRecipe {
  recipeDefinitionId: string
  startedAt: string
  lastProcessedAt: string
  remainderSeconds: number
  targetEquipmentInstanceId: string | null
}

export interface CraftingState {
  activeRecipe: ActiveCraftingRecipe | null
}

export interface CraftingProgressResult {
  save: OfflineGameSave
  completedActions: number
  producedItems: number
  producedEquipment: number
  upgradedEquipment: number
  grantedSkillXp: number
  grantedGeneralXp: number
  gainedSkillLevels: number
  processedSeconds: number
  cappedSeconds: number
  stoppedForMaterials: boolean
}

function getInventoryQuantity(inventory: InventoryStack[], definitionId: string) {
  return inventory.find((stack) => stack.definitionId === definitionId)?.quantity ?? 0
}

function getMaxCraftableCycles(inventory: InventoryStack[], ingredients: readonly RecipeIngredient[]) {
  if (ingredients.length === 0) return Number.POSITIVE_INFINITY

  return Math.min(
    ...ingredients.map((ingredient) =>
      Math.floor(getInventoryQuantity(inventory, ingredient.definitionId) / ingredient.quantity),
    ),
  )
}

function consumeIngredients(
  inventory: InventoryStack[],
  ingredients: readonly RecipeIngredient[],
  cycles: number,
) {
  if (cycles <= 0) return inventory

  const requiredByDefinition = new Map<string, number>()

  for (const ingredient of ingredients) {
    requiredByDefinition.set(
      ingredient.definitionId,
      (requiredByDefinition.get(ingredient.definitionId) ?? 0) + ingredient.quantity * cycles,
    )
  }

  return inventory
    .map((stack) => ({
      ...stack,
      quantity: stack.quantity - (requiredByDefinition.get(stack.definitionId) ?? 0),
    }))
    .filter((stack) => stack.quantity > 0)
}

function addInventoryItem(
  inventory: InventoryStack[],
  definitionId: string,
  quantity: number,
) {
  if (quantity <= 0) return inventory

  const existing = inventory.find((stack) => stack.definitionId === definitionId)

  if (!existing) {
    return [...inventory, { definitionId, quantity }]
  }

  return inventory.map((stack) =>
    stack.definitionId === definitionId
      ? { ...stack, quantity: stack.quantity + quantity }
      : stack,
  )
}

export function startCraftingRecipe(
  save: OfflineGameSave,
  recipe: CraftingRecipeDefinition,
  now: string,
  targetEquipmentInstanceId: string | null = null,
): OfflineGameSave {
  if (save.idle.activeActivity) {
    throw new Error('Interrompa a atividade de coleta antes de iniciar uma produção.')
  }

  const skill = save.skills[recipe.skillId]

  if (skill.level < recipe.requiredSkillLevel) {
    throw new Error(`${recipe.name} exige nível ${recipe.requiredSkillLevel} de Skill.`)
  }

  if (getMaxCraftableCycles(save.character.inventory, recipe.ingredients) < 1) {
    throw new Error('Materiais insuficientes para iniciar essa produção.')
  }

  if (recipe.output.kind === 'equipment-upgrade') {
    if (!targetEquipmentInstanceId) {
      throw new Error('Selecione o equipamento que receberá o reforço.')
    }

    const target = save.character.equipmentItems.find(
      (instance) => instance.instanceId === targetEquipmentInstanceId,
    )

    if (!target) {
      throw new Error('Equipamento selecionado para reforço não foi encontrado.')
    }

    if (target.upgradeLevel !== 0) {
      throw new Error('Na Build 0.1, o Reforço Simples só pode elevar equipamento +0 para +1.')
    }
  }

  return {
    ...save,
    updatedAt: now,
    crafting: {
      activeRecipe: {
        recipeDefinitionId: recipe.id,
        startedAt: now,
        lastProcessedAt: now,
        remainderSeconds: 0,
        targetEquipmentInstanceId,
      },
    },
  }
}

export function stopCraftingRecipe(save: OfflineGameSave, now: string): OfflineGameSave {
  return {
    ...save,
    updatedAt: now,
    crafting: { activeRecipe: null },
  }
}

export function processCraftingProgress(
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
  })

  if (!active || active.recipeDefinitionId !== recipe.id) {
    return emptyResult(save)
  }

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
  const materialCycles = getMaxCraftableCycles(save.character.inventory, recipe.ingredients)
  const outputCycleLimit = recipe.output.kind === 'equipment-upgrade' ? 1 : Number.POSITIVE_INFINITY
  const completedActions = Math.min(timeCycles, materialCycles, outputCycleLimit)

  if (completedActions === 0 && timeCycles > 0 && materialCycles < 1) {
    return {
      ...emptyResult({
        ...save,
        updatedAt: now,
        crafting: { activeRecipe: null },
      }),
      processedSeconds,
      cappedSeconds,
      stoppedForMaterials: true,
    }
  }

  let inventory = consumeIngredients(save.character.inventory, recipe.ingredients, completedActions)
  let equipmentItems = save.character.equipmentItems
  let nextEquipmentSequence = save.character.nextEquipmentSequence
  let producedItems = 0
  let producedEquipment = 0
  let upgradedEquipment = 0

  if (recipe.output.kind === 'item') {
    producedItems = completedActions * recipe.output.quantity
    inventory = addInventoryItem(inventory, recipe.output.definitionId, producedItems)
  }

  if (recipe.output.kind === 'equipment' && completedActions > 0) {
    const created = Array.from({ length: completedActions }, () => {
      const instanceId = `eq-${nextEquipmentSequence}`
      nextEquipmentSequence += 1
      return {
        instanceId,
        definitionId: recipe.output.definitionId,
        upgradeLevel: 0 as const,
      }
    })

    equipmentItems = [...equipmentItems, ...created]
    producedEquipment = created.length
  }

  if (recipe.output.kind === 'equipment-upgrade' && completedActions > 0) {
    const targetId = active.targetEquipmentInstanceId

    if (!targetId) {
      throw new Error('Produção de reforço perdeu a referência do equipamento alvo.')
    }

    equipmentItems = equipmentItems.map((instance) =>
      instance.instanceId === targetId && instance.upgradeLevel === 0
        ? { ...instance, upgradeLevel: 1 as const }
        : instance,
    )
    upgradedEquipment = 1
  }

  const skillXp = completedActions * recipe.skillXpPerAction
  const skillResult = applySkillXp(save.skills[recipe.skillId], skillXp)
  const generalXp = skillResult.gainedLevels * 5
  const remainingMaterialCycles = getMaxCraftableCycles(inventory, recipe.ingredients)
  const cannotRepeat =
    recipe.output.kind === 'equipment-upgrade' ||
    (completedActions > 0 && remainingMaterialCycles < 1) ||
    (timeCycles > completedActions && completedActions === materialCycles)
  const stoppedForMaterials = recipe.output.kind !== 'equipment-upgrade' && cannotRepeat
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
        : {
            ...active,
            lastProcessedAt: now,
            remainderSeconds,
          },
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
  }
}
