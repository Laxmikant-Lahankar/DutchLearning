"use client";

import { useEffect, useRef, useState } from "react";
import { passesSpeak } from "@/lib/match";
import { percent } from "@/lib/quiz";
import { DUTCH, getRecognition, type Recognition, speakDutch, stopSpeaking } from "@/lib/speech";
import { MicIcon, SpeakerIcon } from "@/app/icons";
import { type ExerciseProps, type SaveState, ScoreSummary } from "./lesson-player";

type Status = "ready" | "listening" | "heard" | "error";

export function SpeakExercise({ lesson, next: nextStep, onNext, onComplete }: ExerciseProps) {
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
      <div className="notice" role="status">
        <p style={{ margin: 0 }}>
          <strong>Speaking practice isn&apos;t available in this browser.</strong> Please use Chrome or Edge on a
          computer or Android phone. Everything else in the lesson works here.
        </p>
      </div>
    );
  }

  const phrase = lesson.phrases[index]!;

  function listen() {
    if (status === "listening") return;
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

  if (finished) {
    return <ScoreSummary correct={passed.size} total={total} save={save} next={nextStep} onNext={onNext} onRestart={restart} />;
  }

  return (
    <div>
      <p className="progress-line">Phrase {index + 1} of {total}</p>
      <p className="speak-target" lang="nl-BE">{phrase.nl}</p>
      <p className="muted">{phrase.en}</p>
      <div className="btn-row">
        {/* aria-disabled, not disabled, so focus stays on the button while listening */}
        <button className="btn" type="button" onClick={listen} aria-disabled={status === "listening"}>
          <MicIcon />
          {status === "ready" ? "Say it" : "Try again"}
        </button>
        <button className="btn btn-quiet" type="button" onClick={() => speakDutch(phrase.nl)}>
          <SpeakerIcon /> Hear it
        </button>
        {/* R-SP-03: skip moves on */}
        <button className="text-link" type="button" onClick={next}>
          {status === "heard" && passedNow ? (index + 1 < total ? "Next" : "See score") : "Skip"}
        </button>
      </div>

      {/* One live region for every status, so nothing is announced twice. */}
      <div aria-live="polite" aria-atomic="true">
        {status === "listening" && <p className="muted" style={{ marginTop: "var(--space-4)" }}>Listening… say the phrase now.</p>}
        {status === "heard" && (
          <div className="result" data-state={passedNow ? "right" : "wrong"}>
            <p className="result-title">{passedNow ? "Well said." : "Not quite. Listen again and have another go."}</p>
            <p>We heard: “<span lang="nl-BE">{heard || "…"}</span>”</p>
          </div>
        )}
        {status === "error" && <p className="result-error">{errorText}</p>}
      </div>
    </div>
  );
}
