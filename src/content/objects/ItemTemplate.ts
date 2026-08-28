import type { CoreStatName } from "../../engine/shared/objects/Character";
import type { ItemRarity } from "./ItemRarity";

export interface ItemTemplate {
  name: string;
  statBonus?: Partial<Record<CoreStatName, number>>;
  diceBonus?: number;
  rarity: ItemRarity;
  value: number;
  description?: string;
}
