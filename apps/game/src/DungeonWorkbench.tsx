import { useEffect, useMemo, useState } from 'react'
import {
  DUN_LIATH_EASY,
  getCombatAbilityDefinition,
  getDungeonDefinition,
  getEnemyDefinition,
  getEquipmentDefinition,
} from '@greywake/content'
import {
  chooseDungeonPath,
  decideProtector,
  extractDungeonRun,
  resolveDungeonRoom,
  startDungeon,
  type CombatResult,
  type DungeonRoomDefinition,
  type OfflineGameSave,
} from '@greywake/domain'
import { createIndexedDbSaveRepository } from '@greywake/persistence'

const saveRepository = createIndexedDbSaveRepository()

const dungeonCatalog = {
  getEquipmentDefinition,
  getAbilityDefinition: getCombatAbilityDefinition,
  getEnemyDefinition,
  getDungeonDefinition,
}

const roomCopy: Record<string, string> = {
  'room.entrance': 'A fortaleza está silenciosa. O caminho para dentro ainda está aberto.',
  'room.courtyard': 'Duas rotas se separam entre alojamentos militares e a ala administrativa.',
  'room.barracks': 'Marcas recentes cruzam os antigos alojamentos da guarnição.',
  'room.administration': 'Papéis apodrecidos e selos humanos permanecem entre armários quebrados.',
  'room.treaty': 'Um fragmento antigo registra que humanos e monstros já negociaram formalmente.',
  'room.stores': 'O depósito foi esvaziado às pressas. Há sinais de ocupação recente.',
  'room.crubach': 'Um Crúbach bloqueia a galeria estreita.',
  'room.protector': 'Uma criatura ferida protege outra menor. Ela fala, entende você e teme o que fará em seguida.',
  'room.tromghiallach': 'A massa de Tromghiallach ocupa o salão como uma muralha viva.',
  'room.arsenal': 'O arsenal abandonado ainda guarda uma peça utilizável da antiga guarnição.',
  'room.register': 'O Registro de Suprimentos da Guarnição sobreviveu entre caixas partidas.',
  'room.passage': 'A arquitetura se estreita antes da passagem interna do bastião.',
  'room.cosantoir': 'Cosantóir guarda o acesso às câmaras finais.',
  'room.recovery': 'Uma capela silenciosa oferece a última oportunidade de se recompor ou retirar.',
  'room.boss-gate': 'Além da porta está o ser que manteve este lugar protegido.',
  'room.fairtheoir': 'Fairtheoir espera sem falar. O combate revelará duas fases do Último Vigia.',
}

function roomLabel(room: DungeonRoomDefinition) {
  const suffix = room.enemyDefinitionId ? ' · Combate' : room.kind === 'recovery' ? ' · Recuperação' : ''
  return `${room.name}${suffix}`
}

export default function DungeonWorkbench() {
  const [saves, setSaves] = useState<OfflineGameSave[]>([])
  const [selectedSaveId, setSelectedSaveId] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [combatResult, setCombatResult] = useState<CombatResult | null>(null)
  const [busy, setBusy] = useState(false)

  const selectedSave = useMemo(
    () => saves.find((save) => save.saveId === selectedSaveId) ?? null,
    [saves, selectedSaveId],
  )

  const run = selectedSave?.dungeon.activeRun ?? null
  const currentRoom = run
    ? DUN_LIATH_EASY.rooms.find((room) => room.id === run.currentRoomId) ?? null
    : null
  const roomResolved = Boolean(currentRoom && run?.resolvedRoomIds.includes(currentRoom.id))

  useEffect(() => {
    void saveRepository.list().then((stored) => {
      setSaves(stored)
      setSelectedSaveId((current) => current || stored[0]?.saveId || '')
    })
  }, [])

  async function persist(save: OfflineGameSave) {
    await saveRepository.put(save)
    setSaves((current) => current.map((item) => (item.saveId === save.saveId ? save : item)))
  }

  async function handleStart() {
    if (!selectedSave || busy) return
    if (!selectedSave.combat.wolfDefeated) {
      setMessage('Conclua primeiro o Serviço — Estrada Baixa e derrote o Lobo de Estrada.')
      return
    }

    setBusy(true)
    try {
      const seed = Date.now() >>> 0
      const save = startDungeon(selectedSave, DUN_LIATH_EASY, seed, new Date().toISOString())
      await persist(save)
      setCombatResult(null)
      setMessage(`Dún Liath iniciada · seed ${seed}. A rota e a Bolsa agora fazem parte do save.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível iniciar Dún Liath.')
    } finally {
      setBusy(false)
    }
  }

  async function handleResolve() {
    if (!selectedSave || !run || !currentRoom || busy) return
    setBusy(true)
    try {
      const result = resolveDungeonRoom(
        selectedSave,
        DUN_LIATH_EASY,
        dungeonCatalog,
        new Date().toISOString(),
      )
      await persist(result.save)
      setCombatResult(result.combatResult ?? null)
      if (!result.save.dungeon.activeRun) {
        setMessage('A expedição terminou em derrota. A Bolsa de Expedição foi perdida.')
      } else if (currentRoom.id === 'room.fairtheoir' && result.combatResult?.outcome === 'victory') {
        setMessage('Fairtheoir caiu. O Fragmento foi colocado na Bolsa; retorne à Cidade Livre para assegurar o clear.')
      } else if (result.combatResult) {
        setMessage(`${currentRoom.name} resolvida · ${result.combatResult.xpGranted} XP geral · desgaste persistido.`)
      } else {
        setMessage(`${currentRoom.name} resolvida.`)
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível resolver a sala.')
    } finally {
      setBusy(false)
    }
  }

  async function handlePath(nextRoomId: string) {
    if (!selectedSave || busy) return
    setBusy(true)
    try {
      const save = chooseDungeonPath(
        selectedSave,
        DUN_LIATH_EASY,
        nextRoomId,
        new Date().toISOString(),
      )
      await persist(save)
      setCombatResult(null)
      setMessage('O caminho foi escolhido. Não há retorno para a bifurcação anterior.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível seguir por esse caminho.')
    } finally {
      setBusy(false)
    }
  }

  async function handleProtector(decision: 'killed' | 'spared') {
    if (!selectedSave || busy) return
    setBusy(true)
    try {
      const save = decideProtector(selectedSave, decision, new Date().toISOString())
      await persist(save)
      setMessage(decision === 'spared' ? 'Você poupa o protetor. Não há recompensa imediata.' : 'Você mata o protetor. O indivíduo protegido foge.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível registrar essa decisão.')
    } finally {
      setBusy(false)
    }
  }

  async function handleExtract() {
    if (!selectedSave || busy) return
    setBusy(true)
    try {
      const wasComplete = Boolean(selectedSave.dungeon.activeRun?.completed)
      const save = extractDungeonRun(selectedSave, new Date().toISOString())
      await persist(save)
      setCombatResult(null)
      setMessage(
        wasComplete
          ? 'Primeiro clear assegurado. Loot transferido, contrato processado e Guarda Instintiva registrada quando aplicável.'
          : 'Retirada segura concluída. A Bolsa foi transferida, mas Fairtheoir permanece e o contrato continua aberto.',
      )
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível retirar da Dungeon.')
    } finally {
      setBusy(false)
    }
  }

  if (saves.length === 0) return null

  return (
    <section className="dungeon-workbench" aria-labelledby="dungeon-title">
      <div className="dungeon-workbench__header">
        <div>
          <p className="section-kicker">M5 · Dungeon</p>
          <h2 id="dungeon-title">Dún Liath — Fácil</h2>
          <p className="muted">Run persistível · rota irreversível · loot em risco · retirada pré-Boss</p>
        </div>

        <label className="combat-save-select">
          <span>Personagem</span>
          <select
            value={selectedSaveId}
            disabled={busy}
            onChange={(event) => {
              setSelectedSaveId(event.target.value)
              setMessage(null)
              setCombatResult(null)
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

      {message ? <p className="inline-message">{message}</p> : null}

      {!run && selectedSave ? (
        <div className="dungeon-start-card panel">
          <div>
            <p className="section-kicker">Contrato — Fortaleza Cinzenta</p>
            <h3>{selectedSave.dungeon.dunLiathEasyCleared ? 'Retornar a Dún Liath' : 'Iniciar primeira expedição'}</h3>
            <p className="muted">
              O contrato exige o Registro de Suprimentos, neutralizar a presença hostil e retornar. O primeiro clear concede Guarda Instintiva.
            </p>
          </div>
          <button className="primary-button compact" type="button" disabled={busy} onClick={() => void handleStart()}>
            Entrar em Dún Liath
          </button>
        </div>
      ) : null}

      {run && currentRoom ? (
        <div className="dungeon-grid">
          <article className="panel dungeon-route-panel">
            <p className="section-kicker">Expedição</p>
            <h3>{currentRoom.name}</h3>
            <p className="muted">{roomCopy[currentRoom.id]}</p>

            <div className="dungeon-resource-grid">
              <div><span>Vida</span><strong>{Math.round(run.resources.health)}/{run.resources.maxHealth}</strong></div>
              <div><span>Mana</span><strong>{Math.round(run.resources.mana)}/{run.resources.maxMana}</strong></div>
              <div><span>Stamina</span><strong>{Math.round(run.resources.stamina)}/{run.resources.maxStamina}</strong></div>
            </div>

            <div className="dungeon-room-meta">
              <span>{currentRoom.kind}</span>
              <span>{run.visitedRoomIds.length} sala(s) visitadas</span>
              <span>seed {run.seed}</span>
            </div>

            {currentRoom.id === 'room.protector' && !run.protectorDecision ? (
              <div className="protector-choice">
                <button className="ghost-button" type="button" disabled={busy} onClick={() => void handleProtector('killed')}>
                  Matar
                </button>
                <button className="ghost-button" type="button" disabled={busy} onClick={() => void handleProtector('spared')}>
                  Poupar
                </button>
              </div>
            ) : null}

            {!roomResolved ? (
              <button className="primary-button compact" type="button" disabled={busy || (currentRoom.id === 'room.protector' && !run.protectorDecision)} onClick={() => void handleResolve()}>
                {currentRoom.enemyDefinitionId ? 'Resolver combate' : 'Resolver sala'}
              </button>
            ) : null}

            {roomResolved && currentRoom.nextRoomIds.length > 0 ? (
              <div className="dungeon-paths">
                {currentRoom.nextRoomIds.map((roomId) => {
                  const room = DUN_LIATH_EASY.rooms.find((candidate) => candidate.id === roomId)
                  return room ? (
                    <button className="choice-card" type="button" key={roomId} disabled={busy} onClick={() => void handlePath(roomId)}>
                      <span className="choice-title">{roomLabel(room)}</span>
                      <span className="muted">Seguir adiante</span>
                    </button>
                  ) : null
                })}
              </div>
            ) : null}

            {(run.safeExtractionAvailable || run.completed) ? (
              <button className="ghost-button dungeon-extract" type="button" disabled={busy} onClick={() => void handleExtract()}>
                {run.completed ? 'Retornar à Cidade Livre e assegurar clear' : 'Retirar em segurança com a Bolsa'}
              </button>
            ) : null}
          </article>

          <aside className="panel dungeon-bag-panel">
            <p className="section-kicker">Bolsa de Expedição · em risco</p>
            <h3>Loot da run</h3>
            {run.expeditionBag.length === 0 && run.expeditionEquipment.length === 0 ? (
              <p className="muted">Nada assegurado nesta expedição ainda.</p>
            ) : null}
            {run.expeditionBag.map((stack) => (
              <div className="dungeon-loot-row" key={stack.definitionId}>
                <span>{stack.definitionId}</span><strong>×{stack.quantity}</strong>
              </div>
            ))}
            {run.expeditionEquipment.map((item, index) => (
              <div className="dungeon-loot-row" key={`${item.definitionId}-${index}`}>
                <span>{item.definitionId}</span><strong>{item.rarity} · {item.affixIds.length} afixo(s)</strong>
              </div>
            ))}

            <div className="milestone-note">
              <span>Estados críticos</span>
              <strong>
                Tratado {run.treatyFragmentRecovered ? '✓' : '—'} · Registro {run.supplyRegisterRecovered ? '✓' : '—'} · Protetor {run.protectorDecision ?? '—'}
              </strong>
            </div>
          </aside>
        </div>
      ) : null}

      {combatResult ? (
        <article className="panel dungeon-combat-result">
          <p className="section-kicker">Último encontro</p>
          <h3>{combatResult.outcome === 'victory' ? 'Vitória' : 'Expedição encerrada'}</h3>
          <p className="muted">{combatResult.durationSeconds.toFixed(1)}s · +{combatResult.xpGranted} XP geral · seed {combatResult.seed}</p>
          <div className="combat-log compact-log">
            {combatResult.log.slice(-8).map((entry, index) => (
              <div className={`combat-log__entry ${entry.kind}`} key={`${entry.atSeconds}-${index}`}>
                <time>{entry.atSeconds.toFixed(1)}s</time><span>{entry.message}</span>
              </div>
            ))}
          </div>
        </article>
      ) : null}
    </section>
  )
}
