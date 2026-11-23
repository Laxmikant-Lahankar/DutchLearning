"use client";

import { useState } from "react";
import type { Lesson, Skill } from "@/lib/lessons";
import { SKILLS } from "@/lib/lessons";
import { ListenExercise } from "./listen-exercise";
import { ReadExercise } from "./read-exercise";
import { SpeakExercise } from "./speak-exercise";
import { WriteExercise } from "./write-exercise";

const LABEL: Record<Skill, string> = { read: "Read", listen: "Listen", write: "Write", speak: "Speak" };

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

export interface ExerciseProps {
  lesson: Lesson;
  onComplete: (score: number) => Promise<boolean>;
}

export function LessonPlayer({ lesson, initialDone }: { lesson: Lesson; initialDone: Skill[] }) {
  const [skill, setSkill] = useState<Skill>("read");
  const [done, setDone] = useState<Set<Skill>>(new Set(initialDone));

  function completer(s: Skill) {
    return async (score: number) => {
      const ok = await saveProgress(lesson.id, s, score);
      if (ok) setDone((prev) => new Set(prev).add(s));
      return ok;
    };
  }

  return (
    <>
      <div className="tabs" role="tablist" aria-label="Skills">
        {SKILLS.map((s) => (
          <button
            key={s}
            id={`tab-${s}`}
            className="tab"
            role="tab"
            type="button"
            aria-selected={skill === s}
            aria-controls="skill-panel"
            onClick={() => setSkill(s)}
          >
            {done.has(s) ? "✓ " : ""}
            {LABEL[s]}
            {done.has(s) && <span className="sr-only"> (done)</span>}
          </button>
        ))}
      </div>

      <div id="skill-panel" role="tabpanel" aria-labelledby={`tab-${skill}`}>
        {/* key resets each exercise when switching tabs */}
        {skill === "read" && <ReadExercise key="read" lesson={lesson} done={done.has("read")} onComplete={completer("read")} />}
        {skill === "listen" && <ListenExercise key="listen" lesson={lesson} onComplete={completer("listen")} />}
        {skill === "write" && <WriteExercise key="write" lesson={lesson} onComplete={completer("write")} />}
        {skill === "speak" && <SpeakExercise key="speak" lesson={lesson} onComplete={completer("speak")} />}
      </div>
    </>
  );
}

export function SaveNote({ state }: { state: SaveState }) {
  if (state === "saving") return <p className="muted" role="status">Saving…</p>;
  if (state === "saved") return <p role="status">Progress saved.</p>;
  if (state === "failed") return <p role="alert">We couldn&apos;t save your progress. Please try again.</p>;
  return null;
}

export function ScoreSummary({
  correct,
  total,
  save,
  onRestart,
}: {
  correct: number;
  total: number;
  save: SaveState;
  onRestart: () => void;
}) {
  return (
    <div className="card">
      <h2>Done!</h2>
      <p className="stat">{correct} / {total}</p>
      <SaveNote state={save} />
      <button className="btn btn-ghost" type="button" onClick={onRestart}>Try again</button>
    </div>
  );
}
