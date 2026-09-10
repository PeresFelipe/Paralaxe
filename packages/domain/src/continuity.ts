import type { OfflineGameSave } from './character'

/**
 * Freezes the elapsed-time anchor for whichever Idle work is currently selected.
 * The selected work remains in the save so the UI can show what will resume after
 * a risky context ends, but no catch-up time is accumulated while risk is active.
 */
export function pauseCurrentWorkForRisk(save: OfflineGameSave, now: string): OfflineGameSave {
  return {
    ...save,
    updatedAt: now,
    idle: {
      activeActivity: save.idle.activeActivity
        ? { ...save.idle.activeActivity, lastProcessedAt: now }
        : null,
    },
    crafting: {
      activeRecipe: save.crafting.activeRecipe
        ? { ...save.crafting.activeRecipe, lastProcessedAt: now }
        : null,
    },
  }
}

/**
 * Restarts the elapsed-time anchor after combat/Dungeon without forcing the
 * player to manually restart the activity that was selected before the risk.
 */
export function resumeCurrentWorkAfterRisk(save: OfflineGameSave, now: string): OfflineGameSave {
  return pauseCurrentWorkForRisk(save, now)
}
