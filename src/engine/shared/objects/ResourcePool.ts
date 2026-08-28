/**
 * ResourcePool — tracks the action points available for a single category
 * (e.g. "social" or "proficiency") during the current year.
 *
 * Owned by /engine/poolManager, but the *shape* is shared: the event engine
 * needs to read it, options need to spend against it, so it lives in
 * engine/shared rather than nested under poolManager alone.
 */
export type PoolCategory = "social" | "proficiency";

export class ResourcePool {
  readonly category: PoolCategory;
  current: number;
  max: number;

  constructor(category: PoolCategory, max: number) {
    this.category = category;
    this.max = max;
    this.current = max;
  }

  canAfford(amount: number): boolean {
    return this.current >= amount;
  }

  /** Returns true if the spend succeeded. Never goes negative. */
  spend(amount: number): boolean {
    if (!this.canAfford(amount)) return false;
    this.current -= amount;
    return true;
  }

  refill(newMax: number): void {
    this.max = newMax;
    this.current = newMax;
  }

  clone(): ResourcePool {
    const p = new ResourcePool(this.category, this.max);
    p.current = this.current;
    return p;
  }
}

/** Convenience container for the full set of pools a character has in a year. */
export class PoolSet {
  social: ResourcePool;
  proficiency: ResourcePool;

  constructor(social: ResourcePool, proficiency: ResourcePool) {
    this.social = social;
    this.proficiency = proficiency;
  }

  get(category: PoolCategory): ResourcePool {
    return category === "social" ? this.social : this.proficiency;
  }

  clone(): PoolSet {
    return new PoolSet(this.social.clone(), this.proficiency.clone());
  }
}
