import type { Character } from "../../shared/objects/Character";
import type { PoolCategory } from "../../shared/objects/ResourcePool";
import type { EventOption } from "./EventOption";

export type EventCategory = "flavor" | "scripted" | "recurring";

export interface GameEvent {
  id: string;
  category: EventCategory;
  minAge: number;
  maxAge: number;

  once?: boolean;

  requires?: (c: Character) => boolean;
  text: string;

  pool: PoolCategory | null;

  options: EventOption[] | ((c: Character) => EventOption[]);
}

export function resolveOptions(event: GameEvent, character: Character): EventOption[] {
  const raw = typeof event.options === "function" ? event.options(character) : event.options;
  return raw.filter((o) => !o.requires || o.requires(character));
}
