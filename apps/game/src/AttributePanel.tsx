import { useMemo, useState } from "react";
import {
  getCombatAbilityDefinition,
  getCombatConsumableDefinition,
  getEnemyDefinition,
  getEquipmentDefinition,
} from "@greywake/content";
import {
  ATTRIBUTE_KEYS,
  derivePlayerCombatStats,
  type AttributeAllocation,
  type AttributeKey,
  type OfflineGameSave,
} from "@greywake/domain";

const attributeLabels: Record<AttributeKey, string> = {
  vitality: "Vitalidade",
  mind: "Mente",
  vigor: "Vigor",
  strength: "Força",
  dexterity: "Destreza",
  intelligence: "Inteligência",
  faith: "Fé",
};

const combatCatalog = {
  getEquipmentDefinition,
  getAbilityDefinition: getCombatAbilityDefinition,
  getEnemyDefinition,
  getConsumableDefinition: getCombatConsumableDefinition,
};

type AttributePanelProps = {
  save: OfflineGameSave;
  onAllocateAttributes: (allocation: AttributeAllocation) => Promise<void>;
};

export default function AttributePanel({
  save,
  onAllocateAttributes,
}: AttributePanelProps) {
  const [draft, setDraft] = useState<AttributeAllocation>({});
  const [isSaving, setIsSaving] = useState(false);

  const pendingPoints = ATTRIBUTE_KEYS.reduce(
    (total, key) => total + (draft[key] ?? 0),
    0,
  );
  const remainingPoints = Math.max(
    0,
    save.character.unspentAttributePoints - pendingPoints,
  );

  const currentStats = useMemo(
    () => derivePlayerCombatStats(save, combatCatalog),
    [save],
  );
  const previewStats = useMemo(() => {
    const attributes = { ...save.character.attributes };
    for (const key of ATTRIBUTE_KEYS) attributes[key] += draft[key] ?? 0;
    return derivePlayerCombatStats(
      { ...save, character: { ...save.character, attributes } },
      combatCatalog,
    );
  }, [draft, save]);

  function changeAttribute(key: AttributeKey, delta: number) {
    const current = draft[key] ?? 0;
    if (delta > 0 && remainingPoints <= 0) return;
    const next = Math.max(0, current + delta);
    setDraft((currentDraft) => ({ ...currentDraft, [key]: next }));
  }

  async function confirm() {
    if (pendingPoints <= 0 || isSaving) return;
    setIsSaving(true);
    try {
      await onAllocateAttributes(draft);
      setDraft({});
    } finally {
      setIsSaving(false);
    }
  }

  function resourcePreview(key: AttributeKey) {
    if (key === "vitality")
      return `Vida máxima ${currentStats.maxHealth} → ${previewStats.maxHealth}`;
    if (key === "mind")
      return `Mana máxima ${currentStats.maxMana} → ${previewStats.maxMana}`;
    if (key === "vigor")
      return `Stamina máxima ${currentStats.maxStamina} → ${previewStats.maxStamina}`;
    return null;
  }

  return (
    <article className="panel dense-panel">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">Atributos</p>
          <h2>Distribuição</h2>
        </div>
        <span className="status-chip">
          {remainingPoints} ponto(s) restante(s)
        </span>
      </div>

      <div className="attribute-list">
        {ATTRIBUTE_KEYS.map((key) => {
          const baseValue = save.character.attributes[key];
          const pending = draft[key] ?? 0;
          const previewValue = baseValue + pending;
          const preview = resourcePreview(key);

          return (
            <div key={key}>
              <span>
                {attributeLabels[key]}
                {preview ? <small>{preview}</small> : null}
              </span>
              <div className="attribute-controls">
                <button
                  className="ghost-button compact"
                  type="button"
                  disabled={pending <= 0 || isSaving}
                  onClick={() => changeAttribute(key, -1)}
                  aria-label={`Remover ponto temporário de ${attributeLabels[key]}`}
                >
                  −
                </button>
                <strong>
                  {pending > 0 ? `${baseValue} → ${previewValue}` : baseValue}
                </strong>
                <button
                  className="ghost-button compact"
                  type="button"
                  disabled={remainingPoints <= 0 || isSaving}
                  onClick={() => changeAttribute(key, 1)}
                  aria-label={`Adicionar ponto a ${attributeLabels[key]}`}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {pendingPoints > 0 ? (
        <div className="button-row">
          <button
            className="ghost-button"
            type="button"
            disabled={isSaving}
            onClick={() => setDraft({})}
          >
            Desfazer
          </button>
          <button
            className="primary-button compact"
            type="button"
            disabled={isSaving}
            onClick={() => void confirm()}
          >
            {isSaving
              ? "Salvando…"
              : `Confirmar distribuição · ${pendingPoints}`}
          </button>
        </div>
      ) : null}

      {save.character.unspentAttributePoints === 0 ? (
        <p className="muted">Nenhum ponto de atributo disponível no momento.</p>
      ) : null}
    </article>
  );
}
