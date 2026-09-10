from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        raise SystemExit(f'anchor not found: {label}')
    return text.replace(old, new, 1)


app_path = Path('apps/game/src/App.tsx')
app = app_path.read_text()
app = replace_once(
    app,
    '  BUILD_SAVE_MODE,\n  createOfflineGameSave,',
    '  BUILD_SAVE_MODE,\n  allocateAttributePoints,\n  createOfflineGameSave,',
    'App domain import',
)
app = replace_once(
    app,
    '  type CharacterClassId,\n  type GiftId,',
    '  type AttributeAllocation,\n  type CharacterClassId,\n  type GiftId,',
    'App allocation type import',
)
handle_equip = """  async function handleEquip(instanceId: string) {
    if (!activeSave) return
    const instance = activeSave.character.equipmentItems.find((item) => item.instanceId === instanceId)
    if (!instance) return
    const definition = getEquipmentDefinition(instance.definitionId)
    if (!definition) return

    try {
      const save = equipEquipment(activeSave, instanceId, definition, new Date().toISOString())
      await persistActive(save, `${definition.name} equipado.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível equipar o item.')
    }
  }

"""
handle_allocate = handle_equip + """  async function handleAllocateAttributes(allocation: AttributeAllocation) {
    if (!activeSave) return

    try {
      const save = allocateAttributePoints(activeSave, allocation, new Date().toISOString())
      await persistActive(save, 'Distribuição de atributos confirmada.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível distribuir os pontos de atributo.')
      throw error
    }
  }

"""
app = replace_once(app, handle_equip, handle_allocate, 'App allocation handler')
app = replace_once(
    app,
    '        onEquip={handleEquip}\n      />',
    '        onEquip={handleEquip}\n        onAllocateAttributes={handleAllocateAttributes}\n      />',
    'App GameShell prop',
)
app_path.write_text(app)

shell_path = Path('apps/game/src/GameShell.tsx')
shell = shell_path.read_text()
shell = replace_once(
    shell,
    "import MarketWorkbench from './MarketWorkbench'\n",
    "import MarketWorkbench from './MarketWorkbench'\nimport AttributePanel from './AttributePanel'\n",
    'GameShell AttributePanel import',
)
shell = replace_once(
    shell,
    '  getEquipmentPrimaryValue,\n  type OfflineGameSave,',
    '  getEquipmentPrimaryValue,\n  type AttributeAllocation,\n  type OfflineGameSave,',
    'GameShell allocation type import',
)
shell = replace_once(
    shell,
    '  onEquip: (instanceId: string) => Promise<void>\n}',
    '  onEquip: (instanceId: string) => Promise<void>\n  onAllocateAttributes: (allocation: AttributeAllocation) => Promise<void>\n}',
    'GameShell prop type',
)
shell = replace_once(
    shell,
    '  onStopWork,\n  onEquip,\n}: GameShellProps)',
    '  onStopWork,\n  onEquip,\n  onAllocateAttributes,\n}: GameShellProps)',
    'GameShell destructuring',
)
shell = replace_once(
    shell,
    '            onEquip={onEquip}\n            onStartRecipe={onStartRecipe}\n          />',
    '            onEquip={onEquip}\n            onStartRecipe={onStartRecipe}\n            onAllocateAttributes={onAllocateAttributes}\n          />',
    'CharacterView call',
)
shell = replace_once(
    shell,
    '  onEquip,\n  onStartRecipe,\n}: {\n  save: OfflineGameSave\n  tab: CharacterTab\n  onTab: (tab: CharacterTab) => void\n  onEquip: (instanceId: string) => Promise<void>\n  onStartRecipe: (recipeDefinitionId: string, targetEquipmentInstanceId?: string | null) => Promise<void>\n}) {',
    '  onEquip,\n  onStartRecipe,\n  onAllocateAttributes,\n}: {\n  save: OfflineGameSave\n  tab: CharacterTab\n  onTab: (tab: CharacterTab) => void\n  onEquip: (instanceId: string) => Promise<void>\n  onStartRecipe: (recipeDefinitionId: string, targetEquipmentInstanceId?: string | null) => Promise<void>\n  onAllocateAttributes: (allocation: AttributeAllocation) => Promise<void>\n}) {',
    'CharacterView prop type',
)
attribute_block = """const attributeLabels: Record<keyof OfflineGameSave['character']['attributes'], string> = {
  vitality: 'Vitalidade',
  mind: 'Mente',
  vigor: 'Vigor',
  strength: 'Força',
  dexterity: 'Destreza',
  intelligence: 'Inteligência',
  faith: 'Fé',
}

"""
shell = replace_once(shell, attribute_block, '', 'old attribute labels')
old_ui = """      {tab === 'attributes' ? (
        <article className=\"panel dense-panel\"><div className=\"panel-heading\"><div><p className=\"section-kicker\">Atributos</p><h2>Distribuição atual</h2></div><span className=\"status-chip\">{save.character.unspentAttributePoints} ponto(s) disponível(is)</span></div><div className=\"attribute-list\">{Object.entries(save.character.attributes).map(([key, value]) => <div key={key}><span>{attributeLabels[key as keyof typeof attributeLabels]}</span><strong>{value}</strong></div>)}</div>{save.character.unspentAttributePoints > 0 ? <p className=\"fact-warning\">A distribuição de pontos ainda não possui ação de domínio ligada nesta build. A UI não simula uma alteração que não possa persistir.</p> : null}</article>
      ) : null}
"""
new_ui = """      {tab === 'attributes' ? (
        <AttributePanel save={save} onAllocateAttributes={onAllocateAttributes} />
      ) : null}
"""
shell = replace_once(shell, old_ui, new_ui, 'attribute panel UI')
shell_path.write_text(shell)
