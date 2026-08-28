import type { Character } from "../../engine/shared/objects/Character";
import type { PoolSet } from "../../engine/shared/objects/ResourcePool";
import type { GameEvent } from "../../engine/eventEngine/objects/GameEvent";
import type { Screen } from "./Screen";

export interface GameState {
  screen: Screen;
  inProgress: boolean;
  character: Character;
  pools: PoolSet;
  pendingEvents: GameEvent[];
  activeEvent: GameEvent | null;
  log: string[];
  seenOnce: Set<string>;
  gameOver: boolean;
}
