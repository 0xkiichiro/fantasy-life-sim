import { FamilyTrait } from "./objects/FamilyTrait";
import type { FamilyTraitTemplate } from "./objects/FamilyTraitTemplate";

const TEMPLATES: FamilyTraitTemplate[] = [
  {
    id: "kind",
    label: "Kind",
    description: "Gentle with you, and with everyone. It is not weakness, whatever the village says.",
    icon: "shiningHeart",
    weight: 16,
    roles: ["parent", "sibling"],
  },
  {
    id: "stern",
    label: "Stern",
    description: "Hard to please and harder to read. Affection arrives, when it does, as approval.",
    icon: "angryEyes",
    weight: 14,
    roles: ["parent", "sibling"],
  },
  {
    id: "devout",
    label: "Devout",
    description: "Prays morning and night, and expects the household to do the same.",
    icon: "prayer",
    weight: 12,
    roles: ["parent", "sibling"],
  },
  {
    id: "hardworking",
    label: "Hardworking",
    description: "Up before light, useful until dark. Rest is something other people do.",
    icon: "hammerNails",
    weight: 14,
    roles: ["parent", "sibling"],
  },
  {
    id: "sickly",
    label: "Sickly",
    description: "Never quite well. The household plans around it without saying so.",
    icon: "tiredEye",
    weight: 9,
    roles: ["parent", "sibling"],
  },
  {
    id: "drunkard",
    label: "Fond of Drink",
    description: "A good enough soul until the third cup, and less predictable after it.",
    icon: "beerStein",
    weight: 8,
    roles: ["parent"],
  },
  {
    id: "war-scarred",
    label: "War-Scarred",
    description: "Came back from a campaign carrying something that never fully healed.",
    icon: "swordWound",
    weight: 7,
    roles: ["parent"],
  },
  {
    id: "sharp",
    label: "Sharp-Minded",
    description: "Quick with numbers and quicker with an argument. Wasted on farm work.",
    icon: "brain",
    weight: 11,
    roles: ["parent", "sibling"],
  },
  {
    id: "superstitious",
    label: "Superstitious",
    description: "Salt at the threshold, iron over the door, and a reason for both.",
    icon: "crystalBall",
    weight: 10,
    roles: ["parent", "sibling"],
  },
  {
    id: "literate",
    label: "Lettered",
    description: "Can read, which in this village is closer to a rumour than a skill.",
    icon: "bookCover",
    weight: 8,
    roles: ["parent", "sibling"],
  },
  {
    id: "restless",
    label: "Restless",
    description: "Talks about leaving. Has been talking about it for years.",
    icon: "huntingHorn",
    weight: 10,
    roles: ["sibling"],
  },
  {
    id: "deft",
    label: "Deft-Handed",
    description: "Mends what others throw out, and makes it look like nothing.",
    icon: "sewingNeedle",
    weight: 10,
    roles: ["parent", "sibling"],
  },
];

export const FAMILY_TRAITS = TEMPLATES.map(FamilyTrait.fromTemplate);

const BY_ID = new Map(FAMILY_TRAITS.map((trait) => [trait.id, trait]));

export function familyTrait(id: string): FamilyTrait | undefined {
  return BY_ID.get(id);
}
