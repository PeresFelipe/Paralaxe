import type { SkillId } from "@greywake/domain";

export type ShikashiIconName =
  | "pickaxe"
  | "axe"
  | "fishing-rod"
  | "herb"
  | "gold-ingot"
  | "blacksmith"
  | "cauldron-fire"
  | "heart"
  | "lungs"
  | "orb-blue"
  | "crown-coin"
  | "stone"
  | "wood"
  | "fish"
  | "cooked-fish"
  | "potion-green"
  | "potion-red"
  | "flask-red"
  | "key"
  | "runestone"
  | "book-open"
  | "sword-long"
  | "shield-wood"
  | "armor-iron"
  | "staff-wizard"
  | "cloak"
  | "bow"
  | "armor-leather"
  | "club"
  | "dagger"
  | "tunic-green"
  | "armor-layered"
  | "gauntlet-leather"
  | "boots-leather"
  | "ring"
  | "helmet-barbute"
  | "gauntlet-metal"
  | "boots-steel"
  | "sword-gladius"
  | "shield-checkered"
  | "staff-green";

export const skillIconById: Record<SkillId, ShikashiIconName> = {
  mining: "pickaxe",
  woodcutting: "axe",
  fishing: "fishing-rod",
  herbology: "herb",
  metallurgy: "gold-ingot",
  smithing: "blacksmith",
  cooking: "cauldron-fire",
};

export const hudIconById = {
  maxHealth: "heart",
  maxMana: "orb-blue",
  maxStamina: "lungs",
  gold: "crown-coin",
} as const satisfies Record<string, ShikashiIconName>;

export const itemIconById: Record<string, ShikashiIconName> = {
  "material.cloch": "stone",
  "material.giuis": "wood",
  "material.scadan": "fish",
  "material.neantog": "herb",
  "material.treated-cloch": "gold-ingot",
  "item.food.roasted-scadan": "cooked-fish",
  "item.consumable.neantog-preparation": "potion-green",
  "item.consumable.field-preparation": "potion-red",
  "item.consumable.crimson-flask": "flask-red",
  "item.key.rusted": "key",
  "item.quest.nameless-stone": "runestone",
  "item.garrison-supply-register": "book-open",
};

export const equipmentIconById: Record<string, ShikashiIconName> = {
  "weapon.militia-sword": "sword-long",
  "shield.militia-shield": "shield-wood",
  "armor.militia-chest": "armor-iron",
  "weapon.simple-staff": "staff-wizard",
  "armor.simple-robes": "cloak",
  "weapon.short-bow": "bow",
  "armor.hunting-jerkin": "armor-leather",
  "weapon.simple-mace": "club",
  "catalyst.simple": "orb-blue",
  "armor.acolyte-robes": "cloak",
  "weapon.hunting-dagger": "dagger",
  "armor.light-outfit": "tunic-green",
  "armor.travel-protection": "armor-layered",
  "armor.simple-gloves": "gauntlet-leather",
  "armor.simple-boots": "boots-leather",
  "armor.giuis-bracers": "gauntlet-leather",
  "item.equipment.traveller-ring": "ring",
  "armor.garrison-helmet": "helmet-barbute",
  "armor.garrison-gloves": "gauntlet-metal",
  "armor.garrison-legs": "tunic-green",
  "armor.garrison-boots": "boots-steel",
  "weapon.garrison-sword": "sword-gladius",
  "weapon.bastion-mace": "club",
  "weapon.patrol-bow": "bow",
  "weapon.campaign-staff": "staff-green",
  "shield.watch-shield": "shield-checkered",
};

export function getShikashiIconPath(icon: ShikashiIconName) {
  return `/art/icons/shikashi/${icon}.png?v=1`;
}

export function getItemIcon(definitionId: string) {
  return itemIconById[definitionId];
}

export function getEquipmentIcon(definitionId: string) {
  return equipmentIconById[definitionId];
}
