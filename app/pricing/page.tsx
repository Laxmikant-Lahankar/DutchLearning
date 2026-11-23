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
      <div className="container narrow">
        <h1>Pricing</h1>
        <p>A1 is free, forever. Sign in with Google; no card needed.</p>
        <table>
          <caption className="sr-only">What Free and Pro include</caption>
          <thead>
            <tr><th scope="col">Feature</th><th scope="col">Free</th><th scope="col">Pro (coming later)</th></tr>
          </thead>
          <tbody>
            {ROWS.map(([feature, free, pro]) => (
              <tr key={feature}><th scope="row">{feature}</th><td>{free}</td><td>{pro}</td></tr>
            ))}
            <tr><th scope="row">Price</th><td>€0</td><td>Not set yet</td></tr>
          </tbody>
        </table>
        <div className="row"><Link className="btn" href="/login">Start free</Link></div>
      </div>
    </section>
  );
}
