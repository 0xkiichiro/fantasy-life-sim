import type { StatRange } from "./StatRange";
import type { Household } from "./Household";

export interface FamilyOrigin {
  id: string;
  weight: number;
  goldRange: StatRange;
  describe(household: Household): string;
}
