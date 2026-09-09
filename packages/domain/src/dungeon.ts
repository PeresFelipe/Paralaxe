import type { CombatContentCatalog, CombatLogEntry, CombatResult, CombatResources } from './combat'
import { applyCombatResult, simulateCombat } from './combat'
import type { EquipmentInstance, EquipmentRarity } from './equipment'
import type { OfflineGameSave } from './character'

export type DungeonRoomKind =
  | 'entrance'
  | 'combat'
  | 'elite'
  | 'event'
  | 'treasure'
  | 'recovery'
  | 'boss'

export interface DungeonRoomDefinition {
  id: string
  name: string
  kind: DungeonRoomKind
  enemyDefinitionId?: string
  nextRoomIds: readonly string[]
}

export interface DungeonDefinition {
  id: string
  name: string
  difficulty: 'easy'
  rooms: readonly DungeonRoomDefinition[]
  startRoomId: string
}

export interface ExpeditionStack {
  definitionId: string
  quantity: number
}

export interface ExpeditionEquipment {
  definitionId: string
  rarity: EquipmentRarity
  affixIds: string[]
}

export interface DungeonRun {
  dungeonDefinitionId: string
  difficulty: 'easy'
  seed: number
  currentRoomId: string
  visitedRoomIds: string[]
  resolvedRoomIds: string[]
  chosenBranches: Record<string, string>
  expeditionBag: ExpeditionStack[]
  expeditionEquipment: ExpeditionEquipment[]
  resources: CombatResources
  protectorDecision: 'killed' | 'spared' | null
  supplyRegisterRecovered: boolean
  treatyFragmentRecovered: boolean
  safeExtractionAvailable: boolean
  completed: boolean
  startedAt: string
  updatedAt: string
}

export interface DungeonProgressState {
  activeRun: DungeonRun | null
  dunLiathEasyCleared: boolean
  dunLiathProtector: 'killed' | 'spared' | null
  contractCompleted: boolean
  instinctiveGuardUnlocked: boolean
}

export interface DungeonContentCatalog extends CombatContentCatalog {
  getDungeonDefinition(dungeonId: string): DungeonDefinition | null
}

function createRng(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 0x1_0000_0000
  }
}

function addStack(stacks: ExpeditionStack[], definitionId: string, quantity = 1) {
  const current = stacks.find((stack) => stack.definitionId === definitionId)
  if (!current) return [...stacks, { definitionId, quantity }]
  return stacks.map((stack) =>
    stack.definitionId === definitionId ? { ...stack, quantity: stack.quantity + quantity } : stack,
  )
}

function addInventoryStack(
  inventory: OfflineGameSave['character']['inventory'],
  definitionId: string,
  quantity: number,
) {
  const current = inventory.find((stack) => stack.definitionId === definitionId)
  if (!current) return [...inventory, { definitionId, quantity }]
  return inventory.map((stack) =>
    stack.definitionId === definitionId ? { ...stack, quantity: stack.quantity + quantity } : stack,
  )
}

function initialResources(save: OfflineGameSave): CombatResources {
  const { vitality, mind, vigor } = save.character.attributes
  const maxHealth = 100 + vitality * 12
  const maxMana = 30 + mind * 10
  const maxStamina = 60 + vigor * 8
  return {
    health: maxHealth,
    maxHealth,
    mana: maxMana,
    maxMana,
    stamina: maxStamina,
    maxStamina,
  }
}

function applyEncounterAttrition(resources: CombatResources, result: CombatResult): CombatResources {
  const healthSpent = result.player.maxHealth - result.player.health
  const manaSpent = Math.max(0, result.player.maxMana - result.player.mana)
  const staminaSpent = Math.max(0, result.player.maxStamina - result.player.stamina)
  return {
    ...resources,
    health: Math.max(0, resources.health - healthSpent),
    mana: Math.max(0, resources.mana - manaSpent),
    stamina: Math.max(0, resources.stamina - staminaSpent),
  }
}

function offsetLog(log: CombatLogEntry[], offset: number) {
  return log.map((entry) => ({ ...entry, atSeconds: Number((entry.atSeconds + offset).toFixed(3)) }))
}

function simulateFairtheoirEncounter(
  save: OfflineGameSave,
  catalog: CombatContentCatalog,
  seed: number,
): CombatResult {
  const phase1 = simulateCombat(save, catalog, 'enemy.fairtheoir-phase1', seed)
  if (phase1.outcome !== 'victory') return phase1

  const phase2Seed = (seed ^ 0x9e3779b9) >>> 0
  const phase2 = simulateCombat(save, catalog, 'enemy.fairtheoir-phase2', phase2Seed)
  const phaseTransitionAt = phase1.durationSeconds
  const transition: CombatLogEntry = {
    atSeconds: phaseTransitionAt,
    actor: 'system',
    kind: 'result',
    message: 'Fairtheoir chega a 45% da Vida total. Fase 2 — Desespero.',
  }

  const phase1UsefulLog = phase1.log.filter((entry) => entry.kind !== 'result')
  const combinedLog = [
    ...phase1UsefulLog,
    transition,
    ...offsetLog(phase2.log, phaseTransitionAt),
  ]
  const damageTaken =
    (phase1.player.maxHealth - phase1.player.health) +
    (phase2.player.maxHealth - phase2.player.health)
  const manaSpent =
    (phase1.player.maxMana - phase1.player.mana) +
    (phase2.player.maxMana - phase2.player.mana)
  const staminaSpent =
    (phase1.player.maxStamina - phase1.player.stamina) +
    (phase2.player.maxStamina - phase2.player.stamina)

  return {
    outcome: phase2.outcome,
    durationSeconds: Number((phase1.durationSeconds + phase2.durationSeconds).toFixed(3)),
    player: {
      health: Math.max(0, phase1.player.maxHealth - damageTaken),
      maxHealth: phase1.player.maxHealth,
      mana: Math.max(0, phase1.player.maxMana - manaSpent),
      maxMana: phase1.player.maxMana,
      stamina: Math.max(0, phase1.player.maxStamina - staminaSpent),
      maxStamina: phase1.player.maxStamina,
    },
    enemyHealth: phase2.enemyHealth,
    xpGranted: phase2.outcome === 'victory' ? 120 : 0,
    log: combinedLog,
    seed,
  }
}

function rollRarity(random: () => number, common: number, uncommon: number): EquipmentRarity {
  const value = random()
  if (value < common) return 'common'
  if (value < common + uncommon) return 'uncommon'
  return 'rare'
}

function affixCount(rarity: EquipmentRarity) {
  return rarity === 'common' ? 1 : rarity === 'uncommon' ? 2 : 3
}

const AFFIX_IDS = [
  'affix.vitality-1',
  'affix.mind-1',
  'affix.vigor-1',
  'affix.strength-1',
  'affix.dexterity-1',
  'affix.intelligence-1',
  'affix.faith-1',
  'affix.accuracy-4',
  'affix.defense-2',
] as const

function rollAffixes(random: () => number, count: number) {
  const pool = [...AFFIX_IDS]
  const result: string[] = []
  while (result.length < count && pool.length > 0) {
    const index = Math.floor(random() * pool.length)
    const [picked] = pool.splice(index, 1)
    if (picked) result.push(picked)
  }
  return result
}

function rollEquipment(
  random: () => number,
  definitionIds: readonly string[],
  rarityThresholds: { common: number; uncommon: number },
): ExpeditionEquipment {
  const definitionId = definitionIds[Math.floor(random() * definitionIds.length)] ?? definitionIds[0]
  if (!definitionId) throw new Error('Pool de equipamento vazio.')
  const rarity = rollRarity(random, rarityThresholds.common, rarityThresholds.uncommon)
  return { definitionId, rarity, affixIds: rollAffixes(random, affixCount(rarity)) }
}

export function createDungeonRun(
  save: OfflineGameSave,
  dungeon: DungeonDefinition,
  seed: number,
  now: string,
): DungeonRun {
  return {
    dungeonDefinitionId: dungeon.id,
    difficulty: dungeon.difficulty,
    seed,
    currentRoomId: dungeon.startRoomId,
    visitedRoomIds: [dungeon.startRoomId],
    resolvedRoomIds: [],
    chosenBranches: {},
    expeditionBag: [],
    expeditionEquipment: [],
    resources: initialResources(save),
    protectorDecision: null,
    supplyRegisterRecovered: false,
    treatyFragmentRecovered: false,
    safeExtractionAvailable: false,
    completed: false,
    startedAt: now,
    updatedAt: now,
  }
}

export function startDungeon(
  save: OfflineGameSave,
  dungeon: DungeonDefinition,
  seed: number,
  now: string,
): OfflineGameSave {
  if (save.idle.activeActivity || save.crafting.activeRecipe) {
    throw new Error('Interrompa a atividade Idle antes de iniciar uma Dungeon.')
  }
  if (save.dungeon.activeRun) throw new Error('Já existe uma DungeonRun ativa.')

  return {
    ...save,
    updatedAt: now,
    character: {
      ...save.character,
      currentLocationId: dungeon.id,
      inventory: addInventoryStack(save.character.inventory, 'item.consumable.field-preparation', 2),
    },
    dungeon: { ...save.dungeon, activeRun: createDungeonRun(save, dungeon, seed, now) },
  }
}

export function chooseDungeonPath(
  save: OfflineGameSave,
  dungeon: DungeonDefinition,
  nextRoomId: string,
  now: string,
): OfflineGameSave {
  const run = save.dungeon.activeRun
  if (!run) throw new Error('Nenhuma DungeonRun ativa.')
  const room = dungeon.rooms.find((candidate) => candidate.id === run.currentRoomId)
  if (!room) throw new Error('Sala atual inválida.')
  if (!run.resolvedRoomIds.includes(room.id)) throw new Error('Resolva a sala atual antes de avançar.')
  if (!room.nextRoomIds.includes(nextRoomId)) throw new Error('Esse caminho não parte da sala atual.')
  if (run.visitedRoomIds.includes(nextRoomId)) throw new Error('A rota da Dungeon é irreversível.')

  return {
    ...save,
    updatedAt: now,
    dungeon: {
      ...save.dungeon,
      activeRun: {
        ...run,
        currentRoomId: nextRoomId,
        visitedRoomIds: [...run.visitedRoomIds, nextRoomId],
        chosenBranches:
          room.nextRoomIds.length > 1
            ? { ...run.chosenBranches, [room.id]: nextRoomId }
            : run.chosenBranches,
        updatedAt: now,
      },
    },
  }
}

export function resolveDungeonRoom(
  save: OfflineGameSave,
  dungeon: DungeonDefinition,
  catalog: DungeonContentCatalog,
  now: string,
): { save: OfflineGameSave; combatResult?: CombatResult } {
  const run = save.dungeon.activeRun
  if (!run) throw new Error('Nenhuma DungeonRun ativa.')
  const room = dungeon.rooms.find((candidate) => candidate.id === run.currentRoomId)
  if (!room) throw new Error('Sala atual inválida.')
  if (run.resolvedRoomIds.includes(room.id)) throw new Error('Essa sala já foi resolvida.')
  if (room.id === 'room.protector' && !run.protectorDecision) {
    throw new Error('Escolha Matar ou Poupar antes de resolver esse evento.')
  }

  const random = createRng((run.seed ^ run.visitedRoomIds.length * 2654435761) >>> 0)
  let nextSave = save
  let nextRun = run
  let combatResult: CombatResult | undefined

  if (room.enemyDefinitionId) {
    const encounterSeed = (run.seed + run.visitedRoomIds.length * 7919) >>> 0
    const isFairtheoir = room.id === 'room.fairtheoir'
    combatResult = isFairtheoir
      ? simulateFairtheoirEncounter(save, catalog, encounterSeed)
      : simulateCombat(save, catalog, room.enemyDefinitionId, encounterSeed)

    if (combatResult.outcome !== 'victory') {
      return { save: failDungeonRun(save, now), combatResult }
    }

    const resources = applyEncounterAttrition(run.resources, combatResult)
    if (resources.health <= 0) {
      return { save: failDungeonRun(save, now), combatResult: { ...combatResult, outcome: 'defeat' } }
    }

    const appliedEnemyId = isFairtheoir ? 'enemy.fairtheoir-phase2' : room.enemyDefinitionId
    nextSave = applyCombatResult(save, appliedEnemyId, combatResult, now)
    nextSave = {
      ...nextSave,
      character: { ...nextSave.character, currentLocationId: dungeon.id },
    }
    nextRun = { ...(nextSave.dungeon.activeRun ?? run), resources }

    if (room.enemyDefinitionId === 'enemy.crubach' && random() < 0.35) {
      nextRun = {
        ...nextRun,
        expeditionEquipment: [
          ...nextRun.expeditionEquipment,
          rollEquipment(
            random,
            ['armor.garrison-gloves', 'armor.garrison-boots', 'weapon.garrison-sword'],
            { common: 0.85, uncommon: 0.14 },
          ),
        ],
      }
    }

    if (room.enemyDefinitionId === 'enemy.tromghiallach' && random() < 0.45) {
      nextRun = {
        ...nextRun,
        expeditionEquipment: [
          ...nextRun.expeditionEquipment,
          rollEquipment(
            random,
            ['armor.garrison-helmet', 'armor.garrison-legs', 'weapon.bastion-mace'],
            { common: 0.8, uncommon: 0.18 },
          ),
        ],
      }
    }

    if (room.enemyDefinitionId === 'enemy.cosantoir') {
      nextRun = {
        ...nextRun,
        expeditionBag: addStack(nextRun.expeditionBag, 'item.dun-liath.beam', 1),
      }
      if (random() < 0.25) {
        nextRun = {
          ...nextRun,
          expeditionEquipment: [
            ...nextRun.expeditionEquipment,
            rollEquipment(
              random,
              ['weapon.watch-spear', 'shield.watch-shield', 'armor.garrison-legs'],
              { common: 0.55, uncommon: 0.4 },
            ),
          ],
        }
      }
    }

    if (isFairtheoir) {
      nextRun = {
        ...nextRun,
        expeditionBag: addStack(nextRun.expeditionBag, 'item.fairtheoir-fragment', 1),
        completed: true,
      }
    }
  }

  if (room.id === 'room.treaty') {
    nextRun = {
      ...nextRun,
      treatyFragmentRecovered: true,
      expeditionBag: addStack(nextRun.expeditionBag, 'item.treaty-fragment', 1),
    }
  }
  if (room.id === 'room.register') {
    nextRun = {
      ...nextRun,
      supplyRegisterRecovered: true,
      expeditionBag: addStack(nextRun.expeditionBag, 'item.garrison-supply-register', 1),
    }
  }
  if (
    room.id === 'room.arsenal' &&
    !nextRun.expeditionEquipment.some((item) => item.definitionId === 'armor.garrison-helmet')
  ) {
    nextRun = {
      ...nextRun,
      expeditionEquipment: [
        ...nextRun.expeditionEquipment,
        rollEquipment(random, ['armor.garrison-helmet'], { common: 1, uncommon: 0 }),
      ],
    }
  }
  if (room.kind === 'recovery') {
    nextRun = {
      ...nextRun,
      safeExtractionAvailable: true,
      resources: {
        ...nextRun.resources,
        health: nextRun.resources.maxHealth,
        mana: nextRun.resources.maxMana,
        stamina: nextRun.resources.maxStamina,
      },
      expeditionBag: addStack(nextRun.expeditionBag, 'item.consumable.field-preparation', 3),
    }
  }

  nextRun = {
    ...nextRun,
    resolvedRoomIds: [...nextRun.resolvedRoomIds, room.id],
    updatedAt: now,
  }

  return {
    save: {
      ...nextSave,
      updatedAt: now,
      character: { ...nextSave.character, currentLocationId: dungeon.id },
      dungeon: { ...nextSave.dungeon, activeRun: nextRun },
    },
    combatResult,
  }
}

export function decideProtector(
  save: OfflineGameSave,
  decision: 'killed' | 'spared',
  now: string,
): OfflineGameSave {
  const run = save.dungeon.activeRun
  if (!run) throw new Error('Nenhuma DungeonRun ativa.')
  if (run.currentRoomId !== 'room.protector') throw new Error('Essa decisão só existe no Abrigo Improvisado.')
  if (run.protectorDecision) throw new Error('Essa decisão já foi tomada nesta run.')
  return {
    ...save,
    updatedAt: now,
    dungeon: {
      ...save.dungeon,
      activeRun: { ...run, protectorDecision: decision, updatedAt: now },
    },
  }
}

function materializeExpeditionEquipment(save: OfflineGameSave, loot: ExpeditionEquipment[]) {
  let sequence = save.character.nextEquipmentSequence
  const created: EquipmentInstance[] = loot.map((item) => ({
    instanceId: `eq-${sequence++}`,
    definitionId: item.definitionId,
    upgradeLevel: 0,
    rarity: item.rarity,
    affixIds: [...item.affixIds],
  }))
  return { created, nextSequence: sequence }
}

export function extractDungeonRun(save: OfflineGameSave, now: string): OfflineGameSave {
  const run = save.dungeon.activeRun
  if (!run) throw new Error('Nenhuma DungeonRun ativa.')
  if (!run.safeExtractionAvailable && !run.completed) {
    throw new Error('A retirada segura ainda não está disponível.')
  }

  let inventory = save.character.inventory
  for (const stack of run.expeditionBag) {
    inventory = addInventoryStack(inventory, stack.definitionId, stack.quantity)
  }

  const equipment = materializeExpeditionEquipment(save, run.expeditionEquipment)
  const firstClear = run.completed && !save.dungeon.dunLiathEasyCleared
  const alreadyHasRegister = inventory.some(
    (stack) => stack.definitionId === 'item.garrison-supply-register' && stack.quantity > 0,
  )
  const contractCanComplete = run.completed && (run.supplyRegisterRecovered || alreadyHasRegister)
  const contractReward = contractCanComplete && !save.dungeon.contractCompleted

  return {
    ...save,
    updatedAt: now,
    character: {
      ...save.character,
      currentLocationId: 'free-city.tavern',
      inventory,
      equipmentItems: [...save.character.equipmentItems, ...equipment.created],
      nextEquipmentSequence: equipment.nextSequence,
      gold: save.character.gold + (contractReward ? 150 : 0),
      xp: save.character.xp + (contractReward ? 150 : 0),
      knownAbilityIds:
        firstClear && !save.character.knownAbilityIds.includes('ability.instinctive-guard')
          ? [...save.character.knownAbilityIds, 'ability.instinctive-guard']
          : save.character.knownAbilityIds,
    },
    dungeon: {
      activeRun: null,
      dunLiathEasyCleared: save.dungeon.dunLiathEasyCleared || run.completed,
      dunLiathProtector: run.protectorDecision ?? save.dungeon.dunLiathProtector,
      contractCompleted: save.dungeon.contractCompleted || contractCanComplete,
      instinctiveGuardUnlocked: save.dungeon.instinctiveGuardUnlocked || firstClear,
    },
  }
}

export function failDungeonRun(save: OfflineGameSave, now: string): OfflineGameSave {
  const run = save.dungeon.activeRun
  return {
    ...save,
    updatedAt: now,
    character: { ...save.character, currentLocationId: 'free-city.tavern' },
    dungeon: {
      ...save.dungeon,
      activeRun: null,
      dunLiathProtector: run?.protectorDecision ?? save.dungeon.dunLiathProtector,
    },
  }
}
