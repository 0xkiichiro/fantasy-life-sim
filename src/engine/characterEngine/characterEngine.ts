import { Character, CoreStats } from "../shared/objects/Character";
import { Relationship } from "../shared/objects/Relationship";
import type { CharacterTemplate } from "./objects/CharacterTemplate";
import type { StatRange } from "./objects/StatRange";
import type { FamilyOrigin } from "./objects/FamilyOrigin";
import type { Household } from "./objects/Household";
import type { PersonTrait } from "./objects/PersonTrait";

function rollWithinRange(range: StatRange): number {
  return range.min + Math.floor(Math.random() * (range.max - range.min + 1));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function chance(probability: number): boolean {
  return Math.random() < probability;
}

function pickWeighted<T extends { weight: number }>(items: T[]): T {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= item.weight;
    if (roll <= 0) return item;
  }
  return items[items.length - 1];
}

function pickTraits(pool: PersonTrait[], role: string, count: number): string[] {
  const eligible = pool.filter((trait) => trait.roles.includes(role));
  const chosen: string[] = [];
  while (chosen.length < count && chosen.length < eligible.length) {
    const remaining = eligible.filter((trait) => !chosen.includes(trait.id));
    if (remaining.length === 0) break;
    chosen.push(pickWeighted(remaining).id);
  }
  return chosen;
}

export function createCharacter(template: CharacterTemplate): Character {
  const stats: CoreStats = {
    strength: rollWithinRange(template.statRanges.strength),
    dexterity: rollWithinRange(template.statRanges.dexterity),
    intelligence: rollWithinRange(template.statRanges.intelligence),
    charisma: rollWithinRange(template.statRanges.charisma),
  };

  const household: Household = {
    hasMother: chance(template.parentOdds.mother),
    hasFather: chance(template.parentOdds.father),
    siblings: pickWeighted(template.siblingCounts).count,
  };

  const origin: FamilyOrigin = pickWeighted(template.origins);
  const usedNames = new Set<string>();

  function uniqueName(names: string[]): string {
    const available = names.filter((n) => !usedNames.has(n));
    const chosen = pick(available.length > 0 ? available : names);
    usedNames.add(chosen);
    return chosen;
  }

  const relationships: Relationship[] = [];

  for (const seed of template.startingRelationships) {
    if (seed.id === "mother" && !household.hasMother) continue;
    if (seed.id === "father" && !household.hasFather) continue;

    const isParent = seed.id === "mother" || seed.id === "father";
    if (!isParent) {
      relationships.push(
        new Relationship({ id: seed.id, label: seed.label, score: seed.startingScore })
      );
      continue;
    }

    const isMother = seed.id === "mother";
    relationships.push(
      new Relationship({
        id: seed.id,
        label: seed.label,
        score: seed.startingScore,
        name: uniqueName(isMother ? template.femaleNames : template.maleNames),
        ageOffset: rollWithinRange(isMother ? template.motherAgeOffset : template.fatherAgeOffset),
        traits: pickTraits(
          template.traitPool,
          "parent",
          pickWeighted(template.traitsPerParent).count
        ),
      })
    );
  }

  for (let i = 0; i < household.siblings; i++) {
    const sister = chance(0.5);
    relationships.push(
      new Relationship({
        id: `sibling-${i + 1}`,
        label: sister ? "Sister" : "Brother",
        score: 45,
        name: uniqueName(sister ? template.femaleNames : template.maleNames),
        ageOffset: rollWithinRange(template.siblingAgeOffset),
        traits: pickTraits(
          template.traitPool,
          "sibling",
          pickWeighted(template.traitsPerSibling).count
        ),
      })
    );
  }

  return new Character({
    name: pick(template.namePool),
    stats,
    startingGold: rollWithinRange(origin.goldRange),
    relationships,
    familyDescription: origin.describe(household),
  });
}
