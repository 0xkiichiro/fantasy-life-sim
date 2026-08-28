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

  flavorEvent: FlavorEvent | null;

  events: GameEvent[];
}

const RECURRING_DRAWS_PER_POOL = 2;

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
