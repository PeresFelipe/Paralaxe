/**
 * @file Amostra fixa do formato publicado antes da tradução do código.
 * Os nomes e valores em inglês são dados intencionais do teste de compatibilidade.
 * Não traduzir as chaves nem regenerar a amostra a partir do conversor que ela testa.
 */
// Amostra criada pela API da main 3a251bf antes da tradução. Preservar o formato.
/** Combina personagem, banco, trabalho, meta e expedição para exercitar estruturas aninhadas. */
export const partidaLegadaV10 = {
  "saveId": "warrior",
  "saveMode": "OFFLINE",
  "saveSchemaVersion": 10,
  "contentVersion": "0.1.0-dev",
  "createdAt": "2026-09-15T12:00:00.000Z",
  "updatedAt": "2026-09-15T12:00:00.000Z",
  "playtimeSeconds": 0,
  "character": {
    // O nome livre coincide com um ID de classe de propósito: apenas classId deve ser traduzido.
    "name": "warrior",
    "classId": "warrior",
    "giftId": "traveller-ring",
    "level": 1,
    "xp": 0,
    "unspentAttributePoints": 0,
    "attributes": {
      "vitality": 7,
      "mind": 2,
      "vigor": 7,
      "strength": 8,
      "dexterity": 4,
      "intelligence": 2,
      "faith": 5
    },
    "gold": 321,
    "inventory": [
      {
        "definitionId": "material.cloch",
        "quantity": 7
      },
      {
        "definitionId": "material.giuis",
        "quantity": 4
      },
      {
        "definitionId": "item.consumable.field-preparation",
        "quantity": 2
      }
    ],
    "bank": {
      "inventory": [
        {
          "definitionId": "item.food.roasted-scadan",
          "quantity": 2
        }
      ],
      "equipmentItems": []
    },
    "equipment": {
      "chest": "eq-1",
      "mainHand": "eq-2",
      "offHand": "eq-3",
      "ring1": "eq-4"
    },
    "equipmentItems": [
      {
        "instanceId": "eq-1",
        "definitionId": "armor.militia-chest",
        "upgradeLevel": 0
      },
      {
        "instanceId": "eq-2",
        "definitionId": "weapon.militia-sword",
        "upgradeLevel": 0
      },
      {
        "instanceId": "eq-3",
        "definitionId": "shield.militia-shield",
        "upgradeLevel": 0
      },
      {
        "instanceId": "eq-4",
        "definitionId": "item.equipment.traveller-ring",
        "upgradeLevel": 0
      }
    ],
    "nextEquipmentSequence": 5,
    "knownAbilityIds": [
      "ability.strength-strike"
    ],
    "activeAbilitySlots": [
      "ability.strength-strike",
      null,
      null,
      null
    ],
    "currentLocationId": "dungeon.dun-liath.easy",
    "prestige": {
      "level": 1,
      "points": 3,
      "unlockedNodeIds": [
        "prestige.body.constitution"
      ]
    }
  },
  "skills": {
    "mining": {
      "level": 1,
      "xp": 0,
      "prestige": 0
    },
    "woodcutting": {
      "level": 1,
      "xp": 0,
      "prestige": 0
    },
    "fishing": {
      "level": 1,
      "xp": 0,
      "prestige": 0
    },
    "herbology": {
      "level": 1,
      "xp": 0,
      "prestige": 0
    },
    "metallurgy": {
      "level": 1,
      "xp": 0,
      "prestige": 0
    },
    "smithing": {
      "level": 1,
      "xp": 0,
      "prestige": 0
    },
    "cooking": {
      "level": 1,
      "xp": 0,
      "prestige": 0
    }
  },
  "idle": {
    "activeActivity": {
      "activityDefinitionId": "gather.mining.cloch",
      "startedAt": "2026-09-15T12:00:00.000Z",
      "lastProcessedAt": "2026-09-15T12:00:00.000Z",
      "remainderSeconds": 0
    }
  },
  "crafting": {
    "activeRecipe": null
  },
  "journey": {
    "craftedRecipeIds": [
      "recipe.metallurgy.treated-cloch"
    ],
    "goal": {
      "recipeDefinitionId": "recipe.smithing.giuis-bracers",
      "selectedAt": "2026-09-15T12:00:00.000Z",
      "completedAt": null
    }
  },
  "combat": {
    "preferences": {
      "style": "mixed",
      "defensiveHealthThresholdPercent": 60,
      "consumableSlots": [
        {
          "definitionId": null,
          "autoUseResource": null,
          "autoUseThresholdPercent": null
        },
        {
          "definitionId": null,
          "autoUseResource": null,
          "autoUseThresholdPercent": null
        }
      ]
    },
    "lastRun": null,
    "wolfDefeated": true
  },
  "dungeon": {
    // Expedição em andamento: semente, escolhas e recursos precisam sobreviver à conversão.
    "activeRun": {
      "dungeonDefinitionId": "dungeon.dun-liath.easy",
      "difficulty": "easy",
      "seed": 777,
      "currentRoomId": "room.entrance",
      "visitedRoomIds": [
        "room.entrance"
      ],
      "resolvedRoomIds": [],
      "chosenBranches": {},
      "expeditionBag": [],
      "expeditionEquipment": [],
      "resources": {
        "health": 184,
        "maxHealth": 184,
        "mana": 50,
        "maxMana": 50,
        "stamina": 116,
        "maxStamina": 116
      },
      "protectorDecision": null,
      "supplyRegisterRecovered": false,
      "treatyFragmentRecovered": false,
      "safeExtractionAvailable": false,
      "completed": false,
      "startedAt": "2026-09-15T12:00:00.000Z",
      "updatedAt": "2026-09-15T12:00:00.000Z"
    },
    "dunLiathEasyCleared": false,
    "dunLiathProtector": null,
    "contractCompleted": false,
    "instinctiveGuardUnlocked": false,
    "contractAccepted": true
  }
}
