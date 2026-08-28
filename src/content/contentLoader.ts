import yaml from "js-yaml";
import type { Character } from "../engine/shared/objects/Character";
import type { FlavorEvent } from "../engine/eventEngine/objects/FlavorEvent";
import type { EventRegistry } from "../engine/eventEngine/eventEngine";
import { SCRIPTED_EVENTS } from "./events/scripted";
import { RECURRING_SOCIAL_EVENTS } from "./events/recurring-social";
import { RECURRING_PROFICIENCY_EVENTS } from "./events/recurring-proficiency";

// Vite raw-import for the YAML source (typed via src/vite-env.d.ts).
// Adjust the import mechanism if the build tool differs.
import flavorYamlSource from "./events/flavor.yaml?raw";

type EffectTarget =
  | { target: "stat"; stat: keyof Character["stats"]; delta: number }
  | { target: "condition"; stat: keyof Character["condition"]; delta: number }
  | { target: "relationship"; id: string; delta: number }
  | { target: "gold"; delta: number };

interface RawFlavorEntry {
  id: string;
  minAge: number;
  maxAge: number;
  once?: boolean;
  text: string;
  effects: EffectTarget[];
}

function applyEffect(character: Character, effect: EffectTarget): void {
  switch (effect.target) {
    case "stat":
      character.applyStatChange(effect.stat, effect.delta);
      return;
    case "condition":
      character.applyConditionChange(effect.stat, effect.delta);
      return;
    case "relationship":
      character.adjustRelationship(effect.id, effect.delta);
      return;
    case "gold":
      if (effect.delta >= 0) character.earnGold(effect.delta);
      else character.spendGold(Math.min(-effect.delta, character.gold));
      return;
  }
}

function buildFlavorEvent(raw: RawFlavorEntry): FlavorEvent {
  return {
    id: raw.id,
    minAge: raw.minAge,
    maxAge: raw.maxAge,
    once: raw.once,
    text: raw.text,
    effect: (c) => {
      for (const e of raw.effects) applyEffect(c, e);
    },
  };
}

/**
 * Validates and normalizes the raw YAML into FlavorEvent[]. Fails loudly
 * (throws) on a malformed entry rather than silently dropping it, per the
 * design decision to validate content at load time.
 */
export function loadFlavorEvents(yamlSource: string): FlavorEvent[] {
  const parsed = yaml.load(yamlSource);
  if (!Array.isArray(parsed)) {
    throw new Error("flavor.yaml must be a top-level list of flavor events");
  }
  return parsed.map((entry, i) => {
    const raw = entry as RawFlavorEntry;
    if (!raw.id || !raw.text || !Array.isArray(raw.effects)) {
      throw new Error(`flavor.yaml entry #${i} is missing id, text, or effects`);
    }
    return buildFlavorEvent(raw);
  });
}

/** Assembles the full EventRegistry the eventEngine consumes, from both YAML and TS sources. */
export function loadEventRegistry(): EventRegistry {
  return {
    flavor: loadFlavorEvents(flavorYamlSource),
    scripted: SCRIPTED_EVENTS,
    recurringSocial: RECURRING_SOCIAL_EVENTS,
    recurringProficiency: RECURRING_PROFICIENCY_EVENTS,
  };
}
