import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Signing out returns to the landing page (R-AC-02). POST only, so links cannot sign people out. */
export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
