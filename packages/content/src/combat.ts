import type { CombatAbilityDefinition, EnemyDefinition } from '@greywake/domain'

export const COMBAT_ABILITIES = [
  {
    id: 'ability.strength-strike',
    name: 'Golpe de Força',
    profile: 'aggressive',
    cooldownSeconds: 6,
    resource: 'stamina',
    resourceCost: 28,
    damage: { kind: 'weapon-multiplier', multiplier: 1.55, damageType: 'slash' },
  },
  {
    id: 'ability.arcane-pulse',
    name: 'Pulso Arcano',
    profile: 'aggressive',
    cooldownSeconds: 5,
    resource: 'mana',
    resourceCost: 24,
    damage: {
      kind: 'base-scaling',
      basePower: 24,
      damageType: 'arcane',
      scaling: { intelligence: 'A' },
    },
  },
  {
    id: 'ability.precise-shot',
    name: 'Disparo Preciso',
    profile: 'aggressive',
    cooldownSeconds: 6,
    resource: 'stamina',
    resourceCost: 24,
    damage: {
      kind: 'weapon-multiplier',
      multiplier: 1.5,
      damageType: 'pierce',
      accuracyBonusPercentagePoints: 15,
    },
  },
  {
    id: 'ability.restoring-prayer',
    name: 'Prece Restauradora',
    profile: 'defensive',
    cooldownSeconds: 10,
    resource: 'mana',
    resourceCost: 36,
    heal: { basePower: 24, scaling: { faith: 'S' } },
  },
  {
    id: 'ability.opportunistic-strike',
    name: 'Golpe Oportuno',
    profile: 'aggressive',
    cooldownSeconds: 5,
    resource: 'stamina',
    resourceCost: 20,
    damage: {
      kind: 'weapon-multiplier',
      multiplier: 1.25,
      damageType: 'pierce',
      criticalBonusPercentagePoints: 25,
    },
  },
  {
    id: 'ability.opening',
    name: 'Abertura',
    profile: 'aggressive',
    cooldownSeconds: 7,
    damage: {
      kind: 'weapon-multiplier',
      multiplier: 1.35,
      damageType: 'pierce',
      accuracyBonusPercentagePoints: 10,
    },
  },
  {
    id: 'ability.instinctive-guard',
    name: 'Guarda Instintiva',
    profile: 'defensive',
    cooldownSeconds: 14,
  },
] as const satisfies readonly CombatAbilityDefinition[]

export const ENEMIES = [
  {
    id: 'enemy.road-wolf',
    name: 'Lobo de Estrada',
    combatLevel: 2,
    maxHealth: 60,
    defense: 4,
    evasion: 98,
    accuracy: 102,
    power: 8,
    actionIntervalSeconds: 2.25,
    basicDamageType: 'slash',
    abilities: [
      {
        id: 'enemy.road-wolf.pounce',
        name: 'Bote',
        cooldownSeconds: 7,
        initialDelaySeconds: 2.5,
        damageMultiplier: 1.5,
        telegraphSeconds: 1.2,
        interruptible: true,
      },
    ],
    xpReward: 35,
  },
  {
    id: 'enemy.crubach',
    name: 'Crúbach',
    combatLevel: 4,
    maxHealth: 85,
    defense: 8,
    evasion: 100,
    accuracy: 108,
    power: 8,
    actionIntervalSeconds: 1.65,
    basicDamageType: 'slash',
    abilities: [
      { id: 'enemy.crubach.slash', name: 'Talho', cooldownSeconds: 5, damageMultiplier: 1.35 },
      { id: 'enemy.crubach.short-leap', name: 'Salto Curto', cooldownSeconds: 8, initialDelaySeconds: 3, damageMultiplier: 0.75 },
    ],
    xpReward: 18,
  },
  {
    id: 'enemy.tromghiallach',
    name: 'Tromghiallach',
    combatLevel: 5,
    maxHealth: 130,
    defense: 18,
    evasion: 95,
    accuracy: 100,
    power: 12,
    actionIntervalSeconds: 2.8,
    basicDamageType: 'impact',
    abilities: [
      { id: 'enemy.tromghiallach.heavy', name: 'Golpe Pesado', cooldownSeconds: 7, damageMultiplier: 1.65, telegraphSeconds: 1.1, interruptible: true },
      { id: 'enemy.tromghiallach.hold', name: 'Firmar Posição', cooldownSeconds: 9, damageMultiplier: 0 },
    ],
    xpReward: 26,
  },
  {
    id: 'enemy.cosantoir',
    name: 'Cosantóir',
    combatLevel: 6,
    maxHealth: 240,
    defense: 28,
    evasion: 98,
    accuracy: 106,
    power: 15,
    actionIntervalSeconds: 2.35,
    basicDamageType: 'pierce',
    abilities: [
      { id: 'enemy.cosantoir.thrust', name: 'Estocada', cooldownSeconds: 5, damageMultiplier: 1.25 },
      { id: 'enemy.cosantoir.shield', name: 'Golpe de Escudo', cooldownSeconds: 7, damageMultiplier: 0.9 },
      { id: 'enemy.cosantoir.advance', name: 'Avanço do Guardião', cooldownSeconds: 12, initialDelaySeconds: 4, damageMultiplier: 1.8, telegraphSeconds: 1.8, interruptible: true },
    ],
    xpReward: 70,
  },
  {
    id: 'enemy.fairtheoir',
    name: 'Fairtheoir — O Último Vigia',
    combatLevel: 8,
    maxHealth: 375,
    defense: 35,
    evasion: 95,
    accuracy: 110,
    power: 13,
    actionIntervalSeconds: 2.6,
    basicDamageType: 'impact',
    abilities: [
      { id: 'enemy.fairtheoir.heavy', name: 'Golpe Pesado', cooldownSeconds: 7, damageMultiplier: 1.6, telegraphSeconds: 1.4, interruptible: true },
      { id: 'enemy.fairtheoir.sweep', name: 'Varredura', cooldownSeconds: 5.5, damageMultiplier: 1.05 },
      { id: 'enemy.fairtheoir.last-charge', name: 'Última Investida', cooldownSeconds: 13, initialDelaySeconds: 18, damageMultiplier: 2.2, telegraphSeconds: 2.4, interruptible: false },
    ],
    xpReward: 120,
  },
] as const satisfies readonly EnemyDefinition[]

export function getCombatAbilityDefinition(abilityId: string) {
  return COMBAT_ABILITIES.find((ability) => ability.id === abilityId) ?? null
}

export function getEnemyDefinition(enemyId: string) {
  return ENEMIES.find((enemy) => enemy.id === enemyId) ?? null
}
