import { useState } from 'react'
import { INITIAL_CRAFTING_RECIPES, INITIAL_IDLE_ACTIVITIES } from '@greywake/content'
import { getSkillXpForNextLevel, type OfflineGameSave, type SkillId } from '@greywake/domain'
import IdleProgressIndicator from './IdleProgressIndicator'
import { gatheringSkills, itemLabels, productionSkills, skillLabels } from './gameLabels'

type ActivitiesViewProps = {
  save: OfflineGameSave
  lastWorkResult: string | null
  selectedSkill: SkillId
  onSelectSkill: (skill: SkillId) => void
  onStartActivity: (id: string) => Promise<void>
  onStartRecipe: (id: string) => Promise<void>
  onStopWork: () => Promise<void>
}

export default function ActivitiesView({ save, lastWorkResult, selectedSkill, onSelectSkill, onStartActivity, onStartRecipe, onStopWork }: ActivitiesViewProps) {
  const [pending, setPending] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const progress = save.skills[selectedSkill]
  const nextLevelXp = getSkillXpForNextLevel(progress.level)
  const activities = INITIAL_IDLE_ACTIVITIES.filter((activity) => activity.skillId === selectedSkill)
  const recipes = INITIAL_CRAFTING_RECIPES.filter((recipe) => recipe.skillId === selectedSkill && recipe.output.kind !== 'equipment-upgrade')
  const idle = INITIAL_IDLE_ACTIVITIES.find((activity) => activity.id === save.idle.activeActivity?.activityDefinitionId)
  const craft = INITIAL_CRAFTING_RECIPES.find((recipe) => recipe.id === save.crafting.activeRecipe?.recipeDefinitionId)
  const work = idle?.resultName ?? craft?.name
  const activeSkill = idle?.skillId ?? craft?.skillId
  const animatedArt = selectedSkill === 'fishing'
    ? { motion: '/art/activities/fishing.gif?v=1', still: '/art/activities/fishing-still.png?v=1' }
    : selectedSkill === 'mining'
      ? { motion: '/art/activities/mining.gif?v=1', still: '/art/activities/mining-still.png?v=1' }
      : selectedSkill === 'woodcutting'
        ? { motion: '/art/activities/woodcutting.gif?v=1', still: '/art/activities/woodcutting-still.png?v=1' }
        : selectedSkill === 'herbology'
          ? { motion: '/art/activities/herbology.gif?v=1', still: '/art/activities/herbology-still.png?v=1' }
        : selectedSkill === 'metallurgy'
          ? { motion: '/art/activities/metallurgy.gif?v=1', still: '/art/activities/metallurgy-still.png?v=1' }
        : selectedSkill === 'smithing'
          ? { motion: '/art/activities/smithing.gif?v=1', still: '/art/activities/smithing-still.png?v=1' }
        : selectedSkill === 'cooking'
          ? { motion: '/art/activities/cooking.gif?v=1', still: '/art/activities/cooking-still.png?v=1' }
      : null
  const owned = (id: string) => save.character.inventory.find((stack) => stack.definitionId === id)?.quantity ?? 0

  async function act(action: () => Promise<void>) {
    if (pending) return
    setPending(true)
    setActionError(null)
    try { await action() }
    catch (error) { setActionError(error instanceof Error ? error.message : 'Não foi possível concluir a ação. Tente novamente.') }
    finally { setPending(false) }
  }

  function chooseSkill(skill: SkillId) {
    setActionError(null)
    onSelectSkill(skill)
  }

  return (
    <section className="feature-view activities-view" aria-label="Atividades">
      <div className="view-heading">
        <div><p className="section-kicker">Atividades</p><h1 className="display-title">{skillLabels[selectedSkill]}</h1></div>
        <p className="activity-rule muted">Uma atividade por vez · continua em áreas seguras</p>
      </div>
      <div className="activities-layout">
        <nav className="activities-skill-rail" aria-label="Escolher habilidade">
          {([['Coleta', gatheringSkills], ['Produção', productionSkills]] as const).map(([label, skills]) => (
            <div className="activity-skill-group" key={label}>
              <h2 className="section-title-runtime">{label}</h2>
              <div className="skill-card-grid">
                {skills.map((skill) => <button className={`skill-card ${selectedSkill === skill ? 'active' : ''}`} type="button" key={skill} aria-current={selectedSkill === skill ? 'true' : undefined} onClick={() => chooseSkill(skill)}>
                  <span>{skillLabels[skill]}{activeSkill === skill ? <small className="skill-running">Em curso</small> : null}</span><strong>Nv. {save.skills[skill].level}</strong>
                </button>)}
              </div>
            </div>
          ))}
        </nav>
        <label className="mobile-skill-picker">Habilidade
          <select value={selectedSkill} onChange={(event) => chooseSkill(event.target.value as SkillId)}>
            {([['Coleta', gatheringSkills], ['Produção', productionSkills]] as const).map(([label, skills]) => <optgroup label={label} key={label}>{skills.map((skill) => <option key={skill} value={skill}>{skillLabels[skill]} · Nv. {save.skills[skill].level}{activeSkill === skill ? ' · Em curso' : ''}</option>)}</optgroup>)}
          </select>
        </label>
        <div className="activities-workspace" aria-busy={pending}>
          <div className="activity-stage">
            <div className={`context-art activity-scene${animatedArt ? ' context-art--individual' : ''}`} data-skill={selectedSkill} aria-hidden="true">
              {animatedArt ? <picture>
                <source media="(prefers-reduced-motion: no-preference)" srcSet={animatedArt.motion} />
                <img src={animatedArt.still} alt="" width={480} height={270} decoding="async" />
              </picture> : null}
            </div>
            <div className="activity-live panel">
              <IdleProgressIndicator save={save} />
              <div className="activity-live-actions">
                {work ? <button className="ghost-button" type="button" disabled={pending} onClick={() => void act(onStopWork)}>Parar atividade</button> : <span className="muted">Escolha um recurso ou receita abaixo.</span>}
              </div>
            </div>
          </div>
          <div className="skill-level-strip">
            <strong>{skillLabels[selectedSkill]} · Nv. {progress.level}</strong>
            {nextLevelXp ? <><progress max={nextLevelXp} value={progress.xp} aria-label={`XP de ${skillLabels[selectedSkill]} até o próximo nível`} /><span>{progress.xp} / {nextLevelXp} XP</span></> : <span>Nível máximo da build · {progress.xp} XP</span>}
            <details><summary>Detalhes</summary><p>Prestígio: {progress.prestige}. Trocar a habilidade em consulta mantém a atividade atual.</p></details>
          </div>
          {actionError ? <p className="fact-warning" role="alert">{actionError}</p> : null}
          <div className="activity-options">
            {activities.map((activity) => {
              const active = idle?.id === activity.id
              const unlocked = progress.level >= activity.requiredSkillLevel
              return <article className={`activity-option panel ${active ? 'selected-card' : ''}`} key={activity.id}>
                <div className="item-thumb" aria-hidden="true">{activity.resultName.slice(0, 1)}</div>
                <div className="activity-option-body">
                  <div className="activity-option-title"><h2>{activity.resultName}</h2><span>Possuído: <strong>{owned(activity.resultItemDefinitionId)}</strong></span></div>
                  <p className="activity-yield">+1 por ciclo · {activity.actionSeconds}s · +{activity.skillXpPerAction} XP</p>
                  {!unlocked ? <p className="fact-warning">Requer {skillLabels[selectedSkill]} no nível {activity.requiredSkillLevel}.</p> : null}
                  {work && !active ? <p className="activity-replacement">Ao iniciar, substitui {work}.</p> : null}
                  <button className={active ? 'ghost-button' : 'primary-button compact'} type="button" disabled={pending || !unlocked} onClick={() => void act(active ? onStopWork : () => onStartActivity(activity.id))}>{active ? 'Em curso · Parar' : `Coletar ${activity.resultName}`}</button>
                </div>
              </article>
            })}
            {recipes.map((recipe) => {
              const active = craft?.id === recipe.id
              const enough = recipe.ingredients.every((ingredient) => owned(ingredient.definitionId) >= ingredient.quantity)
              const unlocked = progress.level >= recipe.requiredSkillLevel
              return <article className={`activity-option panel ${active ? 'selected-card' : ''}`} key={recipe.id}>
                <div className="item-thumb" aria-hidden="true">{recipe.name.slice(0, 1)}</div>
                <div className="activity-option-body">
                  <h2>{recipe.name}</h2>
                  <p className="activity-yield">{recipe.actionSeconds}s por ciclo · +{recipe.skillXpPerAction} XP</p>
                  <div className="ingredient-list">
                    {recipe.ingredients.map((ingredient) => {
                      const quantity = owned(ingredient.definitionId)
                      const missing = Math.max(0, ingredient.quantity - quantity)
                      const source = INITIAL_IDLE_ACTIVITIES.find((activity) => activity.resultItemDefinitionId === ingredient.definitionId)
                      const productionSource = INITIAL_CRAFTING_RECIPES.find((candidate) => candidate.output.kind === 'item' && candidate.output.definitionId === ingredient.definitionId)
                      const sourceSkill = source?.skillId ?? productionSource?.skillId
                      return <div key={ingredient.definitionId}><span>{itemLabels[ingredient.definitionId] ?? ingredient.definitionId} <strong>{quantity} / {ingredient.quantity}</strong>{missing ? <small>Faltam {missing}</small> : null}</span>{missing && sourceSkill ? <button className="material-source" type="button" onClick={() => chooseSkill(sourceSkill)}>Ver {skillLabels[sourceSkill]} →</button> : null}</div>
                    })}
                  </div>
                  {!unlocked ? <p className="fact-warning">Requer {skillLabels[selectedSkill]} no nível {recipe.requiredSkillLevel}.</p> : null}
                  {work && !active ? <p className="activity-replacement">Ao iniciar, substitui {work}.</p> : null}
                  <button className={active ? 'ghost-button' : 'primary-button compact'} type="button" disabled={pending || (!active && (!enough || !unlocked))} onClick={() => void act(active ? onStopWork : () => onStartRecipe(recipe.id))}>{active ? 'Em curso · Parar' : enough ? 'Iniciar produção' : 'Faltam materiais'}</button>
                </div>
              </article>
            })}
            {!activities.length && !recipes.length ? <div className="panel"><h2>Sem receitas disponíveis</h2><p className="muted">As melhorias de equipamentos desta build ficam em Personagem → Equipamento.</p></div> : null}
          </div>
          <p className="work-result"><span>Última conclusão</span><strong>{lastWorkResult ?? 'Os resultados da atividade aparecerão aqui.'}</strong></p>
        </div>
      </div>
    </section>
  )
}
