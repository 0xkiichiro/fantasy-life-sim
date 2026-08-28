export const COLORS = {
  ink: "#2B2118",
  parchment: "#F1E4C6",
  parchmentDark: "#E4D3A8",
  oxblood: "#8B3A2F",
  moss: "#4A5D3A",
  gold: "#B4881F",
  leather: "#6B5B3E",
};

export function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v));
}
