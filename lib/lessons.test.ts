import { describe, expect, it } from "vitest";
import { LESSONS } from "./lessons";

describe("lessons", () => {
  it("has 8 A1 lessons with 6 phrases each", () => {
    expect(LESSONS).toHaveLength(8);
    for (const lesson of LESSONS) {
      expect(lesson.level).toBe("A1");
      expect(lesson.phrases).toHaveLength(6);
    }
  });

  it("has unique ids and unique English meanings within a lesson", () => {
    expect(new Set(LESSONS.map((l) => l.id)).size).toBe(LESSONS.length);
    for (const lesson of LESSONS) {
      expect(new Set(lesson.phrases.map((p) => p.en)).size).toBe(lesson.phrases.length);
    }
  });
});
