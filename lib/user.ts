import "server-only";
import type { User } from "@supabase/supabase-js";
import { getEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

/** The signed-in user, or null when signed out or when Supabase is not configured. */
export async function getUser(): Promise<User | null> {
  const env = getEnv();
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}
