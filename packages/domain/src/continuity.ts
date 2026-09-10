import type { OfflineGameSave } from './character'
import { startDungeon, type DungeonDefinition } from './dungeon'

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
 * Starts a Dungeon while keeping the selected safe Idle work as the work that will
 * resume afterward. `startDungeon` still protects its lower-level invariant, so this
 * adapter temporarily detaches the work only for the start call and immediately
 * restores it as a paused continuity anchor in the resulting save.
 */
export function startDungeonWithContinuity(
  save: OfflineGameSave,
  dungeon: DungeonDefinition,
  seed: number,
  now: string,
): OfflineGameSave {
  const paused = pauseCurrentWorkForRisk(save, now)
  const detached: OfflineGameSave = {
    ...paused,
    idle: { activeActivity: null },
    crafting: { activeRecipe: null },
  }
  const started = startDungeon(detached, dungeon, seed, now)

  return {
    ...started,
    idle: paused.idle,
    crafting: paused.crafting,
  }
}

/**
 * Restarts the elapsed-time anchor after combat/Dungeon without forcing the
 * player to manually restart the activity that was selected before the risk.
 */
export function resumeCurrentWorkAfterRisk(save: OfflineGameSave, now: string): OfflineGameSave {
  return pauseCurrentWorkForRisk(save, now)
}
