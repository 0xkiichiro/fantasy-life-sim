/** What an EventOption.resolve() hands back so the engine can apply side effects and log it. */
export interface EventResult {
  log: string;
  health?: number;       // direct health delta, applied after resolve() runs
  deathChance?: number;  // 0-1; rolled by the death system if present
}
