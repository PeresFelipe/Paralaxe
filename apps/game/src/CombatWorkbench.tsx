import { useEffect, useMemo, useState } from 'react'
import {
  COMBAT_CONSUMABLES,
  getCombatAbilityDefinition,
  getCombatConsumableDefinition,
  getEnemyDefinition,
  getEquipmentDefinition,
} from '@greywake/content'
import {
  applyCombatResult,
  configureCombatConsumableSlot,
  derivePlayerCombatStats,
  simulateCombat,
  type CombatResult,
  type CombatThresholdResource,
  type OfflineGameSave,
} from '@greywake/domain'
import { createIndexedDbSaveRepository } from '@greywake/persistence'

const saveRepository = createIndexedDbSaveRepository()

const combatCatalog = {
  getEquipmentDefinition,
  getAbilityDefinition: getCombatAbilityDefinition,
  getEnemyDefinition,
  getConsumableDefinition: getCombatConsumableDefinition,
}

function formatResource(value: number) {
  return Math.max(0, Math.round(value))
}

function inventoryQuantity(save: OfflineGameSave, definitionId: string) {
  return save.character.inventory.find((stack) => stack.definitionId === definitionId)?.quantity ?? 0
}

export default function CombatWorkbench() {
  const [saves, setSaves] = useState<OfflineGameSave[]>([])
  const [selectedSaveId, setSelectedSaveId] = useState('')
  const [result, setResult] = useState<CombatResult | null>(null)
  const [visibleSeconds, setVisibleSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const selectedSave = useMemo(
    () => saves.find((save) => save.saveId === selectedSaveId) ?? null,
    [saves, selectedSaveId],
  )

  useEffect(() => {
    void saveRepository.list().then((stored) => {
      setSaves(stored)
      setSelectedSaveId((current) => current || stored[0]?.saveId || '')
    })
  }, [])

  useEffect(() => {
    if (!running || !result) return

    const timer = window.setInterval(() => {
      setVisibleSeconds((current) => Math.min(result.durationSeconds, current + 0.1))
    }, 100)

    return () => window.clearInterval(timer)
  }, [running, result])

  useEffect(() => {
    if (!running || !result || !selectedSave) return
    if (visibleSeconds + 0.0001 < result.durationSeconds) return

    setRunning(false)
    const now = new Date().toISOString()
    const updated = applyCombatResult(selectedSave, 'enemy.road-wolf', result, now)

    void saveRepository.put(updated).then(() => {
      setSaves((current) => current.map((save) => (save.saveId === updated.saveId ? updated : save)))
      setMessage(
        result.outcome === 'victory'
          ? `Vitória persistida: +${result.xpGranted} XP geral.`
          : 'Resultado persistido. O personagem retornou à Cidade Livre.',
      )
    })
  }, [running, result, selectedSave, visibleSeconds])

  async function persistSave(save: OfflineGameSave) {
    await saveRepository.put(save)
    setSaves((current) => current.map((item) => (item.saveId === save.saveId ? save : item)))
  }

  async function updateConsumableSlot(
    slotIndex: 0 | 1,
    values: {
      definitionId?: string | null
      resource?: CombatThresholdResource | null
      threshold?: number | null
    },
  ) {
    if (!selectedSave || running) return
    const current = selectedSave.combat.preferences.consumableSlots[slotIndex]
    const updated = configureCombatConsumableSlot(
      selectedSave,
      slotIndex,
      values.definitionId === undefined ? current.definitionId : values.definitionId,
      values.resource === undefined ? current.autoUseResource : values.resource,
      values.threshold === undefined ? current.autoUseThresholdPercent : values.threshold,
      new Date().toISOString(),
    )
    await persistSave(updated)
    setMessage(`Slot ${slotIndex + 1} de consumível atualizado.`)
  }

  function startFight(manualSlot?: 0 | 1) {
    if (!selectedSave || running) return

    try {
      const seed = Date.now() >>> 0
      const simulated = simulateCombat(
        selectedSave,
        combatCatalog,
        'enemy.road-wolf',
        seed,
        180,
        undefined,
        manualSlot,
      )
      setResult(simulated)
      setVisibleSeconds(0)
      setMessage(
        manualSlot === undefined
          ? `Combate iniciado · seed ${seed}`
          : `Combate iniciado · Slot ${manualSlot + 1} será usado manualmente na primeira ação útil.`,
      )
      setRunning(true)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível iniciar o combate.')
    }
  }

  function repeatSeed() {
    if (!selectedSave || !result || running) return

    try {
      const simulated = simulateCombat(selectedSave, combatCatalog, 'enemy.road-wolf', result.seed)
      setResult(simulated)
      setVisibleSeconds(0)
      setMessage(`Repetindo seed ${result.seed}.`)
      setRunning(true)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível repetir o combate.')
    }
  }

  if (saves.length === 0) return null

  const stats = selectedSave ? derivePlayerCombatStats(selectedSave, combatCatalog) : null
  const visibleLog = result?.log.filter((entry) => entry.atSeconds <= visibleSeconds + 0.001) ?? []
  const progress = result && result.durationSeconds > 0 ? Math.min(100, (visibleSeconds / result.durationSeconds) * 100) : 0

  return (
    <section className="combat-workbench" aria-labelledby="combat-title">
      <div className="combat-workbench__header">
        <div>
          <p className="section-kicker">M6 · Combate integrado</p>
          <h2 id="combat-title">Serviço — Estrada Baixa</h2>
          <p className="muted">Lobo de Estrada · consumíveis · thresholds · seed determinística</p>
        </div>

        <label className="combat-save-select">
          <span>Personagem</span>
          <select
            value={selectedSaveId}
            disabled={running}
            onChange={(event) => {
              setSelectedSaveId(event.target.value)
              setResult(null)
              setMessage(null)
            }}
          >
            {saves.map((save) => (
              <option key={save.saveId} value={save.saveId}>
                {save.character.name} · Nv. {save.character.level}
              </option>
            ))}
          </select>
        </label>
      </div>

      {selectedSave && stats ? (
        <>
          <div className="combat-grid">
            <article className="panel combat-fighter">
              <p className="section-kicker">Personagem</p>
              <h3>{selectedSave.character.name}</h3>
              <div className="combat-stat-row"><span>Vida</span><strong>{stats.maxHealth}</strong></div>
              <div className="combat-stat-row"><span>Mana</span><strong>{stats.maxMana}</strong></div>
              <div className="combat-stat-row"><span>Stamina</span><strong>{stats.maxStamina}</strong></div>
              <div className="combat-stat-row"><span>Defesa</span><strong>{stats.defense}</strong></div>
              <div className="combat-stat-row"><span>Precisão</span><strong>{stats.accuracy}</strong></div>
              <div className="combat-stat-row"><span>Intervalo</span><strong>{stats.actionIntervalSeconds.toFixed(2)}s</strong></div>
            </article>

            <article className="panel combat-center">
              <div className="combat-progress-track" aria-label="Tempo do combate">
                <span style={{ width: `${progress}%` }} />
              </div>

              {result ? (
                <div className="combat-live-resources">
                  <span>Tempo {visibleSeconds.toFixed(1)}s</span>
                  <span>Fim previsto {result.durationSeconds.toFixed(1)}s</span>
                  <span>Seed {result.seed}</span>
                </div>
              ) : (
                <p className="muted">Consumível manual ou automático ocupa a ação; nunca concede ação extra.</p>
              )}

              {message ? <p className="inline-message">{message}</p> : null}

              <div className="combat-actions">
                <button className="primary-button compact" type="button" disabled={running} onClick={() => startFight()}>
                  {running ? 'Combatendo…' : 'Enfrentar Lobo'}
                </button>
                <button className="ghost-button" type="button" disabled={running || !result} onClick={repeatSeed}>
                  Repetir mesma seed
                </button>
              </div>

              <div className="combat-log" aria-live="polite">
                {visibleLog.length === 0 ? <p className="muted">O log aparecerá aqui em tempo real.</p> : null}
                {visibleLog.map((entry, index) => (
                  <div className={`combat-log__entry ${entry.kind}`} key={`${entry.atSeconds}-${index}`}>
                    <time>{entry.atSeconds.toFixed(1)}s</time>
                    <span>{entry.message}</span>
                  </div>
                ))}
              </div>

              {result && !running ? (
                <div className="combat-result">
                  <strong>{result.outcome === 'victory' ? 'Vitória' : result.outcome === 'defeat' ? 'Derrota' : 'Timeout'}</strong>
                  <span>
                    Vida {formatResource(result.player.health)}/{result.player.maxHealth} · Mana {formatResource(result.player.mana)} · Stamina {formatResource(result.player.stamina)}
                  </span>
                </div>
              ) : null}
            </article>

            <article className="panel combat-fighter">
              <p className="section-kicker">Inimigo</p>
              <h3>Lobo de Estrada</h3>
              <div className="combat-stat-row"><span>Vida</span><strong>60</strong></div>
              <div className="combat-stat-row"><span>Defesa</span><strong>4</strong></div>
              <div className="combat-stat-row"><span>Precisão</span><strong>102</strong></div>
              <div className="combat-stat-row"><span>Poder</span><strong>8</strong></div>
              <div className="combat-stat-row"><span>Intervalo</span><strong>2.25s</strong></div>
              <div className="milestone-note">
                <span>Telegraph</span>
                <strong>Bote · 1.2s · interrompível</strong>
              </div>
            </article>
          </div>

          <div className="combat-grid consumable-grid">
            {([0, 1] as const).map((slotIndex) => {
              const slot = selectedSave.combat.preferences.consumableSlots[slotIndex]
              return (
                <article className="panel combat-fighter" key={slotIndex}>
                  <p className="section-kicker">Consumível · Slot {slotIndex + 1}</p>
                  <label className="combat-save-select">
                    <span>Item</span>
                    <select
                      value={slot.definitionId ?? ''}
                      disabled={running}
                      onChange={(event) => void updateConsumableSlot(slotIndex, { definitionId: event.target.value || null })}
                    >
                      <option value="">Vazio</option>
                      {COMBAT_CONSUMABLES.map((consumable) => (
                        <option key={consumable.id} value={consumable.id}>
                          {consumable.name} · ×{inventoryQuantity(selectedSave, consumable.id)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="combat-save-select">
                    <span>Automático quando</span>
                    <select
                      value={slot.autoUseResource ?? ''}
                      disabled={running || !slot.definitionId}
                      onChange={(event) => void updateConsumableSlot(slotIndex, { resource: (event.target.value || null) as CombatThresholdResource | null })}
                    >
                      <option value="">Desativado</option>
                      <option value="health">Vida</option>
                      <option value="mana">Mana</option>
                      <option value="stamina">Stamina</option>
                    </select>
                  </label>

                  <label className="combat-save-select">
                    <span>Threshold %</span>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      disabled={running || !slot.definitionId || !slot.autoUseResource}
                      value={slot.autoUseThresholdPercent ?? 50}
                      onChange={(event) => void updateConsumableSlot(slotIndex, { threshold: Number(event.target.value) })}
                    />
                  </label>

                  <button
                    className="ghost-button"
                    type="button"
                    disabled={running || !slot.definitionId || inventoryQuantity(selectedSave, slot.definitionId) <= 0}
                    onClick={() => startFight(slotIndex)}
                  >
                    Enfrentar Lobo usando este slot manualmente
                  </button>
                </article>
              )
            })}
          </div>
        </>
      ) : null}
    </section>
  )
}
