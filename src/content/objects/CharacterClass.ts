import type { CoreStatName } from "../../engine/shared/objects/Character";

export interface CharacterClassTemplate {
  name: "Warrior" | "Mage" | "Rogue";
  primaryStat: CoreStatName;
  comingOfAgeBonus: number;
  description: string;
}

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
