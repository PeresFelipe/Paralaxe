import { useEffect, useMemo, useState } from "react";
import {
  DUN_LIATH_EASY,
  getCombatAbilityDefinition,
  getCombatConsumableDefinition,
  getCraftingRecipeDefinition,
  getDungeonDefinition,
  getEnemyDefinition,
  getEquipmentDefinition,
  getIdleActivityDefinition,
  getPreDungeonAbilityLoadout,
} from "@greywake/content";
import {
  acceptDunLiathContract,
  chooseDungeonPath,
  decideProtector,
  derivePlayerCombatStats,
  extractDungeonRun,
  resolveDungeonRoom,
  resumeCurrentWorkAfterRisk,
  startDungeonWithContinuity,
  teachAndEquipCombatAbilities,
  type CombatResult,
  type DungeonRoomDefinition,
  type OfflineGameSave,
} from "@greywake/domain";

type DungeonViewProps = {
  save: OfflineGameSave;
  prepareRisk: () => Promise<OfflineGameSave>;
  onSaveChange: (
    save: OfflineGameSave,
    message?: string,
  ) => void | Promise<void>;
  onRiskStateChange?: (active: boolean) => void;
  onPreparationStateChange?: (active: boolean) => void;
  onReturn?: () => void;
};

const dungeonCatalog = {
  getEquipmentDefinition,
  getAbilityDefinition: getCombatAbilityDefinition,
  getEnemyDefinition,
  getConsumableDefinition: getCombatConsumableDefinition,
  getDungeonDefinition,
};

const roomCopy: Record<string, string> = {
  "room.entrance":
    "A fortaleza está silenciosa. O caminho para dentro ainda está aberto.",
  "room.courtyard":
    "Duas rotas se separam entre alojamentos militares e a ala administrativa.",
  "room.barracks":
    "Marcas recentes cruzam os antigos alojamentos da guarnição.",
  "room.administration":
    "Papéis apodrecidos e selos humanos permanecem entre armários quebrados.",
  "room.treaty":
    "Um fragmento antigo registra que humanos e monstros já negociaram formalmente.",
  "room.stores":
    "O depósito foi esvaziado às pressas. Há sinais de ocupação recente.",
  "room.crubach": "Um Crúbach bloqueia a galeria estreita.",
  "room.protector":
    "Uma criatura ferida protege outra menor. Ela fala, entende você e teme o que fará em seguida.",
  "room.tromghiallach":
    "A massa de Tromghiallach ocupa o salão como uma muralha viva.",
  "room.arsenal":
    "O arsenal abandonado ainda guarda uma peça utilizável da antiga guarnição.",
  "room.register":
    "O Registro de Suprimentos da Guarnição sobreviveu entre caixas partidas.",
  "room.lower-hall":
    "O salão inferior carrega sinais de evacuação e improviso defensivo.",
  "room.rampart":
    "Da muralha interna, a passagem para o coração do bastião fica evidente.",
  "room.passage":
    "A arquitetura se estreita antes da passagem interna do bastião.",
  "room.cosantoir": "Cosantóir guarda o acesso às câmaras finais.",
  "room.recovery":
    "Uma capela silenciosa oferece a última oportunidade de se recompor ou retirar.",
  "room.boss-gate":
    "Além da porta está o ser que manteve este lugar protegido.",
  "room.fairtheoir":
    "Fairtheoir espera sem falar. O combate revelará duas fases do Último Vigia.",
};

function roomLabel(room: DungeonRoomDefinition) {
  const suffix = room.enemyDefinitionId
    ? " · Combate"
    : room.kind === "recovery"
      ? " · Recuperação"
      : "";
  return `${room.name}${suffix}`;
}

function itemLabel(definitionId: string) {
  const labels: Record<string, string> = {
    "item.treaty-fragment": "Fragmento do Tratado",
    "item.garrison-supply-register": "Registro de Suprimentos",
    "item.dun-liath.beam": "Viga de Dún Liath",
    "item.fairtheoir-fragment": "Fragmento de Fairtheoir",
    "item.consumable.field-preparation": "Preparado de Campo",
  };
  return labels[definitionId] ?? definitionId;
}

function activeWorkLabel(save: OfflineGameSave) {
  if (save.idle.activeActivity) {
    return (
      getIdleActivityDefinition(save.idle.activeActivity.activityDefinitionId)
        ?.name ?? "Atividade de coleta"
    );
  }
  if (save.crafting.activeRecipe) {
    return (
      getCraftingRecipeDefinition(save.crafting.activeRecipe.recipeDefinitionId)
        ?.name ?? "Produção"
    );
  }
  return "Nenhuma atividade Idle ativa";
}

export default function DungeonWorkbench({
  save,
  prepareRisk,
  onSaveChange,
  onRiskStateChange,
  onPreparationStateChange,
  onReturn,
}: DungeonViewProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [combatResult, setCombatResult] = useState<CombatResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [preparing, setPreparing] = useState(false);

  const run = save.dungeon.activeRun;
  const currentRoom = useMemo<DungeonRoomDefinition | null>(
    () =>
      run
        ? (DUN_LIATH_EASY.rooms.find((room) => room.id === run.currentRoomId) ??
          null)
        : null,
    [run],
  );
  const roomResolved = Boolean(
    currentRoom && run?.resolvedRoomIds.includes(currentRoom.id),
  );

  useEffect(() => {
    onRiskStateChange?.(Boolean(run));
  }, [onRiskStateChange, run]);

  useEffect(() => () => onRiskStateChange?.(false), [onRiskStateChange]);

  useEffect(() => {
    onPreparationStateChange?.(preparing);
  }, [onPreparationStateChange, preparing]);

  useEffect(
    () => () => onPreparationStateChange?.(false),
    [onPreparationStateChange],
  );

  async function persist(next: OfflineGameSave, text?: string) {
    await onSaveChange(next, text);
    if (text) setMessage(text);
  }

  async function handleAcceptContract() {
    if (busy) return;
    setBusy(true);
    try {
      if (!save.combat.wolfDefeated)
        throw new Error("Conclua primeiro o Serviço — Estrada Baixa.");
      const now = new Date().toISOString();
      let next = teachAndEquipCombatAbilities(
        save,
        getPreDungeonAbilityLoadout(save.character.classId),
        now,
      );
      next = acceptDunLiathContract(next, now);
      await persist(
        next,
        "Contrato aceito. Técnicas básicas preparadas e 2× Preparado de Campo entregues uma única vez.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível aceitar o contrato.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleStart() {
    if (busy) return;
    setBusy(true);
    try {
      if (!save.combat.wolfDefeated)
        throw new Error("Derrote primeiro o Lobo de Estrada.");
      const now = new Date().toISOString();
      const riskSave = await prepareRisk();
      const seed = Date.now() >>> 0;
      const stats = derivePlayerCombatStats(riskSave, dungeonCatalog);
      const startingResources = {
        health: stats.maxHealth,
        maxHealth: stats.maxHealth,
        mana: stats.maxMana,
        maxMana: stats.maxMana,
        stamina: stats.maxStamina,
        maxStamina: stats.maxStamina,
      };
      const next = startDungeonWithContinuity(
        riskSave,
        DUN_LIATH_EASY,
        seed,
        now,
        startingResources,
      );
      await persist(
        next,
        `Dún Liath iniciada. ${activeWorkLabel(riskSave)} foi pausada e será retomada ao voltar à segurança.`,
      );
      setCombatResult(null);
      setPreparing(false);
      onRiskStateChange?.(true);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível iniciar Dún Liath.",
      );
      onRiskStateChange?.(false);
    } finally {
      setBusy(false);
    }
  }

  async function handleResolve() {
    if (!run || !currentRoom || busy) return;
    setBusy(true);
    try {
      const now = new Date().toISOString();
      const result = resolveDungeonRoom(
        save,
        DUN_LIATH_EASY,
        dungeonCatalog,
        now,
      );
      setCombatResult(result.combatResult ?? null);

      if (!result.save.dungeon.activeRun) {
        const resumed = resumeCurrentWorkAfterRisk(result.save, now);
        await persist(
          resumed,
          "A expedição terminou em derrota. A Bolsa foi perdida. Sua atividade Idle anterior foi retomada.",
        );
        onRiskStateChange?.(false);
      } else if (
        currentRoom.id === "room.fairtheoir" &&
        result.combatResult?.outcome === "victory"
      ) {
        await persist(
          result.save,
          "Fairtheoir caiu. Retorne em segurança para assegurar o clear e o loot.",
        );
      } else if (result.combatResult) {
        await persist(
          result.save,
          `${currentRoom.name} resolvida · ${result.combatResult.xpGranted} XP. Loot encontrado permanece em risco.`,
        );
      } else {
        await persist(result.save, `${currentRoom.name} resolvida.`);
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível resolver a sala.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handlePath(nextRoomId: string) {
    if (busy) return;
    setBusy(true);
    try {
      const next = chooseDungeonPath(
        save,
        DUN_LIATH_EASY,
        nextRoomId,
        new Date().toISOString(),
      );
      await persist(
        next,
        "Caminho escolhido. A bifurcação anterior não pode ser refeita nesta expedição.",
      );
      setCombatResult(null);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível seguir por esse caminho.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleProtector(decision: "killed" | "spared") {
    if (busy) return;
    setBusy(true);
    try {
      const next = decideProtector(save, decision, new Date().toISOString());
      await persist(
        next,
        decision === "spared"
          ? "Você poupa o protetor."
          : "Você mata o protetor. O indivíduo protegido foge.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível registrar essa decisão.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleExtract() {
    if (busy) return;
    setBusy(true);
    try {
      const now = new Date().toISOString();
      const wasComplete = Boolean(save.dungeon.activeRun?.completed);
      const extracted = extractDungeonRun(save, now);
      const resumed = resumeCurrentWorkAfterRisk(extracted, now);
      await persist(
        resumed,
        wasComplete
          ? "Clear assegurado. Bolsa transferida e atividade Idle anterior retomada."
          : "Retirada segura concluída. Bolsa transferida e atividade Idle anterior retomada.",
      );
      setCombatResult(null);
      setPreparing(false);
      onRiskStateChange?.(false);
      onReturn?.();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível retirar da Dungeon.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (!run && preparing) {
    const emptyTechniques = save.character.activeAbilitySlots.filter(
      (slot) => !slot,
    ).length;
    const emptyConsumables = save.combat.preferences.consumableSlots.filter(
      (slot) => !slot.definitionId,
    ).length;

    return (
      <section
        className="feature-view preparation-view"
        aria-labelledby="preparation-title"
      >
        <div className="view-heading">
          <div>
            <p className="section-kicker">Dún Liath · Preparação</p>
            <h2 id="preparation-title" className="display-title">
              Antes da expedição
            </h2>
            <p className="muted">
              A preparação ainda é um contexto seguro. Sua atividade Idle
              continua até a entrada ser confirmada.
            </p>
          </div>
          <button
            className="ghost-button"
            type="button"
            onClick={() => setPreparing(false)}
          >
            Voltar
          </button>
        </div>

        <div className="preparation-layout">
          <div className="context-art context-art--risk" aria-hidden="true">
            <span>ARTE 16:9 · DÚN LIATH</span>
          </div>
          <aside className="panel preparation-summary">
            <p className="section-kicker">Estado do personagem</p>
            <h3>
              {save.character.name} · Nv. {save.character.level}
            </h3>
            <div className="fact-row">
              <span>Estilo</span>
              <strong>{save.combat.preferences.style}</strong>
            </div>
            <div className="fact-row">
              <span>Técnicas vazias</span>
              <strong>{emptyTechniques}</strong>
            </div>
            <div className="fact-row">
              <span>Consumíveis vazios</span>
              <strong>{emptyConsumables}</strong>
            </div>
            <div className="fact-row">
              <span>Atividade atual</span>
              <strong>{activeWorkLabel(save)}</strong>
            </div>
          </aside>
        </div>

        <div className="preparation-cards section-gap">
          <article className="panel">
            <p className="section-kicker">Equipamento</p>
            <h3>10 slots do personagem</h3>
            <p className="muted">O equipamento atual será usado na entrada.</p>
          </article>
          <article className="panel">
            <p className="section-kicker">Técnicas</p>
            <h3>{4 - emptyTechniques}/4 configuradas</h3>
            <p className="muted">
              A ordem visível corresponde à prioridade real do combate.
            </p>
          </article>
          <article className="panel">
            <p className="section-kicker">Consumíveis</p>
            <h3>{2 - emptyConsumables}/2 preparados</h3>
            <p className="muted">Consumir ocupa a ação atual.</p>
          </article>
          <article className="panel">
            <p className="section-kicker">Estilo</p>
            <h3>{save.combat.preferences.style}</h3>
            <p className="muted">Agressivo, Defensivo ou Misto.</p>
          </article>
        </div>

        <div className="commit-panel section-gap">
          <div>
            <p className="section-kicker">Ao entrar</p>
            <h3>Você assume o risco da expedição.</h3>
            <ul>
              <li>{activeWorkLabel(save)} será pausada.</li>
              <li>Encontrados irão para a Bolsa de Expedição.</li>
              <li>
                O conteúdo da Bolsa permanece em risco até uma saída segura.
              </li>
            </ul>
          </div>
          <button
            className="primary-button compact"
            type="button"
            disabled={busy}
            onClick={() => void handleStart()}
          >
            Entrar em Dún Liath
          </button>
        </div>
        {message ? (
          <p className="inline-message" role="status">
            {message}
          </p>
        ) : null}
      </section>
    );
  }

  if (!run) {
    return (
      <section
        className="feature-view dungeon-overview"
        aria-labelledby="dungeon-title"
      >
        <div className="view-heading">
          <div>
            <p className="section-kicker">Aventura · Dungeon</p>
            <h2 id="dungeon-title" className="display-title">
              Dún Liath
            </h2>
            <p className="muted">
              Fortificação militar abandonada · expedição prolongada · loot em
              risco.
            </p>
          </div>
          {onReturn ? (
            <button className="ghost-button" type="button" onClick={onReturn}>
              Voltar a Aventura
            </button>
          ) : null}
        </div>

        <div className="context-art context-art--dungeon" aria-hidden="true">
          <span>ARTE 16:9 · DÚN LIATH</span>
        </div>
        {message ? (
          <p className="inline-message" role="status">
            {message}
          </p>
        ) : null}

        <div className="dungeon-entry-grid section-gap">
          <article className="panel">
            <p className="section-kicker">Objetivo conhecido</p>
            <h3>Fortaleza Cinzenta</h3>
            <p className="muted">
              Recupere o Registro de Suprimentos da Guarnição e atravesse a
              fortaleza.
            </p>
            <div className="fact-row">
              <span>Serviço da Estrada</span>
              <strong>
                {save.combat.wolfDefeated ? "Concluído" : "Pendente"}
              </strong>
            </div>
            <div className="fact-row">
              <span>Contrato</span>
              <strong>
                {save.dungeon.contractAccepted || save.dungeon.contractCompleted
                  ? "Aceito"
                  : "Disponível na Taverna"}
              </strong>
            </div>
          </article>
          <article className="panel risk-panel">
            <p className="section-kicker">Riscos conhecidos</p>
            <ul>
              <li>Presença hostil confirmada.</li>
              <li>A expedição mantém recursos entre salas.</li>
              <li>
                Loot encontrado fica na Bolsa de Expedição até uma saída segura.
              </li>
            </ul>
            {!save.dungeon.contractAccepted &&
            !save.dungeon.contractCompleted ? (
              <button
                className="primary-button"
                type="button"
                disabled={busy || !save.combat.wolfDefeated}
                onClick={() => void handleAcceptContract()}
              >
                Aceitar contrato
              </button>
            ) : (
              <button
                className="primary-button"
                type="button"
                disabled={busy}
                onClick={() => setPreparing(true)}
              >
                Preparar expedição
              </button>
            )}
          </article>
        </div>
      </section>
    );
  }

  if (!currentRoom) {
    return (
      <p className="inline-message">
        A sala atual da expedição não foi encontrada no conteúdo.
      </p>
    );
  }

  const atBossGate = currentRoom.id === "room.boss-gate";
  const branchChoice = roomResolved && currentRoom.nextRoomIds.length > 1;

  return (
    <section
      className="feature-view dungeon-run-view"
      aria-labelledby="dungeon-run-title"
    >
      <div className="dungeon-run-header">
        <div>
          <p className="section-kicker">Dún Liath · Expedição ativa</p>
          <h2 id="dungeon-run-title" className="display-title">
            {currentRoom.name}
          </h2>
        </div>
        <div className="risk-chip">
          BOLSA ·{" "}
          {run.expeditionBag.reduce(
            (total, stack) => total + stack.quantity,
            0,
          ) + run.expeditionEquipment.length}{" "}
          EM RISCO
        </div>
      </div>

      {message ? (
        <p className="inline-message" role="status">
          {message}
        </p>
      ) : null}

      <div className="dungeon-run-grid">
        <div>
          <div className="context-art context-art--dungeon" aria-hidden="true">
            <span>ARTE 16:9 · {currentRoom.name.toUpperCase()}</span>
          </div>
          <article className="panel room-panel">
            <p className="section-kicker">Sala atual</p>
            <h3>{roomLabel(currentRoom)}</h3>
            <p className="muted">{roomCopy[currentRoom.id]}</p>

            <div className="dungeon-resource-grid">
              <div>
                <span>VIDA</span>
                <strong>
                  {Math.round(run.resources.health)}/{run.resources.maxHealth}
                </strong>
              </div>
              <div>
                <span>MANA</span>
                <strong>
                  {Math.round(run.resources.mana)}/{run.resources.maxMana}
                </strong>
              </div>
              <div>
                <span>STAMINA</span>
                <strong>
                  {Math.round(run.resources.stamina)}/{run.resources.maxStamina}
                </strong>
              </div>
            </div>

            {currentRoom.id === "room.protector" && !run.protectorDecision ? (
              <div className="narrative-choice">
                <p>
                  Uma criatura ferida protege outra menor. Nenhuma recompensa ou
                  classificação moral é apresentada.
                </p>
                <div className="button-row">
                  <button
                    className="ghost-button"
                    type="button"
                    disabled={busy}
                    onClick={() => void handleProtector("killed")}
                  >
                    Matar
                  </button>
                  <button
                    className="ghost-button"
                    type="button"
                    disabled={busy}
                    onClick={() => void handleProtector("spared")}
                  >
                    Poupar
                  </button>
                </div>
              </div>
            ) : null}

            {!roomResolved ? (
              <button
                className="primary-button compact"
                type="button"
                disabled={
                  busy ||
                  (currentRoom.id === "room.protector" &&
                    !run.protectorDecision)
                }
                onClick={() => void handleResolve()}
              >
                {currentRoom.enemyDefinitionId
                  ? "Entrar em combate"
                  : currentRoom.kind === "recovery"
                    ? "Usar recuperação"
                    : "Resolver sala"}
              </button>
            ) : null}
          </article>

          {combatResult ? (
            <article
              className={`panel encounter-result ${combatResult.outcome}`}
            >
              <p className="section-kicker">Último encontro</p>
              <h3>
                {combatResult.outcome === "victory"
                  ? "Vitória"
                  : combatResult.outcome === "defeat"
                    ? "Derrota"
                    : "Encerrado"}
              </h3>
              <p className="muted">
                {combatResult.durationSeconds.toFixed(1)}s ·{" "}
                {combatResult.xpGranted} XP · consumíveis usados permanecem
                consumidos.
              </p>
            </article>
          ) : null}

          {roomResolved && currentRoom.nextRoomIds.length > 0 && !atBossGate ? (
            <div
              className={`dungeon-paths ${branchChoice ? "dungeon-paths--branch" : ""}`}
            >
              {currentRoom.nextRoomIds.map((roomId) => {
                const room = DUN_LIATH_EASY.rooms.find(
                  (candidate) => candidate.id === roomId,
                );
                return room ? (
                  <button
                    className="route-card"
                    type="button"
                    key={roomId}
                    disabled={busy}
                    onClick={() => void handlePath(roomId)}
                  >
                    <span className="section-kicker">Próxima rota</span>
                    <strong>{roomLabel(room)}</strong>
                    <small>
                      {branchChoice
                        ? "Escolher esta rota fecha a alternativa nesta expedição."
                        : "Seguir adiante"}
                    </small>
                  </button>
                ) : null;
              })}
            </div>
          ) : null}

          {roomResolved && atBossGate ? (
            <div className="boss-commit">
              <p className="section-kicker">Portão do Bastião</p>
              <h3>Além deste ponto está Fairtheoir.</h3>
              <p className="muted">
                Retornar assegura a Bolsa. Continuar mantém tudo em risco.
              </p>
              <div className="button-row">
                {run.safeExtractionAvailable ? (
                  <button
                    className="ghost-button"
                    type="button"
                    disabled={busy}
                    onClick={() => void handleExtract()}
                  >
                    Retornar e assegurar Bolsa
                  </button>
                ) : null}
                {currentRoom.nextRoomIds.map((roomId) => (
                  <button
                    className="primary-button compact"
                    type="button"
                    key={roomId}
                    disabled={busy}
                    onClick={() => void handlePath(roomId)}
                  >
                    Abrir o portão
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {run.completed ? (
            <div className="dungeon-complete-panel">
              <p className="section-kicker">Dún Liath concluída</p>
              <h3>Fairtheoir caiu.</h3>
              <p className="muted">
                O clear e o conteúdo da Bolsa ainda precisam ser assegurados
                pelo retorno.
              </p>
              <button
                className="primary-button compact"
                type="button"
                disabled={busy}
                onClick={() => void handleExtract()}
              >
                Retornar à Cidade Livre
              </button>
            </div>
          ) : null}
        </div>

        <aside className="dungeon-side">
          <article className="panel expedition-bag">
            <p className="section-kicker">Bolsa de Expedição</p>
            <h3>Em risco</h3>
            {run.expeditionBag.length === 0 &&
            run.expeditionEquipment.length === 0 ? (
              <p className="muted">Nada encontrado nesta expedição ainda.</p>
            ) : null}
            {run.expeditionBag.map((stack) => (
              <div className="loot-row" key={stack.definitionId}>
                <span>{itemLabel(stack.definitionId)}</span>
                <strong>×{stack.quantity}</strong>
              </div>
            ))}
            {run.expeditionEquipment.map((item, index) => (
              <div className="loot-row" key={`${item.definitionId}-${index}`}>
                <span>{item.definitionId}</span>
                <strong>{item.rarity}</strong>
              </div>
            ))}
            <p className="risk-copy">
              Uma derrota perde esta Bolsa. O patrimônio que já estava seguro
              não está em risco.
            </p>
          </article>

          <article className="panel dungeon-map-card">
            <p className="section-kicker">Rota descoberta</p>
            <div className="route-trail">
              {run.visitedRoomIds.map((roomId, index) => {
                const room = DUN_LIATH_EASY.rooms.find(
                  (candidate) => candidate.id === roomId,
                );
                return (
                  <div key={roomId}>
                    <span>{index + 1}</span>
                    <strong>{room?.name ?? roomId}</strong>
                  </div>
                );
              })}
            </div>
            {currentRoom.nextRoomIds.length > 0 && !roomResolved ? (
              <p className="muted small-copy">
                Novas conexões ficam disponíveis depois de resolver a sala
                atual.
              </p>
            ) : null}
          </article>

          {run.safeExtractionAvailable && !run.completed && !atBossGate ? (
            <button
              className="ghost-button full-width"
              type="button"
              disabled={busy}
              onClick={() => void handleExtract()}
            >
              Retirar em segurança
            </button>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
