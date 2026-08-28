import type { Character } from "../shared/objects/Character";
import type { EventResult } from "../eventEngine/objects/EventResult";

/**
 * deathSystem — the only place death actually gets decided. Two paths:
 *  1. Old-age mortality, rolled once per age-up past 55, ramping with age.
 *  2. Risk-driven death, rolled when an EventResult carries a deathChance
 *     (e.g. losing a fight in a dungeon).
 *
 * Centralizing this is what makes the v2 "death legacy" stretch goal
 * (write a book / hide a sword / send a letter, seeding a future
 * playthrough) a single extension point later rather than a scattered one.
 */

const OLD_AGE_START = 55;
const OLD_AGE_RAMP_PER_YEAR = 0.012;
const OLD_AGE_CAP = 0.5;

export function rollOldAgeDeath(age: number): boolean {
  if (age <= OLD_AGE_START) return false;
  const chance = Math.min(OLD_AGE_CAP, (age - OLD_AGE_START) * OLD_AGE_RAMP_PER_YEAR);
  return Math.random() < chance;
}

export function applyOldAgeDeathIfDue(character: Character): boolean {
  if (rollOldAgeDeath(character.age)) {
    character.die("Died peacefully of old age, with a full life behind them.");
    return true;
  }
  return false;
}

/** Applies a resolved event's health delta and rolls its death chance, if any. */
export function applyEventResult(character: Character, result: EventResult): void {
  if (result.health) {
    character.applyHealthChange(result.health);
  }
  if (result.deathChance && Math.random() < result.deathChance) {
    character.die(result.log);
  }
}
