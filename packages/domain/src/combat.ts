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
  restore?: {
    health?: number
    mana?: number
    stamina?: number
  }
  evasionBuff?: {
    bonus: number
    durationSeconds: number
  }
  damageReductionBuff?: {
    multiplier: number
    durationSeconds: number
    consumeOnDirectHit?: boolean
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
  restore: { health?: number; mana?: number; stamina?: number }
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

const SCALING: Record<ScalingGrade, number> = { S: 1, A: 0.85, B: 0.7, C: 0.5, D: 0.3, E: 0.15 }
const DAMAGE_RESISTANCE: Record<ResistanceLevel, number> = {
  weak: 1.25,
  normal: 1,
  resistant: 0.8,
  'very-resistant': 0.6,
  immune: 0,
}
const EPSILON = 0.000001
const STATUS_THRESHOLD = 100

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
  resistanceUntil: number
}

interface TimedMultiplier {
  multiplier: number
  expiresAt: number
}

interface PlayerDamageReductionState {
  multiplier: number
  expiresAt: number
  consumeOnDirectHit: boolean
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
  return Object.entries(scaling).reduce((total, [attribute, grade]) => {
    if (!grade) return total
    return total + attributes[attribute as keyof CharacterAttributes] * SCALING[grade]
  }, 0)
}

function mitigation(defense: number, attackerLevel: number) {
  return Math.min(0.75, defense / (defense + 100 + 5 * attackerLevel))
}

function hitChance(accuracy: number, evasion: number, bonus = 0) {
  return clamp(0.9 + (accuracy - evasion) * 0.0025 + bonus / 100, 0.7, 0.99)
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
    if (autoUseThresholdPercent < 1 || autoUseThresholdPercent > 100) {
      throw new Error('Threshold automático precisa estar entre 1% e 100%.')
    }
    if (!autoUseResource) throw new Error('Escolha o recurso do threshold automático.')
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
    combat: { ...save.combat, preferences: { ...save.combat.preferences, consumableSlots: slots } },
  }
}

export function teachAndEquipCombatAbilities(
  save: OfflineGameSave,
  abilityIds: readonly string[],
  now: string,
): OfflineGameSave {
  const unique = [...new Set([...save.character.knownAbilityIds, ...abilityIds])]
  const active: [string | null, string | null, string | null, string | null] = [
    abilityIds[0] ?? null,
    abilityIds[1] ?? null,
    abilityIds[2] ?? null,
    abilityIds[3] ?? null,
  ]

  return {
    ...save,
    updatedAt: now,
    character: {
      ...save.character,
      knownAbilityIds: unique,
      activeAbilitySlots: active,
    },
  }
}

export function derivePlayerCombatStats(
  save: OfflineGameSave,
  catalog: CombatEquipmentCatalog,
): DerivedPlayerCombatStats {
  const { attributes } = save.character
  const equipped = getEquippedDefinitions(save, catalog)
  const mainHandId = save.character.equipment.mainHand
  const mainHand = equipped.find((entry) => entry.instance.instanceId === mainHandId)
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

function initialResources(stats: DerivedPlayerCombatStats, persisted?: CombatResources): CombatResources {
  return {
    health: clamp(persisted?.health ?? stats.maxHealth, 0, stats.maxHealth),
    maxHealth: stats.maxHealth,
    mana: clamp(persisted?.mana ?? stats.maxMana, 0, stats.maxMana),
    maxMana: stats.maxMana,
    stamina: clamp(persisted?.stamina ?? stats.maxStamina, 0, stats.maxStamina),
    maxStamina: stats.maxStamina,
  }
}

function rollDamage(
  raw: number,
  defense: number,
  level: number,
  criticalChance: number,
  random: () => number,
  multiplier = 1,
) {
  const critical = random() < criticalChance
  const damage = raw * (critical ? 1.5 : 1) * multiplier * (1 - mitigation(defense, level))
  return { damage: Math.max(1, Math.round(damage)), critical }
}

function chooseAbility(
  save: OfflineGameSave,
  catalog: CombatContentCatalog,
  resources: CombatResources,
  cooldowns: Map<string, number>,
  now: number,
) {
  const healthPercent = (resources.health / resources.maxHealth) * 100
  const candidates = save.character.activeAbilitySlots
    .map((id, slot) => ({ id, slot }))
    .filter((entry): entry is { id: string; slot: number } => Boolean(entry.id))
    .filter((entry) => save.character.knownAbilityIds.includes(entry.id))
    .map((entry) => ({ ...entry, definition: catalog.getAbilityDefinition(entry.id) }))
    .filter((entry): entry is { id: string; slot: number; definition: CombatAbilityDefinition } =>
      entry.definition !== null,
    )
    .filter((entry) => (cooldowns.get(entry.id) ?? 0) <= now + EPSILON)
    .filter((entry) => {
      const ability = entry.definition
      if (ability.resource === 'mana' && resources.mana < (ability.resourceCost ?? 0)) return false
      if (ability.resource === 'stamina' && resources.stamina < (ability.resourceCost ?? 0)) return false
      if (ability.profile === 'defensive') {
        return healthPercent <= save.combat.preferences.defensiveHealthThresholdPercent
      }
      return true
    })

  return candidates.toSorted((a, b) => {
    const style = save.combat.preferences.style
    if (style === 'mixed') {
      const aDefensiveNeeded = a.definition.profile === 'defensive' && healthPercent <= save.combat.preferences.defensiveHealthThresholdPercent
      const bDefensiveNeeded = b.definition.profile === 'defensive' && healthPercent <= save.combat.preferences.defensiveHealthThresholdPercent
      if (aDefensiveNeeded !== bDefensiveNeeded) return aDefensiveNeeded ? -1 : 1
      return a.slot - b.slot
    }
    const preferred = style === 'aggressive' ? 'aggressive' : 'defensive'
    const aRank = a.definition.profile === preferred ? 0 : 1
    const bRank = b.definition.profile === preferred ? 0 : 1
    return aRank - bRank || a.slot - b.slot
  })[0]?.definition ?? null
}

function resourcePercent(resources: CombatResources, resource: CombatThresholdResource) {
  if (resource === 'health') return (resources.health / resources.maxHealth) * 100
  if (resource === 'mana') return (resources.mana / resources.maxMana) * 100
  return (resources.stamina / resources.maxStamina) * 100
}

function removeConsumedItems(inventory: InventoryStack[], consumedItems: InventoryStack[]) {
  const consumed = new Map(consumedItems.map((stack) => [stack.definitionId, stack.quantity]))
  return inventory
    .map((stack) => ({
      ...stack,
      quantity: stack.quantity - (consumed.get(stack.definitionId) ?? 0),
    }))
    .filter((stack) => stack.quantity > 0)
}

function totalInventoryForCombat(save: OfflineGameSave) {
  const totals = new Map<string, number>()
  for (const stack of save.character.inventory) {
    totals.set(stack.definitionId, (totals.get(stack.definitionId) ?? 0) + stack.quantity)
  }
  for (const stack of save.dungeon.activeRun?.expeditionBag ?? []) {
    totals.set(stack.definitionId, (totals.get(stack.definitionId) ?? 0) + stack.quantity)
  }
  return totals
}

function consumeAcrossSafeAndExpedition(
  save: OfflineGameSave,
  consumedItems: InventoryStack[],
): Pick<OfflineGameSave, 'character' | 'dungeon'> {
  let safeInventory = save.character.inventory.map((stack) => ({ ...stack }))
  let expeditionBag = save.dungeon.activeRun?.expeditionBag.map((stack) => ({ ...stack })) ?? []

  for (const consumed of consumedItems) {
    let remaining = consumed.quantity

    expeditionBag = expeditionBag
      .map((stack) => {
        if (stack.definitionId !== consumed.definitionId || remaining <= 0) return stack
        const used = Math.min(stack.quantity, remaining)
        remaining -= used
        return { ...stack, quantity: stack.quantity - used }
      })
      .filter((stack) => stack.quantity > 0)

    if (remaining > 0) {
      safeInventory = removeConsumedItems(safeInventory, [
        { definitionId: consumed.definitionId, quantity: remaining },
      ])
    }
  }

  return {
    character: { ...save.character, inventory: safeInventory },
    dungeon: {
      ...save.dungeon,
      activeRun: save.dungeon.activeRun
        ? { ...save.dungeon.activeRun, expeditionBag }
        : null,
    },
  }
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

  const foundEnemy = catalog.getEnemyDefinition(enemyDefinitionId)
  if (!foundEnemy) throw new Error('Inimigo não encontrado no Content Catalog.')
  const enemy: EnemyDefinition = foundEnemy
  const stats = derivePlayerCombatStats(save, catalog)
  const resources = initialResources(stats, startingResources)
  const random = createRng(seed)
  const log: CombatLogEntry[] = []
  const playerCooldowns = new Map<string, number>()
  const enemyCooldowns = new Map<string, number>()
  const availableInventory = totalInventoryForCombat(save)
  const consumed = new Map<string, number>()
  const buildup = new Map<CombatStatusId, BuildupState>()
  let timedEnemyMultipliers: TimedMultiplier[] = []
  let poisonUntil = 0
  let burnUntil = 0
  let freezeUntil = 0
  let evasionBonus = 0
  let evasionUntil = 0
  let damageReduction: PlayerDamageReductionState | null = null
  let manualPending: 0 | 1 | null = manualConsumableSlotIndex ?? null
  let enemyHealth = enemy.maxHealth
  let now = 0
  let lastTime = 0
  let playerReadyAt = stats.actionIntervalSeconds
  let enemyReadyAt = enemy.actionIntervalSeconds
  let telegraph: TelegraphState | null = null

  for (const ability of enemy.abilities) {
    enemyCooldowns.set(ability.id, ability.initialDelaySeconds ?? 0)
  }

  function playerDefense() {
    return stats.defense * (burnUntil > now + EPSILON ? 0.85 : 1)
  }

  function playerEvasion() {
    return stats.evasion + (evasionUntil > now + EPSILON ? evasionBonus : 0)
  }

  function playerInterval() {
    return stats.actionIntervalSeconds * (freezeUntil > now + EPSILON ? 1.3 : 1)
  }

  function incomingDirectDamage(rawDamage: number) {
    let finalDamage = rawDamage
    if (damageReduction && damageReduction.expiresAt > now + EPSILON) {
      finalDamage *= damageReduction.multiplier
      if (damageReduction.consumeOnDirectHit) damageReduction = null
    }
    return Math.max(1, Math.round(finalDamage))
  }

  function enemyDamageMultiplier(type: DamageType) {
    const base = DAMAGE_RESISTANCE[enemy.damageResistances?.[type] ?? 'normal']
    const timed = timedEnemyMultipliers.reduce(
      (total, effect) => (effect.expiresAt > now + EPSILON ? total * effect.multiplier : total),
      1,
    )
    return base * timed
  }

  function advanceEffects(to: number) {
    const from = lastTime
    if (to <= from) return
    const poisonSeconds = Math.max(0, Math.min(to, poisonUntil) - from)
    const burnSeconds = Math.max(0, Math.min(to, burnUntil) - from)
    resources.health = Math.max(
      0,
      resources.health - poisonSeconds * resources.maxHealth * 0.02 - burnSeconds * 3,
    )

    for (const state of buildup.values()) {
      const decayStart = state.lastAppliedAt + 3
      const decayFrom = Math.max(state.lastEvaluatedAt, decayStart)
      if (to > decayFrom) state.value = Math.max(0, state.value - (to - decayFrom) * 12)
      state.lastEvaluatedAt = to
    }
    timedEnemyMultipliers = timedEnemyMultipliers.filter((effect) => effect.expiresAt > to + EPSILON)
    if (damageReduction && damageReduction.expiresAt <= to + EPSILON) damageReduction = null
  }

  function applyBuildup(application: StatusApplicationDefinition) {
    const state = buildup.get(application.status) ?? {
      value: 0,
      lastAppliedAt: now,
      lastEvaluatedAt: now,
      resistanceUntil: 0,
    }
    const received = application.buildup * (state.resistanceUntil > now + EPSILON ? 0.5 : 1)
    state.value += received
    state.lastAppliedAt = now
    state.lastEvaluatedAt = now
    log.push({
      atSeconds: now,
      actor: 'system',
      kind: 'status',
      message: `${application.status}: ${Math.round(state.value)}/${STATUS_THRESHOLD} buildup.`,
    })

    if (state.value >= STATUS_THRESHOLD) {
      state.value = 0
      state.resistanceUntil = now + 6
      if (application.status === 'bleed') {
        const damage = Math.max(1, Math.round(resources.health * 0.08))
        resources.health = Math.max(0, resources.health - damage)
        log.push({ atSeconds: now, actor: 'system', kind: 'status', message: `Sangramento causa ${damage} de dano.` })
      } else if (application.status === 'stun') {
        playerReadyAt = Math.max(playerReadyAt, now) + 1.5
        log.push({ atSeconds: now, actor: 'system', kind: 'status', message: 'Atordoamento pausa a ação por 1,5 s.' })
      } else if (application.status === 'poison') {
        poisonUntil = now + 10
      } else if (application.status === 'burn') {
        burnUntil = now + 6
      } else if (application.status === 'freeze') {
        freezeUntil = now + 5
        playerReadyAt = now + Math.max(0, playerReadyAt - now) * 1.3
        if (telegraph) {
          telegraph = {
            ...telegraph,
            resolvesAt: now + Math.max(0, telegraph.resolvesAt - now) * 1.2,
          }
        }
      }
    }
    buildup.set(application.status, state)
  }

  function afterEnemyHit(ability: EnemyAbilityDefinition) {
    for (const application of ability.statusApplications ?? []) applyBuildup(application)
    if (ability.vulnerabilityAfter) {
      timedEnemyMultipliers.push({
        multiplier: ability.vulnerabilityAfter.damageTakenMultiplier,
        expiresAt: now + ability.vulnerabilityAfter.durationSeconds,
      })
      log.push({
        atSeconds: now,
        actor: 'enemy',
        kind: 'posture',
        message: `${enemy.name} fica vulnerável por ${ability.vulnerabilityAfter.durationSeconds}s.`,
      })
    }
  }

  function tryConsumable() {
    const order: Array<{ index: 0 | 1; manual: boolean }> = []
    if (manualPending !== null) order.push({ index: manualPending, manual: true })
    for (const index of [0, 1] as const) {
      if (index !== manualPending) order.push({ index, manual: false })
    }

    for (const candidate of order) {
      const slot = save.combat.preferences.consumableSlots[candidate.index]
      if (!slot.definitionId) continue
      if ((availableInventory.get(slot.definitionId) ?? 0) <= 0) continue
      const definition = catalog.getConsumableDefinition?.(slot.definitionId)
      if (!definition) continue
      const canRestore =
        ((definition.restore.health ?? 0) > 0 && resources.health < resources.maxHealth) ||
        ((definition.restore.mana ?? 0) > 0 && resources.mana < resources.maxMana) ||
        ((definition.restore.stamina ?? 0) > 0 && resources.stamina < resources.maxStamina)
      if (!canRestore) continue

      if (!candidate.manual) {
        if (!slot.autoUseResource || slot.autoUseThresholdPercent === null) continue
        if (resourcePercent(resources, slot.autoUseResource) > slot.autoUseThresholdPercent) continue
      }

      const before = { ...resources }
      resources.health = Math.min(resources.maxHealth, resources.health + (definition.restore.health ?? 0))
      resources.mana = Math.min(resources.maxMana, resources.mana + (definition.restore.mana ?? 0))
      resources.stamina = Math.min(resources.maxStamina, resources.stamina + (definition.restore.stamina ?? 0))
      availableInventory.set(slot.definitionId, (availableInventory.get(slot.definitionId) ?? 0) - 1)
      consumed.set(slot.definitionId, (consumed.get(slot.definitionId) ?? 0) + 1)
      if (candidate.manual) manualPending = null
      log.push({
        atSeconds: now,
        actor: 'player',
        kind: 'consumable',
        message: `${definition.name}: +${Math.round(resources.health - before.health)} Vida, +${Math.round(resources.mana - before.mana)} Mana, +${Math.round(resources.stamina - before.stamina)} Stamina.`,
      })
      return true
    }
    return false
  }

  function applyPlayerAbilityEffects(ability: CombatAbilityDefinition) {
    if (ability.restore) {
      const before = { ...resources }
      resources.health = Math.min(resources.maxHealth, resources.health + (ability.restore.health ?? 0))
      resources.mana = Math.min(resources.maxMana, resources.mana + (ability.restore.mana ?? 0))
      resources.stamina = Math.min(resources.maxStamina, resources.stamina + (ability.restore.stamina ?? 0))
      log.push({
        atSeconds: now,
        actor: 'player',
        kind: 'ability',
        message: `${ability.name} restaura ${Math.round(resources.health - before.health)} Vida, ${Math.round(resources.mana - before.mana)} Mana e ${Math.round(resources.stamina - before.stamina)} Stamina.`,
      })
    }

    if (ability.evasionBuff) {
      evasionBonus = ability.evasionBuff.bonus
      evasionUntil = now + ability.evasionBuff.durationSeconds
      log.push({
        atSeconds: now,
        actor: 'player',
        kind: 'ability',
        message: `${ability.name} concede +${ability.evasionBuff.bonus} Evasão por ${ability.evasionBuff.durationSeconds}s.`,
      })
    }

    if (ability.damageReductionBuff) {
      damageReduction = {
        multiplier: ability.damageReductionBuff.multiplier,
        expiresAt: now + ability.damageReductionBuff.durationSeconds,
        consumeOnDirectHit: ability.damageReductionBuff.consumeOnDirectHit ?? false,
      }
      log.push({
        atSeconds: now,
        actor: 'player',
        kind: 'ability',
        message: `${ability.name} reduz dano direto recebido em ${Math.round((1 - ability.damageReductionBuff.multiplier) * 100)}%.`,
      })
    }
  }

  while (now <= maxDurationSeconds + EPSILON && resources.health > 0 && enemyHealth > 0) {
    const telegraphAt = telegraph?.resolvesAt ?? Number.POSITIVE_INFINITY
    const nextTime = Math.min(playerReadyAt, enemyReadyAt, telegraphAt, maxDurationSeconds)
    if (!Number.isFinite(nextTime)) break

    now = nextTime
    const delta = Math.max(0, now - lastTime)
    advanceEffects(now)
    resources.mana = Math.min(resources.maxMana, resources.mana + stats.manaRegenPerSecond * delta)
    resources.stamina = Math.min(resources.maxStamina, resources.stamina + stats.staminaRegenPerSecond * delta)
    lastTime = now
    if (resources.health <= 0) break

    if (telegraph && Math.abs(telegraph.resolvesAt - now) <= EPSILON) {
      const ability = telegraph.ability
      if (random() < hitChance(enemy.accuracy, playerEvasion())) {
        const mitigated = enemy.power * (ability.damageMultiplier ?? 0) * (1 - mitigation(playerDefense(), enemy.combatLevel))
        const damage = incomingDirectDamage(mitigated)
        resources.health = Math.max(0, resources.health - damage)
        log.push({ atSeconds: now, actor: 'enemy', kind: 'ability', message: `${enemy.name} usa ${ability.name} e causa ${damage} de dano.` })
        afterEnemyHit(ability)
      } else {
        log.push({ atSeconds: now, actor: 'enemy', kind: 'ability', message: `${enemy.name} usa ${ability.name}, mas erra.` })
      }
      telegraph = null
      enemyReadyAt = now + enemy.actionIntervalSeconds * (ability.nextIntervalMultiplier ?? 1)
      continue
    }

    if (Math.abs(playerReadyAt - now) <= EPSILON && resources.health > 0 && enemyHealth > 0) {
      if (!tryConsumable()) {
        const ability = chooseAbility(save, catalog, resources, playerCooldowns, now)
        if (ability) {
          const cost = ability.resourceCost ?? 0
          if (ability.resource === 'mana') resources.mana -= cost
          if (ability.resource === 'stamina') resources.stamina -= cost
          playerCooldowns.set(ability.id, now + ability.cooldownSeconds)

          if (telegraph && ability.canInterrupt && telegraph.ability.interruptible) {
            log.push({ atSeconds: now, actor: 'player', kind: 'interrupt', message: `${ability.name} interrompe ${telegraph.ability.name}.` })
            telegraph = null
            enemyReadyAt = now + enemy.actionIntervalSeconds
          }

          applyPlayerAbilityEffects(ability)

          if (ability.heal) {
            const heal = Math.round(ability.heal.basePower + scalingContribution(save.character.attributes, ability.heal.scaling))
            const recovered = Math.min(heal, resources.maxHealth - resources.health)
            resources.health += recovered
            log.push({ atSeconds: now, actor: 'player', kind: 'ability', message: `${ability.name} recupera ${recovered} de Vida.` })
          } else if (ability.damage) {
            if (random() < hitChance(stats.accuracy, enemy.evasion, ability.damage.accuracyBonusPercentagePoints ?? 0)) {
              const raw =
                ability.damage.kind === 'weapon-multiplier'
                  ? (stats.basicAttackPower + scalingContribution(save.character.attributes, stats.weaponScaling)) * (ability.damage.multiplier ?? 1)
                  : (ability.damage.basePower ?? 0) + scalingContribution(save.character.attributes, ability.damage.scaling ?? {})
              const rolled = rollDamage(
                raw,
                enemy.defense,
                save.character.level,
                clamp(stats.criticalChance + (ability.damage.criticalBonusPercentagePoints ?? 0) / 100, 0, 1),
                random,
                enemyDamageMultiplier(ability.damage.damageType),
              )
              enemyHealth = Math.max(0, enemyHealth - rolled.damage)
              log.push({ atSeconds: now, actor: 'player', kind: 'ability', message: `${ability.name} causa ${rolled.damage} de dano${rolled.critical ? ' crítico' : ''}.` })
            } else {
              log.push({ atSeconds: now, actor: 'player', kind: 'ability', message: `${ability.name} erra.` })
            }
          }
        } else {
          if (random() < hitChance(stats.accuracy, enemy.evasion)) {
            const raw = stats.basicAttackPower + scalingContribution(save.character.attributes, stats.weaponScaling)
            const rolled = rollDamage(raw, enemy.defense, save.character.level, stats.criticalChance, random, enemyDamageMultiplier(stats.basicDamageType))
            enemyHealth = Math.max(0, enemyHealth - rolled.damage)
            log.push({ atSeconds: now, actor: 'player', kind: 'basic', message: `Ataque básico causa ${rolled.damage} de dano${rolled.critical ? ' crítico' : ''}.` })
          } else {
            log.push({ atSeconds: now, actor: 'player', kind: 'basic', message: 'Ataque básico erra.' })
          }
        }
      }
      playerReadyAt = now + playerInterval()
      if (enemyHealth <= 0) break
    }

    if (Math.abs(enemyReadyAt - now) <= EPSILON && resources.health > 0 && enemyHealth > 0 && !telegraph) {
      const ready = enemy.abilities.find((ability) => (enemyCooldowns.get(ability.id) ?? 0) <= now + EPSILON)
      if (ready) {
        enemyCooldowns.set(ready.id, now + ready.cooldownSeconds)
        if (ready.selfDamageTakenMultiplier !== undefined) {
          const duration = ready.selfEffectDurationSeconds ?? 0
          timedEnemyMultipliers.push({ multiplier: ready.selfDamageTakenMultiplier, expiresAt: now + duration })
          log.push({ atSeconds: now, actor: 'enemy', kind: 'posture', message: `${enemy.name} usa ${ready.name} por ${duration}s.` })
          enemyReadyAt = now + enemy.actionIntervalSeconds
        } else if ((ready.telegraphSeconds ?? 0) > 0) {
          telegraph = { ability: ready, resolvesAt: now + (ready.telegraphSeconds ?? 0) }
          enemyReadyAt = Number.POSITIVE_INFINITY
          log.push({ atSeconds: now, actor: 'enemy', kind: 'telegraph', message: `${enemy.name} prepara ${ready.name} por ${ready.telegraphSeconds}s.` })
        } else {
          if (random() < hitChance(enemy.accuracy, playerEvasion())) {
            const mitigated = enemy.power * (ready.damageMultiplier ?? 0) * (1 - mitigation(playerDefense(), enemy.combatLevel))
            const damage = incomingDirectDamage(mitigated)
            resources.health = Math.max(0, resources.health - damage)
            log.push({ atSeconds: now, actor: 'enemy', kind: 'ability', message: `${enemy.name} usa ${ready.name} e causa ${damage} de dano.` })
            afterEnemyHit(ready)
          } else {
            log.push({ atSeconds: now, actor: 'enemy', kind: 'ability', message: `${enemy.name} usa ${ready.name}, mas erra.` })
          }
          enemyReadyAt = now + enemy.actionIntervalSeconds * (ready.nextIntervalMultiplier ?? 1)
        }
      } else {
        if (random() < hitChance(enemy.accuracy, playerEvasion())) {
          const mitigated = enemy.power * (1 - mitigation(playerDefense(), enemy.combatLevel))
          const damage = incomingDirectDamage(mitigated)
          resources.health = Math.max(0, resources.health - damage)
          log.push({ atSeconds: now, actor: 'enemy', kind: 'basic', message: `${enemy.name} causa ${damage} de dano.` })
        } else {
          log.push({ atSeconds: now, actor: 'enemy', kind: 'basic', message: `${enemy.name} erra.` })
        }
        enemyReadyAt = now + enemy.actionIntervalSeconds
      }
    }

    if (Math.abs(now - maxDurationSeconds) <= EPSILON) break
  }

  const outcome: CombatResult['outcome'] = enemyHealth <= 0 ? 'victory' : resources.health <= 0 ? 'defeat' : 'timeout'
  const xpGranted = outcome === 'victory' ? enemy.xpReward : 0
  log.push({
    atSeconds: now,
    actor: 'system',
    kind: 'result',
    message: outcome === 'victory' ? `Vitória. +${xpGranted} XP geral.` : outcome === 'defeat' ? 'Derrota. O personagem retorna à Cidade Livre.' : 'Combate encerrado por limite de simulação.',
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
    consumedItems: [...consumed.entries()].map(([definitionId, quantity]) => ({ definitionId, quantity })),
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
  const consumedState = consumeAcrossSafeAndExpedition(save, result.consumedItems)

  return {
    ...save,
    updatedAt: now,
    character: {
      ...consumedState.character,
      xp: save.character.xp + result.xpGranted,
      currentLocationId: 'free-city.tavern',
    },
    dungeon: consumedState.dungeon,
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
