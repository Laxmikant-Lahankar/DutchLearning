import Link from "next/link";
import { LESSONS } from "@/lib/lessons";

export default function Home() {
  return (
    <>
      <section className="section">
        <div className="container narrow">
          <h1>Learn Dutch properly, starting with Flemish.</h1>
          <p style={{ fontSize: "1.2rem" }}>
            Short lessons for daily life. Read, listen, write and speak every phrase, ten minutes at a time.
          </p>
          <div className="row">
            <Link className="btn" href="/login">Start free with Google</Link>
            <Link className="btn btn-ghost" href="/pricing">See what&apos;s free</Link>
          </div>
          <p className="muted">A1 is free. No card needed.</p>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <h2>Four skills in every lesson</h2>
          <div className="grid">
            <div className="card"><h3>Read</h3><p>See each phrase in Dutch and English, and hear it spoken.</p></div>
            <div className="card"><h3>Listen</h3><p>Hear a phrase and pick what it means.</p></div>
            <div className="card"><h3>Write</h3><p>Type the Dutch. Small typos still count, and mistakes come with a short explanation.</p></div>
            <div className="card"><h3>Speak</h3><p>Say the phrase out loud and see what we heard.</p></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>A1 lessons</h2>
          <ul className="grid" style={{ listStyle: "none", padding: 0 }}>
            {LESSONS.map((l) => (
              <li key={l.id} className="card">
                <span className="lesson-emoji" aria-hidden="true">{l.emoji}</span>
                <h3>{l.title}</h3>
                <p className="muted">{l.phrases.length} phrases</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
