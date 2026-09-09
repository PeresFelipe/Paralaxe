import type { CharacterAttributes, OfflineGameSave } from './character'
import {
  getEquipmentPrimaryValue,
  type DamageType,
  type EquipmentDefinition,
  type ScalingGrade,
} from './equipment'

export type CombatStyle = 'aggressive' | 'defensive' | 'mixed'
export type CombatResource = 'mana' | 'stamina'
export type AbilityProfile = 'aggressive' | 'defensive'

export interface CombatAbilityDefinition {
  id: string
  name: string
  profile: AbilityProfile
  cooldownSeconds: number
  resource?: CombatResource
  resourceCost?: number
  damage?: {
    kind: 'weapon-multiplier' | 'base-scaling'
    multiplier?: number
    basePower?: number
    damageType: DamageType
    scaling?: Partial<Record<keyof CharacterAttributes, ScalingGrade>>
    accuracyBonusPercentagePoints?: number
    criticalBonusPercentagePoints?: number
  }
  heal?: {
    basePower: number
    scaling: Partial<Record<keyof CharacterAttributes, ScalingGrade>>
  }
  canInterrupt?: boolean
}

export interface EnemyAbilityDefinition {
  id: string
  name: string
  cooldownSeconds: number
  initialDelaySeconds?: number
  damageMultiplier: number
  telegraphSeconds?: number
  interruptible?: boolean
}

export interface EnemyDefinition {
  id: string
  name: string
  combatLevel: number
  maxHealth: number
  defense: number
  evasion: number
  accuracy: number
  power: number
  actionIntervalSeconds: number
  basicDamageType: DamageType
  abilities: readonly EnemyAbilityDefinition[]
  xpReward: number
}

export interface CombatEquipmentCatalog {
  getEquipmentDefinition(definitionId: string): EquipmentDefinition | null
}

export interface CombatContentCatalog extends CombatEquipmentCatalog {
  getAbilityDefinition(abilityId: string): CombatAbilityDefinition | null
  getEnemyDefinition(enemyId: string): EnemyDefinition | null
}

export interface CombatPreferences {
  style: CombatStyle
  defensiveHealthThresholdPercent: number
}

export interface CombatResources {
  health: number
  maxHealth: number
  mana: number
  maxMana: number
  stamina: number
  maxStamina: number
}

export interface CombatLogEntry {
  atSeconds: number
  actor: 'player' | 'enemy' | 'system'
  kind: 'basic' | 'ability' | 'telegraph' | 'interrupt' | 'result'
  message: string
}

export interface CombatResult {
  outcome: 'victory' | 'defeat' | 'timeout'
  durationSeconds: number
  player: CombatResources
  enemyHealth: number
  xpGranted: number
  log: CombatLogEntry[]
  seed: number
}

export interface CombatRunSummary {
  enemyDefinitionId: string
  outcome: CombatResult['outcome']
  durationSeconds: number
  seed: number
  completedAt: string
}

export interface CombatState {
  preferences: CombatPreferences
  lastRun: CombatRunSummary | null
  wolfDefeated: boolean
}

const SCALING_MULTIPLIERS: Record<ScalingGrade, number> = {
  S: 1,
  A: 0.85,
  B: 0.7,
  C: 0.5,
  D: 0.3,
  E: 0.15,
}

const EPSILON = 0.000001

interface DerivedPlayerCombatStats {
  maxHealth: number
  maxMana: number
  maxStamina: number
  manaRegenPerSecond: number
  staminaRegenPerSecond: number
  defense: number
  evasion: number
  accuracy: number
  criticalChance: number
  basicAttackPower: number
  basicDamageType: DamageType
  actionIntervalSeconds: number
  weaponScaling: Partial<Record<keyof CharacterAttributes, ScalingGrade>>
}

interface TelegraphState {
  ability: EnemyAbilityDefinition
  resolvesAt: number
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function createRng(seed: number) {
  let state = seed >>> 0

  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 0x1_0000_0000
  }
}

function scalingContribution(
  attributes: CharacterAttributes,
  scaling: Partial<Record<keyof CharacterAttributes, ScalingGrade>>,
) {
  return Object.entries(scaling).reduce((total, [attributeKey, grade]) => {
    if (!grade) return total
    const value = attributes[attributeKey as keyof CharacterAttributes]
    return total + value * SCALING_MULTIPLIERS[grade]
  }, 0)
}

function mitigation(defense: number, attackerLevel: number) {
  return Math.min(0.75, defense / (defense + 100 + 5 * attackerLevel))
}

function calculateHitChance(accuracy: number, evasion: number, bonusPercentagePoints = 0) {
  return clamp(0.9 + (accuracy - evasion) * 0.0025 + bonusPercentagePoints / 100, 0.7, 0.99)
}

function getEquippedDefinitions(save: OfflineGameSave, catalog: CombatEquipmentCatalog) {
  return Object.values(save.character.equipment).flatMap((instanceId) => {
    const instance = save.character.equipmentItems.find((item) => item.instanceId === instanceId)
    if (!instance) return []

    const definition = catalog.getEquipmentDefinition(instance.definitionId)
    return definition ? [{ instance, definition }] : []
  })
}

export function derivePlayerCombatStats(
  save: OfflineGameSave,
  catalog: CombatEquipmentCatalog,
): DerivedPlayerCombatStats {
  const { attributes } = save.character
  const equipped = getEquippedDefinitions(save, catalog)
  const mainHandInstanceId = save.character.equipment.mainHand
  const mainHand = equipped.find((entry) => entry.instance.instanceId === mainHandInstanceId)

  if (!mainHand?.definition.weaponCombat) {
    throw new Error('O personagem precisa de uma arma válida equipada para combater.')
  }

  const defense = equipped.reduce((total, entry) => {
    if (entry.definition.primaryStat?.kind !== 'defense') return total
    return total + (getEquipmentPrimaryValue(entry.definition, entry.instance.upgradeLevel) ?? 0)
  }, 0)

  const weaponPower =
    mainHand.definition.primaryStat?.kind === 'attack'
      ? getEquipmentPrimaryValue(mainHand.definition, mainHand.instance.upgradeLevel) ?? 0
      : 0
  const speedBonus = Math.min(0.25, attributes.dexterity * 0.004)

  return {
    maxHealth: 100 + attributes.vitality * 12,
    maxMana: 30 + attributes.mind * 10,
    maxStamina: 60 + attributes.vigor * 8,
    manaRegenPerSecond: 1.5 + attributes.mind * 0.35,
    staminaRegenPerSecond: 5 + attributes.vigor * 0.6,
    defense,
    evasion: 100,
    accuracy: 100 + attributes.dexterity * 2,
    criticalChance: 0.05 + attributes.dexterity * 0.0025,
    basicAttackPower: weaponPower,
    basicDamageType: mainHand.definition.weaponCombat.damageType,
    actionIntervalSeconds: mainHand.definition.weaponCombat.actionIntervalSeconds / (1 + speedBonus),
    weaponScaling: mainHand.definition.weaponCombat.scaling,
  }
}

function rollDamage(
  rawDamage: number,
  targetDefense: number,
  attackerLevel: number,
  criticalChance: number,
  random: () => number,
) {
  const isCritical = random() < criticalChance
  const criticalMultiplier = isCritical ? 1.5 : 1
  const finalDamage = rawDamage * criticalMultiplier * (1 - mitigation(targetDefense, attackerLevel))
  return { damage: Math.max(1, Math.round(finalDamage)), isCritical }
}

function choosePlayerAbility(
  save: OfflineGameSave,
  catalog: CombatContentCatalog,
  preferences: CombatPreferences,
  resources: CombatResources,
  cooldownReadyAt: Map<string, number>,
  now: number,
) {
  const healthPercent = (resources.health / resources.maxHealth) * 100
  const available = save.character.activeAbilitySlots
    .map((abilityId, slot) => ({ abilityId, slot }))
    .filter((entry): entry is { abilityId: string; slot: number } => Boolean(entry.abilityId))
    .map((entry) => ({ ...entry, definition: catalog.getAbilityDefinition(entry.abilityId) }))
    .filter((entry) => entry.definition !== null)
    .filter((entry) => (cooldownReadyAt.get(entry.abilityId) ?? 0) <= now + EPSILON)
    .filter((entry) => {
      const ability = entry.definition
      if (!ability) return false
      if (ability.resource === 'mana' && resources.mana < (ability.resourceCost ?? 0)) return false
      if (ability.resource === 'stamina' && resources.stamina < (ability.resourceCost ?? 0)) return false
      if (ability.profile === 'defensive') {
        return healthPercent <= preferences.defensiveHealthThresholdPercent
      }
      return true
    })

  const ranked = available.toSorted((a, b) => {
    if (preferences.style === 'mixed') return a.slot - b.slot
    const wantedProfile = preferences.style === 'aggressive' ? 'aggressive' : 'defensive'
    const aPreferred = a.definition?.profile === wantedProfile ? 0 : 1
    const bPreferred = b.definition?.profile === wantedProfile ? 0 : 1
    return aPreferred - bPreferred || a.slot - b.slot
  })

  return ranked[0]?.definition ?? null
}

function consumeAbilityResource(resources: CombatResources, ability: CombatAbilityDefinition) {
  const cost = ability.resourceCost ?? 0
  if (ability.resource === 'mana') resources.mana -= cost
  if (ability.resource === 'stamina') resources.stamina -= cost
}

export function simulateCombat(
  save: OfflineGameSave,
  catalog: CombatContentCatalog,
  enemyDefinitionId: string,
  seed: number,
  maxDurationSeconds = 180,
): CombatResult {
  if (save.idle.activeActivity || save.crafting.activeRecipe) {
    throw new Error('Interrompa a atividade Idle antes de iniciar um combate.')
  }

  const enemy = catalog.getEnemyDefinition(enemyDefinitionId)
  if (!enemy) throw new Error('Inimigo não encontrado no Content Catalog.')

  const stats = derivePlayerCombatStats(save, catalog)
  const resources: CombatResources = {
    health: stats.maxHealth,
    maxHealth: stats.maxHealth,
    mana: stats.maxMana,
    maxMana: stats.maxMana,
    stamina: stats.maxStamina,
    maxStamina: stats.maxStamina,
  }
  const preferences = save.combat.preferences
  const random = createRng(seed)
  const log: CombatLogEntry[] = []
  const playerCooldowns = new Map<string, number>()
  const enemyCooldowns = new Map<string, number>()

  let enemyHealth = enemy.maxHealth
  let now = 0
  let lastTime = 0
  let playerReadyAt = stats.actionIntervalSeconds
  let enemyReadyAt = enemy.actionIntervalSeconds
  let telegraph: TelegraphState | null = null

  for (const ability of enemy.abilities) {
    enemyCooldowns.set(ability.id, ability.initialDelaySeconds ?? 0)
  }

  while (now <= maxDurationSeconds + EPSILON && resources.health > 0 && enemyHealth > 0) {
    const telegraphResolutionAt = telegraph?.resolvesAt ?? Number.POSITIVE_INFINITY
    const nextTime = Math.min(playerReadyAt, enemyReadyAt, telegraphResolutionAt, maxDurationSeconds)

    if (!Number.isFinite(nextTime)) break

    now = nextTime
    const delta = Math.max(0, now - lastTime)
    resources.mana = Math.min(resources.maxMana, resources.mana + stats.manaRegenPerSecond * delta)
    resources.stamina = Math.min(resources.maxStamina, resources.stamina + stats.staminaRegenPerSecond * delta)
    lastTime = now

    if (telegraph && Math.abs(telegraph.resolvesAt - now) <= EPSILON) {
      const hitChance = calculateHitChance(enemy.accuracy, stats.evasion)
      if (random() < hitChance) {
        const raw = enemy.power * telegraph.ability.damageMultiplier
        const damage = Math.max(1, Math.round(raw * (1 - mitigation(stats.defense, enemy.combatLevel))))
        resources.health = Math.max(0, resources.health - damage)
        log.push({
          atSeconds: now,
          actor: 'enemy',
          kind: 'ability',
          message: `${enemy.name} usa ${telegraph.ability.name} e causa ${damage} de dano.`,
        })
      } else {
        log.push({
          atSeconds: now,
          actor: 'enemy',
          kind: 'ability',
          message: `${enemy.name} usa ${telegraph.ability.name}, mas erra.`,
        })
      }
      telegraph = null
      enemyReadyAt = now + enemy.actionIntervalSeconds
      continue
    }

    if (Math.abs(playerReadyAt - now) <= EPSILON && resources.health > 0 && enemyHealth > 0) {
      const ability = choosePlayerAbility(save, catalog, preferences, resources, playerCooldowns, now)

      if (ability) {
        consumeAbilityResource(resources, ability)
        playerCooldowns.set(ability.id, now + ability.cooldownSeconds)

        if (telegraph && ability.canInterrupt && telegraph.ability.interruptible) {
          log.push({
            atSeconds: now,
            actor: 'player',
            kind: 'interrupt',
            message: `${ability.name} interrompe ${telegraph.ability.name}.`,
          })
          telegraph = null
          enemyReadyAt = now + enemy.actionIntervalSeconds
        }

        if (ability.heal) {
          const heal = Math.round(
            ability.heal.basePower + scalingContribution(save.character.attributes, ability.heal.scaling),
          )
          const recovered = Math.min(heal, resources.maxHealth - resources.health)
          resources.health += recovered
          log.push({
            atSeconds: now,
            actor: 'player',
            kind: 'ability',
            message: `${ability.name} recupera ${recovered} de Vida.`,
          })
        } else if (ability.damage) {
          const hitChance = calculateHitChance(
            stats.accuracy,
            enemy.evasion,
            ability.damage.accuracyBonusPercentagePoints ?? 0,
          )

          if (random() < hitChance) {
            const rawDamage =
              ability.damage.kind === 'weapon-multiplier'
                ? (stats.basicAttackPower + scalingContribution(save.character.attributes, stats.weaponScaling)) *
                  (ability.damage.multiplier ?? 1)
                : (ability.damage.basePower ?? 0) +
                  scalingContribution(save.character.attributes, ability.damage.scaling ?? {})
            const criticalChance = clamp(
              stats.criticalChance + (ability.damage.criticalBonusPercentagePoints ?? 0) / 100,
              0,
              1,
            )
            const rolled = rollDamage(rawDamage, enemy.defense, save.character.level, criticalChance, random)
            enemyHealth = Math.max(0, enemyHealth - rolled.damage)
            log.push({
              atSeconds: now,
              actor: 'player',
              kind: 'ability',
              message: `${ability.name} causa ${rolled.damage} de dano${rolled.isCritical ? ' crítico' : ''}.`,
            })
          } else {
            log.push({
              atSeconds: now,
              actor: 'player',
              kind: 'ability',
              message: `${ability.name} erra.`,
            })
          }
        }
      } else {
        const hitChance = calculateHitChance(stats.accuracy, enemy.evasion)
        if (random() < hitChance) {
          const rawDamage = stats.basicAttackPower + scalingContribution(save.character.attributes, stats.weaponScaling)
          const rolled = rollDamage(rawDamage, enemy.defense, save.character.level, stats.criticalChance, random)
          enemyHealth = Math.max(0, enemyHealth - rolled.damage)
          log.push({
            atSeconds: now,
            actor: 'player',
            kind: 'basic',
            message: `Ataque básico causa ${rolled.damage} de dano${rolled.isCritical ? ' crítico' : ''}.`,
          })
        } else {
          log.push({ atSeconds: now, actor: 'player', kind: 'basic', message: 'Ataque básico erra.' })
        }
      }

      playerReadyAt = now + stats.actionIntervalSeconds
      if (enemyHealth <= 0) break
    }

    if (
      Math.abs(enemyReadyAt - now) <= EPSILON &&
      resources.health > 0 &&
      enemyHealth > 0 &&
      !telegraph
    ) {
      const readyAbility = enemy.abilities.find(
        (ability) => (enemyCooldowns.get(ability.id) ?? 0) <= now + EPSILON,
      )

      if (readyAbility) {
        enemyCooldowns.set(readyAbility.id, now + readyAbility.cooldownSeconds)
        if ((readyAbility.telegraphSeconds ?? 0) > 0) {
          telegraph = { ability: readyAbility, resolvesAt: now + (readyAbility.telegraphSeconds ?? 0) }
          enemyReadyAt = Number.POSITIVE_INFINITY
          log.push({
            atSeconds: now,
            actor: 'enemy',
            kind: 'telegraph',
            message: `${enemy.name} prepara ${readyAbility.name} por ${readyAbility.telegraphSeconds}s.`,
          })
        } else {
          const hitChance = calculateHitChance(enemy.accuracy, stats.evasion)
          if (random() < hitChance) {
            const raw = enemy.power * readyAbility.damageMultiplier
            const damage = Math.max(1, Math.round(raw * (1 - mitigation(stats.defense, enemy.combatLevel))))
            resources.health = Math.max(0, resources.health - damage)
            log.push({
              atSeconds: now,
              actor: 'enemy',
              kind: 'ability',
              message: `${enemy.name} usa ${readyAbility.name} e causa ${damage} de dano.`,
            })
          }
          enemyReadyAt = now + enemy.actionIntervalSeconds
        }
      } else {
        const hitChance = calculateHitChance(enemy.accuracy, stats.evasion)
        if (random() < hitChance) {
          const damage = Math.max(
            1,
            Math.round(enemy.power * (1 - mitigation(stats.defense, enemy.combatLevel))),
          )
          resources.health = Math.max(0, resources.health - damage)
          log.push({
            atSeconds: now,
            actor: 'enemy',
            kind: 'basic',
            message: `${enemy.name} causa ${damage} de dano.`,
          })
        } else {
          log.push({ atSeconds: now, actor: 'enemy', kind: 'basic', message: `${enemy.name} erra.` })
        }
        enemyReadyAt = now + enemy.actionIntervalSeconds
      }
    }

    if (Math.abs(now - maxDurationSeconds) <= EPSILON) break
  }

  const outcome: CombatResult['outcome'] =
    enemyHealth <= 0 ? 'victory' : resources.health <= 0 ? 'defeat' : 'timeout'
  const xpGranted = outcome === 'victory' ? enemy.xpReward : 0
  log.push({
    atSeconds: now,
    actor: 'system',
    kind: 'result',
    message:
      outcome === 'victory'
        ? `Vitória. +${xpGranted} XP geral.`
        : outcome === 'defeat'
          ? 'Derrota. O personagem retorna à Cidade Livre.'
          : 'Combate encerrado por limite de simulação.',
  })

  return {
    outcome,
    durationSeconds: Number(now.toFixed(3)),
    player: {
      ...resources,
      mana: Number(resources.mana.toFixed(3)),
      stamina: Number(resources.stamina.toFixed(3)),
    },
    enemyHealth,
    xpGranted,
    log,
    seed,
  }
}

export function applyCombatResult(
  save: OfflineGameSave,
  enemyDefinitionId: string,
  result: CombatResult,
  now: string,
): OfflineGameSave {
  return {
    ...save,
    updatedAt: now,
    character: {
      ...save.character,
      xp: save.character.xp + result.xpGranted,
      currentLocationId: 'free-city.tavern',
    },
    combat: {
      ...save.combat,
      wolfDefeated: save.combat.wolfDefeated || (enemyDefinitionId === 'enemy.road-wolf' && result.outcome === 'victory'),
      lastRun: {
        enemyDefinitionId,
        outcome: result.outcome,
        durationSeconds: result.durationSeconds,
        seed: result.seed,
        completedAt: now,
      },
    },
  }
}