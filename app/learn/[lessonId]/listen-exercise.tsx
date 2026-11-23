"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { listenOptions, percent } from "@/lib/quiz";
import { speakDutch, stopSpeaking } from "@/lib/speech";
import { type ExerciseProps, type SaveState, ScoreSummary } from "./lesson-player";

const NEXT_DELAY_MS = 1100;

export function ListenExercise({ lesson, onComplete }: ExerciseProps) {
  const total = lesson.phrases.length;
  const [round, setRound] = useState(0);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [save, setSave] = useState<SaveState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [showText, setShowText] = useState(false);

  const phrase = lesson.phrases[index]!;
  // Only rendered after a tab click, so this random order never runs on the server (no hydration mismatch).
  const options = useMemo(() => listenOptions(lesson.phrases, index), [lesson.phrases, index, round]);

  useEffect(
    () => () => {
      clearTimeout(timer.current);
      stopSpeaking();
    },
    [],
  );

  // Play each new question after the first (the first needs a tap, as browsers block autoplay).
  useEffect(() => {
    if (index > 0) speakDutch(lesson.phrases[index]!.nl);
  }, [index, lesson.phrases]);

  function pick(option: string) {
    if (picked) return;
    setPicked(option);
    const right = option === phrase.en;
    const newCorrect = correct + (right ? 1 : 0);
    setCorrect(newCorrect);
    timer.current = setTimeout(async () => {
      setPicked(null);
      setShowText(false);
      if (index + 1 < total) {
        setIndex(index + 1);
      } else {
        setFinished(true);
        setSave("saving");
        setSave((await onComplete(percent(newCorrect, total))) ? "saved" : "failed");
      }
    }, NEXT_DELAY_MS);
  }

  function restart() {
    setIndex(0);
    setCorrect(0);
    setPicked(null);
    setFinished(false);
    setSave("idle");
    setRound((r) => r + 1);
  }

  if (finished) return <ScoreSummary correct={correct} total={total} save={save} onRestart={restart} />;

  function stateOf(option: string): "right" | "wrong" | undefined {
    if (!picked) return undefined;
    if (option === phrase.en) return "right";
    if (option === picked) return "wrong";
    return undefined;
  }

  return (
    <div>
      <p className="muted">Question {index + 1} of {total}</p>
      <div className="row">
        <button className="btn" type="button" onClick={() => speakDutch(phrase.nl)}>🔊 Play the phrase</button>
        {/* Written phrase is always available (R-NF-02), for learners who can't hear the audio. */}
        <button className="btn btn-ghost" type="button" aria-expanded={showText} onClick={() => setShowText((v) => !v)}>
          {showText ? "Hide the Dutch" : "Show the Dutch"}
        </button>
      </div>
      {showText && <p className="phrase-nl" lang="nl-BE">{phrase.nl}</p>}
      <p>What does it mean?</p>
      <div className="options">
        {options.map((o) => (
          <button key={o} className="option" type="button" data-state={stateOf(o)} disabled={!!picked} onClick={() => pick(o)}>
            {o}
          </button>
        ))}
      </div>
      <div aria-live="polite">
        {picked && (
          <p>
            {picked === phrase.en ? "Right!" : `Not quite. It means “${phrase.en}”.`}{" "}
            <span lang="nl-BE">({phrase.nl})</span>
          </p>
        )}
      </div>
    </div>
  );
}
