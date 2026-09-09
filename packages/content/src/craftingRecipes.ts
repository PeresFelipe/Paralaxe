import type { CraftingRecipeDefinition } from '@greywake/domain'

export const INITIAL_CRAFTING_RECIPES = [
  {
    id: 'recipe.metallurgy.treated-cloch',
    skillId: 'metallurgy',
    name: 'Cloch Tratada',
    requiredSkillLevel: 1,
    actionSeconds: 6,
    skillXpPerAction: 12,
    ingredients: [{ definitionId: 'material.cloch', quantity: 3 }],
    output: { kind: 'item', definitionId: 'material.treated-cloch', name: 'Cloch Tratada', quantity: 1 },
  },
  {
    id: 'recipe.smithing.giuis-bracers',
    skillId: 'smithing',
    name: 'Braçadeiras de Giúis',
    requiredSkillLevel: 1,
    actionSeconds: 12,
    skillXpPerAction: 24,
    ingredients: [{ definitionId: 'material.giuis', quantity: 6 }],
    output: { kind: 'equipment', definitionId: 'armor.giuis-bracers', name: 'Braçadeiras de Giúis' },
  },
  {
    id: 'recipe.cooking.roasted-scadan',
    skillId: 'cooking',
    name: 'Scadán Assado',
    requiredSkillLevel: 1,
    actionSeconds: 8,
    skillXpPerAction: 16,
    ingredients: [{ definitionId: 'material.scadan', quantity: 2 }],
    output: { kind: 'item', definitionId: 'item.food.roasted-scadan', name: 'Scadán Assado', quantity: 1 },
  },
  {
    id: 'recipe.cooking.neantog-preparation',
    skillId: 'cooking',
    name: 'Preparado de Neantóg',
    requiredSkillLevel: 1,
    actionSeconds: 8,
    skillXpPerAction: 16,
    ingredients: [{ definitionId: 'material.neantog', quantity: 2 }],
    output: { kind: 'item', definitionId: 'item.consumable.neantog-preparation', name: 'Preparado de Neantóg', quantity: 1 },
  },
  {
    id: 'recipe.smithing.simple-upgrade-1',
    skillId: 'smithing',
    name: 'Reforço Simples +1',
    requiredSkillLevel: 1,
    actionSeconds: 15,
    skillXpPerAction: 30,
    ingredients: [{ definitionId: 'material.treated-cloch', quantity: 2 }],
    output: { kind: 'equipment-upgrade', name: 'Reforço Simples +1' },
  },
] as const satisfies readonly CraftingRecipeDefinition[]

export function getCraftingRecipeDefinition(recipeDefinitionId: string) {
  return INITIAL_CRAFTING_RECIPES.find((recipe) => recipe.id === recipeDefinitionId) ?? null
}
