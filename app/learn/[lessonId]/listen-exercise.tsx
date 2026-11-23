"use client";

import { useEffect, useRef, useState } from "react";
import { SpeakerIcon } from "@/app/icons";
import { gradeWrite, type WriteResult } from "@/lib/match";
import { percent } from "@/lib/quiz";
import { speakDutch, stopSpeaking } from "@/lib/speech";
import { type ExerciseProps, type SaveState, ScoreSummary } from "./lesson-player";

/**
 * Listen is dictation: hear the Dutch, type the Dutch. Typing what you hear is what makes it stick,
 * so there are no answer options to tap. Small typos count, as in Write (80%).
 */
export function ListenExercise({ lesson, next, onNext, onComplete }: ExerciseProps) {
  const total = lesson.phrases.length;
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<WriteResult | null>(null);
  const [showText, setShowText] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [save, setSave] = useState<SaveState>("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const phrase = lesson.phrases[index]!;

  useEffect(() => stopSpeaking, []);
  // Each new phrase: play it (the first needs a tap, as browsers block autoplay) and focus the answer box.
  useEffect(() => {
    if (finished) return;
    if (index > 0) speakDutch(lesson.phrases[index]!.nl);
    inputRef.current?.focus();
  }, [index, finished, lesson.phrases]);
  useEffect(() => {
    if (result) nextRef.current?.focus();
  }, [result]);

  function check(e: React.FormEvent) {
    e.preventDefault();
    if (result || !answer.trim()) return;
    const graded = gradeWrite(answer, phrase.nl);
    setResult(graded);
    if (graded !== "wrong") setCorrect((c) => c + 1);
  }

  async function goNext() {
    setAnswer("");
    setResult(null);
    setShowText(false);
    if (index + 1 < total) {
      setIndex(index + 1);
      return;
    }
    setFinished(true);
    setSave("saving");
    setSave((await onComplete(percent(correct, total))) ? "saved" : "failed");
  }

  function restart() {
    setIndex(0);
    setCorrect(0);
    setAnswer("");
    setResult(null);
    setFinished(false);
    setSave("idle");
  }

  if (finished) {
    return <ScoreSummary correct={correct} total={total} save={save} next={next} onNext={onNext} onRestart={restart} />;
  }

  return (
    <div>
      <p className="progress-line">Phrase {index + 1} of {total}</p>
      <div className="btn-row">
        <button className="btn" type="button" onClick={() => speakDutch(phrase.nl)}><SpeakerIcon /> Play</button>
        <button className="btn btn-quiet" type="button" onClick={() => speakDutch(phrase.nl, 0.7)}>Play slowly</button>
      </div>

      <form onSubmit={check} style={{ marginTop: "var(--space-5)" }}>
        <label htmlFor="listen-answer">
          <span className="prompt-label">Type what you hear, in Dutch</span>
        </label>
        <input
          ref={inputRef}
          id="listen-answer"
          className="input"
          lang="nl-BE"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          readOnly={!!result}
          maxLength={200}
        />
        {!result && (
          <div className="btn-row" style={{ marginTop: "var(--space-4)" }}>
            <button className="btn" type="submit">Check</button>
            {/* R-NF-02: the written phrase is always available, for learners who can't hear the audio. */}
            <button className="text-link" type="button" aria-expanded={showText} onClick={() => setShowText((v) => !v)}>
              {showText ? "Hide the Dutch" : "Can't hear it? Show the Dutch"}
            </button>
          </div>
        )}
        {showText && !result && <p className="phrase-nl" lang="nl-BE" style={{ marginTop: "var(--space-3)" }}>{phrase.nl}</p>}
      </form>

      <div aria-live="polite" aria-atomic="true">
        {result && (
          <div id="listen-result" className="result" data-state={result === "wrong" ? "wrong" : "right"}>
            <p>
              <span className="result-title">
                {result === "exact" ? "Correct." : result === "close" ? "Almost — counted as right." : "Not quite."}
              </span>
              <br /><span lang="nl-BE">{phrase.nl}</span>
              <br /><span className="muted">{phrase.en}</span>
            </p>
          </div>
        )}
      </div>
      {result && (
        <div className="btn-row" style={{ marginTop: "var(--space-4)" }}>
          <button ref={nextRef} className="btn" type="button" onClick={goNext} aria-describedby="listen-result">
            {index + 1 < total ? "Next phrase" : "See score"}
          </button>
        </div>
      )}
    </div>
  );
}
