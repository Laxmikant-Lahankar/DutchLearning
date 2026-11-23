import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getEnv } from "@/lib/env";

/** Paths that need a signed-in learner (R-AC-01). */
const PROTECTED = ["/learn"];

/** Refreshes the Supabase session cookie and redirects signed-out visitors away from protected pages. */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { NEXT_PUBLIC_SUPABASE_URL: url, NEXT_PUBLIC_SUPABASE_ANON_KEY: key } = getEnv();
  const isProtected = PROTECTED.some((p) => request.nextUrl.pathname.startsWith(p));

  if (!url || !key) {
    // Supabase not configured (local dev without keys): nobody can sign in.
    return isProtected ? NextResponse.redirect(new URL("/login", request.url)) : response;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(list: { name: string; value: string; options: CookieOptions }[]) {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isProtected) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }

  return response;
}
