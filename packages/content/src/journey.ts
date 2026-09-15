import { derivePlayerCombatStats, getJourneyGoalProgress, type OfflineGameSave } from '@greywake/domain'
import { getCraftingRecipeDefinition } from './craftingRecipes'
import { getEquipmentDefinition } from './equipment'

type StorySave = Pick<OfflineGameSave, 'combat' | 'dungeon'>

export function getJourneyCraftFeedback(before: OfflineGameSave, after: OfflineGameSave): string | null {
  const firstId = after.journey.craftedRecipeIds.find((id) => !before.journey.craftedRecipeIds.includes(id))
  const goal = after.journey.goal
  const goalCompleted = goal?.completedAt && goal.recipeDefinitionId === before.journey.goal?.recipeDefinitionId && !before.journey.goal.completedAt
  const recipe = getCraftingRecipeDefinition(firstId ?? (goalCompleted ? goal.recipeDefinitionId : ''))
  if (!recipe) return null
  return firstId
    ? `Primeira fabricação registrada: ${recipe.name}.${goalCompleted ? ' Sua meta foi concluída.' : ' Um novo feito na Jornada.'}`
    : `Meta concluída: ${recipe.name}. Escolha seu próximo passo na Jornada.`
}

export function getCraftingEquipmentComparison(save: OfflineGameSave, recipeId: string) {
  const recipe = getCraftingRecipeDefinition(recipeId)
  if (!recipe || recipe.output.kind !== 'equipment') return null
  const definition = getEquipmentDefinition(recipe.output.definitionId)
  if (!definition) return null
  const equippedId = save.character.equipment[definition.slot]
  const equipped = save.character.equipmentItems.find((item) => item.instanceId === equippedId)
  const currentDefinition = equipped ? getEquipmentDefinition(equipped.definitionId) : null
  const catalog = { getEquipmentDefinition }
  const before = derivePlayerCombatStats(save, catalog)
  const preview = {
    ...save,
    character: {
      ...save.character,
      equipmentItems: [...save.character.equipmentItems, { instanceId: 'journey-preview', definitionId: definition.id, upgradeLevel: 0 as const }],
      equipment: { ...save.character.equipment, [definition.slot]: 'journey-preview' },
    },
  }
  const after = derivePlayerCombatStats(preview, catalog)
  const fields = [
    ['defense', 'Defesa'], ['basicAttackPower', 'Poder de ataque'],
    ['maxHealth', 'Vida máxima'], ['maxMana', 'Mana máxima'], ['maxStamina', 'Stamina máxima'],
    ['accuracy', 'Precisão'], ['criticalChance', 'Chance crítica'],
    ['manaRegenPerSecond', 'Mana por segundo'], ['staminaRegenPerSecond', 'Stamina por segundo'],
    ['actionIntervalSeconds', 'Segundos por ataque'],
  ] as const
  return {
    currentName: currentDefinition ? `${currentDefinition.name} +${equipped?.upgradeLevel ?? 0}` : 'Nenhuma peça neste espaço',
    rows: fields.map(([key, label]) => ({ key, label, before: before[key], after: after[key], delta: after[key] - before[key] }))
      .filter((row) => row.delta !== 0 || row.key === 'defense'),
  }
}

export function getJourneyReturnSummary(before: OfflineGameSave, after: OfflineGameSave): string | null {
  const goal = after.journey.goal
  if (!goal || before.journey.goal?.completedAt) return null
  const recipe = getCraftingRecipeDefinition(goal.recipeDefinitionId)
  if (!recipe) return null
  const previous = getJourneyGoalProgress(before, recipe)
  const progress = getJourneyGoalProgress(after, recipe)
  if (progress.completed) return `Meta concluída: ${recipe.name}. Sua fabricação está registrada na Jornada.`
  if (progress.ready && !previous.ready) return `Materiais reunidos para ${recipe.name}. Sua próxima fabricação está ao alcance.`
  if (progress.gathered > previous.gathered) return `Sua meta avançou: ${progress.gathered} de ${progress.required} materiais para ${recipe.name}.`
  return null
}

export function getJourneyStory(save: StorySave) {
  if (save.dungeon.activeRun) return {
    label: 'Em expedição', title: 'Expedição em Dún Liath',
    body: 'Sua atividade Idle permanece pausada até retornar a um contexto seguro.',
  }
  if (save.dungeon.contractCompleted) return {
    label: 'Arco concluído', title: 'De volta da Fortaleza Cinzenta',
    body: 'O contrato de Dún Liath foi cumprido. Brann tem palavras sobre seu retorno. Este arco termina aqui; você pode preparar outro equipamento ou revisitar os encontros conhecidos.',
  }
  if (save.dungeon.contractAccepted) return {
    label: 'Contrato em andamento', title: 'Fortaleza Cinzenta',
    body: 'O contrato de Dún Liath está ativo. Revise sua preparação em Aventura e recupere o Registro de Suprimentos para concluir o trabalho.',
  }
  if (save.combat.wolfDefeated) return {
    label: 'Novo caminho', title: 'Depois da Estrada Baixa',
    body: 'O Serviço foi concluído. Brann possui o caminho para o contrato da Fortaleza Cinzenta.',
  }
  return {
    label: 'Primeiro passo', title: 'Estrada Baixa',
    body: 'Há relatos de hostilidade fora da Cidade. O Serviço em Aventura é o próximo teste conhecido de preparação.',
  }
}

export function getBrannDialogue(save: StorySave) {
  const memory = save.dungeon.dunLiathProtector === 'spared'
    ? 'Você deixou o Protetor viver. Há decisões que continuam conosco depois que os portões se fecham.'
    : save.dungeon.dunLiathProtector === 'killed'
      ? 'O Protetor caiu pela sua mão. A fortaleza guardará esse silêncio; você guardará o motivo.'
      : null
  if (save.dungeon.contractCompleted) return {
    title: 'Você trouxe respostas de Dún Liath.',
    body: 'O Registro de Suprimentos chegou, e o contrato está encerrado. Descanse. A cidade ainda tem ofícios a aprender, e a fortaleza continua de pé.',
    memory, action: 'Revisitar Dún Liath',
  }
  if (save.dungeon.contractAccepted) return {
    title: 'O contrato ainda está em suas mãos.',
    body: 'Seus passos trouxeram você de volta. Prepare-se no seu ritmo; ainda precisamos recuperar o Registro de Suprimentos em Dún Liath.',
    memory, action: 'Rever preparação de Dún Liath',
  }
  return save.combat.wolfDefeated ? {
    title: 'A estrada confirmou os rumores.',
    body: 'Há um contrato na Fortaleza Cinzenta. Conheça os riscos antes de atravessar os portões.',
    memory, action: 'Ver contrato de Dún Liath',
  } : {
    title: 'Há trabalho fora dos portões.',
    body: 'Prepare-se nos ofícios da cidade. Quando quiser testar seu equipamento, o Serviço — Estrada Baixa espera por você.',
    memory, action: null,
  }
}
