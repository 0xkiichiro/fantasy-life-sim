import type { CoreStats } from "../../shared/objects/Character";

export interface StatRange {
  min: number;
  max: number;
}

export interface RelationshipSeed {
  id: string;
  label: string;
  startingScore: number;
}

export interface CharacterTemplate {
  namePool: string[];
  statRanges: Record<keyof CoreStats, StatRange>;
  startingGold: number;
  startingRelationships: RelationshipSeed[];
}
