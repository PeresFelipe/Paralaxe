import { useMemo, useState } from "react";
import {
  CHARACTER_CLASSES,
  INITIAL_CRAFTING_RECIPES,
  INITIAL_IDLE_ACTIVITIES,
  getCombatAbilityDefinition,
  getCombatConsumableDefinition,
  getEnemyDefinition,
  getEquipmentDefinition,
  getJourneyStory,
  getBrannDialogue,
} from "@greywake/content";
import {
  derivePlayerCombatStats,
  getEquipmentPrimaryValue,
  type AttributeAllocation,
  type OfflineGameSave,
  type SkillId,
} from "@greywake/domain";
import CombatWorkbench from "./CombatWorkbench";
import DungeonWorkbench from "./DungeonWorkbench";
import MarketWorkbench from "./MarketWorkbench";
import AttributePanel from "./AttributePanel";
import BankPanel from "./BankPanel";
import IdleProgressIndicator from "./IdleProgressIndicator";
import ActivitiesView from "./ActivitiesView";
import PrestigePanel from "./PrestigePanel";
import QuickSheet from "./QuickSheet";
import AssetCredits from "./AssetCredits";
import GameIcon from "./GameIcon";
import InventoryBoard from "./InventoryBoard";
import JourneyGoal, { JourneyGoalSummary } from "./JourneyGoal";
import { getEquipmentIcon, hudIconById, skillIconById } from "./assetIcons";
import { skillLabels } from "./gameLabels";

type PrimaryDestination = "character" | "activities" | "adventure" | "city";
type CharacterTab =
  | "overview"
  | "attributes"
  | "equipment"
  | "techniques"
  | "inventory"
  | "prestige";
type AdventureView = "overview" | "service" | "dungeon";
type CityView =
  | "overview"
  | "tavern"
  | "market"
  | "smith"
  | "bank"
  | "reliquary";
type QuickPanel = "journey" | "inventory" | null;

type GameShellProps = {
  save: OfflineGameSave;
  message: string | null;
  messageKind: "info" | "achievement";
  lastWorkResult: string | null;
  onDismissMessage: () => void;
  riskActive: boolean;
  onRiskStateChange: (active: boolean) => void;
  onSwitchSave: () => void;
  onPersist: (save: OfflineGameSave, message?: string) => void | Promise<void>;
  prepareRisk: () => Promise<OfflineGameSave>;
  onStartActivity: (activityDefinitionId: string) => Promise<void>;
  onStartRecipe: (
    recipeDefinitionId: string,
    targetEquipmentInstanceId?: string | null,
  ) => Promise<void>;
  onChooseJourneyGoal: (recipeId: string | null) => Promise<void>;
  onStopWork: () => Promise<void>;
  onEquip: (instanceId: string) => Promise<void>;
  onAllocateAttributes: (allocation: AttributeAllocation) => Promise<void>;
  onPerformCharacterPrestige: () => Promise<void>;
  onUnlockPrestigeNode: (nodeId: string) => Promise<void>;
  onDepositBankStack: (definitionId: string, quantity: number) => Promise<void>;
  onWithdrawBankStack: (
    definitionId: string,
    quantity: number,
  ) => Promise<void>;
  onDepositBankEquipment: (instanceId: string) => Promise<void>;
  onWithdrawBankEquipment: (instanceId: string) => Promise<void>;
};

const combatCatalog = {
  getEquipmentDefinition,
  getAbilityDefinition: getCombatAbilityDefinition,
  getEnemyDefinition,
  getConsumableDefinition: getCombatConsumableDefinition,
};

function activeWork(save: OfflineGameSave) {
  if (save.idle.activeActivity) {
    const activity = INITIAL_IDLE_ACTIVITIES.find(
      (candidate) =>
        candidate.id === save.idle.activeActivity?.activityDefinitionId,
    );
    return activity
      ? {
          title: `${skillLabels[activity.skillId]} · ${activity.resultName}`,
          detail: `${activity.actionSeconds}s por ciclo`,
          skillId: activity.skillId,
        }
      : null;
  }
  if (save.crafting.activeRecipe) {
    const recipe = INITIAL_CRAFTING_RECIPES.find(
      (candidate) =>
        candidate.id === save.crafting.activeRecipe?.recipeDefinitionId,
    );
    return recipe
      ? {
          title: `${skillLabels[recipe.skillId]} · ${recipe.name}`,
          detail: `${recipe.actionSeconds}s por ciclo`,
          skillId: recipe.skillId,
        }
      : null;
  }
  return null;
}

export default function GameShell({
  save,
  message,
  messageKind,
  lastWorkResult,
  onDismissMessage,
  riskActive,
  onRiskStateChange,
  onSwitchSave,
  onPersist,
  prepareRisk,
  onStartActivity,
  onStartRecipe,
  onChooseJourneyGoal,
  onStopWork,
  onEquip,
  onAllocateAttributes,
  onPerformCharacterPrestige,
  onUnlockPrestigeNode,
  onDepositBankStack,
  onWithdrawBankStack,
  onDepositBankEquipment,
  onWithdrawBankEquipment,
}: GameShellProps) {
  const [destination, setDestination] = useState<PrimaryDestination>(
    save.dungeon.activeRun ? "adventure" : "character",
  );
  const [characterTab, setCharacterTab] = useState<CharacterTab>("overview");
  const [selectedSkill, setSelectedSkill] = useState<SkillId>("mining");
  const [adventureView, setAdventureView] = useState<AdventureView>(
    save.dungeon.activeRun ? "dungeon" : "overview",
  );
  const [cityView, setCityView] = useState<CityView>("overview");
  const [quickPanel, setQuickPanel] = useState<QuickPanel>(null);
  const [preparationActive, setPreparationActive] = useState(false);

  const stats = useMemo(
    () => derivePlayerCombatStats(save, combatCatalog),
    [save],
  );
  const className = CHARACTER_CLASSES.find(
    (item) => item.id === save.character.classId,
  )?.name;
  const work = activeWork(save);
  const journey = getJourneyStory(save);
  const dungeonActive = Boolean(save.dungeon.activeRun);
  const focusedRisk = riskActive || dungeonActive;

  function go(next: PrimaryDestination) {
    if (focusedRisk) return;
    setDestination(next);
    setQuickPanel(null);
    if (next === "adventure") setAdventureView("overview");
    if (next === "city") setCityView("overview");
  }

  function openAdventure(view: AdventureView) {
    setDestination("adventure");
    setAdventureView(view);
    setQuickPanel(null);
  }

  function openFullInventory() {
    setDestination("character");
    setCharacterTab("inventory");
    setQuickPanel(null);
  }

  function openSkill(skill: SkillId) {
    if (focusedRisk) return;
    setSelectedSkill(skill);
    go("activities");
  }

  function openEquipment() {
    if (focusedRisk) return;
    setCharacterTab("equipment");
    go("character");
  }

  function openTavern() {
    if (focusedRisk) return;
    go("city");
    setCityView("tavern");
  }

  const mainClass = `game-shell ${focusedRisk ? "game-shell--risk" : ""} ${preparationActive && !focusedRisk ? "game-shell--preparation" : ""}`;

  return (
    <div className={mainClass} data-destination={destination}>
      <a className="skip-link" href="#game-content">
        Ir para o jogo
      </a>
      <header className="game-topbar">
        <div className="player-identity">
          <div className="avatar-placeholder" aria-hidden="true">
            <GameIcon icon="helmet-barbute" size={32} />
          </div>
          <div>
            <strong className="player-name">{save.character.name}</strong>
            <span>
              {className} · Nível {save.character.level}
            </span>
          </div>
        </div>
        <div
          className="global-resources"
          aria-label="Estado global do personagem"
        >
          <div>
            <span className="resource-sigil health-sigil">
              <GameIcon icon={hudIconById.maxHealth} size={19} />
            </span>
            <small>Vida máx.</small>
            <strong>{stats.maxHealth}</strong>
          </div>
          <div>
            <span className="resource-sigil mana-sigil">
              <GameIcon icon={hudIconById.maxMana} size={19} />
            </span>
            <small>Mana máx.</small>
            <strong>{stats.maxMana}</strong>
          </div>
          <div>
            <span className="resource-sigil stamina-sigil">
              <GameIcon icon={hudIconById.maxStamina} size={19} />
            </span>
            <small>Stamina máx.</small>
            <strong>{stats.maxStamina}</strong>
          </div>
          <div>
            <span className="resource-sigil coin-sigil">
              <GameIcon icon={hudIconById.gold} size={19} />
            </span>
            <small>Moeda</small>
            <strong>{save.character.gold}</strong>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={onSwitchSave}
            disabled={focusedRisk}
            aria-label="Trocar personagem"
            title="Trocar personagem"
          >
            ⋯
          </button>
        </div>
      </header>

      <aside className="game-sidebar" aria-label="Menu do jogo">
        <div className="game-brand">
          <span className="brand-sigil" aria-hidden="true">
            <GameIcon icon="sword-long" size={48} />
          </span>
          <strong>GREYWAKE</strong>
          <small>CRÔNICAS DA CIDADE LIVRE</small>
          <span className="brand-flourish" aria-hidden="true" />
        </div>
        <nav className="primary-nav" aria-label="Navegação principal">
          {(
            [
              ["character", "Personagem", "helmet-barbute", "Seu legado"],
              ["activities", "Atividades", "pickaxe", "Ofícios e recursos"],
              ["adventure", "Aventura", "sword-long", "Além dos portões"],
              ["city", "Cidade", "book-open", "Abrigo e comércio"],
            ] as const
          ).map(([id, label, icon, detail]) => (
            <button
              key={id}
              type="button"
              className={destination === id ? "active" : ""}
              disabled={focusedRisk}
              aria-current={destination === id ? "page" : undefined}
              onClick={() => go(id)}
            >
              <GameIcon icon={icon} size={32} />
              <span>
                {label}
                <small>{detail}</small>
              </span>
            </button>
          ))}
        </nav>
        <div
          className={`realm-status ${focusedRisk ? "realm-status--risk" : ""}`}
        >
          <span className="realm-light" aria-hidden="true" />
          <strong>{focusedRisk ? "Em expedição" : "Cidade Livre"}</strong>
          <small>
            {focusedRisk ? "Atividade externa pausada" : "Território seguro"}
          </small>
        </div>
        <div className="sidebar-footnote">
          O mundo espera.
          <br />
          Seu legado permanece.
        </div>
      </aside>

      {preparationActive && !focusedRisk ? (
        <div className="preparation-state-strip">
          <span>PREPARAÇÃO</span>
          <strong>Dún Liath · Idle continua</strong>
        </div>
      ) : null}
      {focusedRisk ? (
        <div className="risk-state-strip">
          <span>ESTADO DE RISCO</span>
          <strong>
            {dungeonActive
              ? "Dún Liath · Idle pausado"
              : "Combate · Idle pausado"}
          </strong>
        </div>
      ) : null}

      <div className="game-layout">
        <main className="game-content" id="game-content" tabIndex={-1}>
          {!focusedRisk ? (
            <JourneyGoalSummary
              save={save}
              onOpen={() => setQuickPanel("journey")}
            />
          ) : null}

          {destination === "character" ? (
            <CharacterView
              save={save}
              tab={characterTab}
              onTab={setCharacterTab}
              onEquip={onEquip}
              onStartRecipe={onStartRecipe}
              onAllocateAttributes={onAllocateAttributes}
              onPerformCharacterPrestige={onPerformCharacterPrestige}
              onUnlockPrestigeNode={onUnlockPrestigeNode}
            />
          ) : null}

          {destination === "activities" ? (
            <ActivitiesView
              save={save}
              lastWorkResult={lastWorkResult}
              selectedSkill={selectedSkill}
              onSelectSkill={setSelectedSkill}
              onStartActivity={onStartActivity}
              onStartRecipe={onStartRecipe}
              onStopWork={onStopWork}
              onTrackRecipe={async (recipeId) => {
                if (save.journey.goal?.recipeDefinitionId !== recipeId)
                  await onChooseJourneyGoal(recipeId);
                setQuickPanel("journey");
              }}
            />
          ) : null}

          {destination === "adventure" ? (
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

          {destination === "city" ? (
            <CityViewComponent
              save={save}
              view={cityView}
              onView={setCityView}
              onOpenAdventure={() => openAdventure("dungeon")}
              onPersist={onPersist}
              onDepositBankStack={onDepositBankStack}
              onWithdrawBankStack={onWithdrawBankStack}
              onDepositBankEquipment={onDepositBankEquipment}
              onWithdrawBankEquipment={onWithdrawBankEquipment}
            />
          ) : null}
          <div className="mobile-credits">
            <AssetCredits />
          </div>
        </main>
        <aside className="game-companion" aria-label="Resumo da jornada">
          <section className="companion-section">
            <div className="companion-heading">
              <GameIcon icon="book-open" size={24} />
              <h2>Jornada</h2>
            </div>
            <p className="section-kicker">{journey.label}</p>
            <h3>{journey.title}</h3>
            <p className="companion-copy">{journey.body}</p>
            <button
              className="ghost-button full-width"
              type="button"
              disabled={focusedRisk}
              onClick={() => setQuickPanel("journey")}
            >
              Consultar jornada
            </button>
          </section>
          <section className="companion-section">
            <InventoryBoard save={save} compact />
            <button
              className="ghost-button full-width"
              type="button"
              disabled={focusedRisk}
              onClick={openFullInventory}
            >
              Abrir bolsa
            </button>
          </section>
          <AssetCredits />
        </aside>
      </div>

      <footer className="continuity-bar">
        <button
          disabled={focusedRisk}
          className="current-work"
          type="button"
          onClick={() => {
            setDestination("activities");
            setQuickPanel(null);
            if (work) setSelectedSkill(work.skillId);
          }}
        >
          <span aria-hidden="true">
            <GameIcon
              icon={work ? skillIconById[work.skillId] : "pickaxe"}
              size={32}
            />
          </span>
          <IdleProgressIndicator save={save} compact paused={focusedRisk} />
        </button>
        <div className="continuity-actions">
          <button
            type="button"
            disabled={focusedRisk}
            aria-haspopup="dialog"
            onClick={() => setQuickPanel("inventory")}
          >
            <GameIcon icon="armor-layered" size={24} />
            <span>Inventário</span>
          </button>
          <button
            type="button"
            disabled={focusedRisk}
            aria-haspopup="dialog"
            onClick={() => setQuickPanel("journey")}
          >
            <GameIcon icon="book-open" size={24} />
            <span>Jornada</span>
          </button>
        </div>
      </footer>

      {message ? (
        <div
          className={`game-notice ${messageKind === "achievement" ? "game-notice--achievement" : ""}`}
        >
          {messageKind === "achievement" ? (
            <GameIcon icon="blacksmith" size={32} />
          ) : null}
          <p role="status">{message}</p>
          <button
            type="button"
            onClick={onDismissMessage}
            aria-label="Dispensar mensagem"
          >
            ×
          </button>
        </div>
      ) : null}

      {quickPanel === "inventory" && !focusedRisk ? (
        <QuickSheet
          label="Inventário rápido"
          onClose={() => setQuickPanel(null)}
        >
          <button
            className="sheet-close"
            type="button"
            onClick={() => setQuickPanel(null)}
            aria-label="Fechar"
          >
            ×
          </button>
          <p className="section-kicker">Consulta rápida</p>
          <h2 className="display-title">Inventário</h2>
          <InventoryBoard save={save} compact onEquip={onEquip} />
          <button
            className="ghost-button full-width"
            type="button"
            onClick={openFullInventory}
          >
            Abrir Inventário completo
          </button>
        </QuickSheet>
      ) : null}

      {quickPanel === "journey" && !focusedRisk ? (
        <QuickSheet label="Jornada" onClose={() => setQuickPanel(null)}>
          <button
            className="sheet-close"
            type="button"
            onClick={() => setQuickPanel(null)}
            aria-label="Fechar"
          >
            ×
          </button>
          <p className="section-kicker">Continuidade</p>
          <h2 className="display-title">Jornada</h2>
          <JourneyGoal
            save={save}
            onChooseGoal={onChooseJourneyGoal}
            onOpenSkill={openSkill}
            onOpenEquipment={openEquipment}
          />
          <div className="journey-section">
            <span>AGORA</span>
            <strong>{work?.title ?? "Sem atividade Idle"}</strong>
          </div>
          <div className="journey-section">
            <span>{journey.label}</span>
            <strong>{journey.title}</strong>
            <p>{journey.body}</p>
          </div>
          {save.combat.wolfDefeated || save.dungeon.contractCompleted ? (
            <button
              className="ghost-button full-width"
              type="button"
              onClick={openTavern}
            >
              Conversar com Brann
            </button>
          ) : null}
          <button
            className="ghost-button full-width"
            type="button"
            onClick={() =>
              openAdventure(save.dungeon.activeRun ? "dungeon" : "overview")
            }
          >
            Ver em Aventura
          </button>
        </QuickSheet>
      ) : null}
    </div>
  );
}

function CharacterView({
  save,
  tab,
  onTab,
  onEquip,
  onStartRecipe,
  onAllocateAttributes,
  onPerformCharacterPrestige,
  onUnlockPrestigeNode,
}: {
  save: OfflineGameSave;
  tab: CharacterTab;
  onTab: (tab: CharacterTab) => void;
  onEquip: (instanceId: string) => Promise<void>;
  onStartRecipe: (
    recipeDefinitionId: string,
    targetEquipmentInstanceId?: string | null,
  ) => Promise<void>;
  onAllocateAttributes: (allocation: AttributeAllocation) => Promise<void>;
  onPerformCharacterPrestige: () => Promise<void>;
  onUnlockPrestigeNode: (nodeId: string) => Promise<void>;
}) {
  const upgradeRecipe = INITIAL_CRAFTING_RECIPES.find(
    (recipe) => recipe.output.kind === "equipment-upgrade",
  );

  return (
    <section className="feature-view">
      <div className="view-heading">
        <div>
          <p className="section-kicker">Personagem</p>
          <h1 className="display-title">{save.character.name}</h1>
          <p className="muted">Toda jornada deixa suas marcas.</p>
        </div>
      </div>
      <div className="subnav" aria-label="Personagem">
        {(
          [
            ["overview", "Visão Geral"],
            ["attributes", "Atributos"],
            ["equipment", "Equipamento"],
            ["techniques", "Técnicas"],
            ["inventory", "Inventário"],
            ["prestige", "Prestígio"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={tab === id ? "active" : ""}
            aria-pressed={tab === id}
            onClick={() => onTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <div className="character-layout">
          <div className="character-effigy">
            <div className="portrait-placeholder" aria-hidden="true" />
            <p className="effigy-label">EQUIPAMENTO EM USO</p>
            <div className="equipped-rack">
              {save.character.equipmentItems
                .filter((item) =>
                  Object.values(save.character.equipment).includes(
                    item.instanceId,
                  ),
                )
                .map((item) => (
                  <button
                    type="button"
                    className="equipped-slot"
                    key={item.instanceId}
                    title={getEquipmentDefinition(item.definitionId)?.name}
                    aria-label={`Ver ${getEquipmentDefinition(item.definitionId)?.name ?? "equipamento"}`}
                    onClick={() => onTab("equipment")}
                  >
                    <GameIcon
                      icon={getEquipmentIcon(item.definitionId)}
                      size={32}
                    />
                  </button>
                ))}
            </div>
          </div>
          <div className="overview-stack">
            <article className="panel">
              <p className="section-kicker">Seu legado</p>
              <h2>
                {save.character.name} · Nível {save.character.level}
              </h2>
              <div className="facts-grid">
                <div>
                  <span>XP geral</span>
                  <strong>{save.character.xp}</strong>
                </div>
                <div>
                  <span>Pontos disponíveis</span>
                  <strong>{save.character.unspentAttributePoints}</strong>
                </div>
                <div>
                  <span>Equipamentos</span>
                  <strong>{save.character.equipmentItems.length}</strong>
                </div>
                <div>
                  <span>Técnicas conhecidas</span>
                  <strong>{save.character.knownAbilityIds.length}</strong>
                </div>
              </div>
            </article>
            <article className="panel">
              <p className="section-kicker">Domínio dos ofícios</p>
              <div className="skill-summary-grid">
                {Object.entries(save.skills).map(([skillId, progress]) => (
                  <div key={skillId}>
                    <span className="skill-summary-label">
                      <GameIcon
                        icon={skillIconById[skillId as SkillId]}
                        size={22}
                      />
                      <span>{skillLabels[skillId as SkillId]}</span>
                    </span>
                    <strong>Nv. {progress.level}</strong>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      ) : null}

      {tab === "attributes" ? (
        <AttributePanel
          save={save}
          onAllocateAttributes={onAllocateAttributes}
        />
      ) : null}

      {tab === "equipment" ? (
        <div className="equipment-grid-runtime">
          {save.character.equipmentItems.map((instance) => {
            const definition = getEquipmentDefinition(instance.definitionId);
            if (!definition) return null;
            const equipped = Object.values(save.character.equipment).includes(
              instance.instanceId,
            );
            const primary = getEquipmentPrimaryValue(
              definition,
              instance.upgradeLevel,
            );
            return (
              <article
                className={`item-card ${equipped ? "selected-card" : ""}`}
                key={instance.instanceId}
              >
                <div className="item-thumb" aria-hidden="true">
                  <GameIcon
                    icon={getEquipmentIcon(instance.definitionId)}
                    size={64}
                  />
                </div>
                <div className="item-card__body">
                  <p className="section-kicker">{definition.slot}</p>
                  <h3>
                    {definition.name} +{instance.upgradeLevel}
                  </h3>
                  <p className="muted">
                    {primary !== null
                      ? `${definition.primaryStat?.kind === "attack" ? "Poder" : "Defesa"} ${primary}`
                      : "Sem valor primário"}
                  </p>
                  <div className="button-row">
                    <button
                      className="ghost-button"
                      type="button"
                      disabled={equipped}
                      onClick={() => void onEquip(instance.instanceId)}
                    >
                      {equipped ? "Equipado" : "Equipar"}
                    </button>
                    {upgradeRecipe &&
                    instance.upgradeLevel === 0 &&
                    definition.primaryStat ? (
                      <button
                        className="ghost-button"
                        type="button"
                        onClick={() =>
                          void onStartRecipe(
                            upgradeRecipe.id,
                            instance.instanceId,
                          )
                        }
                      >
                        Reforçar +1
                      </button>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      {tab === "techniques" ? (
        <article className="panel dense-panel">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">Estilo</p>
              <h2>{save.combat.preferences.style}</h2>
            </div>
            <span className="status-chip">ordem = prioridade real</span>
          </div>
          <div className="technique-list">
            {save.character.activeAbilitySlots.map((abilityId, index) => {
              const ability = abilityId
                ? getCombatAbilityDefinition(abilityId)
                : null;
              return (
                <div
                  className="technique-row"
                  key={`${abilityId ?? "empty"}-${index}`}
                >
                  <span className="priority-index">{index + 1}</span>
                  <div>
                    <strong>{ability?.name ?? "Slot vazio"}</strong>
                    <small>
                      {ability
                        ? `CD ${ability.cooldownSeconds}s${ability.resourceCost !== undefined ? ` · custo ${ability.resourceCost} ${ability.resource ?? ""}` : ""}`
                        : "Nenhuma Técnica equipada"}
                    </small>
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      ) : null}

      {tab === "inventory" ? (
        <article className="panel inventory-panel">
          <InventoryBoard save={save} onEquip={onEquip} />
        </article>
      ) : null}

      {tab === "prestige" ? (
        <PrestigePanel
          save={save}
          onPerformPrestige={onPerformCharacterPrestige}
          onUnlockNode={onUnlockPrestigeNode}
        />
      ) : null}
    </section>
  );
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
  save: OfflineGameSave;
  view: AdventureView;
  onView: (view: AdventureView) => void;
  prepareRisk: () => Promise<OfflineGameSave>;
  onPersist: (save: OfflineGameSave, message?: string) => void | Promise<void>;
  onRiskStateChange: (active: boolean) => void;
  onPreparationStateChange: (active: boolean) => void;
}) {
  if (view === "service") {
    return (
      <CombatWorkbench
        save={save}
        prepareRisk={prepareRisk}
        onSaveChange={onPersist}
        onRiskStateChange={onRiskStateChange}
        onReturn={() => onView("overview")}
      />
    );
  }
  if (view === "dungeon") {
    return (
      <DungeonWorkbench
        save={save}
        prepareRisk={prepareRisk}
        onSaveChange={onPersist}
        onRiskStateChange={onRiskStateChange}
        onPreparationStateChange={onPreparationStateChange}
        onReturn={() => onView("overview")}
      />
    );
  }

  return (
    <section className="feature-view">
      <div className="view-heading">
        <div>
          <p className="section-kicker">Aventura</p>
          <h1 className="display-title">Além da segurança</h1>
          <p className="muted">
            Serviços são encontros menores; Dungeons são expedições prolongadas
            com risco acumulado.
          </p>
        </div>
      </div>
      <div className="adventure-overview-layout section-gap">
        <div className="context-art context-art--adventure" aria-hidden="true">
          <span>ARTE 16:9 · AVENTURA</span>
        </div>
        <div className="adventure-grid">
          <article className="adventure-card panel">
            <p className="section-kicker">Serviço</p>
            <h2>Estrada Baixa</h2>
            <p className="muted">
              Presença hostil confirmada. Encontro de curta duração.
            </p>
            <div className="fact-row">
              <span>Estado</span>
              <strong>
                {save.combat.wolfDefeated
                  ? "Concluído anteriormente"
                  : "Disponível"}
              </strong>
            </div>
            <button
              className="ghost-button"
              type="button"
              onClick={() => onView("service")}
            >
              Preparar serviço
            </button>
          </article>
          <article className="adventure-card panel risk-panel">
            <p className="section-kicker">Dungeon</p>
            <h2>Dún Liath</h2>
            <p className="muted">
              Fortaleza Cinzenta · expedição prolongada · Bolsa de Expedição.
            </p>
            <div className="fact-row">
              <span>Contrato</span>
              <strong>
                {save.dungeon.contractAccepted || save.dungeon.contractCompleted
                  ? "Conhecido"
                  : "Ainda não aceito"}
              </strong>
            </div>
            <button
              className="primary-button compact"
              type="button"
              onClick={() => onView("dungeon")}
            >
              {save.dungeon.activeRun ? "Retomar expedição" : "Ver Dún Liath"}
            </button>
          </article>
        </div>
      </div>
    </section>
  );
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
  save: OfflineGameSave;
  view: CityView;
  onView: (view: CityView) => void;
  onOpenAdventure: () => void;
  onPersist: (save: OfflineGameSave, message?: string) => void | Promise<void>;
  onDepositBankStack: (definitionId: string, quantity: number) => Promise<void>;
  onWithdrawBankStack: (
    definitionId: string,
    quantity: number,
  ) => Promise<void>;
  onDepositBankEquipment: (instanceId: string) => Promise<void>;
  onWithdrawBankEquipment: (instanceId: string) => Promise<void>;
}) {
  if (view === "market")
    return <MarketWorkbench save={save} onSaveChange={onPersist} />;
  if (view === "bank") {
    return (
      <BankPanel
        save={save}
        onDepositStack={onDepositBankStack}
        onWithdrawStack={onWithdrawBankStack}
        onDepositEquipment={onDepositBankEquipment}
        onWithdrawEquipment={onWithdrawBankEquipment}
        onBack={() => onView("overview")}
      />
    );
  }

  if (view === "tavern") {
    const dialogue = getBrannDialogue(save);
    return (
      <section className="feature-view">
        <div className="view-heading">
          <div>
            <p className="section-kicker">Cidade · Taverna</p>
            <h1 className="display-title">Taverna</h1>
            <p className="muted">Conversas e contratos.</p>
          </div>
          <button
            className="ghost-button"
            type="button"
            onClick={() => onView("overview")}
          >
            Voltar à Cidade
          </button>
        </div>
        <div className="city-context-layout">
          <div className="context-art context-art--city" aria-hidden="true">
            <span>ARTE 16:9 · TAVERNA</span>
          </div>
          <article className="panel npc-card">
            <div
              className="portrait-placeholder portrait-placeholder--npc"
              aria-hidden="true"
            >
              <span>NPC 4:5</span>
            </div>
            <div>
              <p className="section-kicker">
                Brann
                {save.dungeon.contractCompleted ? " · Contrato concluído" : ""}
              </p>
              <h2>{dialogue.title}</h2>
              <p className="muted">{dialogue.body}</p>
              {dialogue.memory ? (
                <blockquote className="brann-memory">
                  {dialogue.memory}
                </blockquote>
              ) : null}
              {dialogue.action ? (
                <button
                  className="primary-button compact"
                  type="button"
                  onClick={onOpenAdventure}
                >
                  {dialogue.action}
                </button>
              ) : null}
            </div>
          </article>
        </div>
      </section>
    );
  }

  if (view !== "overview") {
    const copy: Record<
      Exclude<CityView, "overview" | "tavern" | "market" | "bank">,
      { title: string; body: string }
    > = {
      smith: {
        title: "Ferreiro",
        body: "Serviços de NPC pertencem à Cidade. A Skill Forja continua em Atividades. Nenhum novo serviço do Ferreiro está implementado nesta build.",
      },
      reliquary: {
        title: "Relicário",
        body: "Relíquias descobertas serão apresentadas aqui. O sistema funcional de Relicário ainda não está implementado nesta build.",
      },
    };
    const current = copy[view];
    return (
      <section className="feature-view">
        <div className="view-heading">
          <div>
            <p className="section-kicker">Cidade</p>
            <h1 className="display-title">{current.title}</h1>
            <p className="muted">{current.body}</p>
          </div>
          <button
            className="ghost-button"
            type="button"
            onClick={() => onView("overview")}
          >
            Voltar à Cidade
          </button>
        </div>
        <div className="context-art context-art--city" aria-hidden="true">
          <span>ARTE 16:9 · {current.title.toUpperCase()}</span>
        </div>
      </section>
    );
  }

  return (
    <section className="feature-view">
      <div className="view-heading">
        <div>
          <p className="section-kicker">Cidade</p>
          <h1 className="display-title">Cidade Livre</h1>
          <p className="muted">
            Trégua, necessidade e comércio sustentam este território neutro.
          </p>
        </div>
      </div>
      <div className="city-overview-layout section-gap">
        <div className="context-art context-art--city" aria-hidden="true">
          <span>ARTE 16:9 · CIDADE LIVRE</span>
        </div>
        <div className="city-place-grid">
          <button type="button" onClick={() => onView("tavern")}>
            <GameIcon icon="book-open" size={32} />
            <strong>Taverna</strong>
            <span>Contratos e conversas</span>
          </button>
          <button type="button" onClick={() => onView("market")}>
            <GameIcon icon="crown-coin" size={32} />
            <strong>Mercado</strong>
            <span>Compra e venda</span>
          </button>
          <button type="button" onClick={() => onView("smith")}>
            <GameIcon icon="blacksmith" size={32} />
            <strong>Ferreiro</strong>
            <span>Serviços de equipamento</span>
          </button>
          <button type="button" onClick={() => onView("bank")}>
            <GameIcon icon="key" size={32} />
            <strong>Banco</strong>
            <span>Armazenamento seguro</span>
          </button>
          <button type="button" onClick={() => onView("reliquary")}>
            <GameIcon icon="runestone" size={32} />
            <strong>Relicário</strong>
            <span>Relíquias e memória</span>
          </button>
        </div>
      </div>
    </section>
  );
}
