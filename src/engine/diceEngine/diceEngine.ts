/**
 * diceEngine — the D&D-style advantage roll: 2d6, take the higher, plus a
 * small bonus from the relevant stat. Isolated so the curve can be tuned
 * or unit tested without touching event or UI code.
 */
export function rollAdvantage(statValue: number): number {
  const d1 = 1 + Math.floor(Math.random() * 6);
  const d2 = 1 + Math.floor(Math.random() * 6);
  const bonus = Math.floor(statValue / 4);
  return Math.max(d1, d2) + bonus;
}

/** Plain d6, no advantage — exposed for content that wants a flatter roll. */
export function rollD6(): number {
  return 1 + Math.floor(Math.random() * 6);
}
