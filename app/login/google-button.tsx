"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function GoogleButton({ next }: { next: string }) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function signIn() {
    if (busy) return; // aria-disabled keeps focus on the button
    setBusy(true);
    setFailed(false);
    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
      if (error) throw error;
    } catch {
      setFailed(true);
      setBusy(false);
    }
  }

  return (
    <>
      <button className="btn" type="button" onClick={signIn} aria-disabled={busy}>
        {busy ? "Opening Google…" : "Continue with Google"}
      </button>
      {failed && <p role="alert">Sign-in isn&apos;t available right now. Please try again later.</p>}
    </>
  );
}
