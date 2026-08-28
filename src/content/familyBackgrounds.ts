import { FamilyBackground } from "./objects/FamilyBackground";
import type { FamilyBackgroundTemplate } from "./objects/FamilyBackgroundTemplate";

const TEMPLATES: FamilyBackgroundTemplate[] = [
  {
    id: "peasants",
    weight: 30,
    goldRange: { min: 2, max: 8 },
    station: "You are born to peasant farmers, on land that belongs to someone else.",
    orphanStation: "You are born on tenant farmland and left to the parish before your first winter.",
  },
  {
    id: "labourers",
    weight: 20,
    goldRange: { min: 4, max: 12 },
    station: "Your family cuts peat and hauls stone for the village, and is respected for it in the way hard workers usually are, which is to say quietly.",
  },
  {
    id: "smith",
    weight: 12,
    goldRange: { min: 12, max: 26 },
    station: "Your father keeps the village forge, and the whole house smells of charcoal and hot iron.",
    orphanStation: "The village forge went cold when your parents died, and the smith's guild took you in out of obligation.",
  },
  {
    id: "merchants",
    weight: 12,
    goldRange: { min: 25, max: 60 },
    station: "Your family trades wool and salt along the river road, and has never quite gone hungry.",
  },
  {
    id: "hedge-wizard",
    weight: 8,
    goldRange: { min: 10, max: 30 },
    station: "Your father is a hedge-wizard of modest repute, which means the village asks him for rain and blames him when it comes too hard.",
    orphanStation: "Your parents were hedge-witches, and the village has never decided whether that is why they died.",
  },
  {
    id: "scribes",
    weight: 8,
    goldRange: { min: 18, max: 40 },
    station: "Your mother keeps ledgers for the abbey, and you learn your letters before most children learn their chores.",
  },
  {
    id: "soldiers",
    weight: 7,
    goldRange: { min: 8, max: 22 },
    station: "Your father came home from the last war with a limp and a pension that arrives late, when it arrives.",
    orphanStation: "Both your parents marched east with the levy, and neither came back.",
  },
  {
    id: "minor-nobility",
    weight: 3,
    goldRange: { min: 70, max: 160 },
    station: "Your family holds a small title, a draughty manor, and rather more debt than either would suggest.",
  },
];

export const FAMILY_BACKGROUNDS = TEMPLATES.map(FamilyBackground.fromTemplate);
