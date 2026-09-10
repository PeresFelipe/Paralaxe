import type { CombatContentCatalog, CombatLogEntry, CombatResult, CombatResources } from './combat'
import { applyCombatResult, simulateCombat } from './combat'
import type { EquipmentInstance, EquipmentRarity } from './equipment'
import type { OfflineGameSave } from './character'
import { assertInventoryCanReceiveEquipment, assertInventoryCanReceiveStack } from './storage'

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
  contractAccepted: boolean
  contractCompleted: boolean
  instinctiveGuardUnlocked: boolean
}

export interface DungeonContentCatalog extends CombatContentCatalog {
  getDungeonDefinition(dungeonId: string): DungeonDefinition | null
}

export interface DungeonRoomResolution {
  save: OfflineGameSave
  combatResult?: CombatResult
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

function createRng(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 0x1_0000_0000
  }
}

function addStack(stacks: ExpeditionStack[], definitionId: string, quantity = 1) {
  const existing = stacks.find((stack) => stack.definitionId === definitionId)
  if (!existing) return [...stacks, { definitionId, quantity }]

  return stacks.map((stack) =>
    stack.definitionId === definitionId
      ? { ...stack, quantity: stack.quantity + quantity }
      : stack,
  )
}

function addInventoryStack(
  inventory: OfflineGameSave['character']['inventory'],
  definitionId: string,
  quantity: number,
) {
  const existing = inventory.find((stack) => stack.definitionId === definitionId)
  if (!existing) return [...inventory, { definitionId, quantity }]

  return inventory.map((stack) =>
    stack.definitionId === definitionId
      ? { ...stack, quantity: stack.quantity + quantity }
      : stack,
  )
}

function mergeConsumedItems(first: CombatResult['consumedItems'], second: CombatResult['consumedItems']) {
  const quantities = new Map<string, number>()
  for (const stack of [...first, ...second]) {
    quantities.set(stack.definitionId, (quantities.get(stack.definitionId) ?? 0) + stack.quantity)
  }
  return [...quantities.entries()].map(([definitionId, quantity]) => ({ definitionId, quantity }))
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

function offsetLog(log: CombatLogEntry[], offset: number) {
  return log.map((entry) => ({
    ...entry,
    atSeconds: Number((entry.atSeconds + offset).toFixed(3)),
  }))
}

function simulateFairtheoirEncounter(
  save: OfflineGameSave,
  catalog: CombatContentCatalog,
  seed: number,
  startingResources: CombatResources,
): CombatResult {
  const phase1 = simulateCombat(
    save,
    catalog,
    'enemy.fairtheoir-phase1',
    seed,
    180,
    startingResources,
  )
  if (phase1.outcome !== 'victory') return phase1

  // A Fase 2 precisa enxergar o estoque já reduzido pela Fase 1, mas esse estado é
  // transitório: o resultado combinado será aplicado ao save real apenas uma vez.
  const phase2InputSave = applyCombatResult(
    save,
    'enemy.fairtheoir-phase1',
    phase1,
    save.updatedAt,
  )
  const phase2 = simulateCombat(
    phase2InputSave,
    catalog,
    'enemy.fairtheoir-phase2',
    (seed ^ 0x9e3779b9) >>> 0,
    180,
    phase1.player,
  )
  const phaseTransitionAt = phase1.durationSeconds

  return {
    outcome: phase2.outcome,
    durationSeconds: Number((phase1.durationSeconds + phase2.durationSeconds).toFixed(3)),
    player: phase2.player,
    enemyHealth: phase2.enemyHealth,
    xpGranted: phase2.outcome === 'victory' ? 120 : 0,
    consumedItems: mergeConsumedItems(phase1.consumedItems, phase2.consumedItems),
    seed,
    log: [
      ...phase1.log.filter((entry) => entry.kind !== 'result'),
      {
        atSeconds: phaseTransitionAt,
        actor: 'system',
        kind: 'result',
        message: 'Fairtheoir chega a 45% da Vida total. Fase 2 — Desespero.',
      },
      ...offsetLog(phase2.log, phaseTransitionAt),
    ],
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
  return {
    definitionId,
    rarity,
    affixIds: rollAffixes(random, affixCount(rarity)),
  }
}

export function acceptDunLiathContract(save: OfflineGameSave, now: string): OfflineGameSave {
  if (save.dungeon.contractAccepted) return save
  if (save.dungeon.contractCompleted) return save
  assertInventoryCanReceiveStack(save, 'item.consumable.field-preparation', 2)

  return {
    ...save,
    updatedAt: now,
    character: {
      ...save.character,
      inventory: addInventoryStack(
        save.character.inventory,
        'item.consumable.field-preparation',
        2,
      ),
    },
    dungeon: { ...save.dungeon, contractAccepted: true },
  }
}

export function createDungeonRun(
  save: OfflineGameSave,
  dungeon: DungeonDefinition,
  seed: number,
  now: string,
  startingResources?: CombatResources,
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
    resources: startingResources ?? initialResources(save),
    protectorDecision: save.dungeon.dunLiathProtector,
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
  startingResources?: CombatResources,
): OfflineGameSave {
  if (save.idle.activeActivity || save.crafting.activeRecipe) {
    throw new Error('Interrompa a atividade Idle antes de iniciar uma Dungeon.')
  }
  if (save.dungeon.activeRun) throw new Error('Já existe uma DungeonRun ativa.')
  if (!save.dungeon.contractAccepted && !save.dungeon.contractCompleted) {
    throw new Error('Aceite primeiro o Contrato — Fortaleza Cinzenta.')
  }

  return {
    ...save,
    updatedAt: now,
    character: { ...save.character, currentLocationId: dungeon.id },
    dungeon: {
      ...save.dungeon,
      activeRun: createDungeonRun(save, dungeon, seed, now, startingResources),
    },
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
  if (!run.resolvedRoomIds.includes(room.id)) {
    throw new Error('Resolva a sala atual antes de avançar.')
  }
  if (!room.nextRoomIds.includes(nextRoomId)) {
    throw new Error('Esse caminho não parte da sala atual.')
  }
  if (run.visitedRoomIds.includes(nextRoomId)) {
    throw new Error('A rota da Dungeon é irreversível.')
  }

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

function resolveCombatRoom(
  save: OfflineGameSave,
  dungeon: DungeonDefinition,
  catalog: DungeonContentCatalog,
  run: DungeonRun,
  room: DungeonRoomDefinition,
  random: () => number,
  now: string,
): { save: OfflineGameSave; run: DungeonRun; combatResult: CombatResult } {
  if (!room.enemyDefinitionId) throw new Error('Sala não possui inimigo.')

  const encounterSeed = (run.seed + run.visitedRoomIds.length * 7919) >>> 0
  const isFairtheoir = room.id === 'room.fairtheoir'
  const combatResult = isFairtheoir
    ? simulateFairtheoirEncounter(save, catalog, encounterSeed, run.resources)
    : simulateCombat(
        save,
        catalog,
        room.enemyDefinitionId,
        encounterSeed,
        180,
        run.resources,
      )

  if (combatResult.outcome !== 'victory') {
    const consumedSave = applyCombatResult(save, room.enemyDefinitionId, combatResult, now)
    return { save: failDungeonRun(consumedSave, now), run, combatResult }
  }

  const appliedEnemyId = isFairtheoir ? 'enemy.fairtheoir-phase2' : room.enemyDefinitionId
  let nextSave = applyCombatResult(save, appliedEnemyId, combatResult, now)
  nextSave = {
    ...nextSave,
    character: { ...nextSave.character, currentLocationId: dungeon.id },
  }

  let nextRun: DungeonRun = {
    ...(nextSave.dungeon.activeRun ?? run),
    resources: combatResult.player,
  }

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

  return { save: nextSave, run: nextRun, combatResult }
}

export function resolveDungeonRoom(
  save: OfflineGameSave,
  dungeon: DungeonDefinition,
  catalog: DungeonContentCatalog,
  now: string,
): DungeonRoomResolution {
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
  let combatResult: CombatResult | null = null

  if (room.enemyDefinitionId) {
    const combatResolution = resolveCombatRoom(
      save,
      dungeon,
      catalog,
      run,
      room,
      random,
      now,
    )
    combatResult = combatResolution.combatResult

    if (!combatResolution.save.dungeon.activeRun) {
      return { save: combatResolution.save, combatResult }
    }

    nextSave = combatResolution.save
    nextRun = combatResolution.run
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
      expeditionBag: addStack(
        nextRun.expeditionBag,
        'item.consumable.field-preparation',
        3,
      ),
    }
  }

  nextRun = {
    ...nextRun,
    resolvedRoomIds: [...nextRun.resolvedRoomIds, room.id],
    updatedAt: now,
  }

  const resolvedSave: OfflineGameSave = {
    ...nextSave,
    updatedAt: now,
    character: { ...nextSave.character, currentLocationId: dungeon.id },
    dungeon: { ...nextSave.dungeon, activeRun: nextRun },
  }

  return combatResult ? { save: resolvedSave, combatResult } : { save: resolvedSave }
}

export function decideProtector(
  save: OfflineGameSave,
  decision: 'killed' | 'spared',
  now: string,
): OfflineGameSave {
  const run = save.dungeon.activeRun
  if (!run) throw new Error('Nenhuma DungeonRun ativa.')
  if (run.currentRoomId !== 'room.protector') {
    throw new Error('Essa decisão só existe no Abrigo Improvisado.')
  }
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

function materializeExpeditionEquipment(
  save: OfflineGameSave,
  loot: ExpeditionEquipment[],
) {
  let nextSequence = save.character.nextEquipmentSequence
  const created: EquipmentInstance[] = loot.map((item) => ({
    instanceId: `eq-${nextSequence++}`,
    definitionId: item.definitionId,
    upgradeLevel: 0,
    rarity: item.rarity,
    affixIds: [...item.affixIds],
  }))

  return { created, nextSequence }
}

export function extractDungeonRun(save: OfflineGameSave, now: string): OfflineGameSave {
  const run = save.dungeon.activeRun
  if (!run) throw new Error('Nenhuma DungeonRun ativa.')
  if (!run.safeExtractionAvailable && !run.completed) {
    throw new Error('A retirada segura ainda não está disponível.')
  }

  let inventory = save.character.inventory
  for (const stack of run.expeditionBag) {
    const preview: OfflineGameSave = {
      ...save,
      character: { ...save.character, inventory },
    }
    assertInventoryCanReceiveStack(preview, stack.definitionId, stack.quantity)
    inventory = addInventoryStack(inventory, stack.definitionId, stack.quantity)
  }

  const equipmentPreview: OfflineGameSave = {
    ...save,
    character: { ...save.character, inventory },
  }
  if (run.expeditionEquipment.length > 0) {
    assertInventoryCanReceiveEquipment(equipmentPreview, run.expeditionEquipment.length)
  }
  const equipment = materializeExpeditionEquipment(save, run.expeditionEquipment)
  const firstClear = run.completed && !save.dungeon.dunLiathEasyCleared
  const alreadyHasRegister = inventory.some(
    (stack) =>
      stack.definitionId === 'item.garrison-supply-register' && stack.quantity > 0,
  )
  const contractCanComplete =
    run.completed && (run.supplyRegisterRecovered || alreadyHasRegister)
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
      dunLiathProtector: save.dungeon.dunLiathProtector ?? run.protectorDecision,
      contractAccepted: save.dungeon.contractAccepted,
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
      dunLiathProtector:
        save.dungeon.dunLiathProtector ?? run?.protectorDecision ?? null,
    },
  }
}
