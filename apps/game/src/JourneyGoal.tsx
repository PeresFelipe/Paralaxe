import { useState } from 'react'
import { INITIAL_CRAFTING_RECIPES, INITIAL_IDLE_ACTIVITIES, getCraftingRecipeDefinition } from '@greywake/content'
import { getJourneyGoalProgress, type OfflineGameSave, type SkillId } from '@greywake/domain'
import EquipmentComparison from './EquipmentComparison'
import GameIcon from './GameIcon'
import { getEquipmentIcon, getItemIcon } from './assetIcons'
import { itemLabels, skillLabels } from './gameLabels'

type Props = {
  save: OfflineGameSave
  onChooseGoal: (recipeId: string | null) => Promise<void>
  onOpenSkill: (skill: SkillId) => void
  onOpenEquipment: () => void
}

const recipes = INITIAL_CRAFTING_RECIPES.filter((recipe) => recipe.output.kind !== 'equipment-upgrade')
const purposes: Record<string, string> = {
  'recipe.smithing.giuis-bracers': 'Forje uma peça e compare a proteção com seu equipamento.',
  'recipe.metallurgy.treated-cloch': 'Prepare material usado no Reforço Simples +1 de equipamentos.',
  'recipe.cooking.roasted-scadan': 'Prepare uma refeição que recupera Vida e Stamina em combate.',
  'recipe.cooking.neantog-preparation': 'Prepare um consumível que recupera Vida em combate.',
}

export function JourneyGoalSummary({ save, onOpen }: { save: OfflineGameSave; onOpen: () => void }) {
  const recipe = save.journey.goal ? getCraftingRecipeDefinition(save.journey.goal.recipeDefinitionId) : null
  const progress = recipe ? getJourneyGoalProgress(save, recipe) : null
  return <button className={`journey-goal-summary ${progress?.completed ? 'journey-goal--complete' : ''}`} type="button" onClick={onOpen} aria-haspopup="dialog">
    <GameIcon icon="book-open" size={28} />
    <span><small>{progress?.completed ? 'Meta concluída' : 'Sua próxima conquista'}</small>
      <strong>{recipe?.name ?? 'Escolha uma meta de fabricação'}</strong>
      <span>{progress ? progress.completed ? 'Registrada na Jornada · escolher o próximo passo' : progress.crafting ? 'Na bancada · fabricação em curso' : progress.ready ? 'Materiais reunidos · ver produção' : `${progress.gathered} / ${progress.required} materiais reunidos` : 'Uma receita, um objetivo, no seu ritmo.'}</span>
    </span><span aria-hidden="true">→</span>
  </button>
}

export default function JourneyGoal({ save, onChooseGoal, onOpenSkill, onOpenEquipment }: Props) {
  const [choosing, setChoosing] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recipe = save.journey.goal ? getCraftingRecipeDefinition(save.journey.goal.recipeDefinitionId) : null
  const progress = recipe ? getJourneyGoalProgress(save, recipe) : null
  async function choose(id: string | null) {
    if (pending) return
    setPending(true)
    setError(null)
    try { await onChooseGoal(id); setChoosing(false) }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível salvar sua meta.') }
    finally { setPending(false) }
  }

  return <section className="journey-goal" aria-label="Meta de fabricação" aria-busy={pending}>
    <p className="section-kicker">{progress?.completed ? 'Conquista registrada' : 'Sua próxima conquista'}</p>
    {recipe && progress ? <>
      <div className="journey-goal-title"><GameIcon icon={recipe.output.kind === 'equipment' ? getEquipmentIcon(recipe.output.definitionId) : recipe.output.kind === 'item' ? getItemIcon(recipe.output.definitionId) : 'blacksmith'} size={40} /><h3>{recipe.name}</h3></div>
      <p className="muted">{purposes[recipe.id]}</p>
      {progress.completed ? <div className="journey-complete-copy"><strong>Fabricação concluída.</strong><p>Seu feito permanece registrado, mesmo depois de usar ou guardar o item.</p>
        {recipe.output.kind === 'equipment' ? <button type="button" className="primary-button compact" onClick={onOpenEquipment}>Ver equipamento</button> : null}
      </div> : <>
        <progress value={progress.gathered} max={progress.required || 1} aria-label={`Materiais para ${recipe.name}`} />
        <p className="journey-progress-label">{progress.crafting ? 'Fabricação em curso' : progress.ready ? 'Materiais reunidos' : `${progress.gathered} / ${progress.required} materiais reunidos`} · Inventário</p>
        <ul className="journey-ingredients">{progress.ingredients.map((ingredient) => {
          const source = INITIAL_IDLE_ACTIVITIES.find((activity) => activity.resultItemDefinitionId === ingredient.definitionId)
          const banked = save.character.bank.inventory.find((stack) => stack.definitionId === ingredient.definitionId)?.quantity ?? 0
          return <li key={ingredient.definitionId}><div><strong>{itemLabels[ingredient.definitionId] ?? ingredient.definitionId}</strong><span>{ingredient.owned} / {ingredient.quantity}{ingredient.missing ? ` · faltam ${ingredient.missing}` : ' · reunido'}{ingredient.missing && banked ? ` · ${banked} no Banco` : ''}</span></div>
            {ingredient.missing && source ? <button className="material-source" type="button" onClick={() => onOpenSkill(source.skillId)}>Ver {skillLabels[source.skillId]} →</button> : null}
          </li>
        })}</ul>
        <EquipmentComparison save={save} recipeId={recipe.id} />
        <button className="primary-button compact full-width" type="button" onClick={() => onOpenSkill(recipe.skillId)}>{progress.crafting ? 'Ver fabricação em curso' : `Ver produção · ${skillLabels[recipe.skillId]}`}</button>
      </>}
      <div className="journey-goal-actions"><button type="button" className="ghost-button" disabled={pending} onClick={() => setChoosing(!choosing)}>{choosing ? 'Fechar opções' : progress.completed ? 'Escolher próxima meta' : 'Trocar meta'}</button><button type="button" className="material-source" disabled={pending} onClick={() => void choose(null)}>Dispensar meta</button></div>
    </> : <><h3>O que você quer preparar?</h3><p className="muted">Escolha uma receita. A Jornada acompanha os materiais enquanto você decide o que fazer.</p></>}
    {(!recipe || choosing) ? <div className="journey-goal-options">{recipes.map((candidate) => <button type="button" className="journey-recipe-choice" key={candidate.id} disabled={pending || save.skills[candidate.skillId].level < candidate.requiredSkillLevel} onClick={() => void choose(candidate.id)}>
      <strong>{candidate.name}</strong><span>{purposes[candidate.id]}</span><small>{skillLabels[candidate.skillId]} · {candidate.actionSeconds}s por fabricação</small>
    </button>)}</div> : null}
    {error ? <p role="alert" className="fact-warning">{error}</p> : null}
    {save.journey.craftedRecipeIds.length ? <details className="journey-craft-records"><summary>Fabricações registradas ({save.journey.craftedRecipeIds.length})</summary><ul>{save.journey.craftedRecipeIds.map((id) => <li key={id}>{getCraftingRecipeDefinition(id)?.name ?? 'Receita de uma jornada anterior'}</li>)}</ul></details> : null}
  </section>
}
