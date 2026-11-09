// Adaptado de itajaja/hb/src/ui/stageView/store.ts (MIT), ver LICENSE.txt.
// indexCells, selectAction e o ramo de execução de selectCell usam IDs de escolhas.
export interface AcaoComAlvos {
  targets(): string[]
  execute(target: string): Promise<void>
}

function indexCells(hexes: string[]): Record<string, string> {
  const index: Record<string, string> = Object.create(null)
  hexes.forEach(h => index[h.toString()] = h)
  return index
}

export function selectAction(action: AcaoComAlvos) {
  return {
    action,
    targets: indexCells(action.targets()),
  }
}

export async function selectCell(action: ReturnType<typeof selectAction>, cell: string) {
  if (action && action.targets[cell.toString()]) {
    await action.action.execute(cell)
  }
}
