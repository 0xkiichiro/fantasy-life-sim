import type { Character } from "../../shared/objects/Character";

/**
 * FlavorEvent — the no-choice event type used for early childhood (ages
 * 0-9). No options, no pool cost: just a narrated beat with a small
 * automatic effect. Kept as its own shape rather than shoehorned into
 * GameEvent (which assumes options exist), since the two are genuinely
 * different: a normal GameEvent is a decision, a FlavorEvent is a thing
 * that happens to you.
 */
export interface FlavorEvent {
  id: string;
  minAge: number;
  maxAge: number;
  once?: boolean;
  text: string;
  effect: (c: Character) => void;
}
