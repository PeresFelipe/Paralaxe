import type { CharacterAttributes, InventoryStack, OfflineGameSave } from './character'
import {
  getEquipmentPrimaryValue,
  type DamageType,
  type EquipmentDefinition,
  type ScalingGrade,
} from './equipment'

export type CombatStyle = 'aggressive' | 'defensive' | 'mixed'
export type CombatResource = 'mana' | 'stamina'
export type CombatThresholdResource = 'health' | 'mana' | 'stamina'
export type AbilityProfile = 'aggressive' | 'defensive'
export type CombatStatusId = 'poison' | 'bleed' | 'stun' | 'burn' | 'freeze'
export type ResistanceLevel = 'weak' | 'normal' | 'resistant' | 'very-resistant' | 'immune'

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

export interface StatusApplicationDefinition {
  status: CombatStatusId
  buildup: number
}

export interface EnemyAbilityDefinition {
  id: string
  name: string
  cooldownSeconds: number
  initialDelaySeconds?: number
  damageMultiplier?: number
  damageType?: DamageType
  telegraphSeconds?: number
  interruptible?: boolean
  statusApplications?: readonly StatusApplicationDefinition[]
  nextIntervalMultiplier?: number
  selfDamageTakenMultiplier?: number
  selfEffectDurationSeconds?: number
  vulnerabilityAfter?: {
    damageTakenMultiplier: number
    durationSeconds: number
  }
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
  damageResistances?: Partial<Record<DamageType, ResistanceLevel>>
  statusResistances?: Partial<Record<CombatStatusId, ResistanceLevel>>
  isBoss?: boolean
  xpReward: number
}

export interface CombatConsumableDefinition {
  id: string
  name: string
  restore: {
    health?: number
    mana?: number
    stamina?: number
  }
}

export interface CombatEquipmentCatalog {
  getEquipmentDefinition(definitionId: string): EquipmentDefinition | null
}

export interface CombatContentCatalog extends CombatEquipmentCatalog {
  getAbilityDefinition(abilityId: string): CombatAbilityDefinition | null
  getEnemyDefinition(enemyId: string): EnemyDefinition | null
  getConsumableDefinition?(definitionId: string): CombatConsumableDefinition | null
}

export interface CombatConsumableSlot {
  definitionId: string | null
  autoUseResource: CombatThresholdResource | null
  autoUseThresholdPercent: number | null
}

export interface CombatPreferences {
  style: CombatStyle
  defensiveHealthThresholdPercent: number
  consumableSlots: [CombatConsumableSlot, CombatConsumableSlot]
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
  kind:
    | 'basic'
    | 'ability'
    | 'consumable'
    | 'telegraph'
    | 'interrupt'
    | 'status'
    | 'posture'
    | 'result'
  message: string
}

export interface CombatResult {
  outcome: 'victory' | 'defeat' | 'timeout'
  durationSeconds: number
  player: CombatResources
  enemyHealth: number
  xpGranted: number
  consumedItems: InventoryStack[]
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

const DAMAGE_RESISTANCE_MULTIPLIERS: Record<ResistanceLevel, number> = {
  weak: 1.25,
  normal: 1,
  resistant: 0.8,
  'very-resistant': 0.6,
  immune: 0,
}

const STATUS_RESISTANCE_MULTIPLIERS: Record<ResistanceLevel, number> = {
  weak: 1.25,
  normal: 1,
  resistant: 0.75,
  'very-resistant': 0.5,
  immune: 0,
}

const STATUS_THRESHOLD = 100
const BUILDUP_DECAY_DELAY_SECONDS = 3
const BUILDUP_DECAY_PER_SECOND = 12
const POST_PROC_RESISTANCE_SECONDS = 6
const POST_PROC_BUILDUP_MULTIPLIER = 0.5
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

interface BuildupState {
  value: number
  lastAppliedAt: number
  lastEvaluatedAt: number
  temporaryResistanceUntil: number
}

interface TimedDamageTakenEffect {
  multiplier: number
  expiresAt: number
  label: string
}

interface ActivePlayerStatuses {
  poisonUntil: number
  burnUntil: number
  freezeUntil: number
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

export function createDefaultConsumableSlots(): [CombatConsumableSlot, CombatConsumableSlot] {
  return [
    { definitionId: null, autoUseResource: null, autoUseThresholdPercent: null },
    { definitionId: null, autoUseResource: null, autoUseThresholdPercent: null },
  ]
}

export function configureCombatConsumableSlot(
  save: OfflineGameSave,
  slotIndex: 0 | 1,
  definitionId: string | null,
  autoUseResource: CombatThresholdResource | null,
  autoUseThresholdPercent: number | null,
  now: string,
): OfflineGameSave {
  if (autoUseThresholdPercent !== null) {
    if (!Number.isFinite(autoUseThresholdPercent) || autoUseThresholdPercent < 1 || autoUseThresholdPercent > 100) {
      throw new Error('Threshold automático precisa estar entre 1% e 100%.')
    }
    if (!autoUseResource) throw new Error('Escolha o recurso que dispara o uso automático.')
  }

  const slots: [CombatConsumableSlot, CombatConsumableSlot] = [
    { ...save.combat.preferences.consumableSlots[0] },
    { ...save.combat.preferences.consumableSlots[1] },
  ]
  slots[slotIndex] = {
    definitionId,
    autoUseResource: definitionId ? autoUseResource : null,
    autoUseThresholdPercent: definitionId ? autoUseThresholdPercent : null,
  }

  return {
    ...save,
    updatedAt: now,
    combat: {
      ...save.combat,
      preferences: { ...save.combat.preferences, consumableSlots: slots },
    },
  }
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

function initialCombatResources(
  stats: DerivedPlayerCombatStats,
  persisted?: CombatResources,
): CombatResources {
  if (!persisted) {
    return {
      health: stats.maxHealth,
      maxHealth: stats.maxHealth,
      mana: stats.maxMana,
      maxMana: stats.maxMana,
      stamina: stats.maxStamina,
      maxStamina: stats.maxStamina,
    }
  }

  return {
    health: clamp(persisted.health, 0, stats.maxHealth),
    maxHealth: stats.maxHealth,
    mana: clamp(persisted.mana, 0, stats.maxMana),
    maxMana: stats.maxMana,
    stamina: clamp(persisted.stamina, 0, stats.maxStamina),
    maxStamina: stats.maxStamina,
  }
}

function rollDamage(
  rawDamage: number,
  targetDefense: number,
  attackerLevel: number,
  criticalChance: number,
  random: () => number,
  externalMultiplier = 1,
) {
  const isCritical = random() < criticalChance
  const criticalMultiplier = isCritical ? 1.5 : 1
  const finalDamage =
    rawDamage * criticalMultiplier * externalMultiplier * (1 - mitigation(targetDefense, attackerLevel))
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

function resourcePercent(resources: CombatResources, resource: CombatThresholdResource) {
  if (resource === 'health') return (resources.health / resources.maxHealth) * 100
  if (resource === 'mana') return (resources.mana / resources.maxMana) * 100
  return (resources.stamina / resources.maxStamina) * 100
}

function canBenefitFromConsumable(resources: CombatResources, definition: CombatConsumableDefinition) {
  return (
    ((definition.restore.health ?? 0) > 0 && resources.health < resources.maxHealth) ||
    ((definition.restore.mana ?? 0) > 0 && resources.mana < resources.maxMana) ||
    ((definition.restore.stamina ?? 0) > 0 && resources.stamina < resources.maxStamina)
  )
}

function applyConsumable(resources: CombatResources, definition: CombatConsumableDefinition) {
  const before = { ...resources }
  resources.health = Math.min(resources.maxHealth, resources.health + (definition.restore.health ?? 0))
  resources.mana = Math.min(resources.maxMana, resources.mana + (definition.restore.mana ?? 0))
  resources.stamina = Math.min(resources.maxStamina, resources.stamina + (definition.restore.stamina ?? 0))
  return {
    health: Math.round(resources.health - before.health),
    mana: Math.round(resources.mana - before.mana),
    stamina: Math.round(resources.stamina - before.stamina),
  }
}

function removeConsumedItems(inventory: InventoryStack[], consumedItems: InventoryStack[]) {
  const consumed = new Map(consumedItems.map((stack) => [stack.definitionId, stack.quantity]))
  return inventory
    .map((stack) => ({
      ...stack,
      quantity: Math.max(0, stack.quantity - (consumed.get(stack.definitionId) ?? 0)),
    }))
    .filter((stack) => stack.quantity > 0)
}

function resistanceMultiplier(level: ResistanceLevel | undefined) {
  return DAMAGE_RESISTANCE_MULTIPLIERS[level ?? 'normal']
}

function statusResistanceMultiplier(level: ResistanceLevel | undefined) {
  return STATUS_RESISTANCE_MULTIPLIERS[level ?? 'normal']
}

function currentTimedMultiplier(effects: TimedDamageTakenEffect[], now: number) {
  return effects
    .filter((effect) => effect.expiresAt > now + EPSILON)
    .reduce((total, effect) => total * effect.multiplier, 1)
}

function decayBuildup(state: BuildupState, now: number) {
  const decayStartsAt = state.lastAppliedAt + BUILDUP_DECAY_DELAY_SECONDS
  const from = Math.max(state.lastEvaluatedAt, decayStartsAt)
  if (now > from) {
    state.value = Math.max(0, state.value - (now - from) * BUILDUP_DECAY_PER_SECOND)
  }
  state.lastEvaluatedAt = now
}

export function simulateCombat(
  save: OfflineGameSave,
  catalog: CombatContentCatalog,
  enemyDefinitionId: string,
  seed: number,
  maxDurationSeconds = 180,
  startingResources?: CombatResources,
  manualConsumableSlotIndex?: 0 | 1,
): CombatResult {
  if (save.idle.activeActivity || save.crafting.activeRecipe) {
    throw new Error('Interrompa a atividade Idle antes de iniciar um combate.')
  }

  const enemy = catalog.getEnemyDefinition(enemyDefinitionId)
  if (!enemy) throw new Error('Inimigo não encontrado no Content Catalog.')

  const stats = derivePlayerCombatStats(save, catalog)
  const resources = initialCombatResources(stats, startingResources)
  const preferences = save.combat.preferences
  const random = createRng(seed)
  const log: CombatLogEntry[] = []
  const playerCooldowns = new Map<string, number>()
  const enemyCooldowns = new Map<string, number>()
  const inventoryAvailable = new Map(save.character.inventory.map((stack) => [stack.definitionId, stack.quantity]))
  const consumedByDefinition = new Map<string, number>()
  const buildup = new Map<CombatStatusId, BuildupState>()
  const activePlayerStatuses: ActivePlayerStatuses = {
    poisonUntil: 0,
    burnUntil: 0,
    freezeUntil: 0,
  }
  let enemyDamageTakenEffects: TimedDamageTakenEffect[] = []
  let manualConsumablePending = manualConsumableSlotIndex ?? null

  let enemyHealth = enemy.maxHealth
  let now = 0
  let lastTime = 0
  let playerReadyAt = stats.actionIntervalSeconds
  let enemyReadyAt = enemy.actionIntervalSeconds
  let telegraph: TelegraphState | null = null

  for (const ability of enemy.abilities) {
    enemyCooldowns.set(ability.id, ability.initialDelaySeconds ?? 0)
  }

  function playerDefenseAt(time: number) {
    return stats.defense * (activePlayerStatuses.burnUntil > time + EPSILON ? 0.85 : 1)
  }

  function playerActionIntervalAt(time: number) {
    return stats.actionIntervalSeconds * (activePlayerStatuses.freezeUntil > time + EPSILON ? 1.3 : 1)
  }

  function advanceContinuousEffects(from: number, to: number) {
    if (to <= from) return
    const poisonSeconds = Math.max(0, Math.min(to, activePlayerStatuses.poisonUntil) - from)
    const burnSeconds = Math.max(0, Math.min(to, activePlayerStatuses.burnUntil) - from)
    const poisonDamage = poisonSeconds * resources.maxHealth * 0.02
    const burnDamage = burnSeconds * 3
    const total = poisonDamage + burnDamage
    if (total > 0) resources.health = Math.max(0, resources.health - total)

    for (const state of buildup.values()) decayBuildup(state, to)
    enemyDamageTakenEffects = enemyDamageTakenEffects.filter((effect) => effect.expiresAt > to + EPSILON)
  }

  function applyStatusBuildup(application: StatusApplicationDefinition) {
    const state = buildup.get(application.status) ?? {
      value: 0,
      lastAppliedAt: now,
      lastEvaluatedAt: now,
      temporaryResistanceUntil: 0,
    }
    decayBuildup(state, now)
    const temporaryMultiplier =
      state.temporaryResistanceUntil > now + EPSILON ? POST_PROC_BUILDUP_MULTIPLIER : 1
    const received = application.buildup * temporaryMultiplier
    state.value += received
    state.lastAppliedAt = now
    state.lastEvaluatedAt = now
    log.push({
      atSeconds: now,
      actor: 'system',
      kind: 'status',
      message: `${application.status}: +${Math.round(received)} buildup (${Math.round(state.value)}/${STATUS_THRESHOLD}).`,
    })

    if (state.value >= STATUS_THRESHOLD) {
      state.value = 0
      state.temporaryResistanceUntil = now + POST_PROC_RESISTANCE_SECONDS

      if (application.status === 'bleed') {
        const damage = Math.max(1, Math.round(resources.health * 0.08))
        resources.health = Math.max(0, resources.health - damage)
        log.push({ atSeconds: now, actor: 'system', kind: 'status', message: `Sangramento causa ${damage} de dano.` })
      } else if (application.status === 'stun') {
        playerReadyAt = Math.max(playerReadyAt, now) + 1.5
        log.push({ atSeconds: now, actor: 'system', kind: 'status', message: 'Atordoamento pausa a ação por 1,5 s.' })
      } else if (application.status === 'poison') {
        activePlayerStatuses.poisonUntil = now + 10
        log.push({ atSeconds: now, actor: 'system', kind: 'status', message: 'Veneno aplicado por 10 s.' })
      } else if (application.status === 'burn') {
        activePlayerStatuses.burnUntil = now + 6
        log.push({ atSeconds: now, actor: 'system', kind: 'status', message: 'Queimadura aplicada por 6 s; Defesa reduzida em 15%.' })
      } else if (application.status === 'freeze') {
        const remaining = Math.max(0, playerReadyAt - now)
        playerReadyAt = now + remaining * 1.3
        activePlayerStatuses.freezeUntil = now + 5
        log.push({ atSeconds: now, actor: 'system', kind: 'status', message: 'Congelamento aplicado por 5 s; ações ficam 30% mais lentas.' })
      }
    }

    buildup.set(application.status, state)
  }

  function applyEnemyHitEffects(ability: EnemyAbilityDefinition) {
    for (const application of ability.statusApplications ?? []) applyStatusBuildup(application)
    if (ability.vulnerabilityAfter) {
      enemyDamageTakenEffects.push({
        multiplier: ability.vulnerabilityAfter.damageTakenMultiplier,
        expiresAt: now + ability.vulnerabilityAfter.durationSeconds,
        label: `${ability.name} — vulnerabilidade`,
      })
      log.push({
        atSeconds: now,
        actor: 'enemy',
        kind: 'posture',
        message: `${enemy.name} fica vulnerável por ${ability.vulnerabilityAfter.durationSeconds}s.`,
      })
    }
  }

  function tryUseConsumable() {
    const slotCandidates: Array<{ slotIndex: 0 | 1; manual: boolean }> = []
    if (manualConsumablePending !== null) {
      slotCandidates.push({ slotIndex: manualConsumablePending, manual: true })
    }
    for (const slotIndex of [0, 1] as const) {
      if (slotIndex !== manualConsumablePending) slotCandidates.push({ slotIndex, manual: false })
    }

    for (const candidate of slotCandidates) {
      const slot = preferences.consumableSlots[candidate.slotIndex]
      if (!slot.definitionId) {
        if (candidate.manual) manualConsumablePending = null
        continue
      }
      const quantity = inventoryAvailable.get(slot.definitionId) ?? 0
      if (quantity <= 0) {
        if (candidate.manual) manualConsumablePending = null
        continue
      }
      const definition = catalog.getConsumableDefinition?.(slot.definitionId)
      if (!definition) {
        if (candidate.manual) manualConsumablePending = null
        continue
      }
      if (!canBenefitFromConsumable(resources, definition)) continue

      if (!candidate.manual) {
        if (!slot.autoUseResource || slot.autoUseThresholdPercent === null) continue
        if (resourcePercent(resources, slot.autoUseResource) > slot.autoUseThresholdPercent) continue
      }

      inventoryAvailable.set(slot.definitionId, quantity - 1)
      consumedByDefinition.set(slot.definitionId, (consumedByDefinition.get(slot.definitionId) ?? 0) + 1)
      const restored = applyConsumable(resources, definition)
      if (candidate.manual) manualConsumablePending = null
      log.push({
        atSeconds: now,
        actor: 'player',
        kind: 'consumable',
        message: `${definition.name} usado${candidate.manual ? ' manualmente' : ' automaticamente'}: +${restored.health} Vida, +${restored.mana} Mana, +${restored.stamina} Stamina.`,
      })
      return true
    }
    return false
  }

  function enemyDamageMultiplierFor(damageType: DamageType) {
    const resistance = resistanceMultiplier(enemy.damageResistances?.[damageType])
    return resistance * currentTimedMultiplier(enemyDamageTakenEffects, now)
  }

  while (now <= maxDurationSeconds + EPSILON && resources.health > 0 && enemyHealth > 0) {
    const telegraphResolutionAt = telegraph?.resolvesAt ?? Number.POSITIVE_INFINITY
    const nextTime = Math.min(playerReadyAt, enemyReadyAt, telegraphResolutionAt, maxDurationSeconds)

    if (!Number.isFinite(nextTime)) break

    now = nextTime
    const delta = Math.max(0, now - lastTime)
    advanceContinuousEffects(lastTime, now)
    resources.mana = Math.min(resources.maxMana, resources.mana + stats.manaRegenPerSecond * delta)
    resources.stamina = Math.min(resources.maxStamina, resources.stamina + stats.staminaRegenPerSecond * delta)
    lastTime = now
    if (resources.health <= 0) break

    if (telegraph && Math.abs(telegraph.resolvesAt - now) <= EPSILON) {
      const ability = telegraph.ability
      const hitChance = calculateHitChance(enemy.accuracy, stats.evasion)
      if (random() < hitChance) {
        const raw = enemy.power * (ability.damageMultiplier ?? 0)
        const damage = Math.max(
          1,
          Math.round(raw * (1 - mitigation(playerDefenseAt(now), enemy.combatLevel))),
        )
        resources.health = Math.max(0, resources.health - damage)
        log.push({
          atSeconds: now,
          actor: 'enemy',
          kind: 'ability',
          message: `${enemy.name} usa ${ability.name} e causa ${damage} de dano.`,
        })
        applyEnemyHitEffects(ability)
      } else {
        log.push({
          atSeconds: now,
          actor: 'enemy',
          kind: 'ability',
          message: `${enemy.name} usa ${ability.name}, mas erra.`,
        })
      }
      telegraph = null
      enemyReadyAt = now + enemy.actionIntervalSeconds * (ability.nextIntervalMultiplier ?? 1)
      continue
    }

    if (Math.abs(playerReadyAt - now) <= EPSILON && resources.health > 0 && enemyHealth > 0) {
      if (tryUseConsumable()) {
        playerReadyAt = now + playerActionIntervalAt(now)
      } else {
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
              const rolled = rollDamage(
                rawDamage,
                enemy.defense,
                save.character.level,
                criticalChance,
                random,
                enemyDamageMultiplierFor(ability.damage.damageType),
              )
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
            const rolled = rollDamage(
              rawDamage,
              enemy.defense,
              save.character.level,
              stats.criticalChance,
              random,
              enemyDamageMultiplierFor(stats.basicDamageType),
            )
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

        playerReadyAt = now + playerActionIntervalAt(now)
      }
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

        if (readyAbility.selfDamageTakenMultiplier !== undefined) {
          const duration = readyAbility.selfEffectDurationSeconds ?? 0
          enemyDamageTakenEffects.push({
            multiplier: readyAbility.selfDamageTakenMultiplier,
            expiresAt: now + duration,
            label: readyAbility.name,
          })
          log.push({
            atSeconds: now,
            actor: 'enemy',
            kind: 'posture',
            message: `${enemy.name} usa ${readyAbility.name}: dano recebido ×${readyAbility.selfDamageTakenMultiplier.toFixed(2)} por ${duration}s.`,
          })
          enemyReadyAt = now + enemy.actionIntervalSeconds
        } else if ((readyAbility.telegraphSeconds ?? 0) > 0) {
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
            const raw = enemy.power * (readyAbility.damageMultiplier ?? 0)
            const damage = Math.max(
              1,
              Math.round(raw * (1 - mitigation(playerDefenseAt(now), enemy.combatLevel))),
            )
            resources.health = Math.max(0, resources.health - damage)
            log.push({
              atSeconds: now,
              actor: 'enemy',
              kind: 'ability',
              message: `${enemy.name} usa ${readyAbility.name} e causa ${damage} de dano.`,
            })
            applyEnemyHitEffects(readyAbility)
          } else {
            log.push({
              atSeconds: now,
              actor: 'enemy',
              kind: 'ability',
              message: `${enemy.name} usa ${readyAbility.name}, mas erra.`,
            })
          }
          enemyReadyAt = now + enemy.actionIntervalSeconds * (readyAbility.nextIntervalMultiplier ?? 1)
        }
      } else {
        const hitChance = calculateHitChance(enemy.accuracy, stats.evasion)
        if (random() < hitChance) {
          const damage = Math.max(
            1,
            Math.round(enemy.power * (1 - mitigation(playerDefenseAt(now), enemy.combatLevel))),
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
      health: Number(resources.health.toFixed(3)),
      mana: Number(resources.mana.toFixed(3)),
      stamina: Number(resources.stamina.toFixed(3)),
    },
    enemyHealth,
    xpGranted,
    consumedItems: [...consumedByDefinition.entries()].map(([definitionId, quantity]) => ({
      definitionId,
      quantity,
    })),
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
      inventory: removeConsumedItems(save.character.inventory, result.consumedItems),
      currentLocationId: 'free-city.tavern',
    },
    combat: {
      ...save.combat,
      wolfDefeated:
        save.combat.wolfDefeated ||
        (enemyDefinitionId === 'enemy.road-wolf' && result.outcome === 'victory'),
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
