"use client";

import { useEffect, useState } from "react";
import { hasDutchVoice } from "@/lib/speech";

export type VoiceStatus = "checking" | "yes" | "no";

/** Whether this device has a Dutch voice. Also warms up the voice list so the first tap speaks Dutch. */
export function useDutchVoice(): VoiceStatus {
  const [status, setStatus] = useState<VoiceStatus>("checking");
  useEffect(() => {
    let live = true;
    hasDutchVoice().then((ok) => live && setStatus(ok ? "yes" : "no"));
    return () => {
      live = false;
    };
  }, []);
  return status;
}

/** Shown when audio can't play in Dutch, instead of letting an English voice read Dutch text. */
export function NoDutchVoiceNotice() {
  const status = useDutchVoice();
  if (status !== "no") return null;
  return (
    <div className="notice" role="status" style={{ marginBottom: "var(--space-5)" }}>
      <p style={{ margin: 0 }}>
        <strong>This device has no Dutch voice, so audio won&apos;t play.</strong> Every phrase is still written out.
        To hear Dutch, open DagNederlands in Microsoft Edge or Google Chrome, or add Dutch in your device&apos;s
        speech settings (on Windows: Settings → Time &amp; language → Speech).
      </p>
    </div>
  );
}
