import type { GameEvent } from "../../engine/eventEngine/objects/GameEvent";
import { rollAdvantage } from "../../engine/diceEngine/diceEngine";

export const RECURRING_PROFICIENCY_EVENTS: GameEvent[] = [
  {
    id: "gp-odd-job",
    category: "recurring",
    minAge: 12,
    maxAge: 90,
    text: "There's honest work to be found this season, if you want the coin more than the polish.",
    pool: "proficiency",
    options: [
      {
        label: "Take the work",
        cost: { pool: "proficiency", amount: 1 },
        resolve: (c) => {
          c.earnGold(12);
          c.gainProficiency(1);
          return { log: "Not glamorous, but it pays." };
        },
      },
      { label: "Pass on it", resolve: () => ({ log: "You let the work go to someone else." }) },
    ],
  },
  {
    id: "gp-drills",
    category: "recurring",
    minAge: 14,
    maxAge: 90,
    requires: (c) => !!c.className,
    text: "There's time this season to drill your craft properly, if you're willing to put in the hours.",
    pool: "proficiency",
    options: [
      {
        label: "Drill hard",
        cost: { pool: "proficiency", amount: 1 },
        resolve: (c) => {
          c.gainProficiency(7);
          c.applyConditionChange("happiness", -2);
          return { log: "Discipline, mostly. It adds up." };
        },
      },
      {
        label: "Take it easy",
        resolve: (c) => {
          c.applyConditionChange("happiness", 2);
          return { log: "You rest instead. Sometimes that's the right call too." };
        },
      },
    ],
  },
  {
    id: "gp-contract",
    category: "recurring",
    minAge: 18,
    maxAge: 90,
    requires: (c) => !!c.className,
    text: "A merchant needs someone capable for a short, paying contract — nothing that will make songs about you, but it pays well.",
    pool: "proficiency",
    options: [
      {
        label: "Take the contract",
        cost: { pool: "proficiency", amount: 1 },
        resolve: (c) => {
          const roll = rollAdvantage(c.stats.charisma);
          const gold = roll >= 6 ? 25 : 10;
          c.earnGold(gold);
          return { log: `The work is finished cleanly. ${gold} gold for your trouble.` };
        },
      },
      { label: "Not interested", resolve: () => ({ log: "You let it pass to someone hungrier." }) },
    ],
  },
  {
    id: "gp-study",
    category: "recurring",
    minAge: 12,
    maxAge: 90,
    text: "There are old texts in the village worth the read, if you can find the hours for them.",
    pool: "proficiency",
    options: [
      {
        label: "Study them",
        cost: { pool: "proficiency", amount: 1 },
        resolve: (c) => {
          c.applyStatChange("intelligence", 2);
          c.gainProficiency(3);
          return { log: "Slow going, but you're sharper for it." };
        },
      },
      { label: "Skip it", resolve: () => ({ log: "The books stay closed a while longer." }) },
    ],
  },
];
