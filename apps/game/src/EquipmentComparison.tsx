import { getCraftingEquipmentComparison } from "@greywake/content";
import type { OfflineGameSave } from "@greywake/domain";

export default function EquipmentComparison({
  save,
  recipeId,
}: {
  save: OfflineGameSave;
  recipeId: string;
}) {
  const comparison = getCraftingEquipmentComparison(save, recipeId);
  if (!comparison) return null;
  const format = (value: number, key: string) =>
    key === "criticalChance"
      ? `${Number((value * 100).toFixed(1))}%`
      : Number(value.toFixed(2)).toLocaleString("pt-BR");
  return (
    <div
      className="equipment-comparison"
      aria-label="Comparação com o equipamento atual"
    >
      <p>
        Ao equipar a peça +0, substituindo{" "}
        <strong>{comparison.currentName}</strong>:
      </p>
      <dl>
        {comparison.rows.map((row) => (
          <div key={row.key}>
            <dt>{row.label}</dt>
            <dd>
              {format(row.before, row.key)} →{" "}
              <strong>{format(row.after, row.key)}</strong>{" "}
              <span>
                ({row.delta > 0 ? "+" : ""}
                {format(row.delta, row.key)})
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
