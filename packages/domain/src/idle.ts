import type { InventoryStack, OfflineGameSave } from './character'
import { getInventoryStackRoom } from './storage'

export const SKILL_IDS = [
  'mining',
  'woodcutting',
  'fishing',
  'herbology',
  'metallurgy',
  'smithing',
  'cooking',
] as const

export type SkillId = (typeof SKILL_IDS)[number]

export interface SkillProgress {
  level: number
  xp: number
  prestige: number
}

export type SkillProgressById = Record<SkillId, SkillProgress>

export interface IdleActivityDefinition {
  id: string
  skillId: SkillId
  name: string
  resultItemDefinitionId: string
  resultName: string
  requiredSkillLevel: number
  actionSeconds: number
  skillXpPerAction: number
}

export interface ActiveIdleActivity {
  activityDefinitionId: string
  startedAt: string
  lastProcessedAt: string
  remainderSeconds: number
}

export interface IdleState {
  activeActivity: ActiveIdleActivity | null
}

export interface IdleProgressResult {
  save: OfflineGameSave
  completedActions: number
  grantedItems: number
  grantedSkillXp: number
  grantedGeneralXp: number
  gainedSkillLevels: number
  processedSeconds: number
  cappedSeconds: number
  stoppedForCapacity: boolean
}

const SKILL_XP_TO_NEXT_LEVEL = [40, 60, 80, 110, 140, 180, 220, 270, 320] as const
const BASE_OFFLINE_LIMIT_SECONDS = 4 * 60 * 60
const OFFLINE_BONUS_PER_TEN_LEVELS_SECONDS = 2 * 60 * 60

export function createInitialSkillProgress(): SkillProgressById {
  return Object.fromEntries(
    SKILL_IDS.map((skillId) => [skillId, { level: 1, xp: 0, prestige: 0 }]),
  ) as SkillProgressById
}

export function getOfflineLimitSeconds(characterLevel: number) {
  const earnedBonuses = Math.floor(Math.max(0, characterLevel) / 10)
  return BASE_OFFLINE_LIMIT_SECONDS + earnedBonuses * OFFLINE_BONUS_PER_TEN_LEVELS_SECONDS
}

function addInventoryItem(inventory: InventoryStack[], definitionId: string, quantity: number) {
  const existing = inventory.find((stack) => stack.definitionId === definitionId)

  if (existing) {
    return inventory.map((stack) =>
      stack.definitionId === definitionId
        ? { ...stack, quantity: stack.quantity + quantity }
        : stack,
    )
  }

  return [...inventory, { definitionId, quantity }]
}

export function applySkillXp(progress: SkillProgress, gainedXp: number) {
  let level = progress.level
  let xp = progress.xp + gainedXp
  let gainedLevels = 0

  while (level < 10) {
    const requirement = SKILL_XP_TO_NEXT_LEVEL[level - 1]

    if (requirement === undefined || xp < requirement) break

    xp -= requirement
    level += 1
    gainedLevels += 1
  }

  return {
    progress: { ...progress, level, xp },
    gainedLevels,
  }
}

export function startIdleActivity(
  save: OfflineGameSave,
  activity: IdleActivityDefinition,
  now: string,
): OfflineGameSave {
  if (save.crafting.activeRecipe) {
    throw new Error('Interrompa a produção antes de iniciar uma coleta.')
  }

  const skill = save.skills[activity.skillId]

  if (skill.level < activity.requiredSkillLevel) {
    throw new Error(`${activity.name} exige nível ${activity.requiredSkillLevel} de Skill.`)
  }
  if (getInventoryStackRoom(save, activity.resultItemDefinitionId) <= 0) {
    throw new Error('O Inventário não possui capacidade para o resultado dessa coleta.')
  }

  return {
    ...save,
    updatedAt: now,
    idle: {
      activeActivity: {
        activityDefinitionId: activity.id,
        startedAt: now,
        lastProcessedAt: now,
        remainderSeconds: 0,
      },
    },
  }
}

export function stopIdleActivity(save: OfflineGameSave, now: string): OfflineGameSave {
  return {
    ...save,
    updatedAt: now,
    idle: { activeActivity: null },
  }
}

export function processIdleProgress(
  save: OfflineGameSave,
  activity: IdleActivityDefinition,
  now: string,
): IdleProgressResult {
  const active = save.idle.activeActivity

  if (!active || active.activityDefinitionId !== activity.id) {
    return {
      save,
      completedActions: 0,
      grantedItems: 0,
      grantedSkillXp: 0,
      grantedGeneralXp: 0,
      gainedSkillLevels: 0,
      processedSeconds: 0,
      cappedSeconds: 0,
      stoppedForCapacity: false,
    }
  }

  const lastProcessedMs = Date.parse(active.lastProcessedAt)
  const nowMs = Date.parse(now)

  if (!Number.isFinite(lastProcessedMs) || !Number.isFinite(nowMs) || nowMs <= lastProcessedMs) {
    return {
      save,
      completedActions: 0,
      grantedItems: 0,
      grantedSkillXp: 0,
      grantedGeneralXp: 0,
      gainedSkillLevels: 0,
      processedSeconds: 0,
      cappedSeconds: 0,
      stoppedForCapacity: false,
    }
  }

  const elapsedSeconds = Math.floor((nowMs - lastProcessedMs) / 1000)
  const offlineLimit = getOfflineLimitSeconds(save.character.level)
  const processedSeconds = Math.min(elapsedSeconds, offlineLimit)
  const cappedSeconds = Math.max(0, elapsedSeconds - processedSeconds)
  const totalSeconds = active.remainderSeconds + processedSeconds
  const timeActions = Math.floor(totalSeconds / activity.actionSeconds)
  const inventoryRoom = getInventoryStackRoom(save, activity.resultItemDefinitionId)
  const completedActions = Math.min(timeActions, inventoryRoom)
  const stoppedForCapacity =
    (inventoryRoom === 0 && timeActions > 0) ||
    (inventoryRoom > 0 && completedActions === inventoryRoom)
  const remainderSeconds = stoppedForCapacity ? 0 : totalSeconds % activity.actionSeconds

  const skillXp = completedActions * activity.skillXpPerAction
  const currentSkill = save.skills[activity.skillId]
  const skillResult = applySkillXp(currentSkill, skillXp)
  const generalXp = skillResult.gainedLevels * 5

  const nextSave: OfflineGameSave = {
    ...save,
    updatedAt: now,
    character: {
      ...save.character,
      xp: save.character.xp + generalXp,
      inventory:
        completedActions > 0
          ? addInventoryItem(save.character.inventory, activity.resultItemDefinitionId, completedActions)
          : save.character.inventory,
    },
    skills: {
      ...save.skills,
      [activity.skillId]: skillResult.progress,
    },
    idle: {
      activeActivity: stoppedForCapacity
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
    grantedItems: completedActions,
    grantedSkillXp: skillXp,
    grantedGeneralXp: generalXp,
    gainedSkillLevels: skillResult.gainedLevels,
    processedSeconds,
    cappedSeconds,
    stoppedForCapacity,
  }
}
