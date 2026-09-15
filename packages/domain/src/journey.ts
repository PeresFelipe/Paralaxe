import type { OfflineGameSave } from './character'
import type { CraftingRecipeDefinition } from './crafting'

export interface JourneyGoal {
  recipeDefinitionId: string
  selectedAt: string
  completedAt: string | null
}

export interface JourneyState {
  goal: JourneyGoal | null
  craftedRecipeIds: string[]
}

export function createInitialJourney(): JourneyState {
  return { goal: null, craftedRecipeIds: [] }
}

/** A goal is a reminder: choosing it never starts or interrupts work. */
export function chooseJourneyGoal(
  save: OfflineGameSave,
  recipe: CraftingRecipeDefinition | null,
  now: string,
): OfflineGameSave {
  if (save.dungeon.activeRun) throw new Error('Escolha sua meta após retornar da expedição.')
  if (recipe?.output.kind === 'equipment-upgrade') {
    throw new Error('Escolha uma receita de fabricação para acompanhar.')
  }
  if (recipe && save.skills[recipe.skillId].level < recipe.requiredSkillLevel) {
    throw new Error('Essa receita ainda não está disponível para o personagem.')
  }
  if (recipe && save.journey.goal?.recipeDefinitionId === recipe.id && !save.journey.goal.completedAt) return save

  return {
    ...save,
    updatedAt: now,
    journey: {
      ...save.journey,
      goal: recipe ? { recipeDefinitionId: recipe.id, selectedAt: now, completedAt: null } : null,
    },
  }
}

/** Called only after successful crafting; owning or buying an item is not a craft. */
export function recordJourneyCraft(journey: JourneyState, recipeId: string, now: string): JourneyState {
  const firstCraft = !journey.craftedRecipeIds.includes(recipeId)
  const completedGoal = journey.goal?.recipeDefinitionId === recipeId && !journey.goal.completedAt
  if (!firstCraft && !completedGoal) return journey
  return {
    craftedRecipeIds: firstCraft ? [...journey.craftedRecipeIds, recipeId] : journey.craftedRecipeIds,
    goal: completedGoal && journey.goal ? { ...journey.goal, completedAt: now } : journey.goal,
  }
}

/** Ingredient counts come from the inventory, just like the crafting engine. */
export function getJourneyGoalProgress(save: OfflineGameSave, recipe: CraftingRecipeDefinition) {
  const ingredients = recipe.ingredients.map((ingredient) => {
    const owned = save.character.inventory.find((stack) => stack.definitionId === ingredient.definitionId)?.quantity ?? 0
    return { ...ingredient, owned, missing: Math.max(0, ingredient.quantity - owned) }
  })
  const completed = save.journey.goal?.recipeDefinitionId === recipe.id && Boolean(save.journey.goal.completedAt)
  const ready = ingredients.every((ingredient) => ingredient.missing === 0)
  const crafting = save.crafting.activeRecipe?.recipeDefinitionId === recipe.id
  const required = ingredients.reduce((sum, ingredient) => sum + ingredient.quantity, 0)
  const gathered = ingredients.reduce((sum, ingredient) => sum + Math.min(ingredient.owned, ingredient.quantity), 0)
  return { ingredients, completed, ready, crafting, required, gathered }
}
