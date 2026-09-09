import type { IdleActivityDefinition } from '@greywake/domain'

export const INITIAL_IDLE_ACTIVITIES = [
  {
    id: 'gather.mining.cloch',
    skillId: 'mining',
    name: 'Extrair Cloch',
    resultItemDefinitionId: 'material.cloch',
    resultName: 'Cloch',
    requiredSkillLevel: 1,
    actionSeconds: 4,
    skillXpPerAction: 8,
  },
  {
    id: 'gather.woodcutting.giuis',
    skillId: 'woodcutting',
    name: 'Cortar Giúis',
    resultItemDefinitionId: 'material.giuis',
    resultName: 'Giúis',
    requiredSkillLevel: 1,
    actionSeconds: 4,
    skillXpPerAction: 8,
  },
  {
    id: 'gather.fishing.scadan',
    skillId: 'fishing',
    name: 'Pescar Scadán',
    resultItemDefinitionId: 'material.scadan',
    resultName: 'Scadán',
    requiredSkillLevel: 1,
    actionSeconds: 5,
    skillXpPerAction: 10,
  },
  {
    id: 'gather.herbology.neantog',
    skillId: 'herbology',
    name: 'Colher Neantóg',
    resultItemDefinitionId: 'material.neantog',
    resultName: 'Neantóg',
    requiredSkillLevel: 1,
    actionSeconds: 4,
    skillXpPerAction: 8,
  },
] as const satisfies readonly IdleActivityDefinition[]

export function getIdleActivityDefinition(activityDefinitionId: string) {
  return INITIAL_IDLE_ACTIVITIES.find((activity) => activity.id === activityDefinitionId) ?? null
}
