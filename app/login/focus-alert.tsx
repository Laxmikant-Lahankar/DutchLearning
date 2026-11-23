"use client";

import { useEffect, useRef } from "react";

/**
 * An alert that is already in the page when it loads isn't reliably announced,
 * so move focus to it once, which makes screen readers read it out.
 */
export function FocusAlert({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <p ref={ref} role="alert" tabIndex={-1} className="result-error" style={{ marginBottom: "var(--space-4)" }}>
      {children}
    </p>
  );
}
