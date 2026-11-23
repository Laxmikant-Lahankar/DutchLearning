"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { CheckIcon } from "@/app/icons";
import type { Lesson, Skill } from "@/lib/lessons";
import { SKILLS } from "@/lib/lessons";
import { GrammarExercise } from "./grammar-exercise";
import { ListenExercise } from "./listen-exercise";
import { ReadExercise } from "./read-exercise";
import { SpeakExercise } from "./speak-exercise";
import { WriteExercise } from "./write-exercise";

export const SKILL_LABEL: Record<Skill, string> = { read: "Read", grammar: "Grammar", listen: "Listen", write: "Write", speak: "Speak" };
const LABEL = SKILL_LABEL;

export type SaveState = "idle" | "saving" | "saved" | "failed";

export async function saveProgress(lessonId: string, skill: Skill, score: number): Promise<boolean> {
  try {
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, skill, score }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Where a finished skill leads: the next skill, the next lesson, or back to the list. */
export type NextStep = { label: string; skill: Skill } | { label: string; href: string };

export interface ExerciseProps {
  lesson: Lesson;
  next: NextStep;
  onNext: (skill: Skill) => void;
  onComplete: (score: number) => Promise<boolean>;
}

export function LessonPlayer({
  lesson,
  initialDone,
  nextLesson,
}: {
  lesson: Lesson;
  initialDone: Skill[];
  nextLesson: { id: string; title: string } | null;
}) {
  const [skill, setSkill] = useState<Skill>("read");
  const [done, setDone] = useState<Set<Skill>>(new Set(initialDone));
  const tabRefs = useRef<Partial<Record<Skill, HTMLButtonElement | null>>>({});
  const panelRef = useRef<HTMLDivElement>(null);

  function completer(s: Skill) {
    return async (score: number) => {
      const ok = await saveProgress(lesson.id, s, score);
      if (ok) setDone((prev) => new Set(prev).add(s));
      return ok;
    };
  }

  function nextStepFor(s: Skill): NextStep {
    const i = SKILLS.indexOf(s);
    const following = SKILLS[i + 1];
    if (following) return { label: `Next: ${LABEL[following]}`, skill: following };
    if (nextLesson) return { label: `Next lesson: ${nextLesson.title}`, href: `/learn/${nextLesson.id}` };
    return { label: "Back to my lessons", href: "/learn" };
  }

  function goTo(s: Skill) {
    setSkill(s);
    // Move focus to the new panel so keyboard and screen reader users land in the next exercise.
    requestAnimationFrame(() => panelRef.current?.focus());
  }

  // Tabs pattern: arrow keys, Home and End move between tabs; only the selected tab is a Tab stop.
  function onTabKey(e: React.KeyboardEvent, current: Skill) {
    const i = SKILLS.indexOf(current);
    const target =
      e.key === "ArrowRight" ? SKILLS[(i + 1) % SKILLS.length]
      : e.key === "ArrowLeft" ? SKILLS[(i - 1 + SKILLS.length) % SKILLS.length]
      : e.key === "Home" ? SKILLS[0]
      : e.key === "End" ? SKILLS[SKILLS.length - 1]
      : undefined;
    if (!target) return;
    e.preventDefault();
    setSkill(target);
    tabRefs.current[target]?.focus();
  }

  const props = (s: Skill): ExerciseProps => ({ lesson, next: nextStepFor(s), onNext: goTo, onComplete: completer(s) });

  return (
    <>
      <div className="tabs" role="tablist" aria-label="Skills">
        {SKILLS.map((s) => (
          <button
            key={s}
            ref={(el) => { tabRefs.current[s] = el; }}
            id={`tab-${s}`}
            className="tab"
            role="tab"
            type="button"
            aria-selected={skill === s}
            aria-controls="skill-panel"
            tabIndex={skill === s ? 0 : -1}
            onClick={() => setSkill(s)}
            onKeyDown={(e) => onTabKey(e, s)}
          >
            {done.has(s) && <CheckIcon className="tab-done" />}
            {LABEL[s]}
            {done.has(s) && <span className="sr-only"> (done)</span>}
          </button>
        ))}
      </div>

      <div id="skill-panel" ref={panelRef} role="tabpanel" aria-labelledby={`tab-${skill}`} tabIndex={-1}>
        {/* key resets each exercise when switching tabs. Exercises only mount after hydration,
            so their random option order never runs on the server. */}
        {skill === "read" && <ReadExercise key="read" {...props("read")} done={done.has("read")} />}
        {skill === "grammar" && <GrammarExercise key="grammar" {...props("grammar")} />}
        {skill === "listen" && <ListenExercise key="listen" {...props("listen")} />}
        {skill === "write" && <WriteExercise key="write" {...props("write")} />}
        {skill === "speak" && <SpeakExercise key="speak" {...props("speak")} />}
      </div>
    </>
  );
}

export function SaveNote({ state }: { state: SaveState }) {
  return (
    <p className={state === "failed" ? undefined : "muted"} role="status" style={{ minHeight: "1.5em" }}>
      {state === "saving" && "Saving…"}
      {state === "saved" && "Progress saved."}
      {state === "failed" && "We couldn't save your progress. Please try again."}
    </p>
  );
}

export function NextAction({ next, onNext }: { next: NextStep; onNext: (s: Skill) => void }) {
  return "href" in next ? (
    <Link className="btn" href={next.href}>{next.label}</Link>
  ) : (
    <button className="btn" type="button" onClick={() => onNext(next.skill)}>{next.label}</button>
  );
}

export function ScoreSummary({
  correct,
  total,
  save,
  next,
  onNext,
  onRestart,
}: {
  correct: number;
  total: number;
  save: SaveState;
  next: NextStep;
  onNext: (s: Skill) => void;
  onRestart: () => void;
}) {
  return (
    <div className="score">
      <p className="eyebrow">Your score</p>
      <p className="score-figure">
        {correct}<small> / {total}</small>
      </p>
      <SaveNote state={save} />
      <div className="btn-row">
        <NextAction next={next} onNext={onNext} />
        <button className="text-link" type="button" onClick={onRestart}>Go again</button>
      </div>
    </div>
  );
}
