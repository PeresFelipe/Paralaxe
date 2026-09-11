import { useEffect, useState } from 'react'
import {
  CHARACTER_CLASSES,
  CONTENT_VERSION,
  INITIAL_GIFTS,
  getCraftingRecipeDefinition,
  getEquipmentDefinition,
  getIdleActivityDefinition,
} from '@greywake/content'
import {
  BUILD_SAVE_MODE,
  allocateAttributePoints,
  createOfflineGameSave,
  depositEquipmentToBank,
  depositInventoryStackToBank,
  equipEquipment,
  pauseCurrentWorkForRisk,
  processCraftingProgress,
  processIdleProgress,
  startCraftingRecipe,
  startIdleActivity,
  stopCraftingRecipe,
  stopIdleActivity,
  unlockCharacterPrestigeNode,
  withdrawEquipmentFromBank,
  withdrawInventoryStackFromBank,
  type AttributeAllocation,
  type CharacterClassId,
  type GiftId,
  type OfflineGameSave,
} from '@greywake/domain'
import { createIndexedDbSaveRepository } from '@greywake/persistence'
import GameShell from './GameShell'
import WebGameStatus from './WebGameStatus'

const saveRepository = createIndexedDbSaveRepository()

type Screen = 'loading' | 'save-list' | 'create' | 'game' | 'error'
type OfflineSummary = { duration: string; result: string }

function getClassName(classId: CharacterClassId) {
  return CHARACTER_CLASSES.find((definition) => definition.id === classId)?.name ?? classId
}

function getGiftName(giftId: GiftId) {
  return INITIAL_GIFTS.find((definition) => definition.id === giftId)?.name ?? giftId
}

function updateSaveInList(saves: OfflineGameSave[], save: OfflineGameSave) {
  return saves.map((current) => (current.saveId === save.saveId ? save : current))
}

function createSaveId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `save-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function formatAbsence(milliseconds: number) {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000))
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) return `${hours}h ${minutes}min`
  if (minutes > 0) return `${minutes}min`
  return `${seconds}s`
}

function processCurrentWork(save: OfflineGameSave, now: string) {
  // An active Dungeon is a persisted risk state. Its selected Idle work remains
  // attached only as continuity and must not accrue time while the run is active.
  if (save.dungeon.activeRun) return { save, text: null }

  const activeIdleId = save.idle.activeActivity?.activityDefinitionId
  if (activeIdleId) {
    const activity = getIdleActivityDefinition(activeIdleId)
    if (activity) {
      const result = processIdleProgress(save, activity, now)
      const levelText = result.gainedSkillLevels > 0 ? ` · +${result.gainedSkillLevels} nível(is) de Skill` : ''
      const cappedText = result.cappedSeconds > 0 ? ' · limite offline atingido' : ''
      const capacityText = result.stoppedForCapacity ? ' · Inventário sem capacidade; coleta interrompida' : ''
      return {
        save: result.save,
        text: result.completedActions > 0
          ? `+${result.completedActions} ${activity.resultName} · +${result.grantedSkillXp} XP de Skill${levelText}${cappedText}${capacityText}`
          : result.stoppedForCapacity
            ? `${activity.name} foi interrompida: Inventário sem capacidade.`
            : null,
      }
    }
  }

  const activeRecipeId = save.crafting.activeRecipe?.recipeDefinitionId
  if (activeRecipeId) {
    const recipe = getCraftingRecipeDefinition(activeRecipeId)
    if (recipe) {
      const result = processCraftingProgress(save, recipe, now)
      const totalOutput = result.producedItems + result.producedEquipment + result.upgradedEquipment
      const stoppedText = result.stoppedForMaterials ? ' · produção interrompida por materiais insuficientes' : ''
      const capacityText = result.stoppedForCapacity ? ' · produção interrompida por Inventário sem capacidade' : ''
      return {
        save: result.save,
        text: result.completedActions > 0
          ? `${recipe.name}: ${totalOutput || result.completedActions} concluído(s) · +${result.grantedSkillXp} XP de Skill${stoppedText}${capacityText}`
          : result.stoppedForMaterials
            ? `${recipe.name} foi interrompida por materiais insuficientes.`
            : result.stoppedForCapacity
              ? `${recipe.name} foi interrompida: Inventário sem capacidade.`
              : null,
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
  const [creationStep, setCreationStep] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const [lastWorkResult, setLastWorkResult] = useState<string | null>(null)
  const [offlineSummary, setOfflineSummary] = useState<OfflineSummary | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [riskActive, setRiskActive] = useState(false)

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
    if (screen !== 'game' || !activeSave) return
    if (riskActive || activeSave.dungeon.activeRun) return
    if (!activeSave.idle.activeActivity && !activeSave.crafting.activeRecipe) return

    const timer = window.setInterval(() => {
      const result = processCurrentWork(activeSave, new Date().toISOString())
      if (result.save === activeSave) return

      void saveRepository.put(result.save).then(() => {
        setActiveSave(result.save)
        setSaves((current) => updateSaveInList(current, result.save))
        if (result.text) {
          setLastWorkResult(result.text)
          if (!result.save.idle.activeActivity && !result.save.crafting.activeRecipe) setMessage(result.text)
        }
      }).catch((error: unknown) => {
        setMessage(error instanceof Error ? error.message : 'Não foi possível salvar o progresso da atividade.')
      })
    }, 5000)

    return () => window.clearInterval(timer)
  }, [screen, activeSave, riskActive])

  async function persistActive(save: OfflineGameSave, text?: string) {
    await saveRepository.put(save)
    setActiveSave(save)
    setSaves((current) => updateSaveInList(current, save))
    if (text) setMessage(text)
  }

  async function prepareRisk() {
    if (!activeSave) throw new Error('Nenhum personagem ativo.')
    const now = new Date().toISOString()
    const processed = processCurrentWork(activeSave, now).save
    const paused = pauseCurrentWorkForRisk(processed, now)
    await saveRepository.put(paused)
    setActiveSave(paused)
    setSaves((current) => updateSaveInList(current, paused))
    setRiskActive(true)
    return paused
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
        saveId: createSaveId(),
        createdAt: now,
        contentVersion: CONTENT_VERSION,
        characterName,
        characterClass,
        gift,
      })
      await saveRepository.put(save)
      setSaves((current) => [save, ...current])
      setActiveSave(save)
      setRiskActive(false)
      setOfflineSummary(null)
      setScreen('game')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível criar o save.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleLoadSave(saveId: string) {
    setMessage(null)
    setOfflineSummary(null)
    setLastWorkResult(null)
    try {
      const stored = await saveRepository.get(saveId)
      if (!stored) {
        setMessage('Esse save não foi encontrado no armazenamento local.')
        return
      }

      if (stored.dungeon.activeRun) {
        setActiveSave(stored)
        setSaves((current) => updateSaveInList(current, stored))
        setRiskActive(true)
        setMessage('Expedição em Dún Liath em andamento. Retome do ponto em que parou.')
        setScreen('game')
        return
      }

      const now = new Date().toISOString()
      const absence = Date.parse(now) - Date.parse(stored.updatedAt)
      const result = processCurrentWork(stored, now)
      await saveRepository.put(result.save)
      setSaves((current) => updateSaveInList(current, result.save))
      setActiveSave(result.save)
      setRiskActive(false)
      setScreen('game')

      if (result.text && absence >= 60_000) {
        setOfflineSummary({ duration: formatAbsence(absence), result: result.text })
      } else if (result.text) {
        setMessage(result.text)
      }
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
      await persistActive(save, `${activity.resultName} agora é sua atividade Idle.`)
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
      await persistActive(save, `${recipe.name} iniciado. A atividade anterior foi substituída.`)
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

  async function handleAllocateAttributes(allocation: AttributeAllocation) {
    if (!activeSave) return

    try {
      const save = allocateAttributePoints(activeSave, allocation, new Date().toISOString())
      await persistActive(save, 'Distribuição de atributos confirmada.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível distribuir os pontos de atributo.')
      throw error
    }
  }

  async function handleUnlockPrestigeNode(nodeId: string) {
    if (!activeSave) return

    try {
      const save = unlockCharacterPrestigeNode(activeSave, nodeId, new Date().toISOString())
      await persistActive(save, 'Nó de Prestígio desbloqueado.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível desbloquear o nó de Prestígio.')
    }
  }

  async function handleDepositBankStack(definitionId: string, quantity: number) {
    if (!activeSave) return
    try {
      const save = depositInventoryStackToBank(activeSave, definitionId, quantity, new Date().toISOString())
      await persistActive(save, `Depósito realizado: ${quantity} item(ns).`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível depositar no Banco.')
    }
  }

  async function handleWithdrawBankStack(definitionId: string, quantity: number) {
    if (!activeSave) return
    try {
      const save = withdrawInventoryStackFromBank(activeSave, definitionId, quantity, new Date().toISOString())
      await persistActive(save, `Retirada realizada: ${quantity} item(ns).`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível retirar do Banco.')
    }
  }

  async function handleDepositBankEquipment(instanceId: string) {
    if (!activeSave) return
    try {
      const save = depositEquipmentToBank(activeSave, instanceId, new Date().toISOString())
      await persistActive(save, 'Equipamento depositado no Banco.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível depositar o equipamento.')
    }
  }

  async function handleWithdrawBankEquipment(instanceId: string) {
    if (!activeSave) return
    try {
      const save = withdrawEquipmentFromBank(activeSave, instanceId, new Date().toISOString())
      await persistActive(save, 'Equipamento retirado do Banco.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível retirar o equipamento.')
    }
  }

  function startNewSave() {
    setCharacterName('')
    setSelectedClassId(null)
    setSelectedGiftId(null)
    setCreationStep(0)
    setMessage(null)
    setOfflineSummary(null)
    setRiskActive(false)
    setScreen('create')
  }

  function switchSave() {
    setActiveSave(null)
    setLastWorkResult(null)
    setOfflineSummary(null)
    setRiskActive(false)
    setMessage(null)
    setScreen('save-list')
  }

  if (screen === 'loading') {
    return <main className="entry-shell entry-centered"><div className="loading-mark" /><p className="muted">Carregando saves locais…</p></main>
  }

  if (screen === 'error') {
    return <main className="entry-shell entry-centered"><p className="section-kicker">Greywake</p><h1 className="display-title">Não foi possível abrir o armazenamento local.</h1><p className="muted">{message}</p></main>
  }

  if (screen === 'game' && activeSave) {
    if (offlineSummary) {
      return (
        <main className="offline-return-screen">
          <section className="offline-return-card">
            <p className="section-kicker">Bem-vindo de volta</p>
            <h1 className="display-title">{activeSave.character.name}</h1>
            <p className="offline-duration">Ausente por <strong>{offlineSummary.duration}</strong></p>
            <div className="offline-result"><span>Durante sua ausência</span><strong>{offlineSummary.result}</strong></div>
            <button className="primary-button compact" type="button" onClick={() => setOfflineSummary(null)}>Continuar</button>
          </section>
        </main>
      )
    }

    return (
      <>
      <WebGameStatus canUpdate={false} />
      <GameShell
        save={activeSave}
        message={message}
        lastWorkResult={lastWorkResult}
        onDismissMessage={() => setMessage(null)}
        riskActive={riskActive}
        onRiskStateChange={setRiskActive}
        onSwitchSave={switchSave}
        onPersist={persistActive}
        prepareRisk={prepareRisk}
        onStartActivity={handleStartActivity}
        onStartRecipe={handleStartRecipe}
        onStopWork={handleStopWork}
        onEquip={handleEquip}
        onAllocateAttributes={handleAllocateAttributes}
        onUnlockPrestigeNode={handleUnlockPrestigeNode}
        onDepositBankStack={handleDepositBankStack}
        onWithdrawBankStack={handleWithdrawBankStack}
        onDepositBankEquipment={handleDepositBankEquipment}
        onWithdrawBankEquipment={handleWithdrawBankEquipment}
      />
      </>
    )
  }

  if (screen === 'save-list') {
    return (
      <main className="entry-shell"><WebGameStatus canUpdate />
        <header className="entry-header"><div><p className="section-kicker">Greywake</p><strong className="entry-brand">Build 0.1 · Offline</strong></div><button className="primary-button compact" type="button" onClick={startNewSave}>Novo personagem</button></header>
        <section className="entry-intro"><p className="section-kicker">Continuar</p><h1 className="display-title">Escolha um personagem</h1><p className="muted">Saves locais, persistentes e separados de qualquer futuro modo Online.</p></section>
        {message ? <p className="inline-message">{message}</p> : null}
        <section className="save-grid-runtime">
          {saves.map((save) => (
            <button className="save-card-runtime" type="button" key={save.saveId} onClick={() => void handleLoadSave(save.saveId)}>
              <span>{getClassName(save.character.classId)} · Nv. {save.character.level}</span>
              <strong>{save.character.name}</strong>
              <small>{getGiftName(save.character.giftId)}</small>
              <em>{save.dungeon.activeRun ? 'EXPEDIÇÃO ATIVA · RETOMAR DÚN LIATH' : 'OFFLINE · LOCAL'}</em>
            </button>
          ))}
        </section>
      </main>
    )
  }

  return (
    <main className="entry-shell"><WebGameStatus canUpdate={creationStep === 0 && !isSaving} />
      <header className="entry-header"><div><p className="section-kicker">Novo jogo</p><strong className="entry-brand">Greywake</strong></div>{saves.length > 0 ? <button className="ghost-button" type="button" onClick={() => setScreen('save-list')}>Voltar aos saves</button> : null}</header>
      <section className="creation-stage">
        <div className="creation-progress" aria-label={`Etapa ${creationStep + 1} de 5`}>
          {[0, 1, 2, 3, 4].map((step) => <span key={step} className={step <= creationStep ? 'active' : ''}>{step + 1}</span>)}
        </div>

        {creationStep === 0 ? (
          <div className="creation-focus"><p className="section-kicker">Modo</p><h1 className="display-title">Offline</h1><p className="muted">Este personagem usa save local persistente. Nenhum sistema Online é necessário para jogar.</p><button className="primary-button compact" type="button" onClick={() => setCreationStep(1)}>Continuar</button></div>
        ) : null}

        {creationStep === 1 ? (
          <div className="creation-focus"><p className="section-kicker">Nome</p><h1 className="display-title">Quem desperta em Greywake?</h1><label className="field-stack"><span>Nome do personagem</span><input autoFocus autoComplete="off" value={characterName} onChange={(event) => setCharacterName(event.target.value)} placeholder="Nome" /></label><div className="button-row"><button className="ghost-button" type="button" onClick={() => setCreationStep(0)}>Voltar</button><button className="primary-button compact" type="button" disabled={!characterName.trim()} onClick={() => setCreationStep(2)}>Continuar</button></div></div>
        ) : null}

        {creationStep === 2 ? (
          <div className="creation-focus wide"><p className="section-kicker">Classe inicial</p><h1 className="display-title">Escolha como começar</h1><p className="muted">A classe define seu início, não seu destino.</p><div className="creation-choice-grid">{CHARACTER_CLASSES.map((definition) => <button className={`creation-choice ${selectedClassId === definition.id ? 'selected' : ''}`} type="button" key={definition.id} onClick={() => setSelectedClassId(definition.id)}><strong>{definition.name}</strong><span>{definition.summary}</span></button>)}</div><div className="button-row"><button className="ghost-button" type="button" onClick={() => setCreationStep(1)}>Voltar</button><button className="primary-button compact" type="button" disabled={!selectedClassId} onClick={() => setCreationStep(3)}>Continuar</button></div></div>
        ) : null}

        {creationStep === 3 ? (
          <div className="creation-focus wide"><p className="section-kicker">Presente</p><h1 className="display-title">Escolha o que levar</h1><div className="creation-choice-grid">{INITIAL_GIFTS.map((definition) => <button className={`creation-choice ${selectedGiftId === definition.id ? 'selected' : ''}`} type="button" key={definition.id} onClick={() => setSelectedGiftId(definition.id)}><strong>{definition.name}</strong><span>{definition.summary}</span></button>)}</div><div className="button-row"><button className="ghost-button" type="button" onClick={() => setCreationStep(2)}>Voltar</button><button className="primary-button compact" type="button" disabled={!selectedGiftId} onClick={() => setCreationStep(4)}>Continuar</button></div></div>
        ) : null}

        {creationStep === 4 ? (
          <div className="creation-focus"><p className="section-kicker">Confirmar</p><h1 className="display-title">{characterName}</h1><div className="creation-summary-runtime"><div><span>Modo</span><strong>{BUILD_SAVE_MODE}</strong></div><div><span>Classe</span><strong>{selectedClassId ? getClassName(selectedClassId) : '—'}</strong></div><div><span>Presente</span><strong>{selectedGiftId ? getGiftName(selectedGiftId) : '—'}</strong></div></div>{message ? <p className="inline-message">{message}</p> : null}<div className="button-row"><button className="ghost-button" type="button" onClick={() => setCreationStep(3)}>Voltar</button><button className="primary-button compact" type="button" disabled={isSaving} onClick={() => void handleCreateSave()}>{isSaving ? 'Criando…' : 'Criar personagem'}</button></div></div>
        ) : null}
      </section>
    </main>
  )
}

export default App
