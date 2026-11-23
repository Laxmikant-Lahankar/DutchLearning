import { describe, expect, it } from "vitest";
import { percent } from "./quiz";

describe("percent", () => {
  it("rounds and handles zero", () => {
    expect(percent(5, 6)).toBe(83);
    expect(percent(0, 0)).toBe(0);
  });
});
