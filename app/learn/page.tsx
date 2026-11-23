import type { Metadata } from "next";
import Link from "next/link";
import { LockIcon } from "@/app/icons";
import { LESSONS, LOCKED_LEVELS, SKILLS, XP_PER_SKILL } from "@/lib/lessons";
import { doneSkills, getMyProgress } from "@/lib/progress";

export const metadata: Metadata = { title: "My lessons" };
export const dynamic = "force-dynamic";

const LABEL = { read: "Read", grammar: "Grammar", listen: "Listen", write: "Write", speak: "Speak" } as const;

export default async function Learn() {
  const rows = await getMyProgress();
  // XP is a calculation for now (R-AC-05): 10 per completed skill.
  const xp = rows.length * XP_PER_SKILL;
  const total = LESSONS.length * SKILLS.length;
  const nextLesson = LESSONS.find((l) => doneSkills(rows, l.id).size < SKILLS.length);

  return (
    <div className="container">
      <header className="page-head">
        <p className="eyebrow">A1 Beginner</p>
        <h1>My lessons</h1>
      </header>

      {/* The next action comes first: on a phone, it's the one thing to tap. */}
      <div className="summary">
        <div className="summary-next">
          {nextLesson ? (
            <>
              <p className="muted">
                {rows.length === 0 ? "Start here" : "Up next"}: lesson {LESSONS.indexOf(nextLesson) + 1}
              </p>
              <Link className="btn" href={`/learn/${nextLesson.id}`}>{nextLesson.title}</Link>
            </>
          ) : (
            <p>You&apos;ve finished every A1 skill. Nice work.</p>
          )}
        </div>
        <div className="summary-stats">
          <p className="summary-item">
            <span className="summary-figure">{rows.length}<span className="muted">/{total}</span></span>
            <span className="summary-label">skills done</span>
          </p>
          <p className="summary-item">
            <span className="summary-figure">{xp}</span>
            <span className="summary-label">XP</span>
          </p>
        </div>
      </div>

      <ol className="plain lesson-list">
        {LESSONS.map((lesson, i) => {
          const done = doneSkills(rows, lesson.id);
          const doneNames = SKILLS.filter((s) => done.has(s)).map((s) => LABEL[s]);
          return (
            <li key={lesson.id}>
              <Link className="lesson-row" href={`/learn/${lesson.id}`}>
                <span className="lesson-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span className="lesson-title">{lesson.title}</span>
                <span className="lesson-meta">
                  <span className="meter" aria-hidden="true">
                    {SKILLS.map((s) => <span key={s} data-done={done.has(s)} />)}
                  </span>
                  <span>
                    {done.size === SKILLS.length ? "Complete" : `${done.size} of ${SKILLS.length}`}
                    <span className="sr-only">{doneNames.length ? `: ${doneNames.join(", ")} done` : ""}</span>
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <section className="section" aria-labelledby="next-levels">
        <h2 id="next-levels" style={{ marginBottom: "var(--space-4)" }}>Next levels</h2>
        <ul className="plain lesson-list">
          {LOCKED_LEVELS.map((l) => (
            <li key={l.level} className="lesson-row is-locked">
              <span className="lesson-num">{l.level}</span>
              <span className="lesson-title">{l.title.replace(`${l.level} `, "")}</span>
              <span className="lesson-meta"><LockIcon /> Coming soon</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
