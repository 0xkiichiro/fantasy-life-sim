import type { CharacterTemplate } from "../engine/characterEngine/objects/CharacterTemplate";

/**
 * The fantasy game's concrete character template — the actual values the
 * generic characterEngine needs. A second game (different setting,
 * different relationships) would supply its own template of this same
 * shape rather than touching the engine.
 */
export const FANTASY_CHARACTER_TEMPLATE: CharacterTemplate = {
  namePool: ["Elenwyn", "Rodric", "Sabine", "Torvald", "Maren", "Cassian", "Ysolde", "Bram"],
  statRanges: {
    strength: { min: 5, max: 10 },
    dexterity: { min: 5, max: 10 },
    intelligence: { min: 5, max: 10 },
    charisma: { min: 5, max: 10 },
  },
  startingGold: 10,
  startingRelationships: [
    { id: "mother", label: "Mother", startingScore: 50 },
    { id: "father", label: "Father", startingScore: 50 },
    { id: "friend", label: "Friend", startingScore: 40 },
    { id: "love", label: "Love Interest", startingScore: 0 },
  ],
};
