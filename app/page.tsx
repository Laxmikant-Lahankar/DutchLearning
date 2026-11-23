import Link from "next/link";
import { HeroAudio } from "@/app/hero-audio";
import { LESSONS } from "@/lib/lessons";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-word-row">
            <p className="hero-word" lang="nl-BE">Goeiemorgen.</p>
            <HeroAudio text="Goeiemorgen" />
          </div>
          <p className="hero-gloss">Good morning.</p>
          <p className="hero-note">
            That&apos;s how Flanders says it. In the Netherlands you&apos;ll also hear <span lang="nl-NL">Goedemorgen</span>.
          </p>
          <h1>Learn Dutch properly, starting with the Dutch they speak in Flanders.</h1>
          <div className="btn-row">
            <Link className="btn btn-on-brand" href="/login">Start free with Google</Link>
            <Link className="btn btn-outline-on-brand" href="/pricing">What&apos;s free</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="measure">
            <p className="eyebrow">How a lesson works</p>
            <h2>Every phrase, four ways.</h2>
            <p className="muted">Short lessons for daily life, about ten minutes each. A1 is free; no card needed.</p>
          </div>
          <ul className="plain skill-list">
            <li><span className="skill-verb" lang="nl-BE">lezen</span><h3>Read</h3><p>The Dutch and the English side by side, with audio for every phrase.</p></li>
            <li><span className="skill-verb" lang="nl-BE">luisteren</span><h3>Listen</h3><p>Hear a phrase, then pick what it means.</p></li>
            <li><span className="skill-verb" lang="nl-BE">schrijven</span><h3>Write</h3><p>Type it in Dutch. Small typos still count, and a wrong answer comes with a short tip.</p></li>
            <li><span className="skill-verb" lang="nl-BE">spreken</span><h3>Speak</h3><p>Say it out loud and see what we heard.</p></li>
          </ul>
          <div className="sample">
            <p className="nl" lang="nl-BE">Kunt u wat trager spreken?</p>
            <p className="muted">Can you speak a bit more slowly? — from lesson 8</p>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <p className="eyebrow">A1 Beginner</p>
          <h2 style={{ marginBottom: "var(--space-5)" }}>Eight lessons to start</h2>
          <ol className="plain lesson-list">
            {LESSONS.map((l, i) => (
              <li key={l.id} className="lesson-row">
                <span className="lesson-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span className="lesson-title">{l.title}</span>
                <span className="lesson-meta" lang="nl-BE">{l.phrases[0]!.nl}</span>
              </li>
            ))}
          </ol>
          <div className="btn-row" style={{ marginTop: "var(--space-6)" }}>
            <Link className="btn" href="/login">Start lesson 1</Link>
          </div>
        </div>
      </section>
    </>
  );
}
