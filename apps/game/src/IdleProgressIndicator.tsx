import { useEffect, useMemo, useRef, useState } from "react";
import {
  INITIAL_CRAFTING_RECIPES,
  INITIAL_IDLE_ACTIVITIES,
} from "@greywake/content";
import type { OfflineGameSave, SkillId } from "@greywake/domain";

import { itemLabels, skillLabels } from "./gameLabels";

type IdleProgressIndicatorProps = {
  save: OfflineGameSave;
  compact?: boolean;
  paused?: boolean;
};

type WorkProgress = {
  title: string;
  skillId: SkillId;
  actionSeconds: number;
  remainderSeconds: number;
  lastProcessedAt: string;
  nextResult: string;
};

function labelFor(definitionId: string) {
  return itemLabels[definitionId] ?? definitionId;
}

function getWorkProgress(save: OfflineGameSave): WorkProgress | null {
  const activeIdle = save.idle.activeActivity;
  if (activeIdle) {
    const activity = INITIAL_IDLE_ACTIVITIES.find(
      (candidate) => candidate.id === activeIdle.activityDefinitionId,
    );
    if (!activity) return null;
    return {
      title: `${skillLabels[activity.skillId]} · ${activity.resultName}`,
      skillId: activity.skillId,
      actionSeconds: activity.actionSeconds,
      remainderSeconds: activeIdle.remainderSeconds,
      lastProcessedAt: activeIdle.lastProcessedAt,
      nextResult: `+1 ${activity.resultName} · +${activity.skillXpPerAction} XP`,
    };
  }

  const activeRecipe = save.crafting.activeRecipe;
  if (activeRecipe) {
    const recipe = INITIAL_CRAFTING_RECIPES.find(
      (candidate) => candidate.id === activeRecipe.recipeDefinitionId,
    );
    if (!recipe) return null;
    const ingredients = recipe.ingredients
      .map(
        (ingredient) =>
          `${ingredient.quantity} ${labelFor(ingredient.definitionId)}`,
      )
      .join(" + ");
    const output =
      recipe.output.kind === "item"
        ? `${recipe.output.quantity} ${recipe.output.name}`
        : recipe.output.kind === "equipment"
          ? `1 ${recipe.output.name}`
          : recipe.output.name;
    return {
      title: `${skillLabels[recipe.skillId]} · ${recipe.name}`,
      skillId: recipe.skillId,
      actionSeconds: recipe.actionSeconds,
      remainderSeconds: activeRecipe.remainderSeconds,
      lastProcessedAt: activeRecipe.lastProcessedAt,
      nextResult: `${ingredients || "Materiais"} → ${output} · +${recipe.skillXpPerAction} XP`,
    };
  }

  return null;
}

export default function IdleProgressIndicator({
  save,
  compact = false,
  paused = false,
}: IdleProgressIndicatorProps) {
  const work = useMemo(() => getWorkProgress(save), [save]);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const fillRef = useRef<HTMLSpanElement>(null);
  const actionSeconds = work?.actionSeconds ?? 1;
  const remainderSeconds = work?.remainderSeconds ?? 0;
  const lastProcessedAt = work?.lastProcessedAt;

  useEffect(() => {
    if (!lastProcessedAt) return;
    const fill = fillRef.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number | undefined;
    let animation: Animation | undefined;
    const sample = () => {
      const now = Date.now();
      setNowMs(now);
      const elapsed = paused
        ? 0
        : Math.max(0, (now - Date.parse(lastProcessedAt)) / 1000);
      return ((remainderSeconds + elapsed) % actionSeconds) / actionSeconds;
    };
    const stop = () => {
      window.clearInterval(timer);
      animation?.cancel();
      animation = undefined;
    };
    const sync = () => {
      stop();
      if (document.hidden) return;
      const fraction = sample();
      if (fill) fill.style.transform = `scaleX(${fraction})`;
      if (!paused && !motion.matches && fill?.animate) {
        animation = fill.animate(
          [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
          {
            duration: actionSeconds * 1000,
            iterations: Infinity,
            easing: "linear",
          },
        );
        animation.currentTime = fraction * actionSeconds * 1000;
      }
      if (!paused)
        timer = window.setInterval(() => {
          const position = sample();
          if (!animation && fill) fill.style.transform = `scaleX(${position})`;
        }, 1000);
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
    };
  }, [lastProcessedAt, actionSeconds, remainderSeconds, paused]);

  if (!work) {
    return (
      <div
        className={`idle-progress ${compact ? "idle-progress--compact" : ""} idle-progress--empty`}
      >
        <div className="idle-progress__heading">
          <span>
            <small>Atividade atual</small>
            <strong>Nenhuma atividade</strong>
          </span>
          {!compact ? <em>Pronto para começar</em> : null}
        </div>
      </div>
    );
  }

  const lastProcessedMs = Date.parse(work.lastProcessedAt);
  const elapsedSeconds =
    !paused && Number.isFinite(lastProcessedMs)
      ? Math.max(0, (nowMs - lastProcessedMs) / 1000)
      : 0;
  const totalSeconds = work.remainderSeconds + elapsedSeconds;
  const cyclePosition = totalSeconds % work.actionSeconds;
  const progress = Math.min(
    100,
    Math.max(0, (cyclePosition / work.actionSeconds) * 100),
  );
  const remaining = Math.max(0, work.actionSeconds - cyclePosition);
  const skill = save.skills[work.skillId];

  return (
    <div
      className={`idle-progress ${compact ? "idle-progress--compact" : ""} ${paused ? "idle-progress--paused" : ""}`}
    >
      <div className="idle-progress__heading">
        <span>
          <small>Atividade atual</small>
          <strong>{work.title}</strong>
        </span>
        <em>
          {paused ? "Pausada durante risco" : `${Math.ceil(remaining)} s`}
        </em>
      </div>
      <div
        className="idle-progress__track"
        role="progressbar"
        aria-label={`Progresso do ciclo de ${work.title}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <span ref={fillRef} className="idle-progress__fill" />
      </div>
      {!compact ? (
        <div className="idle-progress__details">
          <span>
            <small>Próxima conclusão</small>
            <strong>
              {paused
                ? "Retoma ao voltar para um estado seguro"
                : work.nextResult}
            </strong>
          </span>
          <span>
            <small>Habilidade em curso</small>
            <strong>
              {skillLabels[work.skillId]} Nv. {skill.level} · {skill.xp} XP
            </strong>
          </span>
        </div>
      ) : null}
    </div>
  );
}
