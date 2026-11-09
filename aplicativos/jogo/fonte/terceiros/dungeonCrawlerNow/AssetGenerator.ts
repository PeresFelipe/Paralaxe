// Copiado de Dungeon Crawler Now, src/systems/AssetGenerator.ts (MIT).
// Mantém os comandos Phaser originais das texturas usadas pelo Paralaxe.
import type Phaser from 'phaser'

export const TILE_SIZE = 16

export class AssetGenerator {
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  createPlayerAssets(): void {
    // Player sprite (adventurer character)
    const playerGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    // Body (blue tunic)
    playerGraphics.fillStyle(0x3b82f6);
    playerGraphics.fillRect(4, 6, 8, 7);
    // Head (skin tone)
    playerGraphics.fillStyle(0xfcd9b6);
    playerGraphics.fillCircle(8, 4, 3);
    // Hair (brown)
    playerGraphics.fillStyle(0x92400e);
    playerGraphics.fillRect(5, 1, 6, 3);
    // Eyes
    playerGraphics.fillStyle(0x1e3a5f);
    playerGraphics.fillRect(6, 3, 1, 1);
    playerGraphics.fillRect(9, 3, 1, 1);
    // Legs
    playerGraphics.fillStyle(0x78350f);
    playerGraphics.fillRect(5, 13, 2, 3);
    playerGraphics.fillRect(9, 13, 2, 3);
    // Arms
    playerGraphics.fillStyle(0xfcd9b6);
    playerGraphics.fillRect(2, 7, 2, 4);
    playerGraphics.fillRect(12, 7, 2, 4);
    // Sword in hand
    playerGraphics.fillStyle(0x9ca3af);
    playerGraphics.fillRect(13, 4, 2, 6);
    playerGraphics.fillStyle(0x78350f);
    playerGraphics.fillRect(13, 9, 2, 2);
    playerGraphics.generateTexture('player', TILE_SIZE, TILE_SIZE);
    playerGraphics.destroy();
  }

  createFloorAndWallAssets(): void {
    // Floor tile
    const floorGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    floorGraphics.fillStyle(0x374151);
    floorGraphics.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    floorGraphics.lineStyle(1, 0x4b5563);
    floorGraphics.strokeRect(0, 0, TILE_SIZE, TILE_SIZE);
    floorGraphics.generateTexture('floor', TILE_SIZE, TILE_SIZE);
    floorGraphics.destroy();

    // Wall tile
    const wallGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    wallGraphics.fillStyle(0x1f2937);
    wallGraphics.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    wallGraphics.lineStyle(1, 0x374151);
    wallGraphics.strokeRect(0, 0, TILE_SIZE, TILE_SIZE);
    wallGraphics.generateTexture('wall', TILE_SIZE, TILE_SIZE);
    wallGraphics.destroy();
  }

  createEnemyAssets(): void {
    // Basic enemy sprite (slime creature)
    const enemyGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    // Slime body
    enemyGraphics.fillStyle(0x22c55e);
    enemyGraphics.fillRoundedRect(2, 6, 12, 10, 4);
    // Slime highlight
    enemyGraphics.fillStyle(0x4ade80);
    enemyGraphics.fillCircle(5, 9, 2);
    // Eyes
    enemyGraphics.fillStyle(0x000000);
    enemyGraphics.fillCircle(6, 10, 2);
    enemyGraphics.fillCircle(10, 10, 2);
    enemyGraphics.fillStyle(0xffffff);
    enemyGraphics.fillCircle(6, 9, 1);
    enemyGraphics.fillCircle(10, 9, 1);
    enemyGraphics.generateTexture('enemy', TILE_SIZE, TILE_SIZE);
    enemyGraphics.destroy();

    // Fast enemy (bat creature)
    const fastEnemyGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    // Wings
    fastEnemyGraphics.fillStyle(0x6b21a8);
    fastEnemyGraphics.fillTriangle(0, 6, 6, 8, 4, 12);
    fastEnemyGraphics.fillTriangle(16, 6, 10, 8, 12, 12);
    // Body
    fastEnemyGraphics.fillStyle(0x581c87);
    fastEnemyGraphics.fillCircle(8, 10, 4);
    // Ears
    fastEnemyGraphics.fillTriangle(5, 6, 6, 10, 7, 6);
    fastEnemyGraphics.fillTriangle(11, 6, 10, 10, 9, 6);
    // Eyes (red glowing)
    fastEnemyGraphics.fillStyle(0xef4444);
    fastEnemyGraphics.fillCircle(6, 9, 1);
    fastEnemyGraphics.fillCircle(10, 9, 1);
    fastEnemyGraphics.generateTexture('enemy_fast', TILE_SIZE, TILE_SIZE);
    fastEnemyGraphics.destroy();

    // Tank enemy (armored orc/golem)
    const tankEnemyGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    // Body (stone/armor)
    tankEnemyGraphics.fillStyle(0x6b7280);
    tankEnemyGraphics.fillRect(2, 4, 12, 12);
    // Head
    tankEnemyGraphics.fillStyle(0x4b5563);
    tankEnemyGraphics.fillRect(4, 1, 8, 6);
    // Helmet
    tankEnemyGraphics.fillStyle(0x78350f);
    tankEnemyGraphics.fillRect(3, 0, 10, 3);
    // Eyes (glowing)
    tankEnemyGraphics.fillStyle(0xfbbf24);
    tankEnemyGraphics.fillRect(5, 3, 2, 2);
    tankEnemyGraphics.fillRect(9, 3, 2, 2);
    // Shoulder pads
    tankEnemyGraphics.fillStyle(0x78350f);
    tankEnemyGraphics.fillRect(0, 4, 3, 4);
    tankEnemyGraphics.fillRect(13, 4, 3, 4);
    tankEnemyGraphics.generateTexture('enemy_tank', TILE_SIZE, TILE_SIZE);
    tankEnemyGraphics.destroy();

    // Ranged enemy (skeleton mage)
    const rangedEnemyGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    // Robe
    rangedEnemyGraphics.fillStyle(0x1e3a5f);
    rangedEnemyGraphics.fillTriangle(8, 5, 2, 15, 14, 15);
    // Skull head
    rangedEnemyGraphics.fillStyle(0xe5e5e5);
    rangedEnemyGraphics.fillCircle(8, 4, 4);
    // Eye sockets
    rangedEnemyGraphics.fillStyle(0x000000);
    rangedEnemyGraphics.fillCircle(6, 4, 1);
    rangedEnemyGraphics.fillCircle(10, 4, 1);
    // Glowing eyes
    rangedEnemyGraphics.fillStyle(0xf97316);
    rangedEnemyGraphics.fillRect(6, 4, 1, 1);
    rangedEnemyGraphics.fillRect(10, 4, 1, 1);
    // Staff
    rangedEnemyGraphics.fillStyle(0x78350f);
    rangedEnemyGraphics.fillRect(13, 2, 2, 12);
    rangedEnemyGraphics.fillStyle(0xf97316);
    rangedEnemyGraphics.fillCircle(14, 2, 2);
    rangedEnemyGraphics.generateTexture('enemy_ranged', TILE_SIZE, TILE_SIZE);
    rangedEnemyGraphics.destroy();

    // Boss enemy (demon lord)
    const bossEnemyGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    // Body
    bossEnemyGraphics.fillStyle(0x7f1d1d);
    bossEnemyGraphics.fillRect(2, 5, 12, 11);
    // Head
    bossEnemyGraphics.fillStyle(0x991b1b);
    bossEnemyGraphics.fillCircle(8, 5, 5);
    // Horns
    bossEnemyGraphics.fillStyle(0x1c1917);
    bossEnemyGraphics.fillTriangle(2, 5, 4, 0, 5, 5);
    bossEnemyGraphics.fillTriangle(14, 5, 12, 0, 11, 5);
    // Glowing eyes
    bossEnemyGraphics.fillStyle(0xfbbf24);
    bossEnemyGraphics.fillRect(5, 4, 2, 2);
    bossEnemyGraphics.fillRect(9, 4, 2, 2);
    // Mouth/fangs
    bossEnemyGraphics.fillStyle(0x000000);
    bossEnemyGraphics.fillRect(6, 7, 4, 2);
    bossEnemyGraphics.fillStyle(0xffffff);
    bossEnemyGraphics.fillTriangle(6, 7, 7, 9, 7, 7);
    bossEnemyGraphics.fillTriangle(10, 7, 9, 9, 9, 7);
    // Wings hint
    bossEnemyGraphics.fillStyle(0x450a0a);
    bossEnemyGraphics.fillTriangle(0, 8, 3, 5, 3, 12);
    bossEnemyGraphics.fillTriangle(16, 8, 13, 5, 13, 12);
    bossEnemyGraphics.generateTexture('enemy_boss', TILE_SIZE, TILE_SIZE);
    bossEnemyGraphics.destroy();
  }

  createSpecialRoomObjectAssets(): void {
    // Treasure chest (closed)
    const chestGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    // Chest body
    chestGraphics.fillStyle(0x8b4513);
    chestGraphics.fillRect(2, 6, 12, 8);
    // Chest lid
    chestGraphics.fillStyle(0xa0522d);
    chestGraphics.fillRoundedRect(1, 3, 14, 5, 2);
    // Metal bands
    chestGraphics.fillStyle(0xfbbf24);
    chestGraphics.fillRect(1, 4, 14, 1);
    chestGraphics.fillRect(1, 10, 14, 1);
    // Lock
    chestGraphics.fillStyle(0xfbbf24);
    chestGraphics.fillRect(6, 6, 4, 4);
    chestGraphics.fillStyle(0x1f2937);
    chestGraphics.fillRect(7, 7, 2, 2);
    chestGraphics.generateTexture('chest_closed', TILE_SIZE, TILE_SIZE);
    chestGraphics.destroy();

    // Treasure chest (open)
    const chestOpenGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    // Chest body
    chestOpenGraphics.fillStyle(0x8b4513);
    chestOpenGraphics.fillRect(2, 8, 12, 6);
    // Open lid (tilted back)
    chestOpenGraphics.fillStyle(0xa0522d);
    chestOpenGraphics.fillRect(2, 2, 12, 4);
    // Metal bands
    chestOpenGraphics.fillStyle(0xfbbf24);
    chestOpenGraphics.fillRect(1, 3, 14, 1);
    chestOpenGraphics.fillRect(2, 10, 12, 1);
    // Gold inside!
    chestOpenGraphics.fillStyle(0xffd700);
    chestOpenGraphics.fillCircle(5, 10, 2);
    chestOpenGraphics.fillCircle(8, 9, 2);
    chestOpenGraphics.fillCircle(11, 10, 2);
    chestOpenGraphics.generateTexture('chest_open', TILE_SIZE, TILE_SIZE);
    chestOpenGraphics.destroy();

    // Healing shrine/fountain
    const shrineGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    // Pedestal
    shrineGraphics.fillStyle(0x6b7280);
    shrineGraphics.fillRect(4, 10, 8, 6);
    shrineGraphics.fillRect(2, 14, 12, 2);
    // Crystal/orb
    shrineGraphics.fillStyle(0x22d3ee);
    shrineGraphics.fillCircle(8, 6, 5);
    shrineGraphics.fillStyle(0x67e8f9);
    shrineGraphics.fillCircle(6, 4, 2);
    // Glow effect
    shrineGraphics.fillStyle(0x22d3ee, 0.3);
    shrineGraphics.fillCircle(8, 6, 7);
    shrineGraphics.generateTexture('shrine', TILE_SIZE, TILE_SIZE);
    shrineGraphics.destroy();

    // Challenge arena skull marker
    const skullMarkerGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    // Skull
    skullMarkerGraphics.fillStyle(0xe5e5e5);
    skullMarkerGraphics.fillCircle(8, 7, 6);
    skullMarkerGraphics.fillRect(5, 11, 6, 3);
    // Eye sockets
    skullMarkerGraphics.fillStyle(0x1f2937);
    skullMarkerGraphics.fillCircle(5, 6, 2);
    skullMarkerGraphics.fillCircle(11, 6, 2);
    // Nose hole
    skullMarkerGraphics.fillTriangle(8, 8, 6, 10, 10, 10);
    // Teeth
    skullMarkerGraphics.fillStyle(0xe5e5e5);
    skullMarkerGraphics.fillRect(5, 11, 1, 2);
    skullMarkerGraphics.fillRect(7, 11, 1, 2);
    skullMarkerGraphics.fillRect(9, 11, 1, 2);
    skullMarkerGraphics.generateTexture('skull_marker', TILE_SIZE, TILE_SIZE);
    skullMarkerGraphics.destroy();
  }
}
