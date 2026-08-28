import type { CharacterTemplate } from "../engine/characterEngine/objects/CharacterTemplate";
import { FAMILY_BACKGROUNDS } from "./familyBackgrounds";

export const FANTASY_CHARACTER_TEMPLATE: CharacterTemplate = {
  namePool: ["Elenwyn", "Rodric", "Sabine", "Torvald", "Maren", "Cassian", "Ysolde", "Bram"],
  statRanges: {
    strength: { min: 5, max: 10 },
    dexterity: { min: 5, max: 10 },
    intelligence: { min: 5, max: 10 },
    charisma: { min: 5, max: 10 },
  },
  origins: FAMILY_BACKGROUNDS,
  parentOdds: { mother: 0.86, father: 0.78 },
  siblingCounts: [
    { count: 0, weight: 18 },
    { count: 1, weight: 28 },
    { count: 2, weight: 24 },
    { count: 3, weight: 15 },
    { count: 4, weight: 9 },
    { count: 5, weight: 4 },
    { count: 6, weight: 2 },
  ],
  siblingLabels: ["Elder Brother", "Elder Sister", "Younger Brother", "Younger Sister"],
  startingRelationships: [
    { id: "mother", label: "Mother", startingScore: 50 },
    { id: "father", label: "Father", startingScore: 50 },
    { id: "love", label: "Love Interest", startingScore: 0 },
  ],
};
