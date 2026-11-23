import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

/** Contact address for privacy and deletion requests. Set NEXT_PUBLIC_CONTACT_EMAIL before launch. */
const CONTACT = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export default function Privacy() {
  return (
    <section className="section">
      <div className="container measure prose">
        <h1 style={{ marginBottom: "var(--space-3)" }}>Privacy</h1>
        <p className="muted" style={{ fontSize: "var(--step-1)" }}>DagNederlands collects as little as it can.</p>

        <h2>What we store</h2>
        <ul>
          <li>Your email address, from Google sign-in.</li>
          <li>Your progress: which lesson skills you finished, your score and when.</li>
          <li>How many writing explanations you used today, so we can apply the daily limit.</li>
        </ul>
        <p>Your data sits in our database behind access rules, so only you can see your own progress.</p>

        <h2>Writing explanations</h2>
        <p>
          When a written answer is wrong, we send that answer, the English prompt and the correct Dutch to our AI
          provider, Anthropic, to write a short explanation. Correct answers are never sent.
        </p>

        <h2>Speaking practice</h2>
        <p>
          Speaking uses your browser&apos;s built-in speech recognition. In Chrome, and in other browsers that use
          Google&apos;s service, your voice is sent to the browser maker to be turned into text. We never receive or
          store your recording; we only see the text that comes back, and we don&apos;t save it.
        </p>
        <p>Listening uses your device&apos;s own voices; nothing is sent.</p>

        <h2>Cookies</h2>
        <p>We only use the cookies needed to keep you signed in. No ads, no tracking.</p>

        <h2>Deleting your account</h2>
        <p>
          {CONTACT ? (
            <>Email <a href={`mailto:${CONTACT}`}>{CONTACT}</a> from the address you signed in with.</>
          ) : (
            <>Contact us from the address you signed in with.</>
          )}{" "}
          We delete your account and all progress tied to it.
        </p>
      </div>
    </section>
  );
}
