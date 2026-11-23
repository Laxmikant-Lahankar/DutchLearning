import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Pricing" };

const ROWS: [string, string, string][] = [
  ["A1 lessons", "Yes", "Yes"],
  ["A2 and B1", "No", "Yes"],
  ["Read, listen, write, speak", "Yes", "Yes"],
  ["Writing feedback", "10 per day", "More"],
  ["Deeper speaking feedback", "No", "Yes"],
];

export default function Pricing() {
  return (
    <section className="section">
      <div className="container measure">
        <h1>Pricing</h1>
        <p className="muted" style={{ fontSize: "var(--step-1)", marginTop: "var(--space-3)" }}>A1 is free, forever. Sign in with Google; no card needed.</p>
        <table className="compare">
          <caption className="sr-only">What Free and Pro include</caption>
          <thead>
            <tr><td /><th scope="col">Free</th><th scope="col">Pro</th></tr>
          </thead>
          <tbody>
            {ROWS.map(([feature, free, pro]) => (
              <tr key={feature}><th scope="row">{feature}</th><td>{free}</td><td>{pro}</td></tr>
            ))}
            <tr><th scope="row">Price</th><td>€0</td><td>Not set yet</td></tr>
          </tbody>
        </table>
        <p className="muted" style={{ marginTop: "calc(-1 * var(--space-4))" }}>Pro is coming later. Its price isn&apos;t set yet.</p>
        <div className="btn-row"><Link className="btn" href="/login">Start free with Google</Link></div>
      </div>
    </section>
  );
}
