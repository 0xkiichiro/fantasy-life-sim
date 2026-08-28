export function rollAdvantage(statValue: number): number {
  const d1 = 1 + Math.floor(Math.random() * 6);
  const d2 = 1 + Math.floor(Math.random() * 6);
  const bonus = Math.floor(statValue / 4);
  return Math.max(d1, d2) + bonus;
}

export function rollD6(): number {
  return 1 + Math.floor(Math.random() * 6);
}
