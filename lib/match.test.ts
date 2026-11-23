import { describe, expect, it } from "vitest";
import { gradeWrite, normalize, passesSpeak, similarity } from "./match";

describe("normalize", () => {
  it("ignores case, accents and punctuation", () => {
    expect(normalize("  Één, TWEE!  ")).toBe("een twee");
    expect(normalize("Hoe gaat het?")).toBe(normalize("hoe gaat het"));
  });
});

describe("gradeWrite", () => {
  it("accepts an exact answer regardless of case and punctuation", () => {
    expect(gradeWrite("goed dank u", "Goed, dank u.")).toBe("exact");
  });

  it("gives credit for a small typo (80% or more)", () => {
    expect(gradeWrite("Mag ik de rekenig?", "Mag ik de rekening?")).toBe("close");
  });

  it("rejects a different sentence", () => {
    expect(gradeWrite("Ik woon in Gent", "Waar is het station?")).toBe("wrong");
  });

  it("rejects an empty answer", () => {
    expect(gradeWrite("", "Hallo!")).toBe("wrong");
  });
});

describe("passesSpeak", () => {
  it("passes at 75% or more", () => {
    expect(passesSpeak("ik spreek een beetje nederland", "Ik spreek een beetje Nederlands.")).toBe(true);
    expect(passesSpeak("hallo", "Waar is het brood?")).toBe(false);
  });
});

describe("similarity", () => {
  it("is 1 for identical text", () => {
    expect(similarity("Dank u wel.", "dank u wel")).toBe(1);
  });
});
