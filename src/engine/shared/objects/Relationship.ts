/**
 * Relationship — a tracked numeric bond between the character and someone
 * else in their life (a parent, a friend, a love interest). Crossing a
 * threshold can unlock new content; this class only tracks the number and
 * threshold bookkeeping — what to do when a threshold is crossed is a
 * content decision (see content/events), not engine logic.
 */
export class Relationship {
  readonly id: string;
  readonly label: string;
  score: number;
  private consumedThresholds: Set<number>;

  constructor(id: string, label: string, initialScore = 0) {
    this.id = id;
    this.label = label;
    this.score = initialScore;
    this.consumedThresholds = new Set();
  }

  adjust(delta: number, min = 0, max = 100): void {
    this.score = Math.max(min, Math.min(max, this.score + delta));
  }

  /** True the first time score has crossed `threshold`; false every time after. */
  crossedThreshold(threshold: number): boolean {
    if (this.score >= threshold && !this.consumedThresholds.has(threshold)) {
      this.consumedThresholds.add(threshold);
      return true;
    }
    return false;
  }

  clone(): Relationship {
    const r = new Relationship(this.id, this.label, this.score);
    r.consumedThresholds = new Set(this.consumedThresholds);
    return r;
  }
}
