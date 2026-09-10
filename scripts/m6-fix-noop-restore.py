from pathlib import Path

combat = Path('packages/domain/src/combat.ts')
text = combat.read_text()
old = """    .filter((entry) => {\n      const ability = entry.definition\n      if (ability.resource === 'mana' && resources.mana < (ability.resourceCost ?? 0)) return false\n      if (ability.resource === 'stamina' && resources.stamina < (ability.resourceCost ?? 0)) return false\n      if (ability.profile === 'defensive') return defensiveCondition(ability)\n      return true\n    })\n"""
new = """    .filter((entry) => {\n      const ability = entry.definition\n      if (ability.resource === 'mana' && resources.mana < (ability.resourceCost ?? 0)) return false\n      if (ability.resource === 'stamina' && resources.stamina < (ability.resourceCost ?? 0)) return false\n      if (ability.restore) {\n        const canRestore =\n          ((ability.restore.health ?? 0) > 0 && resources.health < resources.maxHealth) ||\n          ((ability.restore.mana ?? 0) > 0 && resources.mana < resources.maxMana) ||\n          ((ability.restore.stamina ?? 0) > 0 && resources.stamina < resources.maxStamina)\n        if (!canRestore) return false\n      }\n      if (ability.profile === 'defensive') return defensiveCondition(ability)\n      return true\n    })\n"""
if old not in text:
    raise SystemExit('chooseAbility anchor not found')
combat.write_text(text.replace(old, new))

test = Path('packages/domain/src/combat.test.ts')
text = test.read_text()
old_abilities = """  {\n    id: 'ability.opening',\n    name: 'Abertura',\n    profile: 'aggressive',\n    cooldownSeconds: 7,\n    damage: { kind: 'weapon-multiplier', multiplier: 1.35, damageType: 'pierce', accuracyBonusPercentagePoints: 10 },\n  },\n]\n"""
new_abilities = """  {\n    id: 'ability.opening',\n    name: 'Abertura',\n    profile: 'aggressive',\n    cooldownSeconds: 7,\n    damage: { kind: 'weapon-multiplier', multiplier: 1.35, damageType: 'pierce', accuracyBonusPercentagePoints: 10 },\n  },\n  {\n    id: 'ability.combat-breath',\n    name: 'Fôlego de Combate',\n    profile: 'defensive',\n    cooldownSeconds: 12,\n    restore: { stamina: 24 },\n  },\n]\n"""
if old_abilities not in text:
    raise SystemExit('abilities anchor not found')
text = text.replace(old_abilities, new_abilities)
anchor = """  it('procs buildup and exposes defensive posture events in the deterministic log', () => {\n"""
addition = """  it('skips a defensive restore ability when it would restore nothing', () => {\n    const base = createSave()\n    const save = {\n      ...base,\n      character: {\n        ...base.character,\n        knownAbilityIds: ['ability.combat-breath', 'ability.opening'],\n        activeAbilitySlots: ['ability.combat-breath', 'ability.opening', null, null] as [string | null, string | null, string | null, string | null],\n      },\n    }\n    const result = simulateCombat(save, catalog, postureDummy.id, 7, 2.2, {\n      health: 80, maxHealth: 160, mana: 80, maxMana: 80, stamina: 100, maxStamina: 100,\n    })\n\n    expect(result.log.some((entry) => entry.message.includes('Fôlego de Combate'))).toBe(false)\n    expect(result.log.some((entry) => entry.message.includes('Abertura'))).toBe(true)\n  })\n\n""" + anchor
if anchor not in text:
    raise SystemExit('test insertion anchor not found')
test.write_text(text.replace(anchor, addition))
