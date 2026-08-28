import type { CoreStatName } from "../../engine/shared/objects/Character";

/**
 * DungeonEncounter — formalized now even though there's no standalone
 * dungeon-crawling system yet (v1 resolves dungeons narratively, inline
 * in scripted events). Having the template exist means the next dungeon
 * doesn't have to be hardcoded prose the way "ogre-kin" is in v1 — it can
 * be spun up from a template and dropped into an event's resolve().
 *
 * Deliberately minimal: extend this once an actual dungeon system exists
 * rather than speculatively building fields nothing reads yet.
 */
export interface DungeonEncounterTemplate {
  name: string;
  minLevel: number;
  monster: string;
  checkStat: CoreStatName;
  difficulty: number; // roll target on the advantage dice check
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
