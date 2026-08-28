import type { Character } from "../../shared/objects/Character";
import type { PoolCategory } from "../../shared/objects/ResourcePool";
import type { EventResult } from "./EventResult";

export interface EventCost {
  pool: PoolCategory;
  amount: number;
}

export interface EventOption {
  label: string;
  cost?: EventCost;
  /** Optional extra gating beyond affordability, e.g. "requires 50 gold". */
  requires?: (c: Character) => boolean;
  resolve: (c: Character) => EventResult;
}
