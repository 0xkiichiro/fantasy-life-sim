import type { CoreStatName } from "../../engine/shared/objects/Character";

/** The declarative shape: what a class grants when chosen. */
export interface CharacterClassTemplate {
  name: "Warrior" | "Mage" | "Rogue";
  primaryStat: CoreStatName;
  comingOfAgeBonus: number; // stat points granted to primaryStat on selection
  description: string;
}

/**
 * CharacterClass — templated the same way Item is. Not attached to a
 * Character directly (Character just stores className: ClassName); this
 * class is a lookup/reference object content and UI use to describe or
 * apply what a class means.
 */
export class CharacterClass {
  readonly name: CharacterClassTemplate["name"];
  readonly primaryStat: CoreStatName;
  readonly comingOfAgeBonus: number;
  readonly description: string;

  private constructor(template: CharacterClassTemplate) {
    this.name = template.name;
    this.primaryStat = template.primaryStat;
    this.comingOfAgeBonus = template.comingOfAgeBonus;
    this.description = template.description;
  }

  static fromTemplate(template: CharacterClassTemplate): CharacterClass {
    return new CharacterClass(template);
  }
}
