from pathlib import Path

# Equipment definition supports fixed resource bonuses.
p = Path('packages/domain/src/equipment.ts')
t = p.read_text()
t = t.replace(
"""export interface EquipmentDefinition {\n  id: string\n  name: string\n  slot: EquipmentSlot\n  primaryStat?: EquipmentPrimaryStat\n  weaponCombat?: WeaponCombatProfile\n}""",
"""export interface EquipmentDefinition {\n  id: string\n  name: string\n  slot: EquipmentSlot\n  primaryStat?: EquipmentPrimaryStat\n  weaponCombat?: WeaponCombatProfile\n  resourceBonuses?: {\n    maxHealth?: number\n    maxMana?: number\n    maxStamina?: number\n  }\n}""",
)
p.write_text(t)

# Equipment gift semantics and schema v8.
p = Path('packages/domain/src/character.ts')
t = p.read_text()
t = t.replace("export const SAVE_SCHEMA_VERSION = 7 as const", "export const SAVE_SCHEMA_VERSION = 8 as const")
t = t.replace(
"""  | {\n      kind: 'item'\n      definitionId: string\n      quantity: number\n    }""",
"""  | {\n      kind: 'item'\n      definitionId: string\n      quantity: number\n    }\n  | {\n      kind: 'equipment'\n      definitionId: string\n    }""",
)
t = t.replace(
"""function buildGiftState(gift: GiftDefinition) {\n  const inventoryByDefinition = new Map<string, number>()\n  let gold = 0\n""",
"""function buildGiftState(gift: GiftDefinition) {\n  const inventoryByDefinition = new Map<string, number>()\n  const equipmentDefinitionIds: string[] = []\n  let gold = 0\n""",
)
t = t.replace(
"""      gold += grant.amount\n      continue\n    }\n\n    if (!Number.isInteger(grant.quantity) || grant.quantity <= 0) {""",
"""      gold += grant.amount\n      continue\n    }\n\n    if (grant.kind === 'equipment') {\n      if (!grant.definitionId.trim()) {\n        throw new Error(`Equipamento inválido no presente ${gift.id}.`)\n      }\n      equipmentDefinitionIds.push(grant.definitionId)\n      continue\n    }\n\n    if (!Number.isInteger(grant.quantity) || grant.quantity <= 0) {""",
)
t = t.replace("return { gold, inventory }", "return { gold, inventory, equipmentDefinitionIds }")
t = t.replace(
"""  const startingAbilityId = input.characterClass.startingAbilityId\n  const startingEquipment = createStartingEquipmentState(input.characterClass.startingEquipment)\n\n  return {""",
"""  const startingAbilityId = input.characterClass.startingAbilityId\n  const startingEquipment = createStartingEquipmentState(input.characterClass.startingEquipment)\n  const giftEquipmentItems: EquipmentInstance[] = giftState.equipmentDefinitionIds.map((definitionId, index) => ({\n    instanceId: `eq-${startingEquipment.nextEquipmentSequence + index}`,\n    definitionId,\n    upgradeLevel: 0,\n  }))\n\n  return {""",
)
t = t.replace(
"""      equipmentItems: startingEquipment.equipmentItems,\n      nextEquipmentSequence: startingEquipment.nextEquipmentSequence,""",
"""      equipmentItems: [...startingEquipment.equipmentItems, ...giftEquipmentItems],\n      nextEquipmentSequence: startingEquipment.nextEquipmentSequence + giftEquipmentItems.length,""",
)
p.write_text(t)

# Traveller Ring becomes a real equipment grant and carries its approved effects.
p = Path('packages/content/src/characterCreation.ts')
t = p.read_text().replace(
"grants: [{ kind: 'item', definitionId: 'item.equipment.traveller-ring', quantity: 1 }]",
"grants: [{ kind: 'equipment', definitionId: 'item.equipment.traveller-ring' }]",
)
p.write_text(t)

p = Path('packages/content/src/equipment.ts')
t = p.read_text().replace(
"{ id: 'item.equipment.traveller-ring', name: 'Anel do Viajante', slot: 'ring1' },",
"{ id: 'item.equipment.traveller-ring', name: 'Anel do Viajante', slot: 'ring1', resourceBonuses: { maxHealth: 8, maxMana: 5, maxStamina: 8 } },",
)
p.write_text(t)

# Affixes and fixed equipment bonuses affect derived combat stats; defeat outside Dungeon loses coins.
p = Path('packages/domain/src/combat.ts')
t = p.read_text()
old = """  const { attributes } = save.character\n  const equipped = getEquippedDefinitions(save, catalog)\n  const mainHandId = save.character.equipment.mainHand\n"""
new = """  const equipped = getEquippedDefinitions(save, catalog)\n  const attributes: CharacterAttributes = { ...save.character.attributes }\n  let flatDefenseBonus = 0\n  let flatAccuracyBonus = 0\n  let maxHealthBonus = 0\n  let maxManaBonus = 0\n  let maxStaminaBonus = 0\n\n  const attributeAffixes: Record<string, keyof CharacterAttributes> = {\n    'affix.vitality-1': 'vitality',\n    'affix.mind-1': 'mind',\n    'affix.vigor-1': 'vigor',\n    'affix.strength-1': 'strength',\n    'affix.dexterity-1': 'dexterity',\n    'affix.intelligence-1': 'intelligence',\n    'affix.faith-1': 'faith',\n  }\n\n  for (const entry of equipped) {\n    for (const affixId of entry.instance.affixIds ?? []) {\n      const attribute = attributeAffixes[affixId]\n      if (attribute) attributes[attribute] += 1\n      if (affixId === 'affix.accuracy-4') flatAccuracyBonus += 4\n      if (affixId === 'affix.defense-2') flatDefenseBonus += 2\n    }\n    maxHealthBonus += entry.definition.resourceBonuses?.maxHealth ?? 0\n    maxManaBonus += entry.definition.resourceBonuses?.maxMana ?? 0\n    maxStaminaBonus += entry.definition.resourceBonuses?.maxStamina ?? 0\n  }\n\n  const mainHandId = save.character.equipment.mainHand\n"""
if old not in t:
    raise SystemExit('derive stats anchor not found')
t = t.replace(old, new)
t = t.replace(
"""    return total + (getEquipmentPrimaryValue(entry.definition, entry.instance.upgradeLevel) ?? 0)\n  }, 0)""",
"""    return total + (getEquipmentPrimaryValue(entry.definition, entry.instance.upgradeLevel) ?? 0)\n  }, flatDefenseBonus)""",
1,
)
t = t.replace(
"""    maxHealth: 100 + attributes.vitality * 12,\n    maxMana: 30 + attributes.mind * 10,\n    maxStamina: 60 + attributes.vigor * 8,""",
"""    maxHealth: 100 + attributes.vitality * 12 + maxHealthBonus,\n    maxMana: 30 + attributes.mind * 10 + maxManaBonus,\n    maxStamina: 60 + attributes.vigor * 8 + maxStaminaBonus,""",
)
t = t.replace(
"""    accuracy: 100 + attributes.dexterity * 2,""",
"""    accuracy: 100 + attributes.dexterity * 2 + flatAccuracyBonus,""",
)
apply_anchor = """export function applyCombatResult(\n  save: OfflineGameSave,\n  enemyDefinitionId: string,\n  result: CombatResult,\n  now: string,\n): OfflineGameSave {\n  const consumedState = consumeAcrossSafeAndExpedition(save, result.consumedItems)\n\n  return {"""
apply_new = """export function applyCombatResult(\n  save: OfflineGameSave,\n  enemyDefinitionId: string,\n  result: CombatResult,\n  now: string,\n): OfflineGameSave {\n  const consumedState = consumeAcrossSafeAndExpedition(save, result.consumedItems)\n  const goldLoss =\n    result.outcome === 'defeat' && !save.dungeon.activeRun\n      ? Math.ceil(Math.min(save.character.gold * 0.1, 10 * save.character.level))\n      : 0\n\n  return {"""
if apply_anchor not in t:
    raise SystemExit('applyCombatResult anchor not found')
t = t.replace(apply_anchor, apply_new)
t = t.replace(
"""      xp: save.character.xp + result.xpGranted,\n      currentLocationId: 'free-city.tavern',""",
"""      xp: save.character.xp + result.xpGranted,\n      gold: Math.max(0, consumedState.character.gold - goldLoss),\n      currentLocationId: 'free-city.tavern',""",
1,
)
p.write_text(t)

# Dungeon entry may receive fully-derived resources from the UI so equipment bonuses are full at entry.
p = Path('packages/domain/src/dungeon.ts')
t = p.read_text()
t = t.replace(
"""export function createDungeonRun(\n  save: OfflineGameSave,\n  dungeon: DungeonDefinition,\n  seed: number,\n  now: string,\n): DungeonRun {""",
"""export function createDungeonRun(\n  save: OfflineGameSave,\n  dungeon: DungeonDefinition,\n  seed: number,\n  now: string,\n  startingResources?: CombatResources,\n): DungeonRun {""",
)
t = t.replace("resources: initialResources(save),", "resources: startingResources ?? initialResources(save),", 1)
t = t.replace(
"""export function startDungeon(\n  save: OfflineGameSave,\n  dungeon: DungeonDefinition,\n  seed: number,\n  now: string,\n): OfflineGameSave {""",
"""export function startDungeon(\n  save: OfflineGameSave,\n  dungeon: DungeonDefinition,\n  seed: number,\n  now: string,\n  startingResources?: CombatResources,\n): OfflineGameSave {""",
)
t = t.replace("activeRun: createDungeonRun(save, dungeon, seed, now),", "activeRun: createDungeonRun(save, dungeon, seed, now, startingResources),")
p.write_text(t)

p = Path('packages/domain/src/continuity.ts')
t = p.read_text()
t = t.replace("import { startDungeon, type DungeonDefinition } from './dungeon'", "import type { CombatResources } from './combat'\nimport { startDungeon, type DungeonDefinition } from './dungeon'")
t = t.replace(
"""  seed: number,\n  now: string,\n): OfflineGameSave {""",
"""  seed: number,\n  now: string,\n  startingResources?: CombatResources,\n): OfflineGameSave {""",
1,
)
t = t.replace("const started = startDungeon(detached, dungeon, seed, now)", "const started = startDungeon(detached, dungeon, seed, now, startingResources)")
p.write_text(t)

# Runtime Dungeon passes derived resource maxima into run creation.
p = Path('apps/game/src/DungeonWorkbench.tsx')
t = p.read_text()
t = t.replace(
"""  decideProtector,\n  extractDungeonRun,""",
"""  decideProtector,\n  derivePlayerCombatStats,\n  extractDungeonRun,""",
)
t = t.replace(
"""      const seed = Date.now() >>> 0\n      const next = startDungeonWithContinuity(riskSave, DUN_LIATH_EASY, seed, now)""",
"""      const seed = Date.now() >>> 0\n      const stats = derivePlayerCombatStats(riskSave, dungeonCatalog)\n      const startingResources = {\n        health: stats.maxHealth, maxHealth: stats.maxHealth,\n        mana: stats.maxMana, maxMana: stats.maxMana,\n        stamina: stats.maxStamina, maxStamina: stats.maxStamina,\n      }\n      const next = startDungeonWithContinuity(riskSave, DUN_LIATH_EASY, seed, now, startingResources)""",
)
p.write_text(t)

# Defeat feedback reports the actual coin consequence.
p = Path('apps/game/src/CombatWorkbench.tsx')
t = p.read_text()
t = t.replace(
"""    const updated = resumeCurrentWorkAfterRisk(applied, now)\n    const text = result.outcome === 'victory'""",
"""    const updated = resumeCurrentWorkAfterRisk(applied, now)\n    const lostCoins = Math.max(0, combatBaseSave.character.gold - applied.character.gold)\n    const text = result.outcome === 'victory'""",
)
t = t.replace(
"""      : 'Resultado persistido. O personagem retornou à Cidade Livre e a atividade Idle foi retomada.'""",
"""      : `Derrota persistida: ${lostCoins} moeda(s) perdida(s). O personagem retornou à Cidade Livre e a atividade Idle foi retomada.`""",
)
p.write_text(t)

# Persistence v7 -> v8 normalizes legacy Traveller Ring stacks into equipment instances.
p = Path('packages/persistence/src/indexedDbSaveRepository.ts')
t = p.read_text()
t = t.replace(
"""interface LegacyOfflineGameSaveV6 extends Omit<OfflineGameSave, 'saveSchemaVersion' | 'character'> {\n  saveSchemaVersion: 6\n  character: Omit<OfflineGameSave['character'], 'bank'>\n}\n""",
"""interface LegacyOfflineGameSaveV6 extends Omit<OfflineGameSave, 'saveSchemaVersion' | 'character'> {\n  saveSchemaVersion: 6\n  character: Omit<OfflineGameSave['character'], 'bank'>\n}\n\ninterface LegacyOfflineGameSaveV7 extends Omit<OfflineGameSave, 'saveSchemaVersion'> {\n  saveSchemaVersion: 7\n}\n""",
)
helper_anchor = """function withEmptyBank(\n  character: Omit<OfflineGameSave['character'], 'bank'>,\n): OfflineGameSave['character'] {\n  return { ...character, bank: { inventory: [], equipmentItems: [] } }\n}\n"""
helper_new = """function normalizeTravellerRingGift(\n  character: OfflineGameSave['character'],\n): OfflineGameSave['character'] {\n  if (character.giftId !== 'traveller-ring') return character\n  if (character.equipmentItems.some((item) => item.definitionId === 'item.equipment.traveller-ring')) return character\n\n  const ringStack = character.inventory.find((stack) => stack.definitionId === 'item.equipment.traveller-ring')\n  if (!ringStack || ringStack.quantity <= 0) return character\n\n  const instanceId = `eq-${character.nextEquipmentSequence}`\n  return {\n    ...character,\n    inventory: character.inventory\n      .map((stack) => stack.definitionId === 'item.equipment.traveller-ring' ? { ...stack, quantity: stack.quantity - 1 } : stack)\n      .filter((stack) => stack.quantity > 0),\n    equipmentItems: [...character.equipmentItems, { instanceId, definitionId: 'item.equipment.traveller-ring', upgradeLevel: 0 }],\n    nextEquipmentSequence: character.nextEquipmentSequence + 1,\n  }\n}\n\nfunction withEmptyBank(\n  character: Omit<OfflineGameSave['character'], 'bank'>,\n): OfflineGameSave['character'] {\n  return normalizeTravellerRingGift({ ...character, bank: { inventory: [], equipmentItems: [] } })\n}\n"""
if helper_anchor not in t:
    raise SystemExit('bank helper anchor not found')
t = t.replace(helper_anchor, helper_new)
# normalize v1/v2 migration too
t = t.replace(
"""  return {\n    ...character,\n    bank: { inventory: [], equipmentItems: [] },\n    equipment: startingEquipment.equipped,\n    equipmentItems: startingEquipment.equipmentItems,\n    nextEquipmentSequence: startingEquipment.nextEquipmentSequence,\n  }\n}""",
"""  return normalizeTravellerRingGift({\n    ...character,\n    bank: { inventory: [], equipmentItems: [] },\n    equipment: startingEquipment.equipped,\n    equipmentItems: startingEquipment.equipmentItems,\n    nextEquipmentSequence: startingEquipment.nextEquipmentSequence,\n  })\n}""",
1,
)
dispatch_anchor = """  if (candidate.saveSchemaVersion === SAVE_SCHEMA_VERSION) {\n    return rawSave as OfflineGameSave\n  }\n\n  if (candidate.saveSchemaVersion === 6) {"""
dispatch_new = """  if (candidate.saveSchemaVersion === SAVE_SCHEMA_VERSION) {\n    return rawSave as OfflineGameSave\n  }\n\n  if (candidate.saveSchemaVersion === 7) {\n    const legacy = rawSave as LegacyOfflineGameSaveV7\n    return {\n      ...legacy,\n      saveSchemaVersion: SAVE_SCHEMA_VERSION,\n      character: normalizeTravellerRingGift(legacy.character),\n    }\n  }\n\n  if (candidate.saveSchemaVersion === 6) {"""
if dispatch_anchor not in t:
    raise SystemExit('v7 dispatch anchor not found')
t = t.replace(dispatch_anchor, dispatch_new)
p.write_text(t)

# Tests: schema/equipment gift, bonuses/affixes, death penalty.
p = Path('packages/domain/src/character.test.ts')
t = p.read_text().replace("expect(save.saveSchemaVersion).toBe(7)", "expect(save.saveSchemaVersion).toBe(8)")
insert = """\n  it('materializes an equipment gift as an equipment instance instead of a stack', () => {\n    const equipmentGift: GiftDefinition = {\n      id: 'traveller-ring',\n      name: 'Anel do Viajante',\n      summary: 'Equipamento inicial.',\n      grants: [{ kind: 'equipment', definitionId: 'item.equipment.traveller-ring' }],\n    }\n    const save = createOfflineGameSave({\n      saveId: 'ring-gift', createdAt: '2026-09-10T10:00:00.000Z', contentVersion: '0.1.0-dev',\n      characterName: 'Ailith', characterClass: classDefinition, gift: equipmentGift,\n    })\n\n    expect(save.character.inventory.some((stack) => stack.definitionId === 'item.equipment.traveller-ring')).toBe(false)\n    expect(save.character.equipmentItems.some((item) => item.definitionId === 'item.equipment.traveller-ring')).toBe(true)\n  })\n"""
anchor = "\n  it('rejects a blank character name', () => {"
if insert.strip() not in t:
    t = t.replace(anchor, insert + anchor)
p.write_text(t)

p = Path('packages/domain/src/combat.test.ts')
t = p.read_text()
t = t.replace(
"""  { id: 'armor.travel-protection', name: 'Proteção de Viagem', slot: 'chest', primaryStat: { kind: 'defense', value: 12 } },\n]""",
"""  { id: 'armor.travel-protection', name: 'Proteção de Viagem', slot: 'chest', primaryStat: { kind: 'defense', value: 12 } },\n  { id: 'ring.test', name: 'Anel de Teste', slot: 'ring1', resourceBonuses: { maxHealth: 8, maxMana: 5, maxStamina: 8 } },\n]""",
)
extra_tests = """\n  it('applies equipped resource bonuses and procedural affixes to derived stats', () => {\n    const base = createSave()\n    const chestId = base.character.equipment.chest\n    if (!chestId) throw new Error('Peitoral ausente.')\n    const ringId = `eq-${base.character.nextEquipmentSequence}`\n    const save = {\n      ...base,\n      character: {\n        ...base.character,\n        equipment: { ...base.character.equipment, ring1: ringId },\n        equipmentItems: [\n          ...base.character.equipmentItems.map((item) => item.instanceId === chestId ? { ...item, affixIds: ['affix.vitality-1', 'affix.accuracy-4', 'affix.defense-2'] } : item),\n          { instanceId: ringId, definitionId: 'ring.test', upgradeLevel: 0 as const },\n        ],\n        nextEquipmentSequence: base.character.nextEquipmentSequence + 1,\n      },\n    }\n    const stats = derivePlayerCombatStats(save, catalog)\n    expect(stats.maxHealth).toBe(180)\n    expect(stats.maxMana).toBe(85)\n    expect(stats.maxStamina).toBe(108)\n    expect(stats.defense).toBe(14)\n    expect(stats.accuracy).toBe(114)\n  })\n\n  it('applies the approved outside-Dungeon defeat coin loss', () => {\n    const base = createSave()\n    const save = { ...base, character: { ...base.character, gold: 57 } }\n    const defeat: CombatResult = {\n      outcome: 'defeat', durationSeconds: 5, player: { health: 0, maxHealth: 160, mana: 80, maxMana: 80, stamina: 100, maxStamina: 100 },\n      enemyHealth: 10, xpGranted: 0, consumedItems: [], log: [], seed: 1,\n    }\n    const persisted = applyCombatResult(save, roadWolf.id, defeat, '2026-09-10T10:05:00.000Z')\n    expect(persisted.character.gold).toBe(51)\n  })\n"""
anchor = "\n  it('replays identically with the same seed and starting state', () => {"
if extra_tests.strip() not in t:
    t = t.replace(anchor, extra_tests + anchor)
p.write_text(t)

p = Path('packages/persistence/src/indexedDbSaveRepository.test.ts')
t = p.read_text().replace("expect(loaded?.saveSchemaVersion).toBe(7)", "expect(loaded?.saveSchemaVersion).toBe(8)")
p.write_text(t)
