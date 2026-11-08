/** Extraído de src/systems/RoomManager.ts, John VonDrashek (MIT), ver LICENSE.txt.
 * O estado é derivado do agregado do Paralaxe, sem instanciar Phaser ou outro motor de combate.
 */
export const RoomState = {
  UNVISITED: 'unvisited',
  ACTIVE: 'active',
  CLEARED: 'cleared',
} as const
export function obterEstadoDaSala(id: string, atual: string, resolvidas: readonly string[]) {
  if (resolvidas.includes(id)) return RoomState.CLEARED
  return id === atual ? RoomState.ACTIVE : RoomState.UNVISITED
}
