import type { CoreStats } from "../../shared/objects/Character";

/**
 * CharacterTemplate — the generic *shape* the character engine needs to
 * build a character: a name pool, a stat range to roll within, starting
 * gold, and a list of starting relationships. The actual fantasy-specific
 * values (which names, which relationships exist) live in
 * content/characterTemplate.ts, not here — this file just describes what
 * a template must provide.
 */
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
