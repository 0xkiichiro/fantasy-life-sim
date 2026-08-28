import type { GameEvent } from "../../engine/eventEngine/objects/GameEvent";
import type { Character } from "../../engine/shared/objects/Character";
import { rollAdvantage } from "../../engine/diceEngine/diceEngine";
import { createItem } from "../items";

export const SCRIPTED_EVENTS: GameEvent[] = [
  {
    id: "wizard-offer",
    category: "scripted",
    minAge: 10,
    maxAge: 14,
    once: true,
    requires: (c) => !c.getFlag("mentorArcSeen"),
    text: "A traveling wizard passes through your village, cloak dusted with road-ash. He studies you a moment too long. \"I am looking for a pupil,\" he says.",
    pool: "social",
    options: [
      {
        label: "Accept the mentorship",
        cost: { pool: "social", amount: 1 },
        resolve: (c) => {
          c.setFlag("mentorArcSeen", true);
          c.setFlag("mentorArc", 3);
          c.applyStatChange("intelligence", 3);
          return { log: "You take the wizard's hand. The road ahead just changed." };
        },
      },
      {
        label: "Stay with your family",
        cost: { pool: "social", amount: 1 },
        resolve: (c) => {
          c.setFlag("mentorArcSeen", true);
          c.adjustRelationship("mother", 5);
          c.adjustRelationship("father", 5);
          return { log: "The wizard nods, unsurprised, and wanders on. Your parents hold you a little longer that night." };
        },
      },
    ],
  },
  {
    id: "mentor-lesson",
    category: "scripted",
    minAge: 10,
    maxAge: 17,
    requires: (c) => (c.getFlag<number>("mentorArc") ?? 0) > 0,
    text: "Your mentor sends word: there is a lesson to be had, if you'll make the time for it.",
    pool: "proficiency",
    options: [
      {
        label: "Train with the wizard",
        cost: { pool: "proficiency", amount: 1 },
        resolve: (c) => {
          c.setFlag("mentorArc", (c.getFlag<number>("mentorArc") ?? 1) - 1);
          c.gainProficiency(6);
          c.applyStatChange("intelligence", 1);
          return { log: "Hard-won knowledge settles into your bones." };
        },
      },
      {
        label: "Skip it, spend time at home",
        cost: { pool: "social", amount: 1 },
        resolve: (c) => {
          c.setFlag("mentorArc", (c.getFlag<number>("mentorArc") ?? 1) - 1);
          c.adjustRelationship("mother", 3);
          c.adjustRelationship("father", 3);
          return { log: "You choose the hearth over the horizon, just this once." };
        },
      },
    ],
  },
  {
    id: "family-secret",
    category: "scripted",
    minAge: 12,
    maxAge: 18,
    once: true,
    requires: (c) => c.relationshipScore("father") >= 60 && !c.getFlag("secretFound"),
    text: "Late one night your father, unusually candid, tells you your bloodline carries an old, guarded name.",
    pool: null,
    options: [
      {
        label: "Press him for the whole truth",
        resolve: (c) => {
          c.setFlag("secretFound", true);
          c.applyConditionChange("renown", 8);
          c.earnGold(20);
          return { log: "The family's old debts and older allies are now yours to know — and inherit." };
        },
      },
    ],
  },
  {
    id: "coming-of-age",
    category: "scripted",
    minAge: 16,
    maxAge: 16,
    once: true,
    text: "You have come of age. The path you choose now will shape everything after.",
    pool: null,
    options: [
      {
        label: "Take up the sword — become a Warrior",
        resolve: (c) => {
          c.assignClass("Warrior");
          c.applyStatChange("strength", 4);
          return { log: "Steel in hand, you feel the weight of the choice." };
        },
      },
      {
        label: "Study the old words — become a Mage",
        resolve: (c) => {
          c.assignClass("Mage");
          c.applyStatChange("intelligence", 4);
          return { log: "The first spell catches on your tongue like fire." };
        },
      },
      {
        label: "Trust the shadows — become a Rogue",
        resolve: (c) => {
          c.assignClass("Rogue");
          c.applyStatChange("dexterity", 4);
          return { log: "You learn to be where no one expects you." };
        },
      },
    ],
  },
  {
    id: "dungeon-choice",
    category: "scripted",
    minAge: 17,
    maxAge: 90,
    requires: (c) => !!c.className,
    text: "A collapsed shrine on the village's edge is rumored to hold something valuable — and something that still breathes.",
    pool: "proficiency",
    options: [
      {
        label: "Delve for training, not treasure",
        cost: { pool: "proficiency", amount: 1 },
        resolve: (c) => {
          c.gainProficiency(8);
          c.applyConditionChange("happiness", -2);
          const risky = rollAdvantage(c.stats.strength) < 5;
          if (risky) return { log: "You barely crawl out. It cost you.", deathChance: 0.04, health: -15 };
          return { log: "You emerge sore but sharper, technique honed on real danger." };
        },
      },
      {
        label: "Delve for coin",
        cost: { pool: "proficiency", amount: 1 },
        resolve: (c) => {
          const roll = rollAdvantage(c.stats.dexterity);
          const gold = roll > 7 ? 40 : 15;
          c.earnGold(gold);
          c.gainProficiency(2);
          const risky = roll < 4;
          if (risky)
            return {
              log: `You grab ${gold} gold and flee something you shouldn't have woken.`,
              deathChance: 0.05,
              health: -20,
            };
          return { log: `You return with ${gold} gold and a story worth telling.` };
        },
      },
      { label: "Ignore it entirely", resolve: () => ({ log: "Some doors are better left collapsed." }) },
    ],
  },
  {
    id: "monster-encounter",
    category: "scripted",
    minAge: 17,
    maxAge: 90,
    requires: (c) => !!c.className,
    text: "Deep in the shrine's lower hall, an ogre-kin blocks the only way forward, knuckles dragging on broken stone.",
    pool: "proficiency",
    options: (c) => {
      const opts = [
        {
          label: "Take it head on",
          cost: { pool: "proficiency" as const, amount: 1 },
          resolve: (c: Character) => {
            const roll = rollAdvantage(c.stats.strength);
            if (roll >= 7) {
              c.applyConditionChange("renown", 6);
              c.gainProficiency(5);
              return { log: "You stand your ground and it falls first." };
            }
            return { log: "You trade blows and barely disengage.", deathChance: 0.07, health: -25 };
          },
        },
        {
          label: "Flee",
          cost: { pool: "proficiency" as const, amount: 1 },
          resolve: (c: Character) => {
            c.applyConditionChange("happiness", -3);
            return { log: "You live to try again another day." };
          },
        },
      ];

      if (c.className === "Mage" && c.proficiency >= 10) {
        opts.push({
          label: "Cast radiant light (Mage)",
          cost: { pool: "proficiency" as const, amount: 1 },
          resolve: (c: Character) => {
            const roll = rollAdvantage(c.stats.intelligence);
            if (roll >= 6) {
              c.applyConditionChange("renown", 10);
              c.gainProficiency(6);
              return { log: "Light floods the hall. The ogre-kin flees, blind and roaring." };
            }
            return { log: "The spell gutters early — you're left exposed.", deathChance: 0.05, health: -15 };
          },
        });
      }

      if (c.className === "Warrior" && c.hasItem("Ashen Blade")) {
        opts[0] = {
          label: "Get behind it, slash with the Ashen Blade",
          cost: { pool: "proficiency" as const, amount: 1 },
          resolve: (c: Character) => {
            const roll = rollAdvantage(c.stats.strength);
            if (roll >= 5) {
              c.applyConditionChange("renown", 9);
              c.gainProficiency(6);
              return { log: "The Ashen Blade finds the gap in its guard. One motion. Done." };
            }
            return { log: "It turns faster than expected.", deathChance: 0.06, health: -20 };
          },
        };
      }

      return opts;
    },
  },
  {
    id: "legendary-find",
    category: "scripted",
    minAge: 18,
    maxAge: 90,
    once: true,
    requires: (c) => c.className === "Warrior" && c.proficiency >= 20 && !c.hasItem("Ashen Blade"),
    text: "Buried beneath the ogre-kin's hoard, wrapped in cloth gone to dust, a blade with an edge that hasn't dulled in centuries.",
    pool: null,
    options: [
      {
        label: "Claim the Ashen Blade",
        resolve: (c) => {
          c.addItem(createItem("Ashen Blade"));
          c.applyConditionChange("renown", 5);
          return { log: "It fits your hand like it was waiting." };
        },
      },
    ],
  },
  {
    id: "love-interest",
    category: "scripted",
    minAge: 18,
    maxAge: 45,
    once: true,
    requires: (c) => !c.getFlag("loveMet"),
    text: "At the harvest gathering, someone catches your eye — and, it seems, you catch theirs too.",
    pool: "social",
    options: [
      {
        label: "Approach them",
        cost: { pool: "social", amount: 1 },
        resolve: (c) => {
          c.setFlag("loveMet", true);
          const love = c.getRelationship("love");
          if (love) love.score = 30;
          return { log: "An easy conversation turns into a promise to meet again." };
        },
      },
      { label: "Let the moment pass", resolve: () => ({ log: "You tell yourself there will be other harvests." }) },
    ],
  },
  {
    id: "love-time",
    category: "scripted",
    minAge: 18,
    maxAge: 50,
    requires: (c) => !!c.getFlag("loveMet") && c.relationshipScore("love") < 100 && c.relationshipScore("love") > 0,
    text: "There's time this season to see them again, if you make it.",
    pool: "social",
    options: [
      {
        label: "Spend time together",
        cost: { pool: "social", amount: 1 },
        resolve: (c) => {
          c.adjustRelationship("love", 12);
          return { log: "The bond deepens." };
        },
      },
      {
        label: "Focus elsewhere",
        resolve: (c) => {
          c.adjustRelationship("love", -8);
          return { log: "Distance has a cost, even unspoken." };
        },
      },
    ],
  },
  {
    id: "dowry",
    category: "scripted",
    minAge: 20,
    maxAge: 55,
    once: true,
    requires: (c) => c.relationshipScore("love") >= 70,
    text: "Their father approaches you directly. If this is serious, he says, there is a dowry expected — 50 gold, paid in full.",
    pool: null,
    options: [
      {
        label: "Pay the dowry (50 gold)",
        requires: (c) => c.canAfford(50),
        resolve: (c) => {
          c.spendGold(50);
          c.adjustRelationship("love", 15);
          c.setFlag("married", true);
          return { log: "The match is sealed. You are, by every account, wed." };
        },
      },
      {
        label: "Refuse — you can't afford it",
        resolve: (c) => {
          c.adjustRelationship("love", -20);
          return { log: "Word gets back. Even though you had no choice, it's held against you." };
        },
      },
    ],
  },
  {
    id: "friend-connection",
    category: "scripted",
    minAge: 15,
    maxAge: 80,
    once: true,
    requires: (c) => c.relationshipScore("friend") >= 60,
    text: "Your friend mentions, almost in passing, that their uncle in the city takes on apprentices — if you're ever looking.",
    pool: null,
    options: [
      {
        label: "Ask them to make the introduction",
        resolve: (c) => {
          c.gainProficiency(10);
          return { log: "The door opens because someone was willing to knock for you." };
        },
      },
    ],
  },
  {
    id: "family-plea",
    category: "scripted",
    minAge: 25,
    maxAge: 70,
    requires: (c) => c.relationshipScore("mother") > 0 || c.relationshipScore("father") > 0,
    text: "Your family writes: the harvest failed, and they're short. They're not asking, exactly. But they're asking.",
    pool: null,
    options: [
      {
        label: "Send 20 gold",
        requires: (c) => c.canAfford(20),
        resolve: (c) => {
          c.spendGold(20);
          c.adjustRelationship("mother", 8);
          c.adjustRelationship("father", 8);
          return { log: "It's not much, but it's enough, and they know you sent it." };
        },
      },
      {
        label: "You don't have it to give",
        resolve: (c) => {
          c.adjustRelationship("mother", -10);
          c.adjustRelationship("father", -10);
          return { log: "They never say it plainly. You feel it anyway." };
        },
      },
    ],
  },
];
