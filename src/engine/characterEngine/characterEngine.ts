import { Character, CoreStats } from "../shared/objects/Character";
import { Relationship } from "../shared/objects/Relationship";
import type { CharacterTemplate } from "./objects/CharacterTemplate";
import type { StatRange } from "./objects/StatRange";
import type { FamilyOrigin } from "./objects/FamilyOrigin";
import type { WeightedCount } from "./objects/WeightedCount";
import type { Household } from "./objects/Household";

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

  const relationships: Relationship[] = [];
  for (const seed of template.startingRelationships) {
    if (seed.id === "mother" && !household.hasMother) continue;
    if (seed.id === "father" && !household.hasFather) continue;
    relationships.push(new Relationship(seed.id, seed.label, seed.startingScore));
  }

  for (let i = 0; i < household.siblings; i++) {
    relationships.push(new Relationship(`sibling-${i + 1}`, pick(template.siblingLabels), 45));
  }

  return new Character({
    name: pick(template.namePool),
    stats,
    startingGold: rollWithinRange(origin.goldRange),
    relationships,
    familyDescription: origin.describe(household),
  });
}
