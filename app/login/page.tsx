import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { safeNext } from "@/lib/safe-next";
import { getUser } from "@/lib/user";
import { GoogleButton } from "./google-button";

export const metadata: Metadata = { title: "Sign in" };

export default async function Login({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  const target = safeNext(next);
  if (await getUser()) redirect(target);

  return (
    <section className="section">
      <div className="container narrow">
        <h1>Sign in</h1>
        <p>Use your Google account. A1 is free and needs no card.</p>
        {error && <p role="alert">Sign-in didn&apos;t work. Please try again.</p>}
        <GoogleButton next={target} />
      </div>
    </section>
  );
}
