import { Character } from "../engine/shared/objects/Character";
import { PoolSet, ResourcePool } from "../engine/shared/objects/ResourcePool";
import { ageUp as engineAgeUp } from "../engine/ageEngine/ageEngine";
import { selectYearContent, EventRegistry } from "../engine/eventEngine/eventEngine";
import { applyEventResult } from "../engine/deathSystem/deathSystem";
import { GameEvent, resolveOptions } from "../engine/eventEngine/objects/GameEvent";
import { EventOption } from "../engine/eventEngine/objects/EventOption";
import { createCharacter } from "../engine/characterEngine/characterEngine";
import { FANTASY_CHARACTER_TEMPLATE } from "../content/characterTemplate";
import type { GameState } from "./objects/GameState";
import type { GameAction } from "./objects/GameAction";

function freshState(): GameState {
  const character = createCharacter(FANTASY_CHARACTER_TEMPLATE);
  return {
    screen: "menu",
    inProgress: false,
    character,
    pools: new PoolSet(new ResourcePool("social", 0), new ResourcePool("proficiency", 0)),
    pendingEvents: [],
    activeEvent: null,
    log: ["Your story begins."],
    seenOnce: new Set(),
    gameOver: false,
  };
}

function pushLog(log: string[], entry: string): string[] {
  return [entry, ...log].slice(0, 40);
}

export function gameReducer(state: GameState, action: GameAction, registry: EventRegistry): GameState {
  switch (action.type) {
    case "OPEN_MENU":
      return { ...state, screen: "menu" };

    case "OPEN_HOW_TO_PLAY":
      return { ...state, screen: "howToPlay" };

    case "NEW_GAME":
      return { ...freshState(), screen: "preview" };

    case "BEGIN":
      return { ...state, screen: "playing", inProgress: true };

    case "RESUME":
      return { ...state, screen: "playing" };

    case "AGE_UP": {
      if (state.gameOver) return state;

      const { character, pools, died } = engineAgeUp(state.character);

      if (died) {
        return {
          ...state,
          character,
          pools: state.pools,
          activeEvent: null,
          pendingEvents: [],
          gameOver: true,
          log: pushLog(state.log, `At ${character.age}, they passed quietly, of old age.`),
        };
      }

      const content = selectYearContent(character, registry, state.seenOnce);

      if (content.flavorEvent) {
        content.flavorEvent.effect(character);
        const nextSeen = new Set(state.seenOnce);
        if (content.flavorEvent.once) nextSeen.add(content.flavorEvent.id);
        return {
          ...state,
          character,
          pools: pools!,
          activeEvent: null,
          pendingEvents: [],
          seenOnce: nextSeen,
          log: pushLog(state.log, `Age ${character.age}: ${content.flavorEvent.text}`),
        };
      }

      return {
        ...state,
        character,
        pools: pools!,
        pendingEvents: content.events,
        activeEvent: content.events[0] ?? null,
        log:
          content.events.length === 0
            ? pushLog(state.log, `Age ${character.age}: a quiet year passes.`)
            : state.log,
      };
    }

    case "RESOLVE_OPTION": {
      if (!state.activeEvent) return state;

      const character = state.character.clone();
      const result = action.option.resolve(character);
      applyEventResult(character, result);

      const logEntry = character.alive
        ? `Age ${character.age}: ${result.log}`
        : `Age ${character.age}: ${result.log} — this is where the story ends.`;

      const pools = state.pools.clone();
      if (action.option.cost) {
        pools.get(action.option.cost.pool).spend(action.option.cost.amount);
      }

      const nextSeen = new Set(state.seenOnce);
      if (state.activeEvent.once) nextSeen.add(state.activeEvent.id);

      const rest = state.pendingEvents.slice(1);

      return {
        ...state,
        character,
        pools,
        pendingEvents: rest,
        activeEvent: character.alive ? rest[0] ?? null : null,
        seenOnce: nextSeen,
        gameOver: !character.alive,
        log: pushLog(state.log, logEntry),
      };
    }

    case "SKIP_EVENT": {
      if (!state.activeEvent) return state;
      const nextSeen = new Set(state.seenOnce);
      if (state.activeEvent.once) nextSeen.add(state.activeEvent.id);
      const rest = state.pendingEvents.slice(1);
      return {
        ...state,
        pendingEvents: rest,
        activeEvent: rest[0] ?? null,
        seenOnce: nextSeen,
        log: pushLog(state.log, `Age ${state.character.age}: there wasn't room left to take this one on.`),
      };
    }

    default:
      return state;
  }
}

export function currentOptionsFor(event: GameEvent, character: Character): EventOption[] {
  return resolveOptions(event, character);
}

export { freshState };
export type { GameState, GameAction };
