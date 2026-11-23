import { describe, expect, it } from "vitest";
import { safeNext } from "./safe-next";

describe("safeNext", () => {
  it("keeps relative paths", () => expect(safeNext("/learn/cafe")).toBe("/learn/cafe"));
  it("blocks other sites", () => {
    expect(safeNext("https://evil.example")).toBe("/learn");
    expect(safeNext("//evil.example")).toBe("/learn");
    expect(safeNext("/\\evil.example")).toBe("/learn");
  });
  it("falls back when missing", () => expect(safeNext(null)).toBe("/learn"));
});
