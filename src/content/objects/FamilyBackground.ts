import type { StatRange } from "../../engine/characterEngine/objects/StatRange";
import type { Household } from "../../engine/characterEngine/objects/Household";
import type { FamilyBackgroundTemplate } from "./FamilyBackgroundTemplate";

const NUMBER_WORDS = ["no", "one", "two", "three", "four", "five", "six"];

function countWord(n: number): string {
  return NUMBER_WORDS[n] ?? String(n);
}

export class FamilyBackground {
  readonly id: string;
  readonly weight: number;
  readonly goldRange: StatRange;
  private readonly station: string;
  private readonly orphanStation: string | null;

  private constructor(template: FamilyBackgroundTemplate) {
    this.id = template.id;
    this.weight = template.weight;
    this.goldRange = template.goldRange;
    this.station = template.station;
    this.orphanStation = template.orphanStation ?? null;
  }

  static fromTemplate(template: FamilyBackgroundTemplate): FamilyBackground {
    return new FamilyBackground(template);
  }

  private parentClause(household: Household): string {
    if (household.hasMother && household.hasFather) return "Both your parents are living.";
    if (household.hasMother) return "Your father is dead, and your mother raises you alone.";
    if (household.hasFather) return "Your mother died bringing you into the world.";
    return "You were orphaned before you were old enough to remember either of them.";
  }

  private siblingClause(household: Household): string {
    if (household.siblings === 0) return "You are an only child.";
    if (household.siblings === 1) return "You have one sibling.";
    return `You have ${countWord(household.siblings)} siblings.`;
  }

  describe(household: Household): string {
    const opening =
      !household.hasMother && !household.hasFather && this.orphanStation
        ? this.orphanStation
        : this.station;
    return `${opening} ${this.parentClause(household)} ${this.siblingClause(household)}`;
  }
}
