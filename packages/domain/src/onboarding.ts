import type { OfflineGameSave } from './character'
import { applyCombatResult, type CombatResult } from './combat'
import { grantGeneralXp } from './progression'

export function applyRoadServiceCombatResult(
  save: OfflineGameSave,
  result: CombatResult,
  now: string,
): OfflineGameSave {
  const firstServiceClear = result.outcome === 'victory' && !save.combat.wolfDefeated
  let next = applyCombatResult(save, 'enemy.road-wolf', result, now)

  if (!firstServiceClear) {
    return grantGeneralXp(
      { ...next, character: { ...next.character, xp: save.character.xp } },
      result.xpGranted,
      now,
    )
  }

  next = {
    ...next,
    character: {
      ...next.character,
      xp: save.character.xp,
      gold: next.character.gold + 40,
    },
  }

  return grantGeneralXp(next, result.xpGranted + 25, now)
}
