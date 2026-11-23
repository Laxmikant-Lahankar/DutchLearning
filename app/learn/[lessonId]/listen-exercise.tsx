"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckIcon, CrossIcon, SpeakerIcon } from "@/app/icons";
import { listenOptions, percent } from "@/lib/quiz";
import { speakDutch, stopSpeaking } from "@/lib/speech";
import { type ExerciseProps, type SaveState, ScoreSummary } from "./lesson-player";

/** R-LS-02: the next question loads after about a second. */
const NEXT_DELAY_MS = 1100;
const AUTO_KEY = "dn.listen.autoAdvance";

function readAutoPref(): boolean {
  try {
    return window.localStorage.getItem(AUTO_KEY) !== "off";
  } catch {
    return true;
  }
}

export function ListenExercise({ lesson, next, onNext, onComplete }: ExerciseProps) {
  const total = lesson.phrases.length;
  const [round, setRound] = useState(0);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [save, setSave] = useState<SaveState>("idle");
  const [showText, setShowText] = useState(false);
  // WCAG 2.2.1: the timed advance has an off switch. When off, a Next button waits for the learner.
  const [auto, setAuto] = useState(readAutoPref);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const firstOption = useRef<HTMLButtonElement>(null);
  const nextBtn = useRef<HTMLButtonElement>(null);
  const moveFocus = useRef(false);

  const phrase = lesson.phrases[index]!;
  const options = useMemo(() => listenOptions(lesson.phrases, index), [lesson.phrases, index, round]);

  useEffect(
    () => () => {
      clearTimeout(timer.current);
      stopSpeaking();
    },
    [],
  );

  // New question: play it (the first needs a tap, as browsers block autoplay) and, if the learner
  // was answering by keyboard, put focus on the first option instead of dropping it.
  useEffect(() => {
    if (index > 0) speakDutch(lesson.phrases[index]!.nl);
    if (moveFocus.current) firstOption.current?.focus();
    moveFocus.current = false;
  }, [index, lesson.phrases]);

  function toggleAuto(on: boolean) {
    setAuto(on);
    try {
      window.localStorage.setItem(AUTO_KEY, on ? "on" : "off");
    } catch {
      /* preference just isn't remembered */
    }
  }

  async function advance(score: number) {
    clearTimeout(timer.current);
    setPicked(null);
    setShowText(false);
    if (index + 1 < total) {
      moveFocus.current = true;
      setIndex(index + 1);
    } else {
      setFinished(true);
      setSave("saving");
      setSave((await onComplete(percent(score, total))) ? "saved" : "failed");
    }
  }

  function pick(option: string) {
    if (picked) return;
    setPicked(option);
    const newCorrect = correct + (option === phrase.en ? 1 : 0);
    setCorrect(newCorrect);
    if (auto) {
      moveFocus.current = true;
      timer.current = setTimeout(() => advance(newCorrect), NEXT_DELAY_MS);
    } else {
      requestAnimationFrame(() => nextBtn.current?.focus());
    }
  }

  function restart() {
    setIndex(0);
    setCorrect(0);
    setPicked(null);
    setFinished(false);
    setSave("idle");
    setRound((r) => r + 1);
  }

  if (finished) {
    return <ScoreSummary correct={correct} total={total} save={save} next={next} onNext={onNext} onRestart={restart} />;
  }

  function stateOf(option: string): "right" | "wrong" | undefined {
    if (!picked) return undefined;
    if (option === phrase.en) return "right";
    if (option === picked) return "wrong";
    return undefined;
  }

  const gotIt = picked === phrase.en;

  return (
    <div>
      <div className="exercise-head">
        <p className="progress-line">Question {index + 1} of {total}</p>
        <label className="toggle">
          <input type="checkbox" checked={auto} onChange={(e) => toggleAuto(e.target.checked)} />
          Move on automatically
        </label>
      </div>
      <div className="btn-row">
        <button className="btn" type="button" onClick={() => speakDutch(phrase.nl)}><SpeakerIcon /> Play the phrase</button>
        {/* Written phrase is always available (R-NF-02), for learners who can't hear the audio. */}
        <button className="text-link" type="button" aria-expanded={showText} onClick={() => setShowText((v) => !v)}>
          {showText ? "Hide the Dutch" : "Show the Dutch"}
        </button>
      </div>
      {showText && <p className="phrase-nl" lang="nl-BE" style={{ marginTop: "var(--space-3)" }}>{phrase.nl}</p>}

      <p className="prompt-label" id="listen-q" style={{ marginTop: "var(--space-5)" }}>What does it mean?</p>
      <div className="options" role="group" aria-labelledby="listen-q">
        {options.map((o, i) => {
          const state = stateOf(o);
          return (
            <button
              key={o}
              ref={i === 0 ? firstOption : undefined}
              className="option"
              type="button"
              data-state={state}
              aria-disabled={!!picked}
              onClick={() => pick(o)}
            >
              <span>{o}</span>
              {state === "right" && <><CheckIcon className="option-icon" /><span className="sr-only"> (correct answer)</span></>}
              {state === "wrong" && <><CrossIcon className="option-icon" /><span className="sr-only"> (your answer)</span></>}
            </button>
          );
        })}
      </div>

      <div aria-live="polite" aria-atomic="true">
        {picked && (
          <div className="result" data-state={gotIt ? "right" : "wrong"}>
            <p className="result-title">{gotIt ? "Right." : `Not quite. It means “${phrase.en}”.`}</p>
            <p lang="nl-BE">{phrase.nl}</p>
          </div>
        )}
      </div>
      {picked && !auto && (
        <div className="btn-row" style={{ marginTop: "var(--space-4)" }}>
          <button ref={nextBtn} className="btn" type="button" onClick={() => advance(correct)}>
            {index + 1 < total ? "Next question" : "See score"}
          </button>
        </div>
      )}
    </div>
  );
}
