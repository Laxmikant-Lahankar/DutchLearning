import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getEnv } from "@/lib/env";
import { safeNext } from "@/lib/safe-next";
import { getUser } from "@/lib/user";
import { FocusAlert } from "./focus-alert";
import { GoogleButton } from "./google-button";

type Props = { searchParams: Promise<{ next?: string; error?: string }> };

// The error is in the page title too, so it is announced even before focus moves (WCAG 4.1.3).
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { error } = await searchParams;
  return { title: error ? "Sign-in didn't work" : "Sign in" };
}

export default async function Login({ searchParams }: Props) {
  const { next, error } = await searchParams;
  const target = safeNext(next);
  if (await getUser()) redirect(target);

  const env = getEnv();
  const configured = Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return (
    <section className="section">
      <div className="container measure">
        <h1>Sign in</h1>
        <p className="muted" style={{ marginTop: "var(--space-3)" }}>Use your Google account. A1 is free and needs no card.</p>
        {error && <FocusAlert>Sign-in didn&apos;t work. Please try again.</FocusAlert>}
        {configured ? (
          <GoogleButton next={target} />
        ) : (
          <p className="notice">Sign-in isn&apos;t available yet. Please check back soon.</p>
        )}
      </div>
    </section>
  );
}
