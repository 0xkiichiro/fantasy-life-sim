import { CharacterClass, CharacterClassTemplate } from "./objects/CharacterClass";

const templates: CharacterClassTemplate[] = [
  {
    name: "Warrior",
    primaryStat: "strength",
    comingOfAgeBonus: 4,
    description: "Steel and grit. Strength governs most of what a Warrior can attempt.",
  },
  {
    name: "Mage",
    primaryStat: "intelligence",
    comingOfAgeBonus: 4,
    description: "The old words, learned the hard way. Intelligence governs spellcraft.",
  },
  {
    name: "Rogue",
    primaryStat: "dexterity",
    comingOfAgeBonus: 4,
    description: "Speed and misdirection. Dexterity governs most of what a Rogue can attempt.",
  },
];

export const CHARACTER_CLASSES: Record<string, CharacterClass> = Object.fromEntries(
  templates.map((t) => [t.name, CharacterClass.fromTemplate(t)])
);
