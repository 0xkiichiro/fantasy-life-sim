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

  requires?: (c: Character) => boolean;
  resolve: (c: Character) => EventResult;
}
