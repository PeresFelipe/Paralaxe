import { useEffect, useState } from 'react'
import {
  CHARACTER_CLASSES,
  CONTENT_VERSION,
  INITIAL_CRAFTING_RECIPES,
  INITIAL_GIFTS,
  INITIAL_IDLE_ACTIVITIES,
  getCraftingRecipeDefinition,
  getEquipmentDefinition,
  getIdleActivityDefinition,
} from '@greywake/content'
import {
  BUILD_SAVE_MODE,
  createOfflineGameSave,
  equipEquipment,
  getEquipmentPrimaryValue,
  processCraftingProgress,
  processIdleProgress,
  startCraftingRecipe,
  startIdleActivity,
  stopCraftingRecipe,
  stopIdleActivity,
  type CharacterClassId,
  type GiftId,
  type OfflineGameSave,
  type SkillId,
} from '@greywake/domain'
import { createIndexedDbSaveRepository } from '@greywake/persistence'

const saveRepository = createIndexedDbSaveRepository()

type Screen = 'loading' | 'save-list' | 'create' | 'character' | 'error'

const skillLabels: Record<SkillId, string> = {
  mining: 'Mineração',
  woodcutting: 'Lenhador',
  fishing: 'Pesca',
  herbology: 'Herbologia',
  metallurgy: 'Metalurgia',
  smithing: 'Forja',
  cooking: 'Culinária',
}

const itemLabels: Record<string, string> = {
  'material.cloch': 'Cloch',
  'material.giuis': 'Giúis',
  'material.scadan': 'Scadán',
  'material.neantog': 'Neantóg',
  'material.treated-cloch': 'Cloch Tratada',
  'item.food.roasted-scadan': 'Scadán Assado',
  'item.consumable.neantog-preparation': 'Preparado de Neantóg',
  'item.consumable.field-preparation': 'Preparado de Campo',
  'item.consumable.crimson-flask': 'Frasco Carmesim',
  'item.key.rusted': 'Chave Enferrujada',
  'item.quest.nameless-stone': 'Pedra Sem Nome',
  'item.equipment.traveller-ring': 'Anel do Viajante',
}

function getClassName(classId: CharacterClassId) {
  return CHARACTER_CLASSES.find((definition) => definition.id === classId)?.name ?? classId
}

function getGiftName(giftId: GiftId) {
  return INITIAL_GIFTS.find((definition) => definition.id === giftId)?.name ?? giftId
}

function getInventoryQuantity(save: OfflineGameSave, definitionId: string) {
  return save.character.inventory.find((stack) => stack.definitionId === definitionId)?.quantity ?? 0
}

function updateSaveInList(saves: OfflineGameSave[], save: OfflineGameSave) {
  return saves.map((current) => (current.saveId === save.saveId ? save : current))
}

function processCurrentWork(save: OfflineGameSave, now: string) {
  const activeIdleId = save.idle.activeActivity?.activityDefinitionId
  if (activeIdleId) {
    const activity = getIdleActivityDefinition(activeIdleId)
    if (activity) {
      const result = processIdleProgress(save, activity, now)
      return {
        save: result.save,
        text: result.completedActions > 0 ? `+${result.completedActions} ${activity.resultName}` : null,
      }
    }
  }

  const activeRecipeId = save.crafting.activeRecipe?.recipeDefinitionId
  if (activeRecipeId) {
    const recipe = getCraftingRecipeDefinition(activeRecipeId)
    if (recipe) {
      const result = processCraftingProgress(save, recipe, now)
      const totalOutput = result.producedItems + result.producedEquipment + result.upgradedEquipment
      return {
        save: result.save,
        text: result.completedActions > 0 ? `${recipe.output.name}: ${totalOutput || result.completedActions} concluído(s)` : null,
      }
    }
  }

  return { save, text: null }
}

function App() {
  const [screen, setScreen] = useState<Screen>('loading')
  const [saves, setSaves] = useState<OfflineGameSave[]>([])
  const [activeSave, setActiveSave] = useState<OfflineGameSave | null>(null)
  const [characterName, setCharacterName] = useState('')
  const [selectedClassId, setSelectedClassId] = useState<CharacterClassId | null>(null)
  const [selectedGiftId, setSelectedGiftId] = useState<GiftId | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let cancelled = false

    saveRepository
      .list()
      .then((storedSaves) => {
        if (cancelled) return
        setSaves(storedSaves)
        setScreen(storedSaves.length > 0 ? 'save-list' : 'create')
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setMessage(error instanceof Error ? error.message : 'Não foi possível carregar os saves locais.')
        setScreen('error')
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (screen !== 'character' || !activeSave) return
    if (!activeSave.idle.activeActivity && !activeSave.crafting.activeRecipe) return

    const timer = window.setInterval(() => {
      const result = processCurrentWork(activeSave, new Date().toISOString())
      if (result.save === activeSave) return

      void saveRepository.put(result.save).then(() => {
        setActiveSave(result.save)
        setSaves((current) => updateSaveInList(current, result.save))
        if (result.text) setMessage(result.text)
      })
    }, 5000)

    return () => window.clearInterval(timer)
  }, [screen, activeSave])

  async function persistActive(save: OfflineGameSave, text?: string) {
    await saveRepository.put(save)
    setActiveSave(save)
    setSaves((current) => updateSaveInList(current, save))
    if (text) setMessage(text)
  }

  async function handleCreateSave() {
    const characterClass = CHARACTER_CLASSES.find((definition) => definition.id === selectedClassId)
    const gift = INITIAL_GIFTS.find((definition) => definition.id === selectedGiftId)
    if (!characterClass || !gift || !characterName.trim()) return

    setIsSaving(true)
    setMessage(null)

    try {
      const now = new Date().toISOString()
      const save = createOfflineGameSave({
        saveId: crypto.randomUUID(),
        createdAt: now,
        contentVersion: CONTENT_VERSION,
        characterName,
        characterClass,
        gift,
      })
      await saveRepository.put(save)
      setSaves((current) => [save, ...current])
      setActiveSave(save)
      setScreen('character')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível criar o save.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleLoadSave(saveId: string) {
    setMessage(null)
    try {
      const stored = await saveRepository.get(saveId)
      if (!stored) {
        setMessage('Esse save não foi encontrado no armazenamento local.')
        return
      }

      const result = processCurrentWork(stored, new Date().toISOString())
      await saveRepository.put(result.save)
      setSaves((current) => updateSaveInList(current, result.save))
      setActiveSave(result.save)
      setScreen('character')
      if (result.text) setMessage(`Enquanto você esteve fora: ${result.text}`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível carregar o save.')
    }
  }

  async function handleStartActivity(activityDefinitionId: string) {
    if (!activeSave) return
    const activity = getIdleActivityDefinition(activityDefinitionId)
    if (!activity) return

    try {
      const now = new Date().toISOString()
      let save = processCurrentWork(activeSave, now).save
      if (save.crafting.activeRecipe) save = stopCraftingRecipe(save, now)
      if (save.idle.activeActivity) save = stopIdleActivity(save, now)
      save = startIdleActivity(save, activity, now)
      await persistActive(save, `${activity.name} iniciado.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível iniciar a atividade.')
    }
  }

  async function handleStartRecipe(recipeDefinitionId: string, targetEquipmentInstanceId: string | null = null) {
    if (!activeSave) return
    const recipe = getCraftingRecipeDefinition(recipeDefinitionId)
    if (!recipe) return

    try {
      const now = new Date().toISOString()
      let save = processCurrentWork(activeSave, now).save
      if (save.idle.activeActivity) save = stopIdleActivity(save, now)
      if (save.crafting.activeRecipe) save = stopCraftingRecipe(save, now)
      save = startCraftingRecipe(save, recipe, now, targetEquipmentInstanceId)
      await persistActive(save, `${recipe.name} iniciado. A produção continua enquanto houver materiais.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível iniciar a produção.')
    }
  }

  async function handleStopWork() {
    if (!activeSave) return
    const now = new Date().toISOString()
    let save = processCurrentWork(activeSave, now).save
    if (save.idle.activeActivity) save = stopIdleActivity(save, now)
    if (save.crafting.activeRecipe) save = stopCraftingRecipe(save, now)
    await persistActive(save, 'Atividade interrompida.')
  }

  async function handleEquip(instanceId: string) {
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

  function startNewSave() {
    setCharacterName('')
    setSelectedClassId(null)
    setSelectedGiftId(null)
    setMessage(null)
    setScreen('create')
  }

  if (screen === 'loading') {
    return <main className="app-shell centered-shell"><div className="loading-mark" /><p className="muted">Carregando saves locais…</p></main>
  }

  if (screen === 'error') {
    return <main className="app-shell centered-shell"><p className="eyebrow">Greywake · Build 0.1</p><h1>Não foi possível abrir o armazenamento local.</h1><p className="subtitle">{message}</p></main>
  }

  if (screen === 'character' && activeSave) {
    const activeWork = activeSave.idle.activeActivity
      ? getIdleActivityDefinition(activeSave.idle.activeActivity.activityDefinitionId)?.name
      : activeSave.crafting.activeRecipe
        ? getCraftingRecipeDefinition(activeSave.crafting.activeRecipe.recipeDefinitionId)?.name
        : null

    const upgradeRecipe = INITIAL_CRAFTING_RECIPES.find((recipe) => recipe.output.kind === 'equipment-upgrade')
    const normalRecipes = INITIAL_CRAFTING_RECIPES.filter((recipe) => recipe.output.kind !== 'equipment-upgrade')

    return (
      <main className="app-shell">
        <header className="topbar">
          <div><p className="eyebrow">Build 0.1 · {activeSave.saveMode}</p><strong className="brand">Greywake</strong></div>
          <button className="ghost-button" type="button" onClick={() => setScreen('save-list')}>Trocar save</button>
        </header>

        <section className="character-hero">
          <div><p className="section-kicker">Cidade Livre · Taverna</p><h1>{activeSave.character.name}</h1><p className="subtitle">{getClassName(activeSave.character.classId)} · {getGiftName(activeSave.character.giftId)}</p></div>
          <div className="level-badge"><span>Nível</span><strong>{activeSave.character.level}</strong></div>
        </section>

        {message ? <p className="inline-message">{message}</p> : null}

        <section className="dashboard-grid">
          <article className="panel">
            <div className="panel-heading"><div><p className="section-kicker">M2 · Coleta</p><h2>Recursos</h2></div><span className="pill">1 atividade por vez</span></div>
            <div className="choice-grid">
              {INITIAL_IDLE_ACTIVITIES.map((activity) => (
                <button className={`choice-card ${activeSave.idle.activeActivity?.activityDefinitionId === activity.id ? 'selected' : ''}`} type="button" key={activity.id} onClick={() => void handleStartActivity(activity.id)}>
                  <span className="choice-title">{activity.name}</span>
                  <span className="muted">{skillLabels[activity.skillId]} Nv. {activeSave.skills[activity.skillId].level}</span>
                  <span className="attribute-preview">{activity.actionSeconds}s → 1 {activity.resultName} · posse {getInventoryQuantity(activeSave, activity.resultItemDefinitionId)}</span>
                </button>
              ))}
            </div>
          </article>

          <article className="panel">
            <p className="section-kicker">Estado atual</p><h2>{activeWork ?? 'Sem atividade'}</h2>
            <p className="muted">Coleta e produção usam o mesmo limite de uma atividade Idle por vez.</p>
            {activeWork ? <button className="ghost-button" type="button" onClick={() => void handleStopWork()}>Parar atividade</button> : null}
          </article>
        </section>

        <section className="dashboard-grid section-gap">
          <article className="panel">
            <div className="panel-heading"><div><p className="section-kicker">M3 · Produção</p><h2>Metalurgia, Forja e Culinária</h2></div><span className="pill">determinístico</span></div>
            <div className="choice-grid">
              {normalRecipes.map((recipe) => {
                const ingredients = recipe.ingredients.map((ingredient) => `${ingredient.quantity}× ${itemLabels[ingredient.definitionId] ?? ingredient.definitionId} (${getInventoryQuantity(activeSave, ingredient.definitionId)})`).join(' + ')
                return (
                  <button className={`choice-card ${activeSave.crafting.activeRecipe?.recipeDefinitionId === recipe.id ? 'selected' : ''}`} type="button" key={recipe.id} onClick={() => void handleStartRecipe(recipe.id)}>
                    <span className="choice-title">{recipe.name}</span>
                    <span className="muted">{skillLabels[recipe.skillId]} · {recipe.actionSeconds}s · {recipe.skillXpPerAction} XP</span>
                    <span className="attribute-preview">{ingredients}</span>
                  </button>
                )
              })}
            </div>
          </article>

          <article className="panel">
            <p className="section-kicker">Inventário</p><h2>Materiais e produtos</h2>
            <dl className="save-details">
              {activeSave.character.inventory.length === 0 ? <div><dt>Vazio</dt><dd>—</dd></div> : activeSave.character.inventory.map((stack) => <div key={stack.definitionId}><dt>{itemLabels[stack.definitionId] ?? stack.definitionId}</dt><dd>{stack.quantity}</dd></div>)}
            </dl>
          </article>
        </section>

        <section className="dashboard-grid section-gap">
          <article className="panel">
            <div className="panel-heading"><div><p className="section-kicker">Equipamento</p><h2>Instâncias do personagem</h2></div><span className="pill">+0 / +1</span></div>
            <div className="equipment-list">
              {activeSave.character.equipmentItems.map((instance) => {
                const definition = getEquipmentDefinition(instance.definitionId)
                if (!definition) return null
                const equipped = Object.values(activeSave.character.equipment).includes(instance.instanceId)
                const primary = getEquipmentPrimaryValue(definition, instance.upgradeLevel)
                return (
                  <div className="equipment-row" key={instance.instanceId}>
                    <div><strong>{definition.name} +{instance.upgradeLevel}</strong><span className="muted">{definition.slot}{primary !== null ? ` · ${definition.primaryStat?.kind === 'attack' ? 'Poder' : 'Defesa'} ${primary}` : ''}</span></div>
                    <div className="equipment-actions">
                      <button className="ghost-button" type="button" onClick={() => void handleEquip(instance.instanceId)}>{equipped ? 'Equipado' : 'Equipar'}</button>
                      {upgradeRecipe && instance.upgradeLevel === 0 && definition.primaryStat ? <button className="ghost-button" type="button" onClick={() => void handleStartRecipe(upgradeRecipe.id, instance.instanceId)}>Reforçar +1</button> : null}
                    </div>
                  </div>
                )
              })}
            </div>
          </article>

          <article className="panel">
            <p className="section-kicker">Marco</p><h2>M3 — Crafting e equipamento</h2>
            <dl className="save-details"><div><dt>Schema</dt><dd>v{activeSave.saveSchemaVersion}</dd></div><div><dt>XP geral</dt><dd>{activeSave.character.xp}</dd></div><div><dt>Equipamentos</dt><dd>{activeSave.character.equipmentItems.length}</dd></div></dl>
            <div className="milestone-note"><span>Próximo marco</span><strong>M4 — Primeiro combate completo</strong></div>
          </article>
        </section>
      </main>
    )
  }

  if (screen === 'save-list') {
    return (
      <main className="app-shell">
        <header className="topbar"><div><p className="eyebrow">Build 0.1 · Fase 1 local</p><strong className="brand">Greywake</strong></div><button className="primary-button compact" type="button" onClick={startNewSave}>Novo save Offline</button></header>
        <section className="intro-block"><p className="section-kicker">Continuar</p><h1>Escolha um personagem</h1><p className="subtitle">Saves locais e separados de qualquer futuro modo Online.</p></section>
        {message ? <p className="inline-message">{message}</p> : null}
        <section className="save-grid">{saves.map((save) => <button className="save-card" type="button" key={save.saveId} onClick={() => void handleLoadSave(save.saveId)}><span className="save-card-topline"><span>{getClassName(save.character.classId)}</span><span>Nv. {save.character.level}</span></span><strong>{save.character.name}</strong><span className="muted">{getGiftName(save.character.giftId)}</span><span className="save-card-footer">OFFLINE · schema v{save.saveSchemaVersion}</span></button>)}</section>
      </main>
    )
  }

  const canCreate = Boolean(characterName.trim() && selectedClassId && selectedGiftId && !isSaving)

  return (
    <main className="app-shell">
      <header className="topbar"><div><p className="eyebrow">Novo jogo · {BUILD_SAVE_MODE}</p><strong className="brand">Greywake</strong></div>{saves.length > 0 ? <button className="ghost-button" type="button" onClick={() => setScreen('save-list')}>Voltar aos saves</button> : null}</header>
      <section className="creation-layout">
        <div className="creation-main">
          <section className="creation-section"><div className="step-heading"><span className="step-number">01</span><div><p className="section-kicker">Identidade</p><h1>Dê um nome ao viajante</h1></div></div><label className="name-field"><span>Nome do personagem</span><input autoComplete="off" autoFocus placeholder="Nome" value={characterName} onChange={(event) => setCharacterName(event.target.value)} /></label></section>
          <section className="creation-section"><div className="step-heading"><span className="step-number">02</span><div><p className="section-kicker">Classe inicial</p><h2>Escolha apenas como começar</h2></div></div><div className="choice-grid class-grid">{CHARACTER_CLASSES.map((definition) => <button className={`choice-card ${selectedClassId === definition.id ? 'selected' : ''}`} type="button" key={definition.id} onClick={() => setSelectedClassId(definition.id)}><span className="choice-title">{definition.name}</span><span className="muted">{definition.summary}</span></button>)}</div></section>
          <section className="creation-section"><div className="step-heading"><span className="step-number">03</span><div><p className="section-kicker">Presente</p><h2>Escolha uma pequena vantagem</h2></div></div><div className="choice-grid gift-grid">{INITIAL_GIFTS.map((definition) => <button className={`choice-card ${selectedGiftId === definition.id ? 'selected' : ''}`} type="button" key={definition.id} onClick={() => setSelectedGiftId(definition.id)}><span className="choice-title">{definition.name}</span><span className="muted">{definition.summary}</span></button>)}</div></section>
        </div>
        <aside className="creation-summary"><p className="section-kicker">Resumo</p><h2>{characterName.trim() || 'Novo viajante'}</h2><div className="summary-row"><span>Save</span><strong>Offline</strong></div><div className="summary-row"><span>Classe</span><strong>{selectedClassId ? getClassName(selectedClassId) : 'Escolher'}</strong></div><div className="summary-row"><span>Presente</span><strong>{selectedGiftId ? getGiftName(selectedGiftId) : 'Escolher'}</strong></div>{message ? <p className="inline-message">{message}</p> : null}<button className="primary-button" type="button" disabled={!canCreate} onClick={() => void handleCreateSave()}>{isSaving ? 'Criando…' : 'Criar personagem'}</button></aside>
      </section>
    </main>
  )
}

export default App
