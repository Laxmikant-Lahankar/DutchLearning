"use client";

import { useEffect, useRef, useState } from "react";
import { passesSpeak } from "@/lib/match";
import { percent } from "@/lib/quiz";
import { DUTCH, getRecognition, type Recognition, speakDutch, stopSpeaking } from "@/lib/speech";
import { type ExerciseProps, type SaveState, ScoreSummary } from "./lesson-player";

type Status = "ready" | "listening" | "heard" | "error";

export function SpeakExercise({ lesson, onComplete }: ExerciseProps) {
  const total = lesson.phrases.length;
  // Only rendered after a tab click, so window is available here.
  const [Ctor] = useState(() => getRecognition());
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<Status>("ready");
  const [heard, setHeard] = useState("");
  const [passedNow, setPassedNow] = useState(false);
  const [passed, setPassed] = useState<Set<number>>(new Set());
  const [errorText, setErrorText] = useState("");
  const [finished, setFinished] = useState(false);
  const [save, setSave] = useState<SaveState>("idle");
  const rec = useRef<Recognition | null>(null);

  useEffect(
    () => () => {
      rec.current?.abort();
      stopSpeaking();
    },
    [],
  );

  // R-SP-02: a clear message instead of a crash.
  if (!Ctor) {
    return (
      <div className="result" data-state="wrong" role="status">
        <p>
          <strong>Speaking practice isn&apos;t available in this browser.</strong> Please use Chrome or Edge on a
          computer or Android phone. Everything else in the lesson works here.
        </p>
      </div>
    );
  }

  const phrase = lesson.phrases[index]!;

  function listen() {
    if (!Ctor) return;
    stopSpeaking();
    rec.current?.abort();
    const r = new Ctor();
    r.lang = DUTCH;
    r.interimResults = false;
    r.maxAlternatives = 3;
    let got = false;
    r.onresult = (e) => {
      const alternatives = Array.from(e.results[0] ?? []).map((a) => a.transcript);
      const best = alternatives.find((t) => passesSpeak(t, phrase.nl)) ?? alternatives[0] ?? "";
      got = true;
      const ok = passesSpeak(best, phrase.nl);
      setHeard(best);
      setPassedNow(ok);
      if (ok) setPassed((prev) => new Set(prev).add(index));
      setStatus("heard");
    };
    r.onerror = (e) => {
      got = true;
      setErrorText(
        e.error === "not-allowed" || e.error === "service-not-allowed"
          ? "We need permission to use your microphone. Allow it in your browser settings and try again."
          : e.error === "no-speech"
            ? "We didn't hear anything. Try again a little closer to the microphone."
            : "Something went wrong with speech recognition. Please try again.",
      );
      setStatus("error");
    };
    r.onend = () => {
      if (!got) {
        setErrorText("We didn't hear anything. Try again.");
        setStatus("error");
      }
    };
    rec.current = r;
    setStatus("listening");
    try {
      r.start();
    } catch {
      setErrorText("Something went wrong with speech recognition. Please try again.");
      setStatus("error");
    }
  }

  async function next() {
    rec.current?.abort();
    setHeard("");
    setPassedNow(false);
    setStatus("ready");
    if (index + 1 < total) {
      setIndex(index + 1);
      return;
    }
    setFinished(true);
    setSave("saving");
    setSave((await onComplete(percent(passed.size, total))) ? "saved" : "failed");
  }

  function restart() {
    setIndex(0);
    setPassed(new Set());
    setHeard("");
    setStatus("ready");
    setFinished(false);
    setSave("idle");
  }

  if (finished) return <ScoreSummary correct={passed.size} total={total} save={save} onRestart={restart} />;

  return (
    <div>
      <p className="muted">Phrase {index + 1} of {total}</p>
      <p className="phrase-nl" lang="nl-BE" style={{ fontSize: "1.5rem" }}>{phrase.nl}</p>
      <p className="muted">{phrase.en}</p>
      <div className="row">
        <button className="btn btn-ghost" type="button" onClick={() => speakDutch(phrase.nl)}>🔊 Hear it</button>
        <button className="btn" type="button" onClick={listen} disabled={status === "listening"}>
          {status === "listening" ? "Listening…" : status === "ready" ? "🎤 Say it" : "🎤 Try again"}
        </button>
        {/* R-SP-03: skip moves on */}
        <button className="btn btn-ghost" type="button" onClick={next}>
          {status === "heard" && passedNow ? (index + 1 < total ? "Next" : "See score") : "Skip"}
        </button>
      </div>

      <div aria-live="polite">
        {status === "heard" && (
          <div className="result" data-state={passedNow ? "right" : "wrong"}>
            <p>We heard: “<span lang="nl-BE">{heard || "…"}</span>”</p>
            <p><strong>{passedNow ? "Well said!" : "Not quite. Listen again and have another go."}</strong></p>
          </div>
        )}
        {status === "error" && <p role="alert">{errorText}</p>}
      </div>
    </div>
  );
}
