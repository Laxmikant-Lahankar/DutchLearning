import { NextResponse } from "next/server";
import { getEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

type DbState = "ok" | "unconfigured" | "error";

async function checkDatabase(): Promise<DbState> {
  const { NEXT_PUBLIC_SUPABASE_URL: url, NEXT_PUBLIC_SUPABASE_ANON_KEY: key } = getEnv();
  if (!url || !key) return "unconfigured";
  try {
    const res = await fetch(`${url}/auth/v1/health`, {
      headers: { apikey: key },
      signal: AbortSignal.timeout(3000),
      cache: "no-store",
    });
    return res.ok ? "ok" : "error";
  } catch {
    return "error";
  }
}

/** Used by uptime monitors and deployment checks. Contains no user data. */
export async function GET() {
  const database = await checkDatabase();
  const healthy = database !== "error";
  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      database,
      version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "dev",
      time: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503 },
  );
}
