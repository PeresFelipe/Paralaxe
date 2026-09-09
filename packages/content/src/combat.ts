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
] as const satisfies readonly EnemyDefinition[]

export function getCombatAbilityDefinition(abilityId: string) {
  return COMBAT_ABILITIES.find((ability) => ability.id === abilityId) ?? null
}

export function getEnemyDefinition(enemyId: string) {
  return ENEMIES.find((enemy) => enemy.id === enemyId) ?? null
}
