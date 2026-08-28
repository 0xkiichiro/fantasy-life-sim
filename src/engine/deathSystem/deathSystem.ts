import type { Character } from "../shared/objects/Character";
import type { EventResult } from "../eventEngine/objects/EventResult";

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

export function applyEventResult(character: Character, result: EventResult): void {
  if (result.health) {
    character.applyHealthChange(result.health);
  }
  if (result.deathChance && Math.random() < result.deathChance) {
    character.die(result.log);
  }
}
