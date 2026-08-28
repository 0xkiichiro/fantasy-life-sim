import type { EventOption } from "../../engine/eventEngine/objects/EventOption";

export type GameAction =
  | { type: "OPEN_MENU" }
  | { type: "OPEN_HOW_TO_PLAY" }
  | { type: "NEW_GAME" }
  | { type: "BEGIN" }
  | { type: "RESUME" }
  | { type: "AGE_UP" }
  | { type: "RESOLVE_OPTION"; option: EventOption }
  | { type: "SKIP_EVENT" };
