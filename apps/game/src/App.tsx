import { useEffect, useState } from 'react'
import { CHARACTER_CLASSES, CONTENT_VERSION, INITIAL_GIFTS } from '@greywake/content'
import {
  ATTRIBUTE_KEYS,
  BUILD_SAVE_MODE,
  createOfflineGameSave,
  type AttributeKey,
  type CharacterClassId,
  type GiftId,
  type OfflineGameSave,
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

function getClassName(classId: CharacterClassId) {
  return CHARACTER_CLASSES.find((definition) => definition.id === classId)?.name ?? classId
}

function getGiftName(giftId: GiftId) {
  return INITIAL_GIFTS.find((definition) => definition.id === giftId)?.name ?? giftId
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
      const save = await saveRepository.get(saveId)

      if (!save) {
        setMessage('Esse save não foi encontrado no armazenamento local.')
        return
      }

      setActiveSave(save)
      setScreen('character')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível carregar o save.')
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
            <p className="section-kicker">Save local</p>
            <h2>M1 carregado</h2>
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
                <dt>Conteúdo</dt>
                <dd>{activeSave.contentVersion}</dd>
              </div>
              <div>
                <dt>Moedas</dt>
                <dd>{activeSave.character.gold}</dd>
              </div>
            </dl>
            <div className="milestone-note">
              <span>Próximo marco</span>
              <strong>M2 — Idle persiste e funciona offline</strong>
            </div>
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
