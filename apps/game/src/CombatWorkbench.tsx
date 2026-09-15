import { useEffect, useMemo, useState } from "react";
import {
  COMBAT_CONSUMABLES,
  getCombatAbilityDefinition,
  getCombatConsumableDefinition,
  getEnemyDefinition,
  getEquipmentDefinition,
} from "@greywake/content";
import {
  applyRoadServiceCombatResult,
  configureCombatConsumableSlot,
  derivePlayerCombatStats,
  resumeCurrentWorkAfterRisk,
  simulateCombat,
  type CombatResult,
  type CombatThresholdResource,
  type OfflineGameSave,
} from "@greywake/domain";

type CombatViewProps = {
  save: OfflineGameSave;
  prepareRisk: () => Promise<OfflineGameSave>;
  onSaveChange: (
    save: OfflineGameSave,
    message?: string,
  ) => void | Promise<void>;
  onRiskStateChange?: (active: boolean) => void;
  onReturn?: () => void;
};

const combatCatalog = {
  getEquipmentDefinition,
  getAbilityDefinition: getCombatAbilityDefinition,
  getEnemyDefinition,
  getConsumableDefinition: getCombatConsumableDefinition,
};

function formatResource(value: number) {
  return Math.max(0, Math.round(value));
}

function inventoryQuantity(save: OfflineGameSave, definitionId: string) {
  return (
    save.character.inventory.find(
      (stack) => stack.definitionId === definitionId,
    )?.quantity ?? 0
  );
}

function abilityMeta(abilityId: string | null) {
  if (!abilityId) return null;
  const ability = getCombatAbilityDefinition(abilityId);
  if (!ability) return null;
  const resource =
    ability.resource && ability.resourceCost !== undefined
      ? `${ability.resource} ${ability.resourceCost} · `
      : "";
  return { ability, text: `${resource}CD ${ability.cooldownSeconds}s` };
}

export default function CombatWorkbench({
  save,
  prepareRisk,
  onSaveChange,
  onRiskStateChange,
  onReturn,
}: CombatViewProps) {
  const [result, setResult] = useState<CombatResult | null>(null);
  const [combatBaseSave, setCombatBaseSave] = useState<OfflineGameSave | null>(
    null,
  );
  const [visibleSeconds, setVisibleSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [logOpen, setLogOpen] = useState(false);

  const stats = useMemo(
    () => derivePlayerCombatStats(save, combatCatalog),
    [save],
  );
  const visibleLog =
    result?.log.filter((entry) => entry.atSeconds <= visibleSeconds + 0.001) ??
    [];
  const progress =
    result && result.durationSeconds > 0
      ? Math.min(100, (visibleSeconds / result.durationSeconds) * 100)
      : 0;
  const latestTelegraph =
    [...visibleLog].reverse().find((entry) => entry.kind === "telegraph") ??
    null;

  useEffect(() => {
    if (!running || !result) return;

    const timer = window.setInterval(() => {
      setVisibleSeconds((current) =>
        Math.min(result.durationSeconds, current + 0.1),
      );
    }, 100);

    return () => window.clearInterval(timer);
  }, [running, result]);

  useEffect(() => {
    if (!running || !result || !combatBaseSave) return;
    if (visibleSeconds + 0.0001 < result.durationSeconds) return;

    setRunning(false);
    const now = new Date().toISOString();
    const firstServiceClear =
      result.outcome === "victory" && !combatBaseSave.combat.wolfDefeated;
    const applied = applyRoadServiceCombatResult(combatBaseSave, result, now);
    const updated = resumeCurrentWorkAfterRisk(applied, now);
    const lostCoins = Math.max(
      0,
      combatBaseSave.character.gold - applied.character.gold,
    );
    const text =
      result.outcome === "victory"
        ? firstServiceClear
          ? `Serviço concluído: +${result.xpGranted + 25} XP geral e +40 moedas. Atividade Idle retomada.`
          : `Vitória persistida: +${result.xpGranted} XP geral. Atividade Idle retomada.`
        : `Derrota persistida: ${lostCoins} moeda(s) perdida(s). O personagem retornou à Cidade Livre e a atividade Idle foi retomada.`;

    void Promise.resolve(onSaveChange(updated, text)).then(() => {
      setMessage(text);
      onRiskStateChange?.(false);
    });
  }, [
    combatBaseSave,
    onRiskStateChange,
    onSaveChange,
    result,
    running,
    visibleSeconds,
  ]);

  useEffect(() => () => onRiskStateChange?.(false), [onRiskStateChange]);

  async function updateConsumableSlot(
    slotIndex: 0 | 1,
    values: {
      definitionId?: string | null;
      resource?: CombatThresholdResource | null;
      threshold?: number | null;
    },
  ) {
    if (running) return;
    const current = save.combat.preferences.consumableSlots[slotIndex];
    const updated = configureCombatConsumableSlot(
      save,
      slotIndex,
      values.definitionId === undefined
        ? current.definitionId
        : values.definitionId,
      values.resource === undefined ? current.autoUseResource : values.resource,
      values.threshold === undefined
        ? current.autoUseThresholdPercent
        : values.threshold,
      new Date().toISOString(),
    );
    await onSaveChange(
      updated,
      `Slot ${slotIndex + 1} de consumível atualizado.`,
    );
    setMessage(`Slot ${slotIndex + 1} de consumível atualizado.`);
  }

  async function startFight(manualSlot?: 0 | 1) {
    if (running) return;

    try {
      setMessage(null);
      const riskSave = await prepareRisk();
      const seed = Date.now() >>> 0;
      const simulated = simulateCombat(
        riskSave,
        combatCatalog,
        "enemy.road-wolf",
        seed,
        180,
        undefined,
        manualSlot,
      );
      setCombatBaseSave(riskSave);
      setResult(simulated);
      setVisibleSeconds(0);
      setLogOpen(false);
      onRiskStateChange?.(true);
      setRunning(true);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível iniciar o combate.",
      );
      onRiskStateChange?.(false);
    }
  }

  function repeatSeed() {
    if (!result || running) return;
    void startWithSeed(result.seed);
  }

  async function startWithSeed(seed: number) {
    try {
      const riskSave = await prepareRisk();
      const simulated = simulateCombat(
        riskSave,
        combatCatalog,
        "enemy.road-wolf",
        seed,
      );
      setCombatBaseSave(riskSave);
      setResult(simulated);
      setVisibleSeconds(0);
      setLogOpen(false);
      onRiskStateChange?.(true);
      setRunning(true);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível repetir o combate.",
      );
      onRiskStateChange?.(false);
    }
  }

  const abilitySlots = save.character.activeAbilitySlots;

  return (
    <section
      className={`feature-view combat-view ${running ? "combat-view--running" : ""}`}
      aria-labelledby="combat-title"
    >
      <div className="view-heading">
        <div>
          <p className="section-kicker">Aventura · Serviço</p>
          <h2 id="combat-title" className="display-title">
            Estrada Baixa
          </h2>
          <p className="muted">
            Combate automático em tempo real. A interface explica o estado e a
            automação.
          </p>
        </div>
        {!running && onReturn ? (
          <button className="ghost-button" type="button" onClick={onReturn}>
            Voltar a Aventura
          </button>
        ) : null}
      </div>

      {!running && !result ? (
        <div className="preparation-layout">
          <div className="context-art context-art--risk" aria-hidden="true">
            <span>ARTE 16:9 · ESTRADA BAIXA</span>
          </div>
          <aside className="panel preparation-summary">
            <p className="section-kicker">Preparação leve</p>
            <h3>Lobo de Estrada</h3>
            <div className="fact-row">
              <span>Vida</span>
              <strong>{stats.maxHealth}</strong>
            </div>
            <div className="fact-row">
              <span>Mana</span>
              <strong>{stats.maxMana}</strong>
            </div>
            <div className="fact-row">
              <span>Stamina</span>
              <strong>{stats.maxStamina}</strong>
            </div>
            <div className="risk-note">
              Ao confirmar, sua atividade Idle atual será pausada durante o
              combate e retomada ao retornar à segurança.
            </div>
            <button
              className="primary-button"
              type="button"
              onClick={() => void startFight()}
            >
              Iniciar serviço
            </button>
          </aside>
        </div>
      ) : null}

      {running || result ? (
        <>
          <div className="combat-context-line">
            <span>Serviço · Estrada Baixa</span>
            <strong>
              {running ? "COMBATE ATIVO · IDLE PAUSADO" : "RESULTADO"}
            </strong>
          </div>
          <div className="context-art context-art--combat" aria-hidden="true">
            <span>ARTE / CENA DE COMBATE</span>
          </div>

          <div className="combat-grid">
            <article className="panel combat-fighter">
              <p className="section-kicker">Você</p>
              <h3>{save.character.name}</h3>
              <div className="resource-stack">
                <div>
                  <span>VIDA</span>
                  <strong>
                    {result
                      ? `${formatResource(result.player.health)} / ${result.player.maxHealth}`
                      : stats.maxHealth}
                  </strong>
                </div>
                <div>
                  <span>MANA</span>
                  <strong>
                    {result
                      ? `${formatResource(result.player.mana)} / ${result.player.maxMana}`
                      : stats.maxMana}
                  </strong>
                </div>
                <div>
                  <span>STAMINA</span>
                  <strong>
                    {result
                      ? `${formatResource(result.player.stamina)} / ${result.player.maxStamina}`
                      : stats.maxStamina}
                  </strong>
                </div>
              </div>

              <div className="section-divider" />
              <p className="section-kicker">Prioridade real</p>
              <div className="technique-list">
                {abilitySlots.map((abilityId, index) => {
                  const meta = abilityMeta(abilityId);
                  return (
                    <div
                      className="technique-row"
                      key={`${abilityId ?? "empty"}-${index}`}
                    >
                      <span className="priority-index">{index + 1}</span>
                      <div>
                        <strong>{meta?.ability.name ?? "Slot vazio"}</strong>
                        <small>
                          {meta?.text ?? "Nenhuma Técnica equipada"}
                        </small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="panel combat-center">
              <div
                className="combat-progress-track"
                aria-label="Tempo do combate"
              >
                <span style={{ width: `${progress}%` }} />
              </div>
              <div className="combat-live-resources">
                <span>Tempo {visibleSeconds.toFixed(1)}s</span>
                {result ? (
                  <span>Fim previsto {result.durationSeconds.toFixed(1)}s</span>
                ) : null}
              </div>

              {latestTelegraph ? (
                <div className="telegraph-card" role="status">
                  <span className="section-kicker">Ameaça conhecida</span>
                  <strong>{latestTelegraph.message}</strong>
                  <small>Telegraph identificado no log de combate.</small>
                </div>
              ) : (
                <p className="muted">
                  A próxima ameaça relevante aparecerá aqui quando for
                  telegráfica.
                </p>
              )}

              {message ? (
                <p className="inline-message" role="status">
                  {message}
                </p>
              ) : null}

              {result && !running ? (
                <div className={`combat-result ${result.outcome}`}>
                  <p className="section-kicker">Resultado</p>
                  <h3>
                    {result.outcome === "victory"
                      ? "Vitória"
                      : result.outcome === "defeat"
                        ? "Derrota"
                        : "Combate encerrado"}
                  </h3>
                  <p className="muted">
                    Duração {result.durationSeconds.toFixed(1)}s ·{" "}
                    {result.xpGranted} XP do encontro
                  </p>
                  <div className="button-row">
                    <button
                      className="primary-button compact"
                      type="button"
                      onClick={onReturn}
                    >
                      Retornar a Aventura
                    </button>
                    <button
                      className="ghost-button"
                      type="button"
                      onClick={repeatSeed}
                    >
                      Repetir mesma seed
                    </button>
                  </div>
                </div>
              ) : null}

              <button
                className="ghost-button log-toggle"
                type="button"
                onClick={() => setLogOpen((current) => !current)}
                aria-expanded={logOpen}
              >
                {logOpen ? "Recolher log" : "Ver log de combate"}
              </button>
              {logOpen ? (
                <div className="combat-log" aria-live="polite">
                  {visibleLog.length === 0 ? (
                    <p className="muted">
                      O log aparecerá aqui durante o combate.
                    </p>
                  ) : null}
                  {visibleLog.map((entry, index) => (
                    <div
                      className={`combat-log__entry ${entry.kind}`}
                      key={`${entry.atSeconds}-${index}`}
                    >
                      <time>{entry.atSeconds.toFixed(1)}s</time>
                      <span>{entry.message}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </article>

            <article className="panel combat-fighter enemy-panel">
              <p className="section-kicker">Inimigo</p>
              <h3>Lobo de Estrada</h3>
              <div className="fact-row">
                <span>Vida inicial</span>
                <strong>60</strong>
              </div>
              <div className="fact-row">
                <span>Defesa</span>
                <strong>4</strong>
              </div>
              <div className="fact-row">
                <span>Poder</span>
                <strong>8</strong>
              </div>
              <div className="fact-row">
                <span>Intervalo</span>
                <strong>2,25 s</strong>
              </div>
              <div className="risk-note">
                Bote possui telegraph de 1,2 s e é interrompível.
              </div>
            </article>
          </div>
        </>
      ) : null}

      {!running ? (
        <div className="consumable-grid section-gap">
          {([0, 1] as const).map((slotIndex) => {
            const slot = save.combat.preferences.consumableSlots[slotIndex];
            return (
              <article className="panel" key={slotIndex}>
                <p className="section-kicker">
                  Consumível preparado · Slot {slotIndex + 1}
                </p>
                <label className="field-stack">
                  <span>Item</span>
                  <select
                    value={slot.definitionId ?? ""}
                    onChange={(event) =>
                      void updateConsumableSlot(slotIndex, {
                        definitionId: event.target.value || null,
                      })
                    }
                  >
                    <option value="">Vazio</option>
                    {COMBAT_CONSUMABLES.map((consumable) => (
                      <option key={consumable.id} value={consumable.id}>
                        {consumable.name} · ×
                        {inventoryQuantity(save, consumable.id)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field-stack">
                  <span>Usar automaticamente quando</span>
                  <select
                    value={slot.autoUseResource ?? ""}
                    disabled={!slot.definitionId}
                    onChange={(event) =>
                      void updateConsumableSlot(slotIndex, {
                        resource: (event.target.value ||
                          null) as CombatThresholdResource | null,
                      })
                    }
                  >
                    <option value="">Desativado</option>
                    <option value="health">Vida</option>
                    <option value="mana">Mana</option>
                    <option value="stamina">Stamina</option>
                  </select>
                </label>
                <label className="field-stack">
                  <span>Limite (%)</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    disabled={!slot.definitionId || !slot.autoUseResource}
                    value={slot.autoUseThresholdPercent ?? 50}
                    onChange={(event) =>
                      void updateConsumableSlot(slotIndex, {
                        threshold: Number(event.target.value),
                      })
                    }
                  />
                </label>
                {slot.definitionId ? (
                  <p className="muted small-copy">
                    Usar consumível ocupa a ação atual; não concede uma ação
                    extra.
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
