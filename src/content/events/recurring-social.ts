import type { GameEvent } from "../../engine/eventEngine/objects/GameEvent";
import { rollAdvantage } from "../../engine/diceEngine/diceEngine";

export const RECURRING_SOCIAL_EVENTS: GameEvent[] = [
  {
    id: "gs-festival",
    category: "recurring",
    minAge: 10,
    maxAge: 90,
    text: "There's a gathering in the square this week — music, drink, half the village out past dark.",
    pool: "social",
    options: [
      {
        label: "Go, and enjoy it",
        cost: { pool: "social", amount: 1 },
        resolve: (c) => {
          c.applyConditionChange("happiness", 6);
          c.adjustRelationship("friend", 4);
          return { log: "A good night, plainly enjoyed." };
        },
      },
      { label: "Stay in", resolve: () => ({ log: "You let the noise carry on without you." }) },
    ],
  },
  {
    id: "gs-parents-visit",
    category: "recurring",
    minAge: 12,
    maxAge: 90,
    requires: (c) => c.relationshipScore("mother") > 0 || c.relationshipScore("father") > 0,
    text: "It's been a while since you properly visited your parents. They'd never say they've noticed, but they have.",
    pool: "social",
    options: [
      {
        label: "Visit them",
        cost: { pool: "social", amount: 1 },
        resolve: (c) => {
          c.adjustRelationship("mother", 6);
          c.adjustRelationship("father", 6);
          return { log: "You sit at their table like you used to." };
        },
      },
      {
        label: "Not this year",
        resolve: (c) => {
          c.adjustRelationship("mother", -3);
          c.adjustRelationship("father", -3);
          return { log: "Another season slips by without you." };
        },
      },
    ],
  },
  {
    id: "gs-friend-favor",
    category: "recurring",
    minAge: 12,
    maxAge: 90,
    text: "A friend asks a real favor of you — nothing dramatic, just time and effort you don't quite have to spare.",
    pool: "social",
    options: [
      {
        label: "Help them out",
        cost: { pool: "social", amount: 1 },
        resolve: (c) => {
          c.adjustRelationship("friend", 8);
          return { log: "You show up. That's most of what friendship is." };
        },
      },
      {
        label: "Beg off",
        resolve: (c) => {
          c.adjustRelationship("friend", -5);
          return { log: "They manage without you. It's noted, though." };
        },
      },
    ],
  },
  {
    id: "gs-stranger",
    category: "recurring",
    minAge: 14,
    maxAge: 90,
    text: "Someone new is passing through town and seems, for whatever reason, interested in talking to you specifically.",
    pool: "social",
    options: [
      {
        label: "Talk with them",
        cost: { pool: "social", amount: 1 },
        resolve: (c) => {
          const roll = rollAdvantage(c.stats.charisma);
          if (roll >= 7) {
            c.earnGold(10);
            return { log: "The conversation turns out to be worth more than you expected." };
          }
          return { log: "Pleasant enough. Nothing comes of it." };
        },
      },
      { label: "Keep walking", resolve: () => ({ log: "Not every stranger needs your time." }) },
    ],
  },
  {
    id: "gs-sick-relative",
    category: "recurring",
    minAge: 16,
    maxAge: 90,
    requires: (c) => c.relationshipScore("mother") > 0 || c.relationshipScore("father") > 0,
    text: "Word comes that a relative has taken ill. It's not close family, but it's family.",
    pool: "social",
    options: [
      {
        label: "Go tend to them",
        cost: { pool: "social", amount: 1 },
        resolve: (c) => {
          c.adjustRelationship("mother", 3);
          c.adjustRelationship("father", 3);
          c.applyConditionChange("happiness", -2);
          return { log: "It's hard, thankless work, and you do it anyway." };
        },
      },
      { label: "Send word instead", resolve: () => ({ log: "A letter will have to do this time." }) },
    ],
  },
];
