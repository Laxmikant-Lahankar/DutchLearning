import { describe, expect, it } from "vitest";
import { LESSONS } from "./lessons";
import { listenOptions, percent } from "./quiz";

describe("listenOptions", () => {
  const phrases = LESSONS[0]!.phrases;

  it("gives four distinct options including the right one, all from the lesson", () => {
    for (let i = 0; i < phrases.length; i++) {
      const options = listenOptions(phrases, i);
      expect(options).toHaveLength(4);
      expect(new Set(options).size).toBe(4);
      expect(options).toContain(phrases[i]!.en);
      for (const o of options) expect(phrases.map((p) => p.en)).toContain(o);
    }
  });
});

describe("percent", () => {
  it("rounds and handles zero", () => {
    expect(percent(5, 6)).toBe(83);
    expect(percent(0, 0)).toBe(0);
  });
});
