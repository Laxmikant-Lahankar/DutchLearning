/** Answer comparison for Write (R-WR-02, R-WR-03) and Speak (R-SP-01). Pure functions. */

export const WRITE_PASS = 0.8;
export const SPEAK_PASS = 0.75;

/** Lowercase, strip accents and punctuation, collapse whitespace. */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’‘`]/g, "") // euro's = euros
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j]! + 1, cur[j - 1]! + 1, prev[j - 1]! + cost);
    }
    prev = cur;
  }
  return prev[b.length]!;
}

/** Similarity from 0 to 1 after normalising both strings. */
export function similarity(answer: string, target: string): number {
  const a = normalize(answer);
  const b = normalize(target);
  if (!a && !b) return 1;
  const longest = Math.max(a.length, b.length);
  return 1 - levenshtein(a, b) / longest;
}

export type WriteResult = "exact" | "close" | "wrong";

export function gradeWrite(answer: string, target: string): WriteResult {
  const score = similarity(answer, target);
  if (score === 1) return "exact";
  return score >= WRITE_PASS ? "close" : "wrong";
}

/**
 * Grammar drills are strict: one letter is often the whole point (woon / woont), so there is
 * no typo allowance. Case, accents and punctuation are still ignored. For gap drills the learner
 * may type just the missing word or the whole sentence.
 */
export function gradeDrill(answer: string, answers: readonly string[], gapText?: string): boolean {
  const given = normalize(answer);
  if (!given) return false;
  return answers.some(
    (a) => normalize(a) === given || (gapText !== undefined && normalize(gapText.replace("___", a)) === given),
  );
}

export function passesSpeak(heard: string, target: string): boolean {
  return similarity(heard, target) >= SPEAK_PASS;
}
