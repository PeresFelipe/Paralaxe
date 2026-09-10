from pathlib import Path

# character schema/state
p = Path('packages/domain/src/character.ts')
t = p.read_text()
t = t.replace("export const SAVE_SCHEMA_VERSION = 6 as const", "export const SAVE_SCHEMA_VERSION = 7 as const")
t = t.replace(
"""export interface CharacterState {\n  name: string""",
"""export interface BankState {\n  inventory: InventoryStack[]\n  equipmentItems: EquipmentInstance[]\n}\n\nexport interface CharacterState {\n  name: string""",
)
t = t.replace(
"""  inventory: InventoryStack[]\n  equipment: EquippedItemIds""",
"""  inventory: InventoryStack[]\n  bank: BankState\n  equipment: EquippedItemIds""",
)
t = t.replace(
"""      inventory: giftState.inventory,\n      equipment: startingEquipment.equipped,""",
"""      inventory: giftState.inventory,\n      bank: { inventory: [], equipmentItems: [] },\n      equipment: startingEquipment.equipped,""",
)
p.write_text(t)

# domain exports
p = Path('packages/domain/src/index.ts')
t = p.read_text()
if "export * from './storage'" not in t:
    t += "export * from './storage'\n"
p.write_text(t)

# character tests
p = Path('packages/domain/src/character.test.ts')
t = p.read_text().replace("expect(save.saveSchemaVersion).toBe(6)", "expect(save.saveSchemaVersion).toBe(7)")
t = t.replace(
"""    expect(save.character.equipmentItems).toHaveLength(2)\n""",
"""    expect(save.character.equipmentItems).toHaveLength(2)\n    expect(save.character.bank).toEqual({ inventory: [], equipmentItems: [] })\n""",
)
p.write_text(t)

# persistence migration v6 -> v7 and empty bank on older versions
p = Path('packages/persistence/src/indexedDbSaveRepository.ts')
t = p.read_text()
anchor = """interface LegacyOfflineGameSaveV5\n  extends Omit<OfflineGameSave, 'saveSchemaVersion' | 'combat' | 'dungeon'> {\n  saveSchemaVersion: 5\n  combat: LegacyOfflineGameSaveV4['combat']\n  dungeon: Omit<OfflineGameSave['dungeon'], 'contractAccepted'>\n}\n"""
addition = anchor + """\ninterface LegacyOfflineGameSaveV6 extends Omit<OfflineGameSave, 'saveSchemaVersion' | 'character'> {\n  saveSchemaVersion: 6\n  character: Omit<OfflineGameSave['character'], 'bank'>\n}\n"""
if anchor not in t:
    raise SystemExit('Legacy v5 anchor not found')
t = t.replace(anchor, addition)
helper_anchor = """function migrateLegacyCharacter(character: LegacyCharacterState): OfflineGameSave['character'] {\n  const startingEquipment = createStartingEquipmentState(character.equipment)\n\n  return {\n    ...character,\n    equipment: startingEquipment.equipped,\n    equipmentItems: startingEquipment.equipmentItems,\n    nextEquipmentSequence: startingEquipment.nextEquipmentSequence,\n  }\n}\n"""
helper_new = """function withEmptyBank(\n  character: Omit<OfflineGameSave['character'], 'bank'>,\n): OfflineGameSave['character'] {\n  return { ...character, bank: { inventory: [], equipmentItems: [] } }\n}\n\nfunction migrateLegacyCharacter(character: LegacyCharacterState): OfflineGameSave['character'] {\n  const startingEquipment = createStartingEquipmentState(character.equipment)\n\n  return {\n    ...character,\n    bank: { inventory: [], equipmentItems: [] },\n    equipment: startingEquipment.equipped,\n    equipmentItems: startingEquipment.equipmentItems,\n    nextEquipmentSequence: startingEquipment.nextEquipmentSequence,\n  }\n}\n"""
if helper_anchor not in t:
    raise SystemExit('migrateLegacyCharacter anchor not found')
t = t.replace(helper_anchor, helper_new)
version_anchor = """  if (candidate.saveSchemaVersion === SAVE_SCHEMA_VERSION) {\n    return rawSave as OfflineGameSave\n  }\n\n  if (candidate.saveSchemaVersion === 5) {"""
version_new = """  if (candidate.saveSchemaVersion === SAVE_SCHEMA_VERSION) {\n    return rawSave as OfflineGameSave\n  }\n\n  if (candidate.saveSchemaVersion === 6) {\n    const legacy = rawSave as LegacyOfflineGameSaveV6\n    return {\n      ...legacy,\n      saveSchemaVersion: SAVE_SCHEMA_VERSION,\n      character: withEmptyBank(legacy.character),\n    }\n  }\n\n  if (candidate.saveSchemaVersion === 5) {"""
if version_anchor not in t:
    raise SystemExit('version dispatch anchor not found')
t = t.replace(version_anchor, version_new)
# v5/v4/v3 modern character migrations need empty bank
t = t.replace(
"""      saveSchemaVersion: SAVE_SCHEMA_VERSION,\n      combat: migrateCombatState(legacy.combat),\n      dungeon: {\n        ...legacy.dungeon,""",
"""      saveSchemaVersion: SAVE_SCHEMA_VERSION,\n      character: withEmptyBank(legacy.character),\n      combat: migrateCombatState(legacy.combat),\n      dungeon: {\n        ...legacy.dungeon,""",
1,
)
# next two occurrences v4, v3 with dungeon default
t = t.replace(
"""      saveSchemaVersion: SAVE_SCHEMA_VERSION,\n      combat: migrateCombatState(legacy.combat),\n      dungeon: createDefaultDungeonState(),""",
"""      saveSchemaVersion: SAVE_SCHEMA_VERSION,\n      character: withEmptyBank(legacy.character),\n      combat: migrateCombatState(legacy.combat),\n      dungeon: createDefaultDungeonState(),""",
1,
)
t = t.replace(
"""      saveSchemaVersion: SAVE_SCHEMA_VERSION,\n      combat: createDefaultCombatState(),\n      dungeon: createDefaultDungeonState(),""",
"""      saveSchemaVersion: SAVE_SCHEMA_VERSION,\n      character: withEmptyBank(legacy.character),\n      combat: createDefaultCombatState(),\n      dungeon: createDefaultDungeonState(),""",
1,
)
p.write_text(t)

# persistence test version and bank persistence
p = Path('packages/persistence/src/indexedDbSaveRepository.test.ts')
t = p.read_text().replace("expect(loaded?.saveSchemaVersion).toBe(6)", "expect(loaded?.saveSchemaVersion).toBe(7)")
t = t.replace(
"""    expect(loaded?.dungeon.contractAccepted).toBe(true)\n""",
"""    expect(loaded?.character.bank).toEqual({ inventory: [], equipmentItems: [] })\n    expect(loaded?.dungeon.contractAccepted).toBe(true)\n""",
)
p.write_text(t)

# App domain imports, handlers and shell callbacks
p = Path('apps/game/src/App.tsx')
t = p.read_text()
t = t.replace(
"""  createOfflineGameSave,\n  equipEquipment,""",
"""  createOfflineGameSave,\n  depositEquipmentToBank,\n  depositInventoryStackToBank,\n  equipEquipment,""",
)
t = t.replace(
"""  stopIdleActivity,\n  type AttributeAllocation,""",
"""  stopIdleActivity,\n  withdrawEquipmentFromBank,\n  withdrawInventoryStackFromBank,\n  type AttributeAllocation,""",
)
handler_anchor = """  async function handleAllocateAttributes(allocation: AttributeAllocation) {\n    if (!activeSave) return\n\n    try {\n      const save = allocateAttributePoints(activeSave, allocation, new Date().toISOString())\n      await persistActive(save, 'Distribuição de atributos confirmada.')\n    } catch (error) {\n      setMessage(error instanceof Error ? error.message : 'Não foi possível distribuir os pontos de atributo.')\n      throw error\n    }\n  }\n\n"""
handlers = handler_anchor + """  async function handleDepositBankStack(definitionId: string, quantity: number) {\n    if (!activeSave) return\n    try {\n      const save = depositInventoryStackToBank(activeSave, definitionId, quantity, new Date().toISOString())\n      await persistActive(save, `Depósito realizado: ${quantity} item(ns).`)\n    } catch (error) {\n      setMessage(error instanceof Error ? error.message : 'Não foi possível depositar no Banco.')\n    }\n  }\n\n  async function handleWithdrawBankStack(definitionId: string, quantity: number) {\n    if (!activeSave) return\n    try {\n      const save = withdrawInventoryStackFromBank(activeSave, definitionId, quantity, new Date().toISOString())\n      await persistActive(save, `Retirada realizada: ${quantity} item(ns).`)\n    } catch (error) {\n      setMessage(error instanceof Error ? error.message : 'Não foi possível retirar do Banco.')\n    }\n  }\n\n  async function handleDepositBankEquipment(instanceId: string) {\n    if (!activeSave) return\n    try {\n      const save = depositEquipmentToBank(activeSave, instanceId, new Date().toISOString())\n      await persistActive(save, 'Equipamento depositado no Banco.')\n    } catch (error) {\n      setMessage(error instanceof Error ? error.message : 'Não foi possível depositar o equipamento.')\n    }\n  }\n\n  async function handleWithdrawBankEquipment(instanceId: string) {\n    if (!activeSave) return\n    try {\n      const save = withdrawEquipmentFromBank(activeSave, instanceId, new Date().toISOString())\n      await persistActive(save, 'Equipamento retirado do Banco.')\n    } catch (error) {\n      setMessage(error instanceof Error ? error.message : 'Não foi possível retirar o equipamento.')\n    }\n  }\n\n"""
if handler_anchor not in t:
    raise SystemExit('App allocation handler anchor not found')
t = t.replace(handler_anchor, handlers)
t = t.replace(
"""        onAllocateAttributes={handleAllocateAttributes}\n      />""",
"""        onAllocateAttributes={handleAllocateAttributes}\n        onDepositBankStack={handleDepositBankStack}\n        onWithdrawBankStack={handleWithdrawBankStack}\n        onDepositBankEquipment={handleDepositBankEquipment}\n        onWithdrawBankEquipment={handleWithdrawBankEquipment}\n      />""",
)
p.write_text(t)

# GameShell props and Bank view
p = Path('apps/game/src/GameShell.tsx')
t = p.read_text()
t = t.replace("import AttributePanel from './AttributePanel'", "import AttributePanel from './AttributePanel'\nimport BankPanel from './BankPanel'")
t = t.replace(
"""  onAllocateAttributes: (allocation: AttributeAllocation) => Promise<void>\n}""",
"""  onAllocateAttributes: (allocation: AttributeAllocation) => Promise<void>\n  onDepositBankStack: (definitionId: string, quantity: number) => Promise<void>\n  onWithdrawBankStack: (definitionId: string, quantity: number) => Promise<void>\n  onDepositBankEquipment: (instanceId: string) => Promise<void>\n  onWithdrawBankEquipment: (instanceId: string) => Promise<void>\n}""",
)
t = t.replace(
"""  onEquip,\n  onAllocateAttributes,\n}: GameShellProps) {""",
"""  onEquip,\n  onAllocateAttributes,\n  onDepositBankStack,\n  onWithdrawBankStack,\n  onDepositBankEquipment,\n  onWithdrawBankEquipment,\n}: GameShellProps) {""",
)
t = t.replace(
"""            onOpenAdventure={() => openAdventure('dungeon')}\n            onPersist={onPersist}\n          />""",
"""            onOpenAdventure={() => openAdventure('dungeon')}\n            onPersist={onPersist}\n            onDepositBankStack={onDepositBankStack}\n            onWithdrawBankStack={onWithdrawBankStack}\n            onDepositBankEquipment={onDepositBankEquipment}\n            onWithdrawBankEquipment={onWithdrawBankEquipment}\n          />""",
)
city_sig = """  onOpenAdventure,\n  onPersist,\n}: {\n  save: OfflineGameSave\n  view: CityView\n  onView: (view: CityView) => void\n  onOpenAdventure: () => void\n  onPersist: (save: OfflineGameSave, message?: string) => void | Promise<void>\n}) {\n  if (view === 'market') return <MarketWorkbench save={save} onSaveChange={onPersist} />\n"""
city_new = """  onOpenAdventure,\n  onPersist,\n  onDepositBankStack,\n  onWithdrawBankStack,\n  onDepositBankEquipment,\n  onWithdrawBankEquipment,\n}: {\n  save: OfflineGameSave\n  view: CityView\n  onView: (view: CityView) => void\n  onOpenAdventure: () => void\n  onPersist: (save: OfflineGameSave, message?: string) => void | Promise<void>\n  onDepositBankStack: (definitionId: string, quantity: number) => Promise<void>\n  onWithdrawBankStack: (definitionId: string, quantity: number) => Promise<void>\n  onDepositBankEquipment: (instanceId: string) => Promise<void>\n  onWithdrawBankEquipment: (instanceId: string) => Promise<void>\n}) {\n  if (view === 'market') return <MarketWorkbench save={save} onSaveChange={onPersist} />\n  if (view === 'bank') {\n    return (\n      <BankPanel\n        save={save}\n        onDepositStack={onDepositBankStack}\n        onWithdrawStack={onWithdrawBankStack}\n        onDepositEquipment={onDepositBankEquipment}\n        onWithdrawEquipment={onWithdrawBankEquipment}\n        onBack={() => onView('overview')}\n      />\n    )\n  }\n"""
if city_sig not in t:
    raise SystemExit('City signature anchor not found')
t = t.replace(city_sig, city_new)
t = t.replace(
"""    const copy: Record<Exclude<CityView, 'overview' | 'tavern' | 'market'>, { title: string; body: string }> = {\n      smith: { title: 'Ferreiro', body: 'Serviços de NPC pertencem à Cidade. A Skill Forja continua em Atividades. Nenhum novo serviço do Ferreiro está implementado nesta build.' },\n      bank: { title: 'Banco', body: 'O Banco é o destino de armazenamento seguro. A operação de depósito/retirada ainda não possui domínio implementado nesta build.' },\n      reliquary: { title: 'Relicário', body: 'Relíquias descobertas serão apresentadas aqui. O sistema funcional de Relicário ainda não está implementado nesta build.' },\n    }""",
"""    const copy: Record<Exclude<CityView, 'overview' | 'tavern' | 'market' | 'bank'>, { title: string; body: string }> = {\n      smith: { title: 'Ferreiro', body: 'Serviços de NPC pertencem à Cidade. A Skill Forja continua em Atividades. Nenhum novo serviço do Ferreiro está implementado nesta build.' },\n      reliquary: { title: 'Relicário', body: 'Relíquias descobertas serão apresentadas aqui. O sistema funcional de Relicário ainda não está implementado nesta build.' },\n    }""",
)
p.write_text(t)

# CSS for operational Bank
p = Path('apps/game/src/styles.css')
t = p.read_text()
css = """\n\n.bank-capacity-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }\n.bank-capacity-grid .panel { display: grid; gap: 4px; }\n.bank-capacity-grid strong { font-size: 1.1rem; }\n.bank-columns { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; align-items: start; }\n.bank-row { display: flex; justify-content: space-between; gap: 14px; align-items: center; padding: 11px 0; border-bottom: 1px solid var(--line); }\n.bank-row:last-child { border-bottom: 0; }\n.bank-row > div:first-child { display: grid; min-width: 0; }\n.bank-row small { color: var(--muted); font-size: .68rem; }\n.bank-row .button-row { justify-content: flex-end; }\n@media (max-width: 760px) {\n  .bank-columns, .bank-capacity-grid { grid-template-columns: 1fr; }\n  .bank-row { align-items: flex-start; flex-direction: column; }\n}\n"""
if '.bank-capacity-grid' not in t:
    t += css
p.write_text(t)
