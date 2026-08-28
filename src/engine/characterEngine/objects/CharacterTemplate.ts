import type { CoreStats } from "../../shared/objects/Character";
import type { StatRange } from "./StatRange";
import type { RelationshipSeed } from "./RelationshipSeed";
import type { FamilyOrigin } from "./FamilyOrigin";
import type { ParentOdds } from "./ParentOdds";
import type { WeightedCount } from "./WeightedCount";

export interface CharacterTemplate {
  namePool: string[];
  statRanges: Record<keyof CoreStats, StatRange>;
  origins: FamilyOrigin[];
  parentOdds: ParentOdds;
  siblingCounts: WeightedCount[];
  siblingLabels: string[];
  startingRelationships: RelationshipSeed[];
}
