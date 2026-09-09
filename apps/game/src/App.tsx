import { useEffect, useState } from 'react'
import {
  CHARACTER_CLASSES,
  CONTENT_VERSION,
  INITIAL_GIFTS,
  INITIAL_IDLE_ACTIVITIES,
  getIdleActivityDefinition,
} from '@greywake/content'
import {
  ATTRIBUTE_KEYS,
  BUILD_SAVE_MODE,
  createOfflineGameSave,
  processIdleProgress,
  startIdleActivity,
  stopIdleActivity,
  type AttributeKey,
  type CharacterClassId,
  type GiftId,
  type OfflineGameSave,
  type SkillId,
} from '@greywake/domain'
import { createIndexedDbSaveRepository } from '@greywake/persistence'

const saveRepository = createIndexedDbSaveRepository()

type Screen = 'loading' | 'save-list' | 'create' | 'character' | 'error'

const attributeLabels: Record<AttributeKey, string> = {
  vitality: 'Vitalidade',
  mind: 'Mente',
  vigor: 'Vigor',
  strength: 'Força',
  dexterity: 'Destreza',
  intelligence: 'Inteligência',
  faith: 'Fé',
}

const skillLabels: Record<SkillId, string> = {
  mining: 'Mineração',
  woodcutting: 'Lenhador',
  fishing: 'Pesca',
  herbology: 'Herbologia',
  metallurgy: 'Metalurgia',
  smithing: 'Forja',
  cooking: 'Culinária',
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

function describeIdleResult(
  completedActions: number,
  resultName: string,
  gainedSkillLevels: number,
  cappedSeconds: number,
) {
  const parts = [`+${completedActions} ${resultName}`]

  if (gainedSkillLevels > 0) {
    parts.push(`+${gainedSkillLevels} nível${gainedSkillLevels === 1 ? '' : 'is'} de Skill`)
  }

  if (cappedSeconds > 0) {
    parts.push('limite offline atingido')
  }

  return parts.join(' · ')
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
    if (screen !== 'character' || !activeSave?.idle.activeActivity) return

    const timer = window.setInterval(() => {
      const activity = getIdleActivityDefinition(activeSave.idle.activeActivity?.activityDefinitionId ?? '')

      if (!activity) return

      const result = processIdleProgress(activeSave, activity, new Date().toISOString())

      void saveRepository.put(result.save).then(() => {
        setActiveSave(result.save)
        setSaves((current) => current.map((save) => (save.saveId === result.save.saveId ? result.save : save)))

        if (result.completedActions > 0) {
          setMessage(
            describeIdleResult(
              result.completedActions,
              activity.resultName,
              result.gainedSkillLevels,
              result.cappedSeconds,
            ),
          )
        }
      })
    }, 5000)

    return () => window.clearInterval(timer)
  }, [screen, activeSave])

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
      const storedSave = await saveRepository.get(saveId)

      if (!storedSave) {
        setMessage('Esse save não foi encontrado no armazenamento local.')
        return
      }

      let save = storedSave
      const activeActivityId = save.idle.activeActivity?.activityDefinitionId
      const activity = activeActivityId ? getIdleActivityDefinition(activeActivityId) : null

      if (activity) {
        const result = processIdleProgress(save, activity, new Date().toISOString())
        save = result.save
        await saveRepository.put(save)

        if (result.completedActions > 0) {
          setMessage(
            `Enquanto você esteve fora: ${describeIdleResult(
              result.completedActions,
              activity.resultName,
              result.gainedSkillLevels,
              result.cappedSeconds,
            )}`,
          )
        }
      } else if (storedSave.saveSchemaVersion === 2) {
        await saveRepository.put(storedSave)
      }

      setSaves((current) => current.map((currentSave) => (currentSave.saveId === save.saveId ? save : currentSave)))
      setActiveSave(save)
      setScreen('character')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível carregar o save.')
    }
  }

  async function handleStartActivity(activityDefinitionId: string) {
    if (!activeSave) return

    const activity = getIdleActivityDefinition(activityDefinitionId)
    if (!activity) return

    const now = new Date().toISOString()
    let save = activeSave
    const previousActivityId = save.idle.activeActivity?.activityDefinitionId
    const previousActivity = previousActivityId ? getIdleActivityDefinition(previousActivityId) : null

    if (previousActivity) {
      save = processIdleProgress(save, previousActivity, now).save
    }

    save = startIdleActivity(save, activity, now)
    await saveRepository.put(save)
    setActiveSave(save)
    setSaves((current) => current.map((currentSave) => (currentSave.saveId === save.saveId ? save : currentSave)))
    setMessage(`${activity.name} iniciado. A atividade continuará com o jogo fechado.`)
  }

  async function handleStopActivity() {
    if (!activeSave?.idle.activeActivity) return

    const now = new Date().toISOString()
    const activity = getIdleActivityDefinition(activeSave.idle.activeActivity.activityDefinitionId)
    let save = activeSave

    if (activity) {
      save = processIdleProgress(save, activity, now).save
    }

    save = stopIdleActivity(save, now)
    await saveRepository.put(save)
    setActiveSave(save)
    setSaves((current) => current.map((currentSave) => (currentSave.saveId === save.saveId ? save : currentSave)))
    setMessage('Atividade Idle interrompida.')
  }

  function startNewSave() {
    setCharacterName('')
    setSelectedClassId(null)
    setSelectedGiftId(null)
    setMessage(null)
    setScreen('create')
  }

  if (screen === 'loading') {
    return (
      <main className="app-shell centered-shell">
        <div className="loading-mark" aria-hidden="true" />
        <p className="muted">Carregando saves locais…</p>
      </main>
    )
  }

  if (screen === 'error') {
    return (
      <main className="app-shell centered-shell">
        <p className="eyebrow">Greywake · Build 0.1</p>
        <h1>Não foi possível abrir o armazenamento local.</h1>
        <p className="subtitle">{message}</p>
      </main>
    )
  }

  if (screen === 'character' && activeSave) {
    const activeActivityId = activeSave.idle.activeActivity?.activityDefinitionId ?? null

    return (
      <main className="app-shell">
        <header className="topbar">
          <div>
            <p className="eyebrow">Build 0.1 · {activeSave.saveMode}</p>
            <strong className="brand">Greywake</strong>
          </div>
          <button className="ghost-button" type="button" onClick={() => setScreen('save-list')}>
            Trocar save
          </button>
        </header>

        <section className="character-hero">
          <div>
            <p className="section-kicker">Cidade Livre · Taverna</p>
            <h1>{activeSave.character.name}</h1>
            <p className="subtitle">
              {getClassName(activeSave.character.classId)} · {getGiftName(activeSave.character.giftId)}
            </p>
          </div>
          <div className="level-badge">
            <span>Nível</span>
            <strong>{activeSave.character.level}</strong>
          </div>
        </section>

        {message ? <p className="inline-message">{message}</p> : null}

        <section className="dashboard-grid">
          <article className="panel">
            <div className="panel-heading">
              <div>
                <p className="section-kicker">M2 · Idle</p>
                <h2>Primeiras coletas</h2>
              </div>
              <span className="pill">1 atividade por vez</span>
            </div>

            <div className="choice-grid">
              {INITIAL_IDLE_ACTIVITIES.map((activity) => {
                const skill = activeSave.skills[activity.skillId]
                const isActive = activeActivityId === activity.id
                const quantity = getInventoryQuantity(activeSave, activity.resultItemDefinitionId)

                return (
                  <button
                    className={`choice-card ${isActive ? 'selected' : ''}`}
                    type="button"
                    key={activity.id}
                    onClick={() => void handleStartActivity(activity.id)}
                  >
                    <span className="choice-title">{activity.name}</span>
                    <span className="muted">
                      {skillLabels[activity.skillId]} Nv. {skill.level} · {skill.xp} XP
                    </span>
                    <span className="attribute-preview">
                      {activity.actionSeconds}s → 1 {activity.resultName} · {activity.skillXpPerAction} XP
                    </span>
                    <span className="save-card-footer">Em posse: {quantity}</span>
                  </button>
                )
              })}
            </div>

            {activeActivityId ? (
              <button className="ghost-button" type="button" onClick={() => void handleStopActivity()}>
                Parar atividade
              </button>
            ) : null}
          </article>

          <article className="panel">
            <p className="section-kicker">Save local</p>
            <h2>M2 em execução</h2>
            <dl className="save-details">
              <div>
                <dt>Modo</dt>
                <dd>{activeSave.saveMode}</dd>
              </div>
              <div>
                <dt>Schema</dt>
                <dd>v{activeSave.saveSchemaVersion}</dd>
              </div>
              <div>
                <dt>XP geral</dt>
                <dd>{activeSave.character.xp}</dd>
              </div>
              <div>
                <dt>Atividade</dt>
                <dd>{activeActivityId ? getIdleActivityDefinition(activeActivityId)?.name ?? 'Ativa' : 'Nenhuma'}</dd>
              </div>
            </dl>
            <div className="milestone-note">
              <span>Comportamento</span>
              <strong>Fecha o navegador → relógio continua → progresso é processado ao voltar</strong>
            </div>
          </article>
        </section>

        <section className="dashboard-grid">
          <article className="panel">
            <div className="panel-heading">
              <div>
                <p className="section-kicker">Personagem</p>
                <h2>Atributos iniciais</h2>
              </div>
              <span className="pill">35 pontos</span>
            </div>
            <div className="attribute-grid">
              {ATTRIBUTE_KEYS.map((key) => (
                <div className="attribute-row" key={key}>
                  <span>{attributeLabels[key]}</span>
                  <strong>{activeSave.character.attributes[key]}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <p className="section-kicker">Próximo marco</p>
            <h2>M3 — Crafting e equipamento</h2>
            <p className="muted">
              O progresso Idle agora já possui estado próprio, timestamps, limite offline, recompensa de recurso e XP de Skill.
            </p>
          </article>
        </section>
      </main>
    )
  }

  if (screen === 'save-list') {
    return (
      <main className="app-shell">
        <header className="topbar">
          <div>
            <p className="eyebrow">Build 0.1 · Fase 1 local</p>
            <strong className="brand">Greywake</strong>
          </div>
          <button className="primary-button compact" type="button" onClick={startNewSave}>
            Novo save Offline
          </button>
        </header>

        <section className="intro-block">
          <p className="section-kicker">Continuar</p>
          <h1>Escolha um personagem</h1>
          <p className="subtitle">Os saves desta build são locais e permanecem separados de qualquer futuro modo Online.</p>
        </section>

        {message ? <p className="inline-message">{message}</p> : null}

        <section className="save-grid" aria-label="Saves Offline">
          {saves.map((save) => (
            <button className="save-card" type="button" key={save.saveId} onClick={() => void handleLoadSave(save.saveId)}>
              <span className="save-card-topline">
                <span>{getClassName(save.character.classId)}</span>
                <span>Nv. {save.character.level}</span>
              </span>
              <strong>{save.character.name}</strong>
              <span className="muted">{getGiftName(save.character.giftId)}</span>
              <span className="save-card-footer">OFFLINE · schema v{save.saveSchemaVersion}</span>
            </button>
          ))}
        </section>
      </main>
    )
  }

  const canCreate = Boolean(characterName.trim() && selectedClassId && selectedGiftId && !isSaving)

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Novo jogo · {BUILD_SAVE_MODE}</p>
          <strong className="brand">Greywake</strong>
        </div>
        {saves.length > 0 ? (
          <button className="ghost-button" type="button" onClick={() => setScreen('save-list')}>
            Voltar aos saves
          </button>
        ) : null}
      </header>

      <section className="creation-layout">
        <div className="creation-main">
          <section className="creation-section">
            <div className="step-heading">
              <span className="step-number">01</span>
              <div>
                <p className="section-kicker">Identidade</p>
                <h1>Dê um nome ao viajante</h1>
              </div>
            </div>
            <label className="name-field">
              <span>Nome do personagem</span>
              <input
                autoComplete="off"
                autoFocus
                placeholder="Nome"
                value={characterName}
                onChange={(event) => setCharacterName(event.target.value)}
              />
            </label>
          </section>

          <section className="creation-section">
            <div className="step-heading">
              <span className="step-number">02</span>
              <div>
                <p className="section-kicker">Classe inicial</p>
                <h2>Escolha apenas como começar</h2>
                <p className="muted">A classe não bloqueia sua build futura.</p>
              </div>
            </div>
            <div className="choice-grid class-grid">
              {CHARACTER_CLASSES.map((definition) => (
                <button
                  className={`choice-card ${selectedClassId === definition.id ? 'selected' : ''}`}
                  type="button"
                  key={definition.id}
                  aria-pressed={selectedClassId === definition.id}
                  onClick={() => setSelectedClassId(definition.id)}
                >
                  <span className="choice-title">{definition.name}</span>
                  <span className="muted">{definition.summary}</span>
                  <span className="attribute-preview">
                    FOR {definition.attributes.strength} · DES {definition.attributes.dexterity} · INT {definition.attributes.intelligence} · FÉ {definition.attributes.faith}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="creation-section">
            <div className="step-heading">
              <span className="step-number">03</span>
              <div>
                <p className="section-kicker">Presente</p>
                <h2>Escolha uma pequena vantagem</h2>
              </div>
            </div>
            <div className="choice-grid gift-grid">
              {INITIAL_GIFTS.map((definition) => (
                <button
                  className={`choice-card ${selectedGiftId === definition.id ? 'selected' : ''}`}
                  type="button"
                  key={definition.id}
                  aria-pressed={selectedGiftId === definition.id}
                  onClick={() => setSelectedGiftId(definition.id)}
                >
                  <span className="choice-title">{definition.name}</span>
                  <span className="muted">{definition.summary}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside className="creation-summary">
          <p className="section-kicker">Resumo</p>
          <h2>{characterName.trim() || 'Novo viajante'}</h2>
          <div className="summary-row">
            <span>Save</span>
            <strong>Offline</strong>
          </div>
          <div className="summary-row">
            <span>Classe</span>
            <strong>{selectedClassId ? getClassName(selectedClassId) : 'Escolher'}</strong>
          </div>
          <div className="summary-row">
            <span>Presente</span>
            <strong>{selectedGiftId ? getGiftName(selectedGiftId) : 'Escolher'}</strong>
          </div>
          <p className="summary-copy">O personagem começará no nível 1, na Taverna da Cidade Livre.</p>
          {message ? <p className="inline-message">{message}</p> : null}
          <button className="primary-button" type="button" disabled={!canCreate} onClick={() => void handleCreateSave()}>
            {isSaving ? 'Criando…' : 'Criar personagem'}
          </button>
        </aside>
      </section>
    </main>
  )
}

export default App
