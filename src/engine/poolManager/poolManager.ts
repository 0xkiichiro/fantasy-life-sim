import { ResourcePool, PoolSet } from "../shared/objects/ResourcePool";
import type { Character } from "../shared/objects/Character";

/**
 * poolManager — owns pool sizing rules. Pools are deliberately kept tight
 * (see design doc: scarcity is load-bearing). Base size scales with life
 * stage and class level; the event engine is responsible for making sure
 * enough events are on offer each year to actually contest the pool.
 */

function stageBonus(age: number): number {
  if (age < 8) return 0;
  if (age < 16) return 1;
  if (age < 60) return 2;
  return 1;
}

export function basePoolSize(age: number, level: number): number {
  return 2 + stageBonus(age) + Math.floor(level / 4);
}

/** Builds this year's pools for a character. Proficiency pool is 0 until a class is chosen. */
export function buildPoolsForYear(character: Character): PoolSet {
  const size = basePoolSize(character.age, character.level);
  const social = new ResourcePool("social", size);
  const proficiency = new ResourcePool("proficiency", character.className ? size : 0);
  return new PoolSet(social, proficiency);
}
