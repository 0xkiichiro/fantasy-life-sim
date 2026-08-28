import type { Character } from "../shared/objects/Character";
import type { GameEvent } from "./objects/GameEvent";
import type { FlavorEvent } from "./objects/FlavorEvent";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function isEligible(event: GameEvent, character: Character, seenOnce: Set<string>): boolean {
  if (event.once && seenOnce.has(event.id)) return false;
  if (character.age < event.minAge || character.age > event.maxAge) return false;
  if (event.requires && !event.requires(character)) return false;
  return true;
}

function isFlavorEligible(event: FlavorEvent, character: Character, seenOnce: Set<string>): boolean {
  if (event.once && seenOnce.has(event.id)) return false;
  if (character.age < event.minAge || character.age > event.maxAge) return false;
  return true;
}

export interface EventRegistry {
  flavor: FlavorEvent[];
  scripted: GameEvent[];
  recurringSocial: GameEvent[];
  recurringProficiency: GameEvent[];
}

export interface YearContent {
  /** Set for childhood years (age < 10): a single narrated flavor beat, no choices. */
  flavorEvent: FlavorEvent | null;
  /** Set for age >= 10: the queue of decision events to present this year. */
  events: GameEvent[];
}

const RECURRING_DRAWS_PER_POOL = 2;

/**
 * eventEngine — decides what shows up in a given year. This is where the
 * "events should outnumber what the pools can afford" design rule is
 * actually enforced: every eligible scripted/arc event surfaces, plus a
 * random draw of recurring events per pool, deliberately more than a
 * typical pool (2-4 points) can fully cover.
 */
export function selectYearContent(
  character: Character,
  registry: EventRegistry,
  seenOnce: Set<string>
): YearContent {
  if (character.age < 10) {
    const eligibleFlavor = registry.flavor.filter((e) => isFlavorEligible(e, character, seenOnce));
    const chosen = eligibleFlavor.length > 0 ? shuffle(eligibleFlavor)[0] : null;
    return { flavorEvent: chosen, events: [] };
  }

  const scripted = registry.scripted.filter((e) => isEligible(e, character, seenOnce));

  const recurringSocial = character
    ? shuffle(registry.recurringSocial.filter((e) => isEligible(e, character, seenOnce))).slice(
        0,
        RECURRING_DRAWS_PER_POOL
      )
    : [];

  const recurringProficiency = character.className
    ? shuffle(
        registry.recurringProficiency.filter((e) => isEligible(e, character, seenOnce))
      ).slice(0, RECURRING_DRAWS_PER_POOL)
    : [];

  return {
    flavorEvent: null,
    events: [...scripted, ...recurringSocial, ...recurringProficiency],
  };
}
