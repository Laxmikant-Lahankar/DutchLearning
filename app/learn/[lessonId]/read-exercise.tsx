"use client";

import { useEffect, useState } from "react";
import { SpeakerIcon } from "@/app/icons";
import { speakDutch, stopSpeaking } from "@/lib/speech";
import { type ExerciseProps, NextAction, type SaveState, SaveNote } from "./lesson-player";

export function ReadExercise({ lesson, next, onNext, onComplete, done }: ExerciseProps & { done: boolean }) {
  const [save, setSave] = useState<SaveState>("idle");
  useEffect(() => stopSpeaking, []);

  async function markRead() {
    if (save === "saving") return; // aria-disabled keeps focus on the button while saving
    setSave("saving");
    setSave((await onComplete(100)) ? "saved" : "failed");
  }

  return (
    <>
      <ul className="plain phrase-list">
        {lesson.phrases.map((p) => (
          <li key={p.nl} className="phrase">
            <button className="audio-btn" type="button" onClick={() => speakDutch(p.nl)}>
              <SpeakerIcon />
              <span className="sr-only">Play <span lang="nl-BE">{p.nl}</span></span>
            </button>
            <div>
              <p className="phrase-nl" lang="nl-BE" style={{ margin: 0 }}>{p.nl}</p>
              <p className="phrase-en">{p.en}</p>
              {p.nlNL && (
                <p className="variant-note">
                  In the Netherlands: <span lang="nl-NL">{p.nlNL}</span>
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="btn-row" style={{ marginTop: "var(--space-5)" }}>
        {save === "saved" ? (
          <NextAction next={next} onNext={onNext} />
        ) : (
          <button className="btn" type="button" onClick={markRead} aria-disabled={save === "saving"}>
            {done ? "Mark as read again" : "Mark as read"}
          </button>
        )}
      </div>
      <SaveNote state={save} />
    </>
  );
}
