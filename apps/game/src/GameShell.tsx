import { useMemo, useState } from 'react'
import {
  INITIAL_CRAFTING_RECIPES,
  INITIAL_IDLE_ACTIVITIES,
  getCombatAbilityDefinition,
  getCombatConsumableDefinition,
  getEnemyDefinition,
  getEquipmentDefinition,
} from '@greywake/content'
import {
  derivePlayerCombatStats,
  getEquipmentPrimaryValue,
  type AttributeAllocation,
  type OfflineGameSave,
  type SkillId,
} from '@greywake/domain'
import CombatWorkbench from './CombatWorkbench'
import DungeonWorkbench from './DungeonWorkbench'
import MarketWorkbench from './MarketWorkbench'
import AttributePanel from './AttributePanel'
import BankPanel from './BankPanel'

type PrimaryDestination = 'character' | 'activities' | 'adventure' | 'city'
type CharacterTab = 'overview' | 'attributes' | 'equipment' | 'techniques' | 'inventory'
type AdventureView = 'overview' | 'service' | 'dungeon'
type CityView = 'overview' | 'tavern' | 'market' | 'smith' | 'bank' | 'reliquary'
type QuickPanel = 'journey' | 'inventory' | null

type GameShellProps = {
  save: OfflineGameSave
  message: string | null
  riskActive: boolean
  onRiskStateChange: (active: boolean) => void
  onSwitchSave: () => void
  onPersist: (save: OfflineGameSave, message?: string) => void | Promise<void>
  prepareRisk: () => Promise<OfflineGameSave>
  onStartActivity: (activityDefinitionId: string) => Promise<void>
  onStartRecipe: (recipeDefinitionId: string, targetEquipmentInstanceId?: string | null) => Promise<void>
  onStopWork: () => Promise<void>
  onEquip: (instanceId: string) => Promise<void>
  onAllocateAttributes: (allocation: AttributeAllocation) => Promise<void>
  onDepositBankStack: (definitionId: string, quantity: number) => Promise<void>
  onWithdrawBankStack: (definitionId: string, quantity: number) => Promise<void>
  onDepositBankEquipment: (instanceId: string) => Promise<void>
  onWithdrawBankEquipment: (instanceId: string) => Promise<void>
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

const gatheringSkills: SkillId[] = ['mining', 'woodcutting', 'fishing', 'herbology']
const productionSkills: SkillId[] = ['metallurgy', 'smithing', 'cooking']

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
  'item.garrison-supply-register': 'Registro de Suprimentos',
  'item.treaty-fragment': 'Fragmento do Tratado',
  'item.fairtheoir-fragment': 'Fragmento de Fairtheoir',
}

const combatCatalog = {
  getEquipmentDefinition,
  getAbilityDefinition: getCombatAbilityDefinition,
  getEnemyDefinition,
  getConsumableDefinition: getCombatConsumableDefinition,
}

function inventoryQuantity(save: OfflineGameSave, definitionId: string) {
  return save.character.inventory.find((stack) => stack.definitionId === definitionId)?.quantity ?? 0
}

function activeWork(save: OfflineGameSave) {
  if (save.idle.activeActivity) {
    const activity = INITIAL_IDLE_ACTIVITIES.find((candidate) => candidate.id === save.idle.activeActivity?.activityDefinitionId)
    return activity ? { title: `${skillLabels[activity.skillId]} · ${activity.resultName}`, detail: `${activity.actionSeconds}s por ciclo`, skillId: activity.skillId } : null
  }
  if (save.crafting.activeRecipe) {
    const recipe = INITIAL_CRAFTING_RECIPES.find((candidate) => candidate.id === save.crafting.activeRecipe?.recipeDefinitionId)
    return recipe ? { title: `${skillLabels[recipe.skillId]} · ${recipe.name}`, detail: `${recipe.actionSeconds}s por ciclo`, skillId: recipe.skillId } : null
  }
  return null
}

function journeyCopy(save: OfflineGameSave) {
  if (save.dungeon.activeRun) {
    return {
      title: 'Expedição em Dún Liath',
      body: 'A expedição está ativa. Sua atividade Idle permanece pausada até retornar a um contexto seguro.',
    }
  }
  if (save.dungeon.contractAccepted && !save.dungeon.contractCompleted) {
    return {
      title: 'Fortaleza Cinzenta',
      body: 'O contrato de Dún Liath está ativo. Você pode revisar sua preparação em Aventura antes de entrar.',
    }
  }
  if (save.combat.wolfDefeated) {
    return {
      title: 'Depois da Estrada Baixa',
      body: 'O Serviço foi concluído. Brann possui o caminho para o contrato da Fortaleza Cinzenta.',
    }
  }
  return {
    title: 'Estrada Baixa',
    body: 'Há relatos de hostilidade fora da Cidade. O Serviço em Aventura é o próximo teste conhecido de preparação.',
  }
}

export default function GameShell({
  save,
  message,
  riskActive,
  onRiskStateChange,
  onSwitchSave,
  onPersist,
  prepareRisk,
  onStartActivity,
  onStartRecipe,
  onStopWork,
  onEquip,
  onAllocateAttributes,
  onDepositBankStack,
  onWithdrawBankStack,
  onDepositBankEquipment,
  onWithdrawBankEquipment,
}: GameShellProps) {
  const [destination, setDestination] = useState<PrimaryDestination>(save.dungeon.activeRun ? 'adventure' : 'character')
  const [characterTab, setCharacterTab] = useState<CharacterTab>('overview')
  const [selectedSkill, setSelectedSkill] = useState<SkillId>('mining')
  const [adventureView, setAdventureView] = useState<AdventureView>(save.dungeon.activeRun ? 'dungeon' : 'overview')
  const [cityView, setCityView] = useState<CityView>('overview')
  const [quickPanel, setQuickPanel] = useState<QuickPanel>(null)
  const [preparationActive, setPreparationActive] = useState(false)

  const stats = useMemo(() => derivePlayerCombatStats(save, combatCatalog), [save])
  const work = activeWork(save)
  const journey = journeyCopy(save)
  const dungeonActive = Boolean(save.dungeon.activeRun)
  const focusedRisk = riskActive || dungeonActive

  function go(next: PrimaryDestination) {
    if (focusedRisk) return
    setDestination(next)
    setQuickPanel(null)
    if (next === 'adventure') setAdventureView('overview')
    if (next === 'city') setCityView('overview')
  }

  function openAdventure(view: AdventureView) {
    setDestination('adventure')
    setAdventureView(view)
    setQuickPanel(null)
  }

  function openFullInventory() {
    setDestination('character')
    setCharacterTab('inventory')
    setQuickPanel(null)
  }

  const mainClass = `game-shell ${focusedRisk ? 'game-shell--risk' : ''} ${preparationActive && !focusedRisk ? 'game-shell--preparation' : ''}`

  return (
    <div className={mainClass}>
      <header className="game-topbar">
        <div className="player-identity">
          <div className="avatar-placeholder" aria-hidden="true">{save.character.name.slice(0, 1).toUpperCase()}</div>
          <div>
            <strong className="player-name">{save.character.name}</strong>
            <span>Nível {save.character.level}</span>
          </div>
        </div>
        <div className="global-resources" aria-label="Estado global do personagem">
          <div><span className="resource-sigil health-sigil">V</span><small>Vida</small><strong>{stats.maxHealth}</strong></div>
          <div><span className="resource-sigil mana-sigil">M</span><small>Mana</small><strong>{stats.maxMana}</strong></div>
          <div><span className="resource-sigil stamina-sigil">S</span><small>Stamina</small><strong>{stats.maxStamina}</strong></div>
          <div><span className="resource-sigil coin-sigil">◇</span><small>Moeda</small><strong>{save.character.gold}</strong></div>
          <button className="icon-button" type="button" onClick={onSwitchSave} aria-label="Trocar save">⋯</button>
        </div>
      </header>

      <nav className="primary-nav" aria-label="Navegação principal">
        {([
          ['character', 'Personagem'],
          ['activities', 'Atividades'],
          ['adventure', 'Aventura'],
          ['city', 'Cidade'],
        ] as const).map(([id, label]) => (
          <button key={id} type="button" className={destination === id ? 'active' : ''} onClick={() => go(id)}>{label}</button>
        ))}
      </nav>

      {preparationActive && !focusedRisk ? <div className="preparation-state-strip"><span>PREPARAÇÃO</span><strong>Dún Liath · Idle continua</strong></div> : null}
      {focusedRisk ? <div className="risk-state-strip"><span>ESTADO DE RISCO</span><strong>{dungeonActive ? 'Dún Liath · Idle pausado' : 'Combate · Idle pausado'}</strong></div> : null}

      <main className="game-content">
        {message ? <p className="global-message" role="status">{message}</p> : null}

        {destination === 'character' ? (
          <CharacterView
            save={save}
            tab={characterTab}
            onTab={setCharacterTab}
            onEquip={onEquip}
            onStartRecipe={onStartRecipe}
            onAllocateAttributes={onAllocateAttributes}
          />
        ) : null}

        {destination === 'activities' ? (
          <ActivitiesView
            save={save}
            selectedSkill={selectedSkill}
            onSelectSkill={setSelectedSkill}
            onStartActivity={onStartActivity}
            onStartRecipe={onStartRecipe}
            onStopWork={onStopWork}
          />
        ) : null}

        {destination === 'adventure' ? (
          <AdventureViewComponent
            save={save}
            view={adventureView}
            onView={setAdventureView}
            prepareRisk={prepareRisk}
            onPersist={onPersist}
            onRiskStateChange={onRiskStateChange}
            onPreparationStateChange={setPreparationActive}
          />
        ) : null}

        {destination === 'city' ? (
          <CityViewComponent
            save={save}
            view={cityView}
            onView={setCityView}
            onOpenAdventure={() => openAdventure('dungeon')}
            onPersist={onPersist}
            onDepositBankStack={onDepositBankStack}
            onWithdrawBankStack={onWithdrawBankStack}
            onDepositBankEquipment={onDepositBankEquipment}
            onWithdrawBankEquipment={onWithdrawBankEquipment}
          />
        ) : null}
      </main>

      {!focusedRisk ? (
        <footer className="continuity-bar">
          <button
            className="current-work"
            type="button"
            onClick={() => {
              if (!work) return
              setDestination('activities')
              setSelectedSkill(work.skillId)
            }}
          >
            <span aria-hidden="true">⌁</span>
            <span><small>Atividade atual</small><strong>{work?.title ?? 'Nenhuma atividade'}</strong></span>
            <em>{work?.detail ?? 'Escolha uma atividade em Atividades'}</em>
          </button>
          <div className="continuity-actions">
            <button type="button" onClick={() => setQuickPanel('inventory')}>Inventário</button>
            <button type="button" onClick={() => setQuickPanel('journey')}>Jornada · {journey.title}</button>
          </div>
        </footer>
      ) : null}

      {quickPanel === 'inventory' && !focusedRisk ? (
        <aside className="side-sheet" aria-label="Inventário rápido">
          <button className="sheet-close" type="button" onClick={() => setQuickPanel(null)} aria-label="Fechar">×</button>
          <p className="section-kicker">Consulta rápida</p>
          <h2 className="display-title">Inventário</h2>
          <div className="sheet-list">
            {save.character.inventory.length === 0 ? <p className="muted">Ainda não há itens aqui.</p> : save.character.inventory.slice(0, 8).map((stack) => (
              <div className="sheet-row" key={stack.definitionId}><span>{itemLabels[stack.definitionId] ?? stack.definitionId}</span><strong>×{stack.quantity}</strong></div>
            ))}
          </div>
          <button className="ghost-button full-width" type="button" onClick={openFullInventory}>Abrir Inventário completo</button>
        </aside>
      ) : null}

      {quickPanel === 'journey' && !focusedRisk ? (
        <aside className="side-sheet" aria-label="Jornada">
          <button className="sheet-close" type="button" onClick={() => setQuickPanel(null)} aria-label="Fechar">×</button>
          <p className="section-kicker">Continuidade</p>
          <h2 className="display-title">Jornada</h2>
          <div className="journey-section"><span>AGORA</span><strong>{work?.title ?? 'Sem atividade Idle'}</strong></div>
          <div className="journey-section"><span>EM ANDAMENTO</span><strong>{journey.title}</strong><p>{journey.body}</p></div>
          <button className="ghost-button full-width" type="button" onClick={() => openAdventure(save.dungeon.activeRun ? 'dungeon' : 'overview')}>Ver em Aventura</button>
        </aside>
      ) : null}
    </div>
  )
}

function CharacterView({
  save,
  tab,
  onTab,
  onEquip,
  onStartRecipe,
  onAllocateAttributes,
}: {
  save: OfflineGameSave
  tab: CharacterTab
  onTab: (tab: CharacterTab) => void
  onEquip: (instanceId: string) => Promise<void>
  onStartRecipe: (recipeDefinitionId: string, targetEquipmentInstanceId?: string | null) => Promise<void>
  onAllocateAttributes: (allocation: AttributeAllocation) => Promise<void>
}) {
  const upgradeRecipe = INITIAL_CRAFTING_RECIPES.find((recipe) => recipe.output.kind === 'equipment-upgrade')

  return (
    <section className="feature-view">
      <div className="view-heading"><div><p className="section-kicker">Personagem</p><h1 className="display-title">{save.character.name}</h1><p className="muted">Visão geral do personagem e de sua preparação.</p></div></div>
      <div className="subnav" role="tablist" aria-label="Personagem">
        {([
          ['overview', 'Visão Geral'], ['attributes', 'Atributos'], ['equipment', 'Equipamento'], ['techniques', 'Técnicas'], ['inventory', 'Inventário'],
        ] as const).map(([id, label]) => <button key={id} type="button" className={tab === id ? 'active' : ''} onClick={() => onTab(id)}>{label}</button>)}
      </div>

      {tab === 'overview' ? (
        <div className="character-layout">
          <div className="portrait-placeholder" aria-hidden="true"><span>RETRATO 4:5</span></div>
          <div className="overview-stack">
            <article className="panel"><p className="section-kicker">Estado geral</p><h2>{save.character.name} · Nível {save.character.level}</h2><div className="facts-grid"><div><span>XP geral</span><strong>{save.character.xp}</strong></div><div><span>Pontos disponíveis</span><strong>{save.character.unspentAttributePoints}</strong></div><div><span>Equipamentos</span><strong>{save.character.equipmentItems.length}</strong></div><div><span>Técnicas conhecidas</span><strong>{save.character.knownAbilityIds.length}</strong></div></div></article>
            <article className="panel"><p className="section-kicker">Progressão</p><div className="skill-summary-grid">{Object.entries(save.skills).map(([skillId, progress]) => <div key={skillId}><span>{skillLabels[skillId as SkillId]}</span><strong>Nv. {progress.level}</strong></div>)}</div></article>
          </div>
        </div>
      ) : null}

      {tab === 'attributes' ? (
        <AttributePanel save={save} onAllocateAttributes={onAllocateAttributes} />
      ) : null}

      {tab === 'equipment' ? (
        <div className="equipment-grid-runtime">
          {save.character.equipmentItems.map((instance) => {
            const definition = getEquipmentDefinition(instance.definitionId)
            if (!definition) return null
            const equipped = Object.values(save.character.equipment).includes(instance.instanceId)
            const primary = getEquipmentPrimaryValue(definition, instance.upgradeLevel)
            return (
              <article className={`item-card ${equipped ? 'selected-card' : ''}`} key={instance.instanceId}>
                <div className="item-thumb" aria-hidden="true">{definition.name.slice(0, 1)}</div>
                <div className="item-card__body"><p className="section-kicker">{definition.slot}</p><h3>{definition.name} +{instance.upgradeLevel}</h3><p className="muted">{primary !== null ? `${definition.primaryStat?.kind === 'attack' ? 'Poder' : 'Defesa'} ${primary}` : 'Sem valor primário'}</p><div className="button-row"><button className="ghost-button" type="button" disabled={equipped} onClick={() => void onEquip(instance.instanceId)}>{equipped ? 'Equipado' : 'Equipar'}</button>{upgradeRecipe && instance.upgradeLevel === 0 && definition.primaryStat ? <button className="ghost-button" type="button" onClick={() => void onStartRecipe(upgradeRecipe.id, instance.instanceId)}>Reforçar +1</button> : null}</div></div>
              </article>
            )
          })}
        </div>
      ) : null}

      {tab === 'techniques' ? (
        <article className="panel dense-panel"><div className="panel-heading"><div><p className="section-kicker">Estilo</p><h2>{save.combat.preferences.style}</h2></div><span className="status-chip">ordem = prioridade real</span></div><div className="technique-list">{save.character.activeAbilitySlots.map((abilityId, index) => { const ability = abilityId ? getCombatAbilityDefinition(abilityId) : null; return <div className="technique-row" key={`${abilityId ?? 'empty'}-${index}`}><span className="priority-index">{index + 1}</span><div><strong>{ability?.name ?? 'Slot vazio'}</strong><small>{ability ? `CD ${ability.cooldownSeconds}s${ability.resourceCost !== undefined ? ` · custo ${ability.resourceCost} ${ability.resource ?? ''}` : ''}` : 'Nenhuma Técnica equipada'}</small></div></div>})}</div></article>
      ) : null}

      {tab === 'inventory' ? (
        <article className="panel dense-panel"><div className="panel-heading"><div><p className="section-kicker">Inventário</p><h2>Patrimônio seguro</h2></div><span className="status-chip">{save.character.inventory.length} pilha(s)</span></div><div className="inventory-grid-runtime">{save.character.inventory.length === 0 ? <p className="muted">Ainda não há itens aqui.</p> : save.character.inventory.map((stack) => <div className="inventory-tile" key={stack.definitionId}><div className="item-thumb" aria-hidden="true">{(itemLabels[stack.definitionId] ?? stack.definitionId).slice(0, 1)}</div><strong>{itemLabels[stack.definitionId] ?? stack.definitionId}</strong><span>×{stack.quantity}</span></div>)}</div></article>
      ) : null}
    </section>
  )
}

function ActivitiesView({
  save,
  selectedSkill,
  onSelectSkill,
  onStartActivity,
  onStartRecipe,
  onStopWork,
}: {
  save: OfflineGameSave
  selectedSkill: SkillId
  onSelectSkill: (skill: SkillId) => void
  onStartActivity: (id: string) => Promise<void>
  onStartRecipe: (id: string) => Promise<void>
  onStopWork: () => Promise<void>
}) {
  const progress = save.skills[selectedSkill]
  const activities = INITIAL_IDLE_ACTIVITIES.filter((activity) => activity.skillId === selectedSkill)
  const recipes = INITIAL_CRAFTING_RECIPES.filter((recipe) => recipe.skillId === selectedSkill && recipe.output.kind !== 'equipment-upgrade')
  const work = activeWork(save)
  const isGathering = gatheringSkills.includes(selectedSkill)

  return (
    <section className="feature-view">
      <div className="view-heading"><div><p className="section-kicker">Atividades</p><h1 className="display-title">{skillLabels[selectedSkill]}</h1><p className="muted">Uma atividade Idle por vez. Navegar por áreas seguras não a interrompe.</p></div>{work ? <button className="ghost-button" type="button" onClick={() => void onStopWork()}>Parar atividade</button> : null}</div>

      <div className="activity-current-card"><span className="section-kicker">Atividade atual</span><strong>{work?.title ?? 'Nenhuma atividade em andamento'}</strong><small>{work?.detail ?? 'Escolha uma coleta ou produção abaixo.'}</small></div>

      <h2 className="section-title-runtime">Coleta</h2>
      <div className="skill-card-grid">{gatheringSkills.map((skillId) => <button className={`skill-card ${selectedSkill === skillId ? 'active' : ''}`} type="button" key={skillId} onClick={() => onSelectSkill(skillId)}><span>{skillLabels[skillId]}</span><strong>Nv. {save.skills[skillId].level}</strong></button>)}</div>
      <h2 className="section-title-runtime">Produção</h2>
      <div className="skill-card-grid production-cards">{productionSkills.map((skillId) => <button className={`skill-card ${selectedSkill === skillId ? 'active' : ''}`} type="button" key={skillId} onClick={() => onSelectSkill(skillId)}><span>{skillLabels[skillId]}</span><strong>Nv. {save.skills[skillId].level}</strong></button>)}</div>

      <div className="skill-detail-layout section-gap">
        <div className="context-art" aria-hidden="true"><span>ARTE 16:9 · {skillLabels[selectedSkill].toUpperCase()}</span></div>
        <aside className="panel skill-progress-panel"><p className="section-kicker">Progresso da Skill</p><h2>{skillLabels[selectedSkill]}</h2><div className="fact-row"><span>Nível</span><strong>{progress.level}</strong></div><div className="fact-row"><span>XP atual</span><strong>{progress.xp}</strong></div><div className="fact-row"><span>Prestígio</span><strong>{progress.prestige}</strong></div></aside>
      </div>

      <div className="activity-options section-gap">
        {isGathering ? activities.map((activity) => {
          const active = save.idle.activeActivity?.activityDefinitionId === activity.id
          const unlocked = progress.level >= activity.requiredSkillLevel
          return <article className={`activity-option panel ${active ? 'selected-card' : ''}`} key={activity.id}><div className="item-thumb" aria-hidden="true">{activity.resultName.slice(0, 1)}</div><div><p className="section-kicker">Recurso</p><h3>{activity.resultName}</h3><div className="facts-grid compact-facts"><div><span>Tempo</span><strong>{activity.actionSeconds}s</strong></div><div><span>XP</span><strong>+{activity.skillXpPerAction}</strong></div><div><span>Possuído</span><strong>{inventoryQuantity(save, activity.resultItemDefinitionId)}</strong></div><div><span>Requisito</span><strong>Nv. {activity.requiredSkillLevel}</strong></div></div>{active ? <span className="status-chip">ATIVIDADE ATUAL</span> : <button className="primary-button compact" type="button" disabled={!unlocked} onClick={() => void onStartActivity(activity.id)}>Iniciar {activity.resultName}</button>}</div></article>
        }) : recipes.map((recipe) => {
          const active = save.crafting.activeRecipe?.recipeDefinitionId === recipe.id
          const enough = recipe.ingredients.every((ingredient) => inventoryQuantity(save, ingredient.definitionId) >= ingredient.quantity)
          return <article className={`activity-option panel ${active ? 'selected-card' : ''}`} key={recipe.id}><div className="item-thumb" aria-hidden="true">{recipe.name.slice(0, 1)}</div><div><p className="section-kicker">Receita</p><h3>{recipe.name}</h3><div className="ingredient-list">{recipe.ingredients.map((ingredient) => { const owned = inventoryQuantity(save, ingredient.definitionId); return <div key={ingredient.definitionId}><span>{itemLabels[ingredient.definitionId] ?? ingredient.definitionId}</span><strong>{owned} / {ingredient.quantity}</strong></div> })}</div><div className="facts-grid compact-facts"><div><span>Tempo</span><strong>{recipe.actionSeconds}s</strong></div><div><span>XP</span><strong>+{recipe.skillXpPerAction}</strong></div></div>{!enough ? <p className="fact-warning">Materiais insuficientes para iniciar.</p> : null}{active ? <span className="status-chip">ATIVIDADE ATUAL</span> : <button className="primary-button compact" type="button" disabled={!enough} onClick={() => void onStartRecipe(recipe.id)}>Iniciar produção</button>}</div></article>
        })}
        {activities.length === 0 && recipes.length === 0 ? <p className="muted">Nenhuma opção de conteúdo implementada para esta Skill nesta build.</p> : null}
      </div>
    </section>
  )
}

function AdventureViewComponent({
  save,
  view,
  onView,
  prepareRisk,
  onPersist,
  onRiskStateChange,
  onPreparationStateChange,
}: {
  save: OfflineGameSave
  view: AdventureView
  onView: (view: AdventureView) => void
  prepareRisk: () => Promise<OfflineGameSave>
  onPersist: (save: OfflineGameSave, message?: string) => void | Promise<void>
  onRiskStateChange: (active: boolean) => void
  onPreparationStateChange: (active: boolean) => void
}) {
  if (view === 'service') {
    return <CombatWorkbench save={save} prepareRisk={prepareRisk} onSaveChange={onPersist} onRiskStateChange={onRiskStateChange} onReturn={() => onView('overview')} />
  }
  if (view === 'dungeon') {
    return <DungeonWorkbench save={save} prepareRisk={prepareRisk} onSaveChange={onPersist} onRiskStateChange={onRiskStateChange} onPreparationStateChange={onPreparationStateChange} onReturn={() => onView('overview')} />
  }

  return (
    <section className="feature-view">
      <div className="view-heading"><div><p className="section-kicker">Aventura</p><h1 className="display-title">Além da segurança</h1><p className="muted">Serviços são encontros menores; Dungeons são expedições prolongadas com risco acumulado.</p></div></div>
      <div className="context-art context-art--adventure" aria-hidden="true"><span>ARTE 16:9 · AVENTURA</span></div>
      <div className="adventure-grid section-gap">
        <article className="adventure-card panel"><p className="section-kicker">Serviço</p><h2>Estrada Baixa</h2><p className="muted">Presença hostil confirmada. Encontro de curta duração.</p><div className="fact-row"><span>Estado</span><strong>{save.combat.wolfDefeated ? 'Concluído anteriormente' : 'Disponível'}</strong></div><button className="ghost-button" type="button" onClick={() => onView('service')}>Preparar serviço</button></article>
        <article className="adventure-card panel risk-panel"><p className="section-kicker">Dungeon</p><h2>Dún Liath</h2><p className="muted">Fortaleza Cinzenta · expedição prolongada · Bolsa de Expedição.</p><div className="fact-row"><span>Contrato</span><strong>{save.dungeon.contractAccepted || save.dungeon.contractCompleted ? 'Conhecido' : 'Ainda não aceito'}</strong></div><button className="primary-button compact" type="button" onClick={() => onView('dungeon')}>{save.dungeon.activeRun ? 'Retomar expedição' : 'Ver Dún Liath'}</button></article>
      </div>
    </section>
  )
}

function CityViewComponent({
  save,
  view,
  onView,
  onOpenAdventure,
  onPersist,
  onDepositBankStack,
  onWithdrawBankStack,
  onDepositBankEquipment,
  onWithdrawBankEquipment,
}: {
  save: OfflineGameSave
  view: CityView
  onView: (view: CityView) => void
  onOpenAdventure: () => void
  onPersist: (save: OfflineGameSave, message?: string) => void | Promise<void>
  onDepositBankStack: (definitionId: string, quantity: number) => Promise<void>
  onWithdrawBankStack: (definitionId: string, quantity: number) => Promise<void>
  onDepositBankEquipment: (instanceId: string) => Promise<void>
  onWithdrawBankEquipment: (instanceId: string) => Promise<void>
}) {
  if (view === 'market') return <MarketWorkbench save={save} onSaveChange={onPersist} />
  if (view === 'bank') {
    return (
      <BankPanel
        save={save}
        onDepositStack={onDepositBankStack}
        onWithdrawStack={onWithdrawBankStack}
        onDepositEquipment={onDepositBankEquipment}
        onWithdrawEquipment={onWithdrawBankEquipment}
        onBack={() => onView('overview')}
      />
    )
  }

  if (view === 'tavern') {
    return <section className="feature-view"><div className="view-heading"><div><p className="section-kicker">Cidade · Taverna</p><h1 className="display-title">Taverna</h1><p className="muted">Conversas e contratos.</p></div><button className="ghost-button" type="button" onClick={() => onView('overview')}>Voltar à Cidade</button></div><div className="city-context-layout"><div className="context-art context-art--city" aria-hidden="true"><span>ARTE 16:9 · TAVERNA</span></div><article className="panel npc-card"><div className="portrait-placeholder portrait-placeholder--npc" aria-hidden="true"><span>NPC 4:5</span></div><div><p className="section-kicker">Brann</p><h2>{save.combat.wolfDefeated ? 'A estrada confirmou os rumores.' : 'Há trabalho fora dos portões.'}</h2><p className="muted">{save.combat.wolfDefeated ? 'Dún Liath agora é um objetivo conhecido.' : 'Conclua o Serviço — Estrada Baixa para avançar o primeiro arco.'}</p>{save.combat.wolfDefeated ? <button className="primary-button compact" type="button" onClick={onOpenAdventure}>Ver contrato de Dún Liath</button> : null}</div></article></div></section>
  }

  if (view !== 'overview') {
    const copy: Record<Exclude<CityView, 'overview' | 'tavern' | 'market' | 'bank'>, { title: string; body: string }> = {
      smith: { title: 'Ferreiro', body: 'Serviços de NPC pertencem à Cidade. A Skill Forja continua em Atividades. Nenhum novo serviço do Ferreiro está implementado nesta build.' },
      reliquary: { title: 'Relicário', body: 'Relíquias descobertas serão apresentadas aqui. O sistema funcional de Relicário ainda não está implementado nesta build.' },
    }
    const current = copy[view]
    return <section className="feature-view"><div className="view-heading"><div><p className="section-kicker">Cidade</p><h1 className="display-title">{current.title}</h1><p className="muted">{current.body}</p></div><button className="ghost-button" type="button" onClick={() => onView('overview')}>Voltar à Cidade</button></div><div className="context-art context-art--city" aria-hidden="true"><span>ARTE 16:9 · {current.title.toUpperCase()}</span></div></section>
  }

  return (
    <section className="feature-view">
      <div className="view-heading"><div><p className="section-kicker">Cidade</p><h1 className="display-title">Cidade Livre</h1><p className="muted">Trégua, necessidade e comércio sustentam este território neutro.</p></div></div>
      <div className="context-art context-art--city" aria-hidden="true"><span>ARTE 16:9 · CIDADE LIVRE</span></div>
      <div className="city-place-grid section-gap">
        <button type="button" onClick={() => onView('tavern')}><strong>Taverna</strong><span>Contratos e conversas</span></button>
        <button type="button" onClick={() => onView('market')}><strong>Mercado</strong><span>Compra e venda</span></button>
        <button type="button" onClick={() => onView('smith')}><strong>Ferreiro</strong><span>Serviços de equipamento</span></button>
        <button type="button" onClick={() => onView('bank')}><strong>Banco</strong><span>Armazenamento seguro</span></button>
        <button type="button" onClick={() => onView('reliquary')}><strong>Relicário</strong><span>Relíquias e memória</span></button>
      </div>
    </section>
  )
}
