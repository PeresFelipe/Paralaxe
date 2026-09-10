from pathlib import Path
import re

# character.ts: equipment grants and schema v8
p = Path('packages/domain/src/character.ts')
t = p.read_text()
t = t.replace(
"""  type EquipmentInstance,\n  type StartingEquipmentLoadout,""",
"""  type EquipmentInstance,\n  type EquipmentSlot,\n  type StartingEquipmentLoadout,""",
)
t = t.replace(
"""export type StartingGrant =\n  | {\n      kind: 'gold'\n      amount: number\n    }\n  | {\n      kind: 'item'\n      definitionId: string\n      quantity: number\n    }""",
"""export type StartingGrant =\n  | {\n      kind: 'gold'\n      amount: number\n    }\n  | {\n      kind: 'item'\n      definitionId: string\n      quantity: number\n    }\n  | {\n      kind: 'equipment'\n      definitionId: string\n      equipSlot?: EquipmentSlot\n    }""",
)
t = t.replace("export const SAVE_SCHEMA_VERSION = 7 as const", "export const SAVE_SCHEMA_VERSION = 8 as const")
start = t.index('function buildGiftState(gift: GiftDefinition) {')
end = t.index('\n\nexport function createOfflineGameSave', start)
new_build = """function buildGiftState(gift: GiftDefinition) {\n  const inventoryByDefinition = new Map<string, number>()\n  const equipmentGrants: Array<{ definitionId: string; equipSlot?: EquipmentSlot }> = []\n  let gold = 0\n\n  for (const grant of gift.grants) {\n    if (grant.kind === 'gold') {\n      if (!Number.isInteger(grant.amount) || grant.amount < 0) {\n        throw new Error(`Quantidade de moedas inválida no presente ${gift.id}.`)\n      }\n      gold += grant.amount\n      continue\n    }\n\n    if (grant.kind === 'equipment') {\n      if (!grant.definitionId.trim()) {\n        throw new Error(`Equipamento inválido no presente ${gift.id}.`)\n      }\n      equipmentGrants.push({ definitionId: grant.definitionId, equipSlot: grant.equipSlot })\n      continue\n    }\n\n    if (!Number.isInteger(grant.quantity) || grant.quantity <= 0) {\n      throw new Error(`Quantidade de item inválida no presente ${gift.id}.`)\n    }\n\n    const currentQuantity = inventoryByDefinition.get(grant.definitionId) ?? 0\n    inventoryByDefinition.set(grant.definitionId, currentQuantity + grant.quantity)\n  }\n\n  const inventory = [...inventoryByDefinition.entries()].map(([definitionId, quantity]) => ({\n    definitionId,\n    quantity,\n  }))\n\n  return { gold, inventory, equipmentGrants }\n}"""
t = t[:start] + new_build + t[end:]
anchor = """  const giftState = buildGiftState(input.gift)\n  const startingAbilityId = input.characterClass.startingAbilityId\n  const startingEquipment = createStartingEquipmentState(input.characterClass.startingEquipment)\n\n  return {"""
replacement = """  const giftState = buildGiftState(input.gift)\n  const startingAbilityId = input.characterClass.startingAbilityId\n  const startingEquipment = createStartingEquipmentState(input.characterClass.startingEquipment)\n  const giftEquipmentItems: EquipmentInstance[] = giftState.equipmentGrants.map((grant, index) => ({\n    instanceId: `eq-${startingEquipment.nextEquipmentSequence + index}`,\n    definitionId: grant.definitionId,\n    upgradeLevel: 0,\n  }))\n  const equipped = { ...startingEquipment.equipped }\n  giftState.equipmentGrants.forEach((grant, index) => {\n    const instance = giftEquipmentItems[index]\n    if (grant.equipSlot && instance && !equipped[grant.equipSlot]) {\n      equipped[grant.equipSlot] = instance.instanceId\n    }\n  })\n\n  return {"""
if anchor not in t: raise SystemExit('character create anchor missing')
t = t.replace(anchor, replacement, 1)
t = t.replace(
"""      equipment: startingEquipment.equipped,\n      equipmentItems: startingEquipment.equipmentItems,\n      nextEquipmentSequence: startingEquipment.nextEquipmentSequence,""",
"""      equipment: equipped,\n      equipmentItems: [...startingEquipment.equipmentItems, ...giftEquipmentItems],\n      nextEquipmentSequence: startingEquipment.nextEquipmentSequence + giftEquipmentItems.length,""",
1,
)
p.write_text(t)

# equipment definition supports fixed resource bonuses
p = Path('packages/domain/src/equipment.ts')
t = p.read_text()
t = t.replace(
"""  primaryStat?: EquipmentPrimaryStat\n  weaponCombat?: WeaponCombatProfile\n}""",
"""  primaryStat?: EquipmentPrimaryStat\n  weaponCombat?: WeaponCombatProfile\n  resourceBonuses?: {\n    maxHealth?: number\n    maxMana?: number\n    maxStamina?: number\n  }\n}""",
1,
)
p.write_text(t)

# Traveller Ring is an equipment gift with its Build 0.1 bonuses
p = Path('packages/content/src/characterCreation.ts')
t = p.read_text().replace(
"grants: [{ kind: 'item', definitionId: 'item.equipment.traveller-ring', quantity: 1 }]",
"grants: [{ kind: 'equipment', definitionId: 'item.equipment.traveller-ring', equipSlot: 'ring1' }]",
)
p.write_text(t)
p = Path('packages/content/src/equipment.ts')
t = p.read_text().replace(
"{ id: 'item.equipment.traveller-ring', name: 'Anel do Viajante', slot: 'ring1' },",
"{ id: 'item.equipment.traveller-ring', name: 'Anel do Viajante', slot: 'ring1', resourceBonuses: { maxHealth: 8, maxMana: 5, maxStamina: 8 } },",
)
p.write_text(t)

# combat: affixes/equipment bonuses and outside-Dungeon defeat cost
p = Path('packages/domain/src/combat.ts')
t = p.read_text()
t = t.replace(
"""interface DerivedPlayerCombatStats {\n  maxHealth: number""",
"""interface DerivedPlayerCombatStats {\n  attributes: CharacterAttributes\n  maxHealth: number""",
1,
)
start = t.index('export function derivePlayerCombatStats(')
end = t.index('\n\nfunction initialResources', start)
new_derive = """export function derivePlayerCombatStats(\n  save: OfflineGameSave,\n  catalog: CombatEquipmentCatalog,\n): DerivedPlayerCombatStats {\n  const equipped = getEquippedDefinitions(save, catalog)\n  const attributes: CharacterAttributes = { ...save.character.attributes }\n  let flatDefenseBonus = 0\n  let flatAccuracyBonus = 0\n  let maxHealthBonus = 0\n  let maxManaBonus = 0\n  let maxStaminaBonus = 0\n  const attributeAffixes: Partial<Record<string, keyof CharacterAttributes>> = {\n    'affix.vitality-1': 'vitality',\n    'affix.mind-1': 'mind',\n    'affix.vigor-1': 'vigor',\n    'affix.strength-1': 'strength',\n    'affix.dexterity-1': 'dexterity',\n    'affix.intelligence-1': 'intelligence',\n    'affix.faith-1': 'faith',\n  }\n\n  for (const entry of equipped) {\n    for (const affixId of entry.instance.affixIds ?? []) {\n      const attribute = attributeAffixes[affixId]\n      if (attribute) attributes[attribute] += 1\n      if (affixId === 'affix.accuracy-4') flatAccuracyBonus += 4\n      if (affixId === 'affix.defense-2') flatDefenseBonus += 2\n    }\n    maxHealthBonus += entry.definition.resourceBonuses?.maxHealth ?? 0\n    maxManaBonus += entry.definition.resourceBonuses?.maxMana ?? 0\n    maxStaminaBonus += entry.definition.resourceBonuses?.maxStamina ?? 0\n  }\n\n  const mainHandId = save.character.equipment.mainHand\n  const mainHand = equipped.find((entry) => entry.instance.instanceId === mainHandId)\n  if (!mainHand?.definition.weaponCombat) {\n    throw new Error('O personagem precisa de uma arma válida equipada para combater.')\n  }\n\n  const defense = equipped.reduce((total, entry) => {\n    if (entry.definition.primaryStat?.kind !== 'defense') return total\n    return total + (getEquipmentPrimaryValue(entry.definition, entry.instance.upgradeLevel) ?? 0)\n  }, flatDefenseBonus)\n  const weaponPower =\n    mainHand.definition.primaryStat?.kind === 'attack'\n      ? getEquipmentPrimaryValue(mainHand.definition, mainHand.instance.upgradeLevel) ?? 0\n      : 0\n  const speedBonus = Math.min(0.25, attributes.dexterity * 0.004)\n\n  return {\n    attributes,\n    maxHealth: 100 + attributes.vitality * 12 + maxHealthBonus,\n    maxMana: 30 + attributes.mind * 10 + maxManaBonus,\n    maxStamina: 60 + attributes.vigor * 8 + maxStaminaBonus,\n    manaRegenPerSecond: 1.5 + attributes.mind * 0.35,\n    staminaRegenPerSecond: 5 + attributes.vigor * 0.6,\n    defense,\n    evasion: 100,\n    accuracy: 100 + attributes.dexterity * 2 + flatAccuracyBonus,\n    criticalChance: 0.05 + attributes.dexterity * 0.0025,\n    basicAttackPower: weaponPower,\n    basicDamageType: mainHand.definition.weaponCombat.damageType,\n    actionIntervalSeconds: mainHand.definition.weaponCombat.actionIntervalSeconds / (1 + speedBonus),\n    weaponScaling: mainHand.definition.weaponCombat.scaling,\n  }\n}"""
t = t[:start] + new_derive + t[end:]
t = t.replace('scalingContribution(save.character.attributes,', 'scalingContribution(stats.attributes,')
apply_anchor = """export function applyCombatResult(\n  save: OfflineGameSave,\n  enemyDefinitionId: string,\n  result: CombatResult,\n  now: string,\n): OfflineGameSave {\n  const consumedState = consumeAcrossSafeAndExpedition(save, result.consumedItems)\n\n  return {"""
apply_new = """export function applyCombatResult(\n  save: OfflineGameSave,\n  enemyDefinitionId: string,\n  result: CombatResult,\n  now: string,\n): OfflineGameSave {\n  const consumedState = consumeAcrossSafeAndExpedition(save, result.consumedItems)\n  const goldLoss =\n    result.outcome === 'defeat' && !save.dungeon.activeRun\n      ? Math.ceil(Math.min(save.character.gold * 0.1, 10 * save.character.level))\n      : 0\n\n  return {"""
if apply_anchor not in t: raise SystemExit('applyCombatResult anchor missing')
t = t.replace(apply_anchor, apply_new, 1)
t = t.replace(
"""      xp: save.character.xp + result.xpGranted,\n      currentLocationId: 'free-city.tavern',""",
"""      xp: save.character.xp + result.xpGranted,\n      gold: Math.max(0, consumedState.character.gold - goldLoss),\n      currentLocationId: 'free-city.tavern',""",
1,
)
p.write_text(t)

# Dungeon entry can receive full derived resources
p = Path('packages/domain/src/dungeon.ts')
t = p.read_text()
t = t.replace(
"""export function createDungeonRun(\n  save: OfflineGameSave,\n  dungeon: DungeonDefinition,\n  seed: number,\n  now: string,\n): DungeonRun {""",
"""export function createDungeonRun(\n  save: OfflineGameSave,\n  dungeon: DungeonDefinition,\n  seed: number,\n  now: string,\n  startingResources?: CombatResources,\n): DungeonRun {""",
1,
)
t = t.replace('resources: initialResources(save),', 'resources: startingResources ?? initialResources(save),', 1)
t = t.replace(
"""export function startDungeon(\n  save: OfflineGameSave,\n  dungeon: DungeonDefinition,\n  seed: number,\n  now: string,\n): OfflineGameSave {""",
"""export function startDungeon(\n  save: OfflineGameSave,\n  dungeon: DungeonDefinition,\n  seed: number,\n  now: string,\n  startingResources?: CombatResources,\n): OfflineGameSave {""",
1,
)
t = t.replace('activeRun: createDungeonRun(save, dungeon, seed, now),', 'activeRun: createDungeonRun(save, dungeon, seed, now, startingResources),', 1)
p.write_text(t)

p = Path('packages/domain/src/continuity.ts')
t = p.read_text()
if "import type { CombatResources } from './combat'" not in t:
    t = "import type { CombatResources } from './combat'\n" + t
t = t.replace(
"""  seed: number,\n  now: string,\n): OfflineGameSave {\n  const paused = pauseCurrentWorkForRisk(save, now)""",
"""  seed: number,\n  now: string,\n  startingResources?: CombatResources,\n): OfflineGameSave {\n  const paused = pauseCurrentWorkForRisk(save, now)""",
1,
)
t = t.replace('const started = startDungeon(detached, dungeon, seed, now)', 'const started = startDungeon(detached, dungeon, seed, now, startingResources)', 1)
p.write_text(t)

p = Path('apps/game/src/DungeonWorkbench.tsx')
t = p.read_text()
t = t.replace(
"""  decideProtector,\n  extractDungeonRun,""",
"""  decideProtector,\n  derivePlayerCombatStats,\n  extractDungeonRun,""",
1,
)
t = t.replace(
"""      const seed = Date.now() >>> 0\n      const next = startDungeonWithContinuity(riskSave, DUN_LIATH_EASY, seed, now)""",
"""      const seed = Date.now() >>> 0\n      const stats = derivePlayerCombatStats(riskSave, dungeonCatalog)\n      const startingResources = {\n        health: stats.maxHealth,\n        maxHealth: stats.maxHealth,\n        mana: stats.maxMana,\n        maxMana: stats.maxMana,\n        stamina: stats.maxStamina,\n        maxStamina: stats.maxStamina,\n      }\n      const next = startDungeonWithContinuity(riskSave, DUN_LIATH_EASY, seed, now, startingResources)""",
1,
)
p.write_text(t)

# Combat UI reports actual monetary defeat consequence
p = Path('apps/game/src/CombatWorkbench.tsx')
t = p.read_text()
t = t.replace(
"""    const applied = applyRoadServiceCombatResult(combatBaseSave, result, now)\n    const updated = resumeCurrentWorkAfterRisk(applied, now)\n    const text = result.outcome === 'victory'""",
"""    const applied = applyRoadServiceCombatResult(combatBaseSave, result, now)\n    const updated = resumeCurrentWorkAfterRisk(applied, now)\n    const lostCoins = Math.max(0, combatBaseSave.character.gold - applied.character.gold)\n    const text = result.outcome === 'victory'""",
1,
)
t = t.replace(
"""      : 'Resultado persistido. O personagem retornou à Cidade Livre e a atividade Idle foi retomada.'""",
"""      : `Derrota persistida: ${lostCoins} moeda(s) perdida(s). O personagem retornou à Cidade Livre e a atividade Idle foi retomada.`""",
1,
)
p.write_text(t)

# Persistence: v7 -> v8 converts the legacy ring stack to real equipped equipment.
p = Path('packages/persistence/src/indexedDbSaveRepository.ts')
t = p.read_text()
t = t.replace(
"""interface LegacyOfflineGameSaveV6 extends Omit<OfflineGameSave, 'saveSchemaVersion' | 'character'> {\n  saveSchemaVersion: 6\n  character: Omit<OfflineGameSave['character'], 'bank'>\n}\n""",
"""interface LegacyOfflineGameSaveV6 extends Omit<OfflineGameSave, 'saveSchemaVersion' | 'character'> {\n  saveSchemaVersion: 6\n  character: Omit<OfflineGameSave['character'], 'bank'>\n}\n\ninterface LegacyOfflineGameSaveV7 extends Omit<OfflineGameSave, 'saveSchemaVersion'> {\n  saveSchemaVersion: 7\n}\n""",
1,
)
helper = """function withEmptyBank(\n  character: Omit<OfflineGameSave['character'], 'bank'>,\n): OfflineGameSave['character'] {\n  return { ...character, bank: { inventory: [], equipmentItems: [] } }\n}\n"""
new_helper = """function normalizeTravellerRingGift(\n  character: OfflineGameSave['character'],\n): OfflineGameSave['character'] {\n  if (character.giftId !== 'traveller-ring') return character\n\n  const existingRing = character.equipmentItems.find(\n    (item) => item.definitionId === 'item.equipment.traveller-ring',\n  )\n  if (existingRing) {\n    return character.equipment.ring1\n      ? character\n      : { ...character, equipment: { ...character.equipment, ring1: existingRing.instanceId } }\n  }\n\n  const ringStack = character.inventory.find(\n    (stack) => stack.definitionId === 'item.equipment.traveller-ring',\n  )\n  if (!ringStack || ringStack.quantity <= 0) return character\n\n  const instanceId = `eq-${character.nextEquipmentSequence}`\n  const inventory = character.inventory\n    .map((stack) =>\n      stack.definitionId === 'item.equipment.traveller-ring'\n        ? { ...stack, quantity: stack.quantity - 1 }\n        : stack,\n    )\n    .filter((stack) => stack.quantity > 0)\n\n  return {\n    ...character,\n    inventory,\n    equipmentItems: [\n      ...character.equipmentItems,\n      { instanceId, definitionId: 'item.equipment.traveller-ring', upgradeLevel: 0 },\n    ],\n    nextEquipmentSequence: character.nextEquipmentSequence + 1,\n    equipment: character.equipment.ring1\n      ? character.equipment\n      : { ...character.equipment, ring1: instanceId },\n  }\n}\n\nfunction withEmptyBank(\n  character: Omit<OfflineGameSave['character'], 'bank'>,\n): OfflineGameSave['character'] {\n  return normalizeTravellerRingGift({ ...character, bank: { inventory: [], equipmentItems: [] } })\n}\n"""
if helper not in t: raise SystemExit('persistence helper anchor missing')
t = t.replace(helper, new_helper, 1)
legacy_return = """  return {\n    ...character,\n    bank: { inventory: [], equipmentItems: [] },\n    equipment: startingEquipment.equipped,\n    equipmentItems: startingEquipment.equipmentItems,\n    nextEquipmentSequence: startingEquipment.nextEquipmentSequence,\n  }\n}"""
legacy_new = """  return normalizeTravellerRingGift({\n    ...character,\n    bank: { inventory: [], equipmentItems: [] },\n    equipment: startingEquipment.equipped,\n    equipmentItems: startingEquipment.equipmentItems,\n    nextEquipmentSequence: startingEquipment.nextEquipmentSequence,\n  })\n}"""
if legacy_return not in t: raise SystemExit('legacy character anchor missing')
t = t.replace(legacy_return, legacy_new, 1)
case_anchor = """  if (candidate.saveSchemaVersion === 6) {"""
if case_anchor not in t: raise SystemExit('v6 case missing')
t = t.replace(
case_anchor,
"""  if (candidate.saveSchemaVersion === 7) {\n    const legacy = rawSave as LegacyOfflineGameSaveV7\n    return {\n      ...legacy,\n      saveSchemaVersion: SAVE_SCHEMA_VERSION,\n      character: normalizeTravellerRingGift(legacy.character),\n    }\n  }\n\n  if (candidate.saveSchemaVersion === 6) {""",
1,
)
p.write_text(t)

# Tests: actual content ring behavior
Path('packages/content/src/characterCreation.test.ts').write_text("""import { describe, expect, it } from 'vitest'\nimport { createOfflineGameSave, derivePlayerCombatStats } from '@greywake/domain'\nimport { CHARACTER_CLASSES, INITIAL_GIFTS } from './characterCreation'\nimport { getEquipmentDefinition } from './equipment'\n\ndescribe('presentes iniciais da Build 0.1', () => {\n  it('cria e equipa o Anel do Viajante com seus bônus aprovados', () => {\n    const characterClass = CHARACTER_CLASSES.find((entry) => entry.id === 'wanderer')\n    const gift = INITIAL_GIFTS.find((entry) => entry.id === 'traveller-ring')\n    if (!characterClass || !gift) throw new Error('Conteúdo de teste ausente.')\n\n    const save = createOfflineGameSave({\n      saveId: 'ring-content-test',\n      createdAt: '2026-09-10T12:00:00.000Z',\n      contentVersion: '0.1.0-dev',\n      characterName: 'Ailith',\n      characterClass,\n      gift,\n    })\n    const ringId = save.character.equipment.ring1\n    const ring = save.character.equipmentItems.find((item) => item.instanceId === ringId)\n    const stats = derivePlayerCombatStats(save, { getEquipmentDefinition })\n\n    expect(ring?.definitionId).toBe('item.equipment.traveller-ring')\n    expect(save.character.inventory.some((stack) => stack.definitionId === 'item.equipment.traveller-ring')).toBe(false)\n    expect(stats.maxHealth).toBe(168)\n    expect(stats.maxMana).toBe(85)\n    expect(stats.maxStamina).toBe(108)\n  })\n})\n""")

# combat tests: affixes and defeat formula
p = Path('packages/domain/src/combat.test.ts')
t = p.read_text()
t = t.replace(
"""import { createOfflineGameSave, type CharacterClassDefinition, type GiftDefinition } from './character'""",
"""import { createOfflineGameSave, type CharacterClassDefinition, type GiftDefinition, type OfflineGameSave } from './character'""",
1,
)
t = t.replace(
"""  type CombatAbilityDefinition,\n  type EnemyDefinition,""",
"""  type CombatAbilityDefinition,\n  type CombatResult,\n  type EnemyDefinition,""",
1,
)
insert = """\n  it('applies equipped affixes to effective attributes, Accuracy and Defense', () => {\n    const base = createSave()\n    const chestId = base.character.equipment.chest\n    const mainHandId = base.character.equipment.mainHand\n    const save = {\n      ...base,\n      character: {\n        ...base.character,\n        equipmentItems: base.character.equipmentItems.map((item) => {\n          if (item.instanceId === chestId) return { ...item, affixIds: ['affix.vitality-1', 'affix.strength-1', 'affix.accuracy-4'] }\n          if (item.instanceId === mainHandId) return { ...item, affixIds: ['affix.defense-2'] }\n          return item\n        }),\n      },\n    }\n    const stats = derivePlayerCombatStats(save, catalog)\n    expect(stats.attributes.vitality).toBe(6)\n    expect(stats.attributes.strength).toBe(6)\n    expect(stats.maxHealth).toBe(172)\n    expect(stats.accuracy).toBe(114)\n    expect(stats.defense).toBe(14)\n  })\n\n  it('loses the approved coin amount on defeat outside Dungeon and no extra coins inside Dungeon', () => {\n    const base = createSave()\n    const rich = { ...base, character: { ...base.character, level: 3, gold: 95 } }\n    const defeat: CombatResult = {\n      outcome: 'defeat', durationSeconds: 1, enemyHealth: 10, xpGranted: 0, consumedItems: [], log: [], seed: 1,\n      player: { health: 0, maxHealth: 160, mana: 80, maxMana: 80, stamina: 100, maxStamina: 100 },\n    }\n    const outside = applyCombatResult(rich, roadWolf.id, defeat, '2026-09-10T12:01:00.000Z')\n    expect(outside.character.gold).toBe(85)\n\n    const inDungeon: OfflineGameSave = {\n      ...rich,\n      dungeon: { ...rich.dungeon, activeRun: {} as NonNullable<OfflineGameSave['dungeon']['activeRun']> },\n    }\n    const inside = applyCombatResult(inDungeon, roadWolf.id, defeat, '2026-09-10T12:01:00.000Z')\n    expect(inside.character.gold).toBe(95)\n  })\n"""
pos = t.rfind('\n})')
if pos < 0: raise SystemExit('combat test end missing')
t = t[:pos] + insert + t[pos:]
p.write_text(t)

# onboarding idempotence test
Path('packages/domain/src/onboarding.test.ts').write_text("""import { describe, expect, it } from 'vitest'\nimport { createOfflineGameSave, type CharacterClassDefinition, type GiftDefinition } from './character'\nimport type { CombatResult } from './combat'\nimport { applyRoadServiceCombatResult } from './onboarding'\n\nconst characterClass: CharacterClassDefinition = {\n  id: 'wanderer', name: 'Errante', summary: 'Teste',\n  attributes: { vitality: 5, mind: 5, vigor: 5, strength: 5, dexterity: 5, intelligence: 5, faith: 5 },\n  startingEquipment: { mainHand: 'weapon.travel-spear' },\n  startingAbilityId: 'ability.opening',\n}\nconst gift: GiftDefinition = { id: 'none', name: 'Nenhum', summary: 'Teste', grants: [] }\nconst victory: CombatResult = {\n  outcome: 'victory', durationSeconds: 10, enemyHealth: 0, xpGranted: 35, consumedItems: [], log: [], seed: 10,\n  player: { health: 100, maxHealth: 160, mana: 80, maxMana: 80, stamina: 80, maxStamina: 100 },\n}\n\nfunction createSave() {\n  return createOfflineGameSave({\n    saveId: 'service-test', createdAt: '2026-09-10T12:00:00.000Z', contentVersion: '0.1.0-dev',\n    characterName: 'Ailith', characterClass, gift,\n  })\n}\n\ndescribe('Serviço — Estrada Baixa', () => {\n  it('grants the service reward only on the first victory', () => {\n    const first = applyRoadServiceCombatResult(createSave(), victory, '2026-09-10T12:01:00.000Z')\n    expect(first.character.xp).toBe(60)\n    expect(first.character.gold).toBe(40)\n    expect(first.combat.wolfDefeated).toBe(true)\n\n    const repeat = applyRoadServiceCombatResult(first, victory, '2026-09-10T12:02:00.000Z')\n    expect(repeat.character.xp).toBe(95)\n    expect(repeat.character.gold).toBe(40)\n  })\n})\n""")

# dungeon test verifies externally-derived starting resources are preserved
p = Path('packages/domain/src/dungeon.test.ts')
t = p.read_text()
insert = """\n  it('starts with explicitly derived resource maxima when provided by the runtime', () => {\n    const resources = { health: 168, maxHealth: 168, mana: 85, maxMana: 85, stamina: 108, maxStamina: 108 }\n    const started = startDungeon(createAcceptedSave(), dungeon, 5, '2026-09-09T12:00:00.000Z', resources)\n    expect(started.dungeon.activeRun?.resources).toEqual(resources)\n  })\n"""
pos = t.rfind('\n})')
t = t[:pos] + insert + t[pos:]
p.write_text(t)

# persistence test updates schema expectation and covers v7 ring normalization
p = Path('packages/persistence/src/indexedDbSaveRepository.test.ts')
t = p.read_text()
t = t.replace(
"""  type GiftDefinition,\n} from '@greywake/domain'""",
"""  type GiftDefinition,\n  type OfflineGameSave,\n} from '@greywake/domain'""",
1,
)
t = t.replace("expect(loaded?.saveSchemaVersion).toBe(7)", "expect(loaded?.saveSchemaVersion).toBe(8)")
insert = """\n\n  it('migrates a v7 Traveller Ring stack into an equipped ring instance', async () => {\n    const current = createOfflineGameSave({\n      saveId: 'legacy-ring',\n      createdAt: '2026-09-09T12:00:00.000Z',\n      contentVersion: '0.1.0-dev',\n      characterName: 'Ailith',\n      characterClass,\n      gift,\n    })\n    const legacy = {\n      ...current,\n      saveSchemaVersion: 7 as const,\n      character: {\n        ...current.character,\n        giftId: 'traveller-ring' as const,\n        inventory: [{ definitionId: 'item.equipment.traveller-ring', quantity: 1 }],\n      },\n    }\n    const repository = createIndexedDbSaveRepository()\n    await repository.put(legacy as unknown as OfflineGameSave)\n    const loaded = await repository.get('legacy-ring')\n    const ringId = loaded?.character.equipment.ring1\n    const ring = loaded?.character.equipmentItems.find((item) => item.instanceId === ringId)\n\n    expect(loaded?.saveSchemaVersion).toBe(8)\n    expect(ring?.definitionId).toBe('item.equipment.traveller-ring')\n    expect(loaded?.character.inventory.some((stack) => stack.definitionId === 'item.equipment.traveller-ring')).toBe(false)\n  })\n"""
pos = t.rfind('\n})')
t = t[:pos] + insert + t[pos:]
p.write_text(t)
