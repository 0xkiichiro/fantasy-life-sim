import type { Character } from "../../shared/objects/Character";

export interface FlavorEvent {
  id: string;
  minAge: number;
  maxAge: number;
  once?: boolean;
  text: string;
  effect: (c: Character) => void;
}
