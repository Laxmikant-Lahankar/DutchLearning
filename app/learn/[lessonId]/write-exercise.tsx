"use client";

import { useEffect, useRef, useState } from "react";
import type { FeedbackResponse } from "@/app/api/feedback/route";
import { gradeWrite, type WriteResult } from "@/lib/match";
import { percent } from "@/lib/quiz";
import { type ExerciseProps, type SaveState, ScoreSummary } from "./lesson-player";

type Feedback = { state: "loading" } | FeedbackResponse;

async function fetchFeedback(lessonId: string, index: number, answer: string): Promise<FeedbackResponse> {
  try {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, index, answer }),
    });
    return (await res.json()) as FeedbackResponse;
  } catch {
    return { status: "unavailable" };
  }
}

export function WriteExercise({ lesson, next, onNext, onComplete }: ExerciseProps) {
  const total = lesson.phrases.length;
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<WriteResult | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [save, setSave] = useState<SaveState>("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const phrase = lesson.phrases[index]!;
  const currentIndex = useRef(index);
  currentIndex.current = finished ? -1 : index;

  // Focus the answer box for each new question, and the Next button once an answer is checked.
  useEffect(() => {
    if (!finished) inputRef.current?.focus();
  }, [index, finished]);
  useEffect(() => {
    if (result) nextRef.current?.focus();
  }, [result]);

  async function check(e: React.FormEvent) {
    e.preventDefault();
    if (result || !answer.trim()) return;
    const graded = gradeWrite(answer, phrase.nl);
    setResult(graded);
    if (graded !== "wrong") {
      setCorrect((c) => c + 1);
      return;
    }
    // Wrong: the correct answer shows straight away; the explanation follows if it arrives (R-AI-04).
    setFeedback({ state: "loading" });
    const asked = index;
    const reply = await fetchFeedback(lesson.id, asked, answer);
    // Ignore a late reply if the learner has already moved on.
    if (currentIndex.current === asked) setFeedback(reply);
  }

  async function goNext() {
    setAnswer("");
    setResult(null);
    setFeedback(null);
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
    setFeedback(null);
    setFinished(false);
    setSave("idle");
  }

  if (finished) {
    return <ScoreSummary correct={correct} total={total} save={save} next={next} onNext={onNext} onRestart={restart} />;
  }

  return (
    <div>
      <p className="progress-line">Question {index + 1} of {total}</p>
      <form onSubmit={check}>
        <label htmlFor="write-answer">
          <span className="prompt-label">Write this in Dutch</span>
          <span className="prompt" style={{ display: "block" }}>{phrase.en}</span>
        </label>
        <input
          ref={inputRef}
          id="write-answer"
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
          </div>
        )}
      </form>

      {/* The result text is announced on its own; Next points back to it via aria-describedby. */}
      <div aria-live="polite" aria-atomic="true">
        {result && (
          <div id="write-result" className="result" data-state={result === "wrong" ? "wrong" : "right"}>
            {result === "exact" && <p className="result-title">Correct.</p>}
            {result === "close" && (
              <p>
                <span className="result-title">Almost — counted as right.</span>
                <br />Spelling: <span lang="nl-BE">{phrase.nl}</span>
              </p>
            )}
            {result === "wrong" && (
              <>
                <p>
                  <span className="result-title">Not quite.</span>
                  <br />The answer: <span lang="nl-BE">{phrase.nl}</span>
                </p>
                {feedback && "state" in feedback && <p className="tip">Getting a tip…</p>}
                {feedback && "status" in feedback && feedback.status === "ok" && <p>{feedback.feedback}</p>}
                {feedback && "status" in feedback && feedback.status === "limit" && (
                  <p className="tip">You&apos;ve used today&apos;s tips. They reset tomorrow.</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
      {result && (
        <div className="btn-row" style={{ marginTop: "var(--space-4)" }}>
          <button ref={nextRef} className="btn" type="button" onClick={goNext} aria-describedby="write-result">
            {index + 1 < total ? "Next question" : "See score"}
          </button>
        </div>
      )}
    </div>
  );
}
