import { Relationship } from "./Relationship";

/**
 * The engine only needs to know an inventory entry has a name it can
 * check against (see hasItem). It deliberately does NOT import the
 * content-layer Item class here — engine must not depend on content,
 * only the reverse. content's Item class structurally satisfies this
 * interface, so passing an Item into addItem() just works.
 */
export interface InventoryItem {
  name: string;
}

export type CoreStatName = "strength" | "dexterity" | "intelligence" | "charisma";
export type ConditionStatName = "health" | "happiness" | "renown";
export type ClassName = "Warrior" | "Mage" | "Rogue";

export interface CoreStats {
  strength: number;
  dexterity: number;
  intelligence: number;
  charisma: number;
}

export interface ConditionStats {
  health: number;
  happiness: number;
  renown: number;
}

/** Proficiency → level thresholds. Index i means "reach level i+1 at this proficiency". */
export const LEVEL_THRESHOLDS = [0, 10, 25, 50, 90, 140, 200, 280];

function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v));
}

/**
 * Character — the central entity of the simulation. A real class with
 * behavior: other objects (events, the engines) call its methods rather
 * than mutating its fields directly, so invariants (gold can't go
 * negative, stats stay in range) are enforced in one place.
 */
export class Character {
  name: string;
  age: number;
  className: ClassName | null;

  stats: CoreStats;
  condition: ConditionStats;

  gold: number;
  proficiency: number;

  items: InventoryItem[];
  relationships: Map<string, Relationship>;
  flags: Record<string, unknown>;

  alive: boolean;
  causeOfDeath: string | null;

  constructor(params: {
    name: string;
    stats: CoreStats;
    startingGold?: number;
    relationships?: Relationship[];
  }) {
    this.name = params.name;
    this.age = 0;
    this.className = null;

    this.stats = { ...params.stats };
    this.condition = { health: 100, happiness: 70, renown: 0 };

    this.gold = params.startingGold ?? 0;
    this.proficiency = 0;

    this.items = [];
    this.relationships = new Map();
    for (const r of params.relationships ?? []) {
      this.relationships.set(r.id, r);
    }

    this.flags = {};
    this.alive = true;
    this.causeOfDeath = null;
  }

  // ---- derived ----

  get level(): number {
    let lvl = 1;
    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
      if (this.proficiency >= LEVEL_THRESHOLDS[i]) lvl = i + 1;
    }
    return lvl;
  }

  // ---- stats ----

  applyStatChange(stat: CoreStatName, delta: number): void {
    this.stats[stat] = clamp(this.stats[stat] + delta);
  }

  applyConditionChange(stat: ConditionStatName, delta: number): void {
    this.condition[stat] = clamp(this.condition[stat] + delta);
  }

  applyHealthChange(delta: number): void {
    this.applyConditionChange("health", delta);
  }

  // ---- resources ----

  earnGold(amount: number): void {
    this.gold += amount;
  }

  /** Returns false (and spends nothing) if the character can't afford it. */
  spendGold(amount: number): boolean {
    if (this.gold < amount) return false;
    this.gold -= amount;
    return true;
  }

  canAfford(amount: number): boolean {
    return this.gold >= amount;
  }

  gainProficiency(amount: number): void {
    this.proficiency += amount;
  }

  // ---- class ----

  assignClass(className: ClassName): void {
    this.className = className;
  }

  // ---- items ----

  addItem(item: InventoryItem): void {
    this.items.push(item);
  }

  hasItem(name: string): boolean {
    return this.items.some((i) => i.name === name);
  }

  // ---- relationships ----

  getRelationship(id: string): Relationship | undefined {
    return this.relationships.get(id);
  }

  adjustRelationship(id: string, delta: number): void {
    const rel = this.relationships.get(id);
    if (rel) rel.adjust(delta);
  }

  relationshipScore(id: string): number {
    return this.relationships.get(id)?.score ?? 0;
  }

  // ---- flags ----

  setFlag(key: string, value: unknown): void {
    this.flags[key] = value;
  }

  getFlag<T = unknown>(key: string): T | undefined {
    return this.flags[key] as T | undefined;
  }

  // ---- lifecycle ----

  die(cause: string): void {
    this.alive = false;
    this.causeOfDeath = cause;
  }

  /** Deep clone — used so engines can produce a new immutable-ish snapshot per turn. */
  clone(): Character {
    const c = new Character({
      name: this.name,
      stats: { ...this.stats },
      startingGold: this.gold,
    });
    c.age = this.age;
    c.className = this.className;
    c.condition = { ...this.condition };
    c.proficiency = this.proficiency;
    c.items = [...this.items];
    c.relationships = new Map(
      Array.from(this.relationships.entries()).map(([id, r]) => [id, r.clone()])
    );
    c.flags = { ...this.flags };
    c.alive = this.alive;
    c.causeOfDeath = this.causeOfDeath;
    return c;
  }
}
