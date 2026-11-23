import { describe, expect, it } from "vitest";
import { parseEnv, requireSupabaseEnv } from "./env";

describe("parseEnv", () => {
  it("applies the default app URL", () => {
    expect(parseEnv({}).NEXT_PUBLIC_APP_URL).toBe("http://localhost:3000");
  });

  it("treats empty strings as unset", () => {
    const env = parseEnv({ NEXT_PUBLIC_SUPABASE_URL: "", NEXT_PUBLIC_SUPABASE_ANON_KEY: "" });
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBeUndefined();
  });

  it("rejects an invalid URL", () => {
    expect(() => parseEnv({ NEXT_PUBLIC_SUPABASE_URL: "not-a-url" })).toThrow();
  });
});

describe("requireSupabaseEnv", () => {
  it("throws a clear error when Supabase is not configured", () => {
    expect(() => requireSupabaseEnv(parseEnv({}))).toThrow(/Supabase is not configured/);
  });

  it("returns url and key when configured", () => {
    const env = parseEnv({
      NEXT_PUBLIC_SUPABASE_URL: "https://abc.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
    });
    expect(requireSupabaseEnv(env)).toEqual({ url: "https://abc.supabase.co", anonKey: "anon" });
  });
});
