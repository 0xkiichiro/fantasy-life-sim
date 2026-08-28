import type { CoreStatName } from "../../engine/shared/objects/Character";

export type ItemRarity = "common" | "rare" | "legendary";

/** The declarative shape a content author writes — no behavior, just data. */
export interface ItemTemplate {
  name: string;
  statBonus?: Partial<Record<CoreStatName, number>>;
  diceBonus?: number;
  rarity: ItemRarity;
  description?: string;
}

/**
 * Item — a templated object. Content defines ItemTemplate values (see
 * content/items.ts); Item.fromTemplate() spins up the actual instance a
 * Character holds. Multiple items can share a template shape without
 * being the same object.
 */
export class Item {
  readonly name: string;
  readonly statBonus: Partial<Record<CoreStatName, number>>;
  readonly diceBonus: number;
  readonly rarity: ItemRarity;
  readonly description: string;

  private constructor(template: ItemTemplate) {
    this.name = template.name;
    this.statBonus = template.statBonus ?? {};
    this.diceBonus = template.diceBonus ?? 0;
    this.rarity = template.rarity;
    this.description = template.description ?? "";
  }

  static fromTemplate(template: ItemTemplate): Item {
    return new Item(template);
  }
}
