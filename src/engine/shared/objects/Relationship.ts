export class Relationship {
  readonly id: string;
  readonly label: string;
  readonly name: string;
  readonly ageOffset: number | null;
  readonly traits: string[];
  score: number;
  private consumedThresholds: Set<number>;

  constructor(params: {
    id: string;
    label: string;
    score?: number;
    name?: string;
    ageOffset?: number | null;
    traits?: string[];
  }) {
    this.id = params.id;
    this.label = params.label;
    this.name = params.name ?? "";
    this.ageOffset = params.ageOffset ?? null;
    this.traits = params.traits ?? [];
    this.score = params.score ?? 0;
    this.consumedThresholds = new Set();
  }

  ageAt(characterAge: number): number | null {
    if (this.ageOffset === null) return null;
    return characterAge + this.ageOffset;
  }

  hasTrait(id: string): boolean {
    return this.traits.includes(id);
  }

  adjust(delta: number, min = 0, max = 100): void {
    this.score = Math.max(min, Math.min(max, this.score + delta));
  }

  crossedThreshold(threshold: number): boolean {
    if (this.score >= threshold && !this.consumedThresholds.has(threshold)) {
      this.consumedThresholds.add(threshold);
      return true;
    }
    return false;
  }

  clone(): Relationship {
    const r = new Relationship({
      id: this.id,
      label: this.label,
      score: this.score,
      name: this.name,
      ageOffset: this.ageOffset,
      traits: [...this.traits],
    });
    r.consumedThresholds = new Set(this.consumedThresholds);
    return r;
  }
}
