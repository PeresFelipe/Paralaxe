import { describe, expect, it } from 'vitest'
import { createOfflineGameSave, type OfflineGameSave } from './character'
import {
  PRESTIGE_NODES,
  getCharacterPrestigeReadiness,
  getPrestigeNodeAvailability,
  isCharacterPrestigeReady,
  performCharacterPrestige,
  unlockCharacterPrestigeNode,
} from './prestige'

const characterClass = {
  id: 'wanderer' as const,
  name: 'Errante',
  summary: 'Teste',
  attributes: {
    vitality: 5,
    mind: 5,
    vigor: 5,
    strength: 5,
    dexterity: 5,
    intelligence: 5,
    faith: 5,
  },
  startingEquipment: {
    mainHand: 'weapon.travel-spear',
  },
  startingAbilityId: 'ability.opening',
}

const gift = {
  id: 'none' as const,
  name: 'Nenhum',
  summary: 'Teste',
  grants: [],
}

function createSave() {
  return createOfflineGameSave({
    saveId: 'prestige-test',
    createdAt: '2026-09-09T12:00:00.000Z',
    contentVersion: '0.1.0-dev',
    characterName: 'Teste',
    characterClass,
    gift,
  })
}

function readySave(points = 5): OfflineGameSave {
  const save = createSave()

  return {
    ...save,
    skills: Object.fromEntries(
      Object.entries(save.skills).map(([skillId, progress]) => [skillId, { ...progress, prestige: 1 }]),
    ) as typeof save.skills,
    character: {
      ...save.character,
      prestige: { level: 1, points, unlockedNodeIds: [] },
    },
  }
}

describe('Árvore de Prestígio do personagem', () => {
  it('define os 32 nós previstos e mantém o personagem bloqueado antes das Skills', () => {
    const save = createSave()
    const readiness = getCharacterPrestigeReadiness(save)

    expect(PRESTIGE_NODES).toHaveLength(32)
    expect(isCharacterPrestigeReady(save)).toBe(false)
    expect(readiness).toEqual({ ready: false, readySkills: 0, totalSkills: 7 })
    expect(getPrestigeNodeAvailability(save, PRESTIGE_NODES[0]!.id)).toEqual({
      status: 'locked',
      reason: 'Exige todas as Skills com Prestígio I.',
    })

    const readyBase = readySave(0)
    const ready = {
      ...readyBase,
      character: {
        ...readyBase.character,
        prestige: { level: 0, points: 0, unlockedNodeIds: [] },
      },
    }
    expect(getPrestigeNodeAvailability(ready, PRESTIGE_NODES[0]!.id)).toEqual({
      status: 'locked',
      reason: 'Realize o Prestígio I do personagem.',
    })
  })

  it('desbloqueia nós puros em sequência e consome os pontos corretos', () => {
    let save = readySave()
    save = unlockCharacterPrestigeNode(save, 'prestige.body.constitution', '2026-09-09T12:01:00.000Z')

    expect(save.character.prestige.points).toBe(4)
    expect(save.character.prestige.unlockedNodeIds).toEqual(['prestige.body.constitution'])
    expect(getPrestigeNodeAvailability(save, 'prestige.body.impetus').reason).toBe('Requer: Fôlego de Guerra.')

    expect(() => unlockCharacterPrestigeNode(save, 'prestige.body.impetus', '2026-09-09T12:02:00.000Z'))
      .toThrow('Requer: Fôlego de Guerra')
  })

  it('libera um híbrido após os requisitos dos dois ramos', () => {
    let save = readySave(20)
    const bodyNodes = [
      'prestige.body.constitution',
      'prestige.body.war-breath',
      'prestige.body.impetus',
    ]
    const arcaneNodes = [
      'prestige.arcane.mental-reserve',
      'prestige.arcane.arcane-flow',
      'prestige.arcane.channeling',
    ]

    for (const nodeId of [...bodyNodes, ...arcaneNodes]) {
      save = unlockCharacterPrestigeNode(save, nodeId, '2026-09-09T12:01:00.000Z')
    }

    expect(getPrestigeNodeAvailability(save, 'prestige.hybrid.body-arcane.enchanted-weapon').status).toBe('available')
    save = unlockCharacterPrestigeNode(save, 'prestige.hybrid.body-arcane.enchanted-weapon', '2026-09-09T12:02:00.000Z')
    expect(save.character.prestige.points).toBe(11)
  })

  it('realiza o primeiro Prestígio, reinicia a jornada e preserva a árvore', () => {
    const ready = readySave(0)
    const save = {
      ...ready,
      character: {
        ...ready.character,
        level: 8,
        xp: 1_200,
        unspentAttributePoints: 3,
        attributes: {
          vitality: 8,
          mind: 6,
          vigor: 7,
          strength: 5,
          dexterity: 5,
          intelligence: 5,
          faith: 5,
        },
        prestige: { level: 0, points: 0, unlockedNodeIds: [] },
      },
    }
    const baseAttributes = characterClass.attributes
    const next = performCharacterPrestige(save, baseAttributes, '2026-09-09T12:10:00.000Z')

    expect(next.character.level).toBe(1)
    expect(next.character.xp).toBe(0)
    expect(next.character.unspentAttributePoints).toBe(0)
    expect(next.character.attributes).toEqual(baseAttributes)
    expect(next.character.prestige).toEqual({ level: 1, points: 5, unlockedNodeIds: [] })
  })
})
