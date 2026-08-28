import type { Character } from "../../shared/objects/Character";
import type { PoolCategory } from "../../shared/objects/ResourcePool";
import type { EventOption } from "./EventOption";

export type EventCategory = "flavor" | "scripted" | "recurring";

export interface GameEvent {
  id: string;
  category: EventCategory;
  minAge: number;
  maxAge: number;
  /** If true, this event can only ever fire once per playthrough. */
  once?: boolean;
  /** Eligibility gate beyond age range — e.g. "only if mentorArc is active". */
  requires?: (c: Character) => boolean;
  text: string;
  /** Which pool this event draws from when presenting options. Null for flavor/no-cost events. */
  pool: PoolCategory | null;
  /** Static list, or a function so options can depend on class/items (e.g. the ogre fight). */
  options: EventOption[] | ((c: Character) => EventOption[]);
}

export function resolveOptions(event: GameEvent, character: Character): EventOption[] {
  const raw = typeof event.options === "function" ? event.options(character) : event.options;
  return raw.filter((o) => !o.requires || o.requires(character));
}
