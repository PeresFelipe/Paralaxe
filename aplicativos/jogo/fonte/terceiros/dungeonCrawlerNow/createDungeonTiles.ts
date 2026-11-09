// Adaptado de src/scenes/game/GameSceneInit.ts (MIT), ramo de texturas simples.
// O recorte limita a renderização à sala atual e dispensa corpos físicos.
import type Phaser from 'phaser'
import type { DungeonData, Room } from './DungeonGenerator'
import { TILE_SIZE } from './AssetGenerator'

export function createDungeonTiles(scene: Phaser.Scene, dungeon: DungeonData, room: Room) {
  const floorLayer = scene.add.group()
  const wallLayer = scene.add.group()

  for (let y = room.y - 1; y <= room.y + room.height; y++) {
    for (let x = room.x - 1; x <= room.x + room.width; x++) {
      const tileX = x * TILE_SIZE
      const tileY = y * TILE_SIZE
      if (dungeon.tiles[y]?.[x] === 0) {
        const floor = scene.add.sprite(tileX, tileY, 'floor').setOrigin(0, 0)
        floor.setDepth(0)
        floorLayer.add(floor)
      } else {
        const wall = scene.add.sprite(tileX, tileY, 'wall').setOrigin(0, 0)
        wallLayer.add(wall)
      }
    }
  }

  return { wallLayer, floorLayer }
}
