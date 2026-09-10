import type { CharacterClassDefinition, GiftDefinition } from '@greywake/domain'

export const CHARACTER_CLASSES = [
  {
    id: 'warrior',
    name: 'Guerreiro',
    summary: 'Corpo a corpo, sobrevivência, Força e Vigor.',
    attributes: {
      vitality: 7,
      mind: 2,
      vigor: 7,
      strength: 8,
      dexterity: 4,
      intelligence: 2,
      faith: 5,
    },
    startingEquipment: {
      mainHand: 'weapon.militia-sword',
      offHand: 'shield.militia-shield',
      chest: 'armor.militia-chest',
    },
    startingAbilityId: 'ability.strength-strike',
  },
  {
    id: 'mage',
    name: 'Mago',
    summary: 'Mana, Inteligência e acesso imediato a dano mágico.',
    attributes: {
      vitality: 4,
      mind: 8,
      vigor: 3,
      strength: 2,
      dexterity: 3,
      intelligence: 10,
      faith: 5,
    },
    startingEquipment: {
      mainHand: 'weapon.simple-staff',
      chest: 'armor.simple-robes',
    },
    startingAbilityId: 'ability.arcane-pulse',
  },
  {
    id: 'hunter',
    name: 'Caçador',
    summary: 'Destreza, Precisão e combate à distância.',
    attributes: {
      vitality: 5,
      mind: 3,
      vigor: 6,
      strength: 4,
      dexterity: 10,
      intelligence: 2,
      faith: 5,
    },
    startingEquipment: {
      mainHand: 'weapon.short-bow',
      chest: 'armor.hunting-jerkin',
    },
    startingAbilityId: 'ability.precise-shot',
  },
  {
    id: 'acolyte',
    name: 'Acólito',
    summary: 'Fé, cura, defesa e suporte.',
    attributes: {
      vitality: 5,
      mind: 8,
      vigor: 4,
      strength: 3,
      dexterity: 2,
      intelligence: 3,
      faith: 10,
    },
    startingEquipment: {
      mainHand: 'weapon.simple-mace',
      offHand: 'catalyst.simple',
      chest: 'armor.acolyte-robes',
    },
    startingAbilityId: 'ability.restoring-prayer',
  },
  {
    id: 'rogue',
    name: 'Ladino',
    summary: 'Destreza, crítico e velocidade.',
    attributes: {
      vitality: 4,
      mind: 3,
      vigor: 7,
      strength: 3,
      dexterity: 11,
      intelligence: 4,
      faith: 3,
    },
    startingEquipment: {
      mainHand: 'weapon.hunting-dagger',
      chest: 'armor.light-outfit',
    },
    startingAbilityId: 'ability.opportunistic-strike',
  },
  {
    id: 'wanderer',
    name: 'Errante',
    summary: 'Início equilibrado sem atributo atrasado.',
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
      chest: 'armor.travel-protection',
    },
    startingAbilityId: 'ability.opening',
  },
] as const satisfies readonly CharacterClassDefinition[]

export const INITIAL_GIFTS = [
  {
    id: 'rusted-key',
    name: 'Chave Enferrujada',
    summary: 'Exploração e acesso antecipado a um segredo opcional.',
    grants: [{ kind: 'item', definitionId: 'item.key.rusted', quantity: 1 }],
  },
  {
    id: 'coin-pouch',
    name: 'Bolsa de Moedas',
    summary: 'Começa com 60 moedas adicionais.',
    grants: [{ kind: 'gold', amount: 60 }],
  },
  {
    id: 'crimson-flask',
    name: 'Frasco Carmesim',
    summary: 'Consumível raro de emergência para recuperar Vida.',
    grants: [{ kind: 'item', definitionId: 'item.consumable.crimson-flask', quantity: 1 }],
  },
  {
    id: 'traveller-ring',
    name: 'Anel do Viajante',
    summary: 'Pequeno bônus versátil enquanto estiver equipado.',
    grants: [{ kind: 'equipment', definitionId: 'item.equipment.traveller-ring', equipSlot: 'ring1' }],
  },
  {
    id: 'nameless-stone',
    name: 'Pedra Sem Nome',
    summary: 'Objeto ligado a lore, diálogo e conteúdo secreto.',
    grants: [{ kind: 'item', definitionId: 'item.quest.nameless-stone', quantity: 1 }],
  },
  {
    id: 'survival-kit',
    name: 'Kit de Sobrevivência',
    summary: '2× Preparado de Campo e 2× Scadán Assado.',
    grants: [
      { kind: 'item', definitionId: 'item.consumable.field-preparation', quantity: 2 },
      { kind: 'item', definitionId: 'item.food.roasted-scadan', quantity: 2 },
    ],
  },
  {
    id: 'none',
    name: 'Nenhum Presente',
    summary: 'Nenhuma vantagem e nenhuma compensação escondida.',
    grants: [],
  },
] as const satisfies readonly GiftDefinition[]
