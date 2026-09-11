import { useState } from 'react'
import {
  CHARACTER_PRESTIGE_MAX_LEVEL,
  CHARACTER_PRESTIGE_POINTS_PER_LEVEL,
  PRESTIGE_BRANCH_LABELS,
  PRESTIGE_HYBRID_LABELS,
  PRESTIGE_NODES,
  PRESTIGE_PURE_BRANCHES,
  getCharacterPrestigeReadiness,
  getPrestigeNodeAvailability,
  type OfflineGameSave,
  type PrestigeNodeDefinition,
  type PrestigePureBranch,
} from '@greywake/domain'

type PrestigePanelProps = {
  save: OfflineGameSave
  onPerformPrestige: () => Promise<void>
  onUnlockNode: (nodeId: string) => Promise<void>
}

const hybridPaths = ['body-arcane', 'body-spirit', 'technique-arcane', 'technique-spirit'] as const
const prestigeLevelLabels = ['I', 'II', 'III'] as const

export default function PrestigePanel({ save, onPerformPrestige, onUnlockNode }: PrestigePanelProps) {
  const [pendingNodeId, setPendingNodeId] = useState<string | null>(null)
  const [confirmingPrestige, setConfirmingPrestige] = useState(false)
  const [isPrestiging, setIsPrestiging] = useState(false)
  const readiness = getCharacterPrestigeReadiness(save)
  const prestige = save.character.prestige
  const earnedPoints = prestige.level * CHARACTER_PRESTIGE_POINTS_PER_LEVEL
  const spentPoints = Math.max(0, earnedPoints - prestige.points)
  const hasActiveWork = Boolean(save.idle.activeActivity || save.crafting.activeRecipe)
  const canPerformPrestige = readiness.ready && prestige.level < CHARACTER_PRESTIGE_MAX_LEVEL && !hasActiveWork
  const nextPrestigeLabel = prestigeLevelLabels[prestige.level] ?? '—'

  const gateTitle = !readiness.ready
    ? 'Árvore bloqueada'
    : prestige.level >= CHARACTER_PRESTIGE_MAX_LEVEL
      ? 'Prestígio completo'
      : prestige.level > 0
        ? 'Árvore ativa'
        : 'Prestígio I aguardando confirmação'
  const gateCopy = !readiness.ready
    ? 'O Prestígio do personagem só abre quando todas as Skills alcançam Prestígio I.'
    : prestige.level >= CHARACTER_PRESTIGE_MAX_LEVEL
      ? 'Os três ciclos do personagem foram realizados; os 15 pontos permanecem disponíveis para a build.'
      : hasActiveWork
        ? 'Interrompa a atividade Idle ou a produção antes de reiniciar a jornada do personagem.'
        : prestige.level > 0
          ? 'Nós disponíveis respeitam os caminhos e os custos definidos no GDD.'
          : 'Todas as Skills já estão prontas. Confirme o primeiro Prestígio para receber 5 pontos.'

  async function unlock(nodeId: string) {
    if (pendingNodeId) return
    setPendingNodeId(nodeId)
    try {
      await onUnlockNode(nodeId)
    } finally {
      setPendingNodeId(null)
    }
  }

  async function performPrestige() {
    if (!canPerformPrestige || isPrestiging) return
    setIsPrestiging(true)
    try {
      await onPerformPrestige()
      setConfirmingPrestige(false)
    } finally {
      setIsPrestiging(false)
    }
  }

  return (
    <section className="prestige-view" aria-labelledby="prestige-title">
      <div className="prestige-summary panel">
        <div>
          <p className="section-kicker">Progressão permanente</p>
          <h2 id="prestige-title">Árvore de Prestígio</h2>
          <p className="muted">Escolha uma expressão de build. Os pontos permanecem entre os ciclos do personagem.</p>
        </div>
        <div className="prestige-total" aria-label={`${prestige.points} pontos de Prestígio disponíveis de ${earnedPoints}`}>
          <strong>{prestige.points}</strong>
          <span>pontos disponíveis</span>
          <small>{spentPoints} gastos · {earnedPoints}/15 conquistados</small>
        </div>
      </div>

      <div className={`prestige-gate panel${readiness.ready && prestige.level > 0 ? ' prestige-gate--ready' : ''}`}>
        <div className="prestige-gate__main">
          <p className="section-kicker">Requisito da árvore</p>
          <h3>{gateTitle}</h3>
          <p className="muted">{gateCopy}</p>
        </div>
        <div className="prestige-gate__actions">
          <strong className="prestige-readiness">{readiness.readySkills}/{readiness.totalSkills} Skills em Prestígio I</strong>
          {readiness.ready && prestige.level < CHARACTER_PRESTIGE_MAX_LEVEL ? (
            <button
              className="primary-button compact"
              type="button"
              disabled={!canPerformPrestige || confirmingPrestige || isPrestiging}
              onClick={() => setConfirmingPrestige(true)}
            >
              Preparar Prestígio {nextPrestigeLabel}
            </button>
          ) : null}
        </div>
        {confirmingPrestige ? (
          <div className="prestige-confirmation" role="group" aria-labelledby="prestige-confirmation-title">
            <p id="prestige-confirmation-title"><strong>Reinício permanente da jornada.</strong> O nível e os atributos normais voltam ao início; Skills, equipamentos, inventário e nós já desbloqueados permanecem.</p>
            <div className="button-row">
              <button className="ghost-button compact" type="button" disabled={isPrestiging} onClick={() => setConfirmingPrestige(false)}>Cancelar</button>
              <button className="primary-button compact" type="button" disabled={!canPerformPrestige || isPrestiging} onClick={() => void performPrestige()}>{isPrestiging ? 'Aplicando…' : `Confirmar Prestígio ${nextPrestigeLabel}`}</button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="prestige-branch-grid">
        {PRESTIGE_PURE_BRANCHES.map((branch) => (
          <PrestigeBranch
            key={branch}
            branch={branch}
            save={save}
            pendingNodeId={pendingNodeId}
            onUnlock={unlock}
          />
        ))}
      </div>

      <article className="panel prestige-hybrid-panel">
        <div className="panel-heading">
          <div>
            <p className="section-kicker">Caminhos híbridos</p>
            <h3>Combinações</h3>
          </div>
          <span className="status-chip">8 nós · 4 caminhos</span>
        </div>
        <div className="prestige-hybrid-grid">
          {hybridPaths.map((path) => (
            <div className="prestige-hybrid-path" key={path}>
              <h4>{PRESTIGE_HYBRID_LABELS[path]}</h4>
              {PRESTIGE_NODES.filter((node) => node.hybridPath === path).map((node) => (
                <PrestigeNode
                  key={node.id}
                  node={node}
                  save={save}
                  pendingNodeId={pendingNodeId}
                  onUnlock={unlock}
                />
              ))}
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}

function PrestigeBranch({
  branch,
  save,
  pendingNodeId,
  onUnlock,
}: {
  branch: PrestigePureBranch
  save: OfflineGameSave
  pendingNodeId: string | null
  onUnlock: (nodeId: string) => Promise<void>
}) {
  const nodes = PRESTIGE_NODES.filter((node) => node.kind === 'pure' && node.group === branch)

  return (
    <article className={`panel prestige-branch prestige-branch--${branch}`}>
      <div className="prestige-branch-heading">
        <div>
          <p className="section-kicker">Ramo puro</p>
          <h3>{PRESTIGE_BRANCH_LABELS[branch]}</h3>
        </div>
        <span>{nodes.filter((node) => save.character.prestige.unlockedNodeIds.includes(node.id)).length}/6</span>
      </div>
      <div className="prestige-node-list">
        {nodes.map((node) => (
          <PrestigeNode
            key={node.id}
            node={node}
            save={save}
            pendingNodeId={pendingNodeId}
            onUnlock={onUnlock}
          />
        ))}
      </div>
    </article>
  )
}

function PrestigeNode({
  node,
  save,
  pendingNodeId,
  onUnlock,
}: {
  node: PrestigeNodeDefinition
  save: OfflineGameSave
  pendingNodeId: string | null
  onUnlock: (nodeId: string) => Promise<void>
}) {
  const availability = getPrestigeNodeAvailability(save, node.id)
  const pending = pendingNodeId === node.id
  const statusLabel = availability.status === 'unlocked'
    ? 'Desbloqueado'
    : availability.status === 'available'
      ? `Desbloquear · ${node.cost} pt`
      : availability.reason

  return (
    <button
      className={`prestige-node prestige-node--${availability.status}`}
      type="button"
      disabled={availability.status !== 'available' || Boolean(pendingNodeId)}
      aria-pressed={availability.status === 'unlocked'}
      aria-label={`${node.name}: ${node.description}. ${statusLabel}`}
      onClick={() => void onUnlock(node.id)}
    >
      <span className="prestige-node__tier">{node.tier}</span>
      <span className="prestige-node__copy">
        <strong>{node.name}</strong>
        <small>{node.description}</small>
      </span>
      <span className="prestige-node__meta">{pending ? 'Salvando…' : statusLabel}</span>
    </button>
  )
}
