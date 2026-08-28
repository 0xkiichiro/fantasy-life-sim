import type { StatRange } from "../../engine/characterEngine/objects/StatRange";

export interface FamilyBackgroundTemplate {
  id: string;
  weight: number;
  goldRange: StatRange;
  station: string;
  orphanStation?: string;
}
