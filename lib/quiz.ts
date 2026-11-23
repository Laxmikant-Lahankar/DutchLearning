import type { Phrase } from "./lessons";

/** Fisher–Yates shuffle that returns a new array. `random` is injectable for tests. */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/** Four English options: the right one plus three from the same lesson (R-LS-01). */
export function listenOptions(phrases: readonly Phrase[], index: number, random: () => number = Math.random): string[] {
  const right = phrases[index]!.en;
  const wrong = shuffle(
    phrases.filter((_, i) => i !== index).map((p) => p.en),
    random,
  ).slice(0, 3);
  return shuffle([right, ...wrong], random);
}

export function percent(correct: number, total: number): number {
  return total === 0 ? 0 : Math.round((correct / total) * 100);
}
