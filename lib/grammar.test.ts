import { describe, expect, it } from "vitest";
import { GRAMMAR, drillSolution } from "./grammar";
import { LESSONS } from "./lessons";
import { gradeDrill } from "./match";

const entries = Object.entries(GRAMMAR);

describe("grammar content", () => {
  it("gives every lesson exactly one grammar lesson, and none without a lesson", () => {
    for (const lesson of LESSONS) expect(GRAMMAR[lesson.id], lesson.id).toBeDefined();
    expect(entries).toHaveLength(LESSONS.length);
  });

  it("has an explanation and 8 to 10 drills per lesson", () => {
    for (const [id, g] of entries) {
      expect(g.sections.length, id).toBeGreaterThan(0);
      expect(g.drills.length, id).toBeGreaterThanOrEqual(8);
      expect(g.drills.length, id).toBeLessThanOrEqual(10);
    }
  });

  it("puts exactly one blank in every gap drill", () => {
    for (const [id, g] of entries) {
      for (const d of g.drills) {
        if (d.kind === "gap") expect(d.text.split("___").length - 1, `${id}: ${d.text}`).toBe(1);
      }
    }
  });

  it("accepts every listed answer, and the whole sentence for gap drills", () => {
    for (const [, g] of entries) {
      for (const d of g.drills) {
        const gapText = d.kind === "gap" ? d.text : undefined;
        for (const a of d.answers) expect(gradeDrill(a, d.answers, gapText), a).toBe(true);
        if (gapText) expect(gradeDrill(drillSolution(d), d.answers, gapText)).toBe(true);
      }
    }
  });

  it("keeps *Dutch* markup balanced", () => {
    for (const [id, g] of entries) {
      for (const s of g.sections) for (const t of s.text) expect((t.match(/\*/g) ?? []).length % 2, `${id}: ${t}`).toBe(0);
    }
  });
});

describe("gradeDrill", () => {
  it("is strict about one letter, because that's the grammar point", () => {
    expect(gradeDrill("woont", ["woon"], "Ik ___ in Antwerpen.")).toBe(false);
    expect(gradeDrill("Woon", ["woon"], "Ik ___ in Antwerpen.")).toBe(true);
  });

  it("ignores apostrophes, so euros matches euro's", () => {
    expect(gradeDrill("euros", ["euro's"], "één euro, vijf ___")).toBe(true);
  });

  it("rejects an empty answer", () => {
    expect(gradeDrill("  ", ["ben"], "Ik ___ moe.")).toBe(false);
  });
});
