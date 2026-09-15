import { describe, expect, it } from 'vitest'
import {
  chooseJourneyGoal, createOfflineGameSave, depositInventoryStackToBank, getJourneyGoalProgress,
  processCraftingProgress, processIdleProgress, startCraftingRecipe, startIdleActivity, stopIdleActivity,
} from '@greywake/domain'
import { CHARACTER_CLASSES, INITIAL_GIFTS } from './characterCreation'
import { getCraftingRecipeDefinition } from './craftingRecipes'
import { INITIAL_IDLE_ACTIVITIES } from './idleActivities'
import { getBrannDialogue, getCraftingEquipmentComparison, getJourneyCraftFeedback, getJourneyReturnSummary, getJourneyStory } from './journey'

const time = (seconds: number) => new Date(Date.UTC(2026, 8, 15, 12, 0, seconds)).toISOString()
const bracers = getCraftingRecipeDefinition('recipe.smithing.giuis-bracers')!
const cloch = getCraftingRecipeDefinition('recipe.metallurgy.treated-cloch')!
const woodcutting = INITIAL_IDLE_ACTIVITIES.find((activity) => activity.skillId === 'woodcutting')!
function createSave() {
  return createOfflineGameSave({ saveId: 'journey-test', createdAt: time(0), contentVersion: 'test', characterName: 'Aedan', characterClass: CHARACTER_CLASSES[0]!, gift: INITIAL_GIFTS.find((gift) => gift.id === 'none')! })
}

describe('Journey with real crafting content', () => {
  it('chooses, replaces and dismisses a goal without changing the current activity', () => {
    const working = startIdleActivity(createSave(), woodcutting, time(0))
    const chosen = chooseJourneyGoal(working, bracers, time(1))
    expect(chosen.idle).toBe(working.idle)
    expect(chosen.crafting).toBe(working.crafting)
    const changed = chooseJourneyGoal(chosen, cloch, time(2))
    expect(changed.journey.goal?.recipeDefinitionId).toBe(cloch.id)
    expect(chooseJourneyGoal(changed, null, time(3)).journey.goal).toBeNull()
    expect(changed.idle).toBe(working.idle)
  })

  it('connects six gathered Giúis to a successful craft, with unchanged rewards', () => {
    const goal = chooseJourneyGoal(createSave(), bracers, time(0))
    const started = startIdleActivity(goal, woodcutting, time(0))
    const gathered = processIdleProgress(started, woodcutting, time(24)).save
    expect(getJourneyGoalProgress(gathered, bracers).ready).toBe(true)
    expect(getJourneyReturnSummary(started, gathered)).toContain('Materiais reunidos')
    const prepared = stopIdleActivity(gathered, time(24))
    const crafting = startCraftingRecipe(prepared, bracers, time(24))
    const completed = processCraftingProgress(crafting, bracers, time(36)).save
    const untracked = processCraftingProgress({ ...crafting, journey: { goal: null, craftedRecipeIds: [] } }, bracers, time(36)).save
    expect(completed.character).toEqual(untracked.character)
    expect(completed.skills).toEqual(untracked.skills)
    expect(completed.journey.goal?.completedAt).toBe(time(36))
    expect(completed.journey.craftedRecipeIds).toEqual([bracers.id])
    expect(getJourneyCraftFeedback(crafting, completed)).toContain('Primeira fabricação registrada')
    expect(getJourneyReturnSummary(crafting, completed)).toContain('Meta concluída')
    const replay = processCraftingProgress(completed, bracers, time(36)).save
    expect(replay).toBe(completed)
    expect(getJourneyCraftFeedback(completed, replay)).toBeNull()
    expect(getJourneyReturnSummary(completed, replay)).toBeNull()
  })

  it('updates missing materials after storage changes instead of counting banked resources as available', () => {
    let save = chooseJourneyGoal(createSave(), bracers, time(0))
    save = { ...save, character: { ...save.character, inventory: [{ definitionId: 'material.giuis', quantity: 6 }] } }
    expect(getJourneyGoalProgress(save, bracers).ready).toBe(true)
    const deposited = depositInventoryStackToBank(save, 'material.giuis', 4, time(1))
    expect(getJourneyGoalProgress(deposited, bracers).ingredients[0]?.missing).toBe(4)
    expect(deposited.journey.goal?.completedAt).toBeNull()
    expect(deposited.journey.craftedRecipeIds).toEqual([])
  })

  it('keeps active and offline production equivalent and records one first craft for multiple cycles', () => {
    let save = chooseJourneyGoal(createSave(), bracers, time(0))
    save = { ...save, character: { ...save.character, inventory: [{ definitionId: 'material.giuis', quantity: 24 }] } }
    const started = startCraftingRecipe(save, bracers, time(0))
    const offline = processCraftingProgress(started, bracers, time(48)).save
    let active = started
    for (const seconds of [12, 24, 36, 48]) active = processCraftingProgress(active, bracers, time(seconds)).save
    expect(active.character).toEqual(offline.character)
    expect(active.skills).toEqual(offline.skills)
    expect(active.journey.craftedRecipeIds).toEqual([bracers.id])
    expect(offline.journey.craftedRecipeIds).toEqual([bracers.id])
    expect(Boolean(active.journey.goal?.completedAt)).toBe(true)
    expect(Boolean(offline.journey.goal?.completedAt)).toBe(true)
  })

  it('does not record a craft before completion or when inventory capacity blocks the output', () => {
    let save = chooseJourneyGoal(createSave(), bracers, time(0))
    save = { ...save, character: { ...save.character, inventory: [
      { definitionId: 'material.giuis', quantity: 12 },
      ...Array.from({ length: 23 }, (_, index) => ({ definitionId: `material.test-${index}`, quantity: 1 })),
    ] } }
    const started = startCraftingRecipe(save, bracers, time(0))
    expect(processCraftingProgress(started, bracers, time(1)).save.journey.craftedRecipeIds).toEqual([])
    const blocked = processCraftingProgress(started, bracers, time(12))
    expect(blocked.stoppedForCapacity).toBe(true)
    expect(blocked.save.journey.craftedRecipeIds).toEqual([])
    expect(blocked.save.journey.goal?.completedAt).toBeNull()
  })

  it('keeps completed goals after using their output and allows a deliberate repeat goal', () => {
    let save = chooseJourneyGoal(createSave(), cloch, time(0))
    save = { ...save, character: { ...save.character, inventory: [{ definitionId: 'material.cloch', quantity: 6 }] } }
    const first = processCraftingProgress(startCraftingRecipe(save, cloch, time(0)), cloch, time(6)).save
    const stored = depositInventoryStackToBank(first, 'material.treated-cloch', 1, time(7))
    expect(getJourneyGoalProgress(stored, cloch).completed).toBe(true)
    const repeated = chooseJourneyGoal(stored, cloch, time(8))
    expect(repeated.journey.goal?.completedAt).toBeNull()
    const second = processCraftingProgress(repeated, cloch, time(12)).save
    expect(second.journey.craftedRecipeIds).toEqual([cloch.id])
    expect(getJourneyCraftFeedback(repeated, second)).toContain('Meta concluída')
    expect(getJourneyCraftFeedback(repeated, second)).not.toContain('Primeira')
  })

  it('compares against the actual upgraded equipment and includes a possible loss of defense', () => {
    const base = createSave()
    expect(getCraftingEquipmentComparison(base, bracers.id)?.rows.find((row) => row.key === 'defense')?.delta).toBe(6)
    const equipped = { ...base, character: { ...base.character,
      equipmentItems: [...base.character.equipmentItems, { instanceId: 'crafted', definitionId: 'armor.giuis-bracers', upgradeLevel: 1 as const }],
      equipment: { ...base.character.equipment, gloves: 'crafted' },
    } }
    expect(getCraftingEquipmentComparison(equipped, bracers.id)?.rows.find((row) => row.key === 'defense')?.delta).toBe(-1)
  })
})

describe('First arc closure', () => {
  it('recognizes the completed contract instead of repeating the initial invitation', () => {
    const save = createSave()
    save.combat.wolfDefeated = true
    save.dungeon.contractAccepted = true
    save.dungeon.contractCompleted = true
    expect(getJourneyStory(save).label).toBe('Arco concluído')
    expect(getBrannDialogue(save).action).toBe('Revisitar Dún Liath')
    expect(getBrannDialogue(save).memory).toBeNull()
  })

  it.each(['killed', 'spared'] as const)('remembers %s without turning an unfinished contract into a victory', (decision) => {
    const save = createSave()
    save.combat.wolfDefeated = true
    save.dungeon.contractAccepted = true
    save.dungeon.dunLiathProtector = decision
    expect(getJourneyStory(save).label).toBe('Contrato em andamento')
    expect(getBrannDialogue(save).memory).not.toBeNull()
    expect(getBrannDialogue(save).action).toBe('Rever preparação de Dún Liath')
    expect(getBrannDialogue(save).body).toContain('ainda precisamos recuperar')
  })
})
