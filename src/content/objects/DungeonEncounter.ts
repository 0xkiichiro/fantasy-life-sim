import type { CoreStatName } from "../../engine/shared/objects/Character";

export interface DungeonEncounterTemplate {
  name: string;
  minLevel: number;
  monster: string;
  checkStat: CoreStatName;
  difficulty: number;
  goldReward: [min: number, max: number];
  proficiencyReward: number;
  deathChanceOnFailure: number;
}

export class DungeonEncounter {
  readonly name: string;
  readonly minLevel: number;
  readonly monster: string;
  readonly checkStat: CoreStatName;
  readonly difficulty: number;
  readonly goldReward: [number, number];
  readonly proficiencyReward: number;
  readonly deathChanceOnFailure: number;

  private constructor(template: DungeonEncounterTemplate) {
    this.name = template.name;
    this.minLevel = template.minLevel;
    this.monster = template.monster;
    this.checkStat = template.checkStat;
    this.difficulty = template.difficulty;
    this.goldReward = template.goldReward;
    this.proficiencyReward = template.proficiencyReward;
    this.deathChanceOnFailure = template.deathChanceOnFailure;
  }

  static fromTemplate(template: DungeonEncounterTemplate): DungeonEncounter {
    return new DungeonEncounter(template);
  }

  rollGold(): number {
    const [min, max] = this.goldReward;
    return min + Math.floor(Math.random() * (max - min + 1));
  }
}
