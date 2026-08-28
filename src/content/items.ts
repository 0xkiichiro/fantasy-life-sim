import { Item } from "./objects/Item";
import type { ItemTemplate } from "./objects/ItemTemplate";

const templates: ItemTemplate[] = [
  {
    name: "Ashen Blade",
    statBonus: { strength: 2 },
    diceBonus: 1,
    rarity: "legendary",
    value: 400,
    description: "A blade with an edge that hasn't dulled in centuries.",
  },
];

export const ITEM_TEMPLATES: Record<string, ItemTemplate> = Object.fromEntries(
  templates.map((t) => [t.name, t])
);

export function createItem(name: string): Item {
  const template = ITEM_TEMPLATES[name];
  if (!template) throw new Error(`Unknown item template: ${name}`);
  return Item.fromTemplate(template);
}
