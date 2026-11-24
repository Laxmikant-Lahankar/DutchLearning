import type { Metadata } from "next";
import { VoiceCheck } from "./voice-check";

export const metadata: Metadata = {
  title: "Sound check",
  robots: { index: false },
};

/** Public diagnostic: which voices this browser offers, and which one DagNederlands would use. */
export default function VoicesPage() {
  return (
    <section className="section">
      <div className="container measure">
        <h1>Sound check</h1>
        <p className="muted" style={{ marginTop: "var(--space-3)" }}>
          DagNederlands uses your browser&apos;s own voices. This page shows which ones your browser offers and lets you
          test them.
        </p>
        <VoiceCheck />
      </div>
    </section>
  );
}
