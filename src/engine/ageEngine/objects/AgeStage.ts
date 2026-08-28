export type AgeStage = "childhood" | "adolescent" | "adult" | "elder";

export function stageForAge(age: number): AgeStage {
  if (age < 10) return "childhood";
  if (age < 16) return "adolescent";
  if (age < 60) return "adult";
  return "elder";
}
