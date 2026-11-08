/** Extraído de itajaja/hb/src/ui/stageView/iso.ts (MIT). Ver LICENSE.txt.
 * Mantidas as fórmulas originais; tipos estruturais substituem dependências do motor antigo.
 */
export const HEX_SIZE = 20
export const SCALE_Y_FACTOR = .7
export function projectHex({ q, r }: { q: number; r: number }): { x: number; y: number } {
  return {
    x: (3 / 2) * r * HEX_SIZE,
    y: Math.sqrt(3) * (q + r / 2) * SCALE_Y_FACTOR * HEX_SIZE,
  }
}
function hexCorner(i: number) {
  const angleDeg = 60 * i
  const angleRad = Math.PI / 180 * angleDeg
  return { x: Math.cos(angleRad) * HEX_SIZE, y: Math.sin(angleRad) * SCALE_Y_FACTOR * HEX_SIZE }
}
export const HEX_POINTS = { e: hexCorner(0), se: hexCorner(1), sw: hexCorner(2), w: hexCorner(3), nw: hexCorner(4), ne: hexCorner(5) }
/** Adaptação do drawHex original para dispensar o helper SVG do React 15. */
export const pontosDoHexagono = Object.values(HEX_POINTS).map(p => `${p.x},${p.y}`).join(' ')
