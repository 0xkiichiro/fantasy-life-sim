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
