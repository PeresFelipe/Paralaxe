import type { OfflineGameSave } from './character'

export const GENERAL_XP_TO_NEXT_LEVEL = [
  100,
  150,
  225,
  325,
  450,
  600,
  775,
  975,
  1200,
] as const

export const BUILD_01_MAX_GENERAL_LEVEL = 10

export function getGeneralLevelForXp(totalXp: number) {
  let level = 1
  let cumulative = 0

  for (const required of GENERAL_XP_TO_NEXT_LEVEL) {
    cumulative += required
    if (totalXp < cumulative) break
    level += 1
  }

  return Math.min(level, BUILD_01_MAX_GENERAL_LEVEL)
}

export function grantGeneralXp(
  save: OfflineGameSave,
  amount: number,
  now: string,
): OfflineGameSave {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error('XP Geral concedido precisa ser um valor não negativo.')
  }

  if (amount === 0) return save

  const xp = save.character.xp + amount
  const level = Math.max(save.character.level, getGeneralLevelForXp(xp))
  const gainedLevels = Math.max(0, level - save.character.level)

  return {
    ...save,
    updatedAt: now,
    character: {
      ...save.character,
      xp,
      level,
      unspentAttributePoints: save.character.unspentAttributePoints + gainedLevels,
    },
  }
}
