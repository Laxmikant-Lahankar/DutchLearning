import { describe, expect, it } from "vitest";
import { chooseDutchVoice } from "./voices";

const v = (name: string, lang: string) => ({ name, lang });

describe("chooseDutchVoice", () => {
  it("returns nothing when only English voices exist, so we never read Dutch in English", () => {
    expect(chooseDutchVoice([v("Microsoft David", "en-US"), v("Microsoft Zira", "en-US")])).toBeUndefined();
    expect(chooseDutchVoice([])).toBeUndefined();
  });

  it("prefers Flemish over Netherlands Dutch", () => {
    const chosen = chooseDutchVoice([v("Google Nederlands", "nl-NL"), v("Microsoft Arnaud Online (Natural)", "nl-BE")]);
    expect(chosen?.lang).toBe("nl-BE");
  });

  it("prefers a natural voice within the same region", () => {
    const chosen = chooseDutchVoice([v("Microsoft Frank", "nl-NL"), v("Google Nederlands", "nl-NL")]);
    expect(chosen?.name).toBe("Google Nederlands");
  });

  it("handles underscores and lower case in language tags (Android)", () => {
    expect(chooseDutchVoice([v("Dutch", "nl_be")])?.name).toBe("Dutch");
  });

  it("falls back to any Dutch voice", () => {
    expect(chooseDutchVoice([v("English", "en-GB"), v("Nederlands", "nl")])?.name).toBe("Nederlands");
  });
});
