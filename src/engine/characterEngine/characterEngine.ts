import { Character, CoreStats } from "../shared/objects/Character";
import { Relationship } from "../shared/objects/Relationship";
import type { CharacterTemplate, StatRange } from "./objects/CharacterTemplate";

function rollWithinRange(range: StatRange): number {
  return range.min + Math.floor(Math.random() * (range.max - range.min + 1));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function createCharacter(template: CharacterTemplate): Character {
  const stats: CoreStats = {
    strength: rollWithinRange(template.statRanges.strength),
    dexterity: rollWithinRange(template.statRanges.dexterity),
    intelligence: rollWithinRange(template.statRanges.intelligence),
    charisma: rollWithinRange(template.statRanges.charisma),
  };

  const relationships = template.startingRelationships.map(
    (seed) => new Relationship(seed.id, seed.label, seed.startingScore)
  );

  return new Character({
    name: pick(template.namePool),
    stats,
    startingGold: template.startingGold,
    relationships,
  });
}
