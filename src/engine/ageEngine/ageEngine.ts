import { Character } from "../shared/objects/Character";
import { PoolSet } from "../shared/objects/ResourcePool";
import { buildPoolsForYear } from "../poolManager/poolManager";
import { applyOldAgeDeathIfDue } from "../deathSystem/deathSystem";

export interface AgeUpResult {
  character: Character;
  pools: PoolSet | null;
  died: boolean;
}

export function ageUp(character: Character): AgeUpResult {
  const next = character.clone();
  next.age += 1;

  if (applyOldAgeDeathIfDue(next)) {
    return { character: next, pools: null, died: true };
  }

  const pools = buildPoolsForYear(next);
  return { character: next, pools, died: false };
}
