"use client";

import { useEffect, useState } from "react";
import type { Lesson } from "@/lib/lessons";
import { speakDutch, stopSpeaking } from "@/lib/speech";
import { type SaveState, SaveNote } from "./lesson-player";

export function ReadExercise({
  lesson,
  done,
  onComplete,
}: {
  lesson: Lesson;
  done: boolean;
  onComplete: (score: number) => Promise<boolean>;
}) {
  const [save, setSave] = useState<SaveState>("idle");
  useEffect(() => stopSpeaking, []);

  async function markRead() {
    setSave("saving");
    setSave((await onComplete(100)) ? "saved" : "failed");
  }

  return (
    <>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {lesson.phrases.map((p) => (
          <li key={p.nl} className="phrase">
            <button className="icon-btn" type="button" onClick={() => speakDutch(p.nl)} aria-label={`Play: ${p.nl}`}>
              🔊
            </button>
            <div>
              <div className="phrase-nl" lang="nl-BE">{p.nl}</div>
              <div className="muted">{p.en}</div>
            </div>
          </li>
        ))}
      </ul>
      <div className="row">
        <button className="btn" type="button" onClick={markRead} disabled={save === "saving"}>
          {done ? "Mark as read again" : "Mark as read"}
        </button>
      </div>
      <SaveNote state={save} />
    </>
  );
}
