import type { Metadata } from "next";
import Link from "next/link";
import { LESSONS, LOCKED_LEVELS, SKILLS, XP_PER_SKILL } from "@/lib/lessons";
import { doneSkills, getMyProgress } from "@/lib/progress";

export const metadata: Metadata = { title: "My lessons" };
export const dynamic = "force-dynamic";

const LABEL = { read: "Read", listen: "Listen", write: "Write", speak: "Speak" } as const;

export default async function Learn() {
  const rows = await getMyProgress();
  // XP is a calculation for now (R-AC-05): 10 per completed skill.
  const xp = rows.length * XP_PER_SKILL;
  const total = LESSONS.length * SKILLS.length;

  return (
    <section className="section">
      <div className="container">
        <h1>My lessons</h1>
        <div className="row" style={{ marginBottom: "2rem" }}>
          <div className="card"><div className="stat">{xp}</div><div className="muted">XP</div></div>
          <div className="card"><div className="stat">{rows.length}/{total}</div><div className="muted">Skills done</div></div>
        </div>

        <h2>A1 Beginner</h2>
        <ul className="grid" style={{ listStyle: "none", padding: 0 }}>
          {LESSONS.map((lesson) => {
            const done = doneSkills(rows, lesson.id);
            return (
              <li key={lesson.id}>
                <Link className="card lesson-card" href={`/learn/${lesson.id}`}>
                  <span className="lesson-emoji" aria-hidden="true">{lesson.emoji}</span>
                  <h3>{lesson.title}</h3>
                  <ul className="ticks" aria-label={`${done.size} of 4 skills done`}>
                    {SKILLS.map((s) => (
                      <li key={s} data-done={done.has(s)}>
                        {done.has(s) ? "✓ " : ""}{LABEL[s]}
                      </li>
                    ))}
                  </ul>
                </Link>
              </li>
            );
          })}
        </ul>

        <h2 style={{ marginTop: "2.5rem" }}>Next levels</h2>
        <ul className="grid" style={{ listStyle: "none", padding: 0 }}>
          {LOCKED_LEVELS.map((l) => (
            <li key={l.level} className="card locked">
              <span aria-hidden="true">🔒</span>
              <h3>{l.title}</h3>
              <p>Coming soon</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
