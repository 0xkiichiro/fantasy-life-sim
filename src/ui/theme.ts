export const COLORS = {
  oxblood: "#7E2119",
  moss: "#4A6B32",
  gold: "#B08A2E",
  steel: "#3D6491",
  amethyst: "#6B4585",
  textDim: "#93805E",
};

export const CLASS_COLORS = {
  Warrior: COLORS.oxblood,
  Mage: COLORS.steel,
  Rogue: COLORS.moss,
} as const;

export function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v));
}
