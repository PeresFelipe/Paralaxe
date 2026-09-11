import type { CharacterAttributes, CharacterPrestigeState, OfflineGameSave } from './character'

export const CHARACTER_PRESTIGE_MAX_LEVEL = 3
export const CHARACTER_PRESTIGE_POINTS_PER_LEVEL = 5
export const CHARACTER_PRESTIGE_MAX_POINTS = CHARACTER_PRESTIGE_MAX_LEVEL * CHARACTER_PRESTIGE_POINTS_PER_LEVEL

export const PRESTIGE_PURE_BRANCHES = ['body', 'arcane', 'spirit', 'technique'] as const
export type PrestigePureBranch = (typeof PRESTIGE_PURE_BRANCHES)[number]
export type PrestigeNodeGroup = PrestigePureBranch | 'hybrid'
export type PrestigeNodeKind = 'pure' | 'hybrid'

export interface PrestigeBranchRequirement {
  branch: PrestigePureBranch
  count: number
}

export interface PrestigeNodeDefinition {
  id: string
  group: PrestigeNodeGroup
  name: string
  description: string
  cost: number
  tier: number
  kind: PrestigeNodeKind
  prerequisites: readonly string[]
  branchRequirements?: readonly PrestigeBranchRequirement[]
  hybridPath?: string
}

const pureNode = (
  group: PrestigePureBranch,
  id: string,
  name: string,
  description: string,
  cost: number,
  tier: number,
  prerequisites: readonly string[],
): PrestigeNodeDefinition => ({
  id,
  group,
  name,
  description,
  cost,
  tier,
  kind: 'pure',
  prerequisites,
})

const hybridNode = (
  id: string,
  hybridPath: string,
  name: string,
  description: string,
  cost: number,
  tier: number,
  prerequisites: readonly string[],
  branchRequirements: readonly PrestigeBranchRequirement[],
): PrestigeNodeDefinition => ({
  id,
  group: 'hybrid',
  hybridPath,
  name,
  description,
  cost,
  tier,
  kind: 'hybrid',
  prerequisites,
  branchRequirements,
})

export const PRESTIGE_NODES: readonly PrestigeNodeDefinition[] = [
  pureNode('body', 'prestige.body.constitution', 'Constituição', 'Aumenta a Vida máxima.', 1, 1, []),
  pureNode('body', 'prestige.body.war-breath', 'Fôlego de Guerra', 'Aumenta a Stamina máxima e sua recuperação.', 1, 2, ['prestige.body.constitution']),
  pureNode('body', 'prestige.body.impetus', 'Ímpeto', 'Física Agressiva concede eficiência física temporária.', 2, 3, ['prestige.body.war-breath']),
  pureNode('body', 'prestige.body.unshaken', 'Inabalável', 'Um golpe relevante concede redução temporária de dano.', 2, 4, ['prestige.body.impetus']),
  pureNode('body', 'prestige.body.second-wind', 'Segundo Fôlego', 'Uma vez por combate, uma condição crítica recupera Vida e Stamina.', 2, 5, ['prestige.body.unshaken']),
  pureNode('body', 'prestige.body.last-stand', 'Último Bastião', 'Capstone: Vida baixa concede resistência e recuperação de Stamina progressivas e limitadas.', 2, 6, ['prestige.body.second-wind']),

  pureNode('arcane', 'prestige.arcane.mental-reserve', 'Reserva Mental', 'Aumenta a Mana máxima.', 1, 1, []),
  pureNode('arcane', 'prestige.arcane.arcane-flow', 'Fluxo Arcano', 'Aumenta a regeneração de Mana.', 1, 2, ['prestige.arcane.mental-reserve']),
  pureNode('arcane', 'prestige.arcane.channeling', 'Canalização', 'Magias diferentes em sequência fortalecem a eficiência da próxima.', 2, 3, ['prestige.arcane.arcane-flow']),
  pureNode('arcane', 'prestige.arcane.resonance', 'Ressonância', 'Uma sequência diversa acumula Ressonância.', 2, 4, ['prestige.arcane.channeling']),
  pureNode('arcane', 'prestige.arcane.arcane-reserve', 'Reserva Arcana', 'Uma vez por combate em Mana crítica, oferece recuperação e uma janela excepcional.', 2, 5, ['prestige.arcane.resonance']),
  pureNode('arcane', 'prestige.arcane.overload', 'Sobrecarga', 'Capstone: Ressonância máxima permite uma Magia Sobrecarregada.', 2, 6, ['prestige.arcane.arcane-reserve']),

  pureNode('spirit', 'prestige.spirit.conviction', 'Convicção', 'Aumenta a Fé.', 1, 1, []),
  pureNode('spirit', 'prestige.spirit.restorative-grace', 'Graça Restauradora', 'Aumenta o efeito de cura realizada.', 1, 2, ['prestige.spirit.conviction']),
  pureNode('spirit', 'prestige.spirit.spiritual-resistance', 'Resistência Espiritual', 'Aumenta a resistência ao buildup dos cinco status.', 2, 3, ['prestige.spirit.restorative-grace']),
  pureNode('spirit', 'prestige.spirit.intercession', 'Intercessão', 'Converte parte do overheal em proteção temporária limitada.', 2, 4, ['prestige.spirit.spiritual-resistance']),
  pureNode('spirit', 'prestige.spirit.company-bond', 'Vínculo de Companhia', 'O suporte pode beneficiar parcialmente outros membros da Party.', 2, 5, ['prestige.spirit.intercession']),
  pureNode('spirit', 'prestige.spirit.communion', 'Comunhão', 'Capstone: cura e proteção excedentes são parcialmente redirecionadas, com equivalente Solo.', 2, 6, ['prestige.spirit.company-bond']),

  pureNode('technique', 'prestige.technique.steady-hand', 'Mão Firme', 'Aumenta a Precisão.', 1, 1, []),
  pureNode('technique', 'prestige.technique.precise-strike', 'Golpe Preciso', 'Aumenta o Crítico.', 1, 2, ['prestige.technique.steady-hand']),
  pureNode('technique', 'prestige.technique.combat-rhythm', 'Ritmo de Combate', 'Ativos diferentes geram Ritmo.', 2, 3, ['prestige.technique.precise-strike']),
  pureNode('technique', 'prestige.technique.opportunism', 'Oportunismo', 'Críticos aceleram ou preservam Ritmo dentro de limites.', 2, 4, ['prestige.technique.combat-rhythm']),
  pureNode('technique', 'prestige.technique.execution', 'Execução', 'Crítico contra inimigos em Vida baixa recebe efeito adicional.', 2, 5, ['prestige.technique.opportunism']),
  pureNode('technique', 'prestige.technique.rhythm-master', 'Mestre do Ritmo', 'Capstone: Ritmo máximo fortalece o próximo ativo e é consumido.', 2, 6, ['prestige.technique.execution']),

  hybridNode('prestige.hybrid.body-arcane.enchanted-weapon', 'body-arcane', 'Arma Encantada', 'Física Agressiva fortalece a próxima Magia.', 1, 1, [], [{ branch: 'body', count: 3 }, { branch: 'arcane', count: 3 }]),
  hybridNode('prestige.hybrid.body-arcane.arcane-warrior', 'body-arcane', 'Guerreiro Arcano', 'Interação bidirecional entre Física e Magia.', 2, 2, ['prestige.hybrid.body-arcane.enchanted-weapon'], [{ branch: 'body', count: 4 }, { branch: 'arcane', count: 4 }]),
  hybridNode('prestige.hybrid.body-spirit.zeal', 'body-spirit', 'Zelo', 'Habilidade Defensiva ligada a Fé fortalece a próxima ação Física apropriada.', 1, 1, [], [{ branch: 'body', count: 3 }, { branch: 'spirit', count: 3 }]),
  hybridNode('prestige.hybrid.body-spirit.sacred-bastion', 'body-spirit', 'Bastião Sagrado', 'Ações físicas geram Guarda; Milagre ou defesa consome Guarda para fortalecer proteção ou cura.', 2, 2, ['prestige.hybrid.body-spirit.zeal'], [{ branch: 'body', count: 4 }, { branch: 'spirit', count: 4 }]),
  hybridNode('prestige.hybrid.technique-arcane.arcane-blade', 'technique-arcane', 'Lâmina Arcana', 'Crítico físico fortalece a próxima Magia.', 1, 1, [], [{ branch: 'technique', count: 3 }, { branch: 'arcane', count: 3 }]),
  hybridNode('prestige.hybrid.technique-arcane.quick-casting', 'technique-arcane', 'Conjuração Rápida', 'Magia fortalecida abre uma janela para ação física precisa.', 2, 2, ['prestige.hybrid.technique-arcane.arcane-blade'], [{ branch: 'technique', count: 4 }, { branch: 'arcane', count: 4 }]),
  hybridNode('prestige.hybrid.technique-spirit.conviction-strike', 'technique-spirit', 'Golpe de Convicção', 'Crítico fortalece o próximo Milagre.', 1, 1, [], [{ branch: 'technique', count: 3 }, { branch: 'spirit', count: 3 }]),
  hybridNode('prestige.hybrid.technique-spirit.inquisitor', 'technique-spirit', 'Inquisidor', 'Milagre apropriado fortalece a próxima ação física precisa.', 2, 2, ['prestige.hybrid.technique-spirit.conviction-strike'], [{ branch: 'technique', count: 4 }, { branch: 'spirit', count: 4 }]),
] as const

export type PrestigeNodeId = (typeof PRESTIGE_NODES)[number]['id']

export const PRESTIGE_BRANCH_LABELS: Record<PrestigePureBranch, string> = {
  body: 'Corpo',
  arcane: 'Arcano',
  spirit: 'Espírito',
  technique: 'Técnica',
}

export const PRESTIGE_HYBRID_LABELS: Record<string, string> = {
  'body-arcane': 'Corpo + Arcano',
  'body-spirit': 'Corpo + Espírito',
  'technique-arcane': 'Técnica + Arcano',
  'technique-spirit': 'Técnica + Espírito',
}

export function getPrestigeNode(nodeId: string) {
  return PRESTIGE_NODES.find((node) => node.id === nodeId)
}

export function isCharacterPrestigeReady(save: OfflineGameSave) {
  return Object.values(save.skills).every((skill) => skill.prestige >= 1)
}

export function getCharacterPrestigeReadiness(save: OfflineGameSave) {
  const totalSkills = Object.keys(save.skills).length
  const readySkills = Object.values(save.skills).filter((skill) => skill.prestige >= 1).length

  return {
    ready: readySkills === totalSkills,
    readySkills,
    totalSkills,
  }
}

function hasUnlockedNode(state: CharacterPrestigeState, nodeId: string) {
  return state.unlockedNodeIds.includes(nodeId)
}

function countUnlockedBranchNodes(state: CharacterPrestigeState, branch: PrestigePureBranch) {
  return PRESTIGE_NODES.filter((node) => node.kind === 'pure' && node.group === branch && hasUnlockedNode(state, node.id)).length
}

function formatNodeNames(nodeIds: readonly string[]) {
  return nodeIds
    .map((id) => getPrestigeNode(id)?.name)
    .filter((name): name is string => Boolean(name))
    .join(', ')
}

export type PrestigeNodeStatus = 'locked' | 'available' | 'unlocked'

export function getPrestigeNodeAvailability(
  save: OfflineGameSave,
  nodeId: string,
): { status: PrestigeNodeStatus; reason?: string } {
  const node = getPrestigeNode(nodeId)
  const state = save.character.prestige

  if (!node) return { status: 'locked', reason: 'Nó de Prestígio não encontrado.' }
  if (hasUnlockedNode(state, node.id)) return { status: 'unlocked' }
  if (!isCharacterPrestigeReady(save)) {
    return { status: 'locked', reason: 'Exige todas as Skills com Prestígio I.' }
  }
  if (state.level < 1) {
    return { status: 'locked', reason: 'Realize o Prestígio I do personagem.' }
  }
  if (state.points < node.cost) {
    return { status: 'locked', reason: `Faltam ${node.cost - state.points} ponto(s) de Prestígio.` }
  }
  if (node.prerequisites.some((prerequisite) => !hasUnlockedNode(state, prerequisite))) {
    return { status: 'locked', reason: `Requer: ${formatNodeNames(node.prerequisites)}.` }
  }
  if (node.branchRequirements?.some((requirement) => countUnlockedBranchNodes(state, requirement.branch) < requirement.count)) {
    const missing = node.branchRequirements
      .filter((requirement) => countUnlockedBranchNodes(state, requirement.branch) < requirement.count)
      .map((requirement) => `${requirement.count} nós de ${PRESTIGE_BRANCH_LABELS[requirement.branch]}`)
      .join(' e ')
    return { status: 'locked', reason: `Requer ${missing}.` }
  }

  return { status: 'available' }
}

export function unlockCharacterPrestigeNode(
  save: OfflineGameSave,
  nodeId: string,
  now: string,
): OfflineGameSave {
  const node = getPrestigeNode(nodeId)
  if (!node) throw new Error('Nó de Prestígio não encontrado.')

  const availability = getPrestigeNodeAvailability(save, node.id)
  if (availability.status !== 'available') {
    throw new Error(availability.reason ?? 'Esse nó de Prestígio ainda não está disponível.')
  }

  return {
    ...save,
    updatedAt: now,
    character: {
      ...save.character,
      prestige: {
        ...save.character.prestige,
        points: save.character.prestige.points - node.cost,
        unlockedNodeIds: [...save.character.prestige.unlockedNodeIds, node.id],
      },
    },
  }
}

export function performCharacterPrestige(
  save: OfflineGameSave,
  baseAttributes: CharacterAttributes,
  now: string,
): OfflineGameSave {
  if (!isCharacterPrestigeReady(save)) {
    throw new Error('Todas as Skills precisam ter Prestígio I antes do Prestígio do personagem.')
  }
  if (save.character.prestige.level >= CHARACTER_PRESTIGE_MAX_LEVEL) {
    throw new Error('O Prestígio do personagem já atingiu o limite desta versão.')
  }
  if (save.idle.activeActivity || save.crafting.activeRecipe) {
    throw new Error('Pare a atividade atual antes de realizar o Prestígio do personagem.')
  }

  const nextLevel = save.character.prestige.level + 1
  const nextPoints = Math.min(
    CHARACTER_PRESTIGE_MAX_POINTS,
    save.character.prestige.points + CHARACTER_PRESTIGE_POINTS_PER_LEVEL,
  )

  return {
    ...save,
    updatedAt: now,
    character: {
      ...save.character,
      level: 1,
      xp: 0,
      unspentAttributePoints: 0,
      attributes: { ...baseAttributes },
      prestige: {
        ...save.character.prestige,
        level: nextLevel,
        points: nextPoints,
      },
    },
  }
}
