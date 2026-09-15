import type { SkillId } from "@greywake/domain";

export const skillLabels: Record<SkillId, string> = {
  mining: "Mineração",
  woodcutting: "Lenhador",
  fishing: "Pesca",
  herbology: "Herbologia",
  metallurgy: "Metalurgia",
  smithing: "Forja",
  cooking: "Culinária",
};

export const gatheringSkills: SkillId[] = [
  "mining",
  "woodcutting",
  "fishing",
  "herbology",
];
export const productionSkills: SkillId[] = [
  "metallurgy",
  "smithing",
  "cooking",
];

export const itemLabels: Record<string, string> = {
  "material.cloch": "Cloch",
  "material.giuis": "Giúis",
  "material.scadan": "Scadán",
  "material.neantog": "Neantóg",
  "material.treated-cloch": "Cloch Tratada",
  "item.food.roasted-scadan": "Scadán Assado",
  "item.consumable.neantog-preparation": "Preparado de Neantóg",
  "item.consumable.field-preparation": "Preparado de Campo",
  "item.consumable.crimson-flask": "Frasco Carmesim",
  "item.key.rusted": "Chave Enferrujada",
  "item.quest.nameless-stone": "Pedra Sem Nome",
  "item.equipment.traveller-ring": "Anel do Viajante",
  "item.garrison-supply-register": "Registro de Suprimentos",
  "item.treaty-fragment": "Fragmento do Tratado",
  "item.fairtheoir-fragment": "Fragmento de Fairtheoir",
};
