import { Character } from "../shared/objects/Character";
import { PoolSet } from "../shared/objects/ResourcePool";
import { buildPoolsForYear } from "../poolManager/poolManager";
import { applyOldAgeDeathIfDue } from "../deathSystem/deathSystem";

export interface AgeUpResult {
  character: Character;
  pools: PoolSet | null; // null if the character died this year
  died: boolean;
}

/**
 * ageEngine — advances the character by one year. Does NOT select events;
 * that's eventEngine's job, run by the caller after ageUp() succeeds. This
 * keeps "what happens to time and mortality" separate from "what content
 * shows up," so each can be tested independently.
 */
export function ageUp(character: Character): AgeUpResult {
  const next = character.clone();
  next.age += 1;

  if (applyOldAgeDeathIfDue(next)) {
    return { character: next, pools: null, died: true };
  }

  const pools = buildPoolsForYear(next);
  return { character: next, pools, died: false };
}
