import type { CoreStatName } from "../../engine/shared/objects/Character";
import type { ItemRarity } from "./ItemRarity";
import type { ItemTemplate } from "./ItemTemplate";

export class Item {
  readonly name: string;
  readonly statBonus: Partial<Record<CoreStatName, number>>;
  readonly diceBonus: number;
  readonly rarity: ItemRarity;
  readonly value: number;
  readonly description: string;

  private constructor(template: ItemTemplate) {
    this.name = template.name;
    this.statBonus = template.statBonus ?? {};
    this.diceBonus = template.diceBonus ?? 0;
    this.rarity = template.rarity;
    this.value = template.value;
    this.description = template.description ?? "";
  }

  static fromTemplate(template: ItemTemplate): Item {
    return new Item(template);
  }
}
