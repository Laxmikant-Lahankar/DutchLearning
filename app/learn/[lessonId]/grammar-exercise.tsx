"use client";

import { useEffect, useRef, useState } from "react";
import { RichText } from "@/app/rich-text";
import { type Drill, drillSolution, getGrammar } from "@/lib/grammar";
import { gradeDrill } from "@/lib/match";
import { percent } from "@/lib/quiz";
import { type ExerciseProps, type SaveState, ScoreSummary } from "./lesson-player";
import { type Feedback, fetchFeedback } from "./typed-answer";

function DrillPrompt({ drill }: { drill: Drill }) {
  if (drill.kind === "gap") {
    const [before, after] = drill.text.split("___");
    return (
      <>
        <span className="prompt-label">Fill the gap · <span lang="nl-BE">{drill.hint}</span></span>
        <span className="prompt" lang="nl-BE" style={{ display: "block" }}>
          {before}<span className="gap"><span className="sr-only">(blank)</span></span>{after}
        </span>
        <span className="phrase-en" style={{ display: "block", marginTop: "calc(-1 * var(--space-4))", marginBottom: "var(--space-4)" }}>
          {drill.en}
        </span>
      </>
    );
  }
  if (drill.kind === "rewrite") {
    return (
      <>
        <span className="prompt-label"><RichText text={drill.task} /></span>
        <span className="prompt" lang="nl-BE" style={{ display: "block" }}>{drill.from}</span>
      </>
    );
  }
  return (
    <>
      <span className="prompt-label">
        Write this in Dutch{drill.hint ? <> · use <span lang="nl-BE">{drill.hint}</span></> : null}
      </span>
      <span className="prompt" style={{ display: "block" }}>{drill.en}</span>
    </>
  );
}

export function GrammarExercise({ lesson, next, onNext, onComplete }: ExerciseProps) {
  const grammar = getGrammar(lesson.id)!;
  const drills = grammar.drills;
  const total = drills.length;
  const [phase, setPhase] = useState<"learn" | "practise">("learn");
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<"right" | "wrong" | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [save, setSave] = useState<SaveState>("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const currentIndex = useRef(index);
  currentIndex.current = finished ? -1 : index;

  const drill = drills[index]!;

  useEffect(() => {
    if (phase === "practise" && !finished) inputRef.current?.focus();
  }, [phase, index, finished]);
  useEffect(() => {
    if (result) nextRef.current?.focus();
  }, [result]);

  async function check(e: React.FormEvent) {
    e.preventDefault();
    if (result || !answer.trim()) return;
    const ok = gradeDrill(answer, drill.answers, drill.kind === "gap" ? drill.text : undefined);
    setResult(ok ? "right" : "wrong");
    if (ok) {
      setCorrect((c) => c + 1);
      return;
    }
    setFeedback({ state: "loading" });
    const asked = index;
    const reply = await fetchFeedback("grammar", lesson.id, asked, answer);
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

  if (phase === "learn") {
    return (
      <article className="grammar">
        <h2>{grammar.title}</h2>
        <p className="muted">{grammar.summary}</p>
        {grammar.sections.map((s) => (
          <section key={s.heading}>
            <h3>{s.heading}</h3>
            {s.text.map((t) => <p key={t}><RichText text={t} /></p>)}
            {s.table && (
              <table className="forms">
                <tbody>
                  {s.table.map(([nl, en]) => (
                    <tr key={nl}><td lang="nl-BE">{nl}</td><td>{en}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
            {s.examples && (
              <ul className="plain examples">
                {s.examples.map((ex) => (
                  <li key={ex.nl}><span lang="nl-BE">{ex.nl}</span> <span className="muted">{ex.en}</span></li>
                ))}
              </ul>
            )}
          </section>
        ))}
        <div className="btn-row" style={{ marginTop: "var(--space-6)" }}>
          <button className="btn" type="button" onClick={() => setPhase("practise")}>
            Practise: {total} questions
          </button>
        </div>
      </article>
    );
  }

  if (finished) {
    return <ScoreSummary correct={correct} total={total} save={save} next={next} onNext={onNext} onRestart={restart} />;
  }

  const gap = drill.kind === "gap";

  return (
    <div>
      <div className="exercise-head">
        <p className="progress-line">Question {index + 1} of {total}</p>
        <button className="text-link" type="button" onClick={() => setPhase("learn")}>See the rule again</button>
      </div>
      <form onSubmit={check}>
        <label htmlFor="drill-answer">
          <DrillPrompt drill={drill} />
        </label>
        <input
          ref={inputRef}
          id="drill-answer"
          className="input"
          lang="nl-BE"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          readOnly={!!result}
          maxLength={200}
          placeholder={gap ? "The missing word" : "The whole sentence"}
        />
        {!result && (
          <div className="btn-row" style={{ marginTop: "var(--space-4)" }}>
            <button className="btn" type="submit">Check</button>
          </div>
        )}
      </form>

      <div aria-live="polite" aria-atomic="true">
        {result && (
          <div id="drill-result" className="result" data-state={result}>
            {result === "right" ? (
              <p>
                <span className="result-title">Correct.</span>
                <br /><span lang="nl-BE">{drillSolution(drill)}</span>
              </p>
            ) : (
              <>
                <p>
                  <span className="result-title">Not quite.</span>
                  <br />The answer: <span lang="nl-BE">{drillSolution(drill)}</span>
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
          <button ref={nextRef} className="btn" type="button" onClick={goNext} aria-describedby="drill-result">
            {index + 1 < total ? "Next question" : "See score"}
          </button>
        </div>
      )}
    </div>
  );
}
