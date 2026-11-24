"use client";

import { useEffect, useState } from "react";
import { SpeakerIcon } from "@/app/icons";
import { canSpeak, loadVoices, speakDutch } from "@/lib/speech";
import { chooseDutchVoice } from "@/lib/voices";

const SAMPLE = "Goeiemorgen. Hoe gaat het met u?";

type Row = { name: string; lang: string; local: boolean; isDefault: boolean };

function browserName(ua: string): string {
  if (/Edg\//.test(ua)) return "Microsoft Edge";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Chrome\//.test(ua)) return /Electron|Code\//.test(ua) ? "An app's built-in browser (Electron)" : "Google Chrome";
  if (/Safari\//.test(ua)) return "Safari";
  return "Unknown browser";
}

export function VoiceCheck() {
  const [state, setState] = useState<"loading" | "ready" | "unsupported">("loading");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [browser, setBrowser] = useState("");
  const [log, setLog] = useState("");

  useEffect(() => {
    setBrowser(browserName(navigator.userAgent));
    // Checked here, in the browser: on the server there is never speech support.
    if (!canSpeak()) {
      setState("unsupported");
      return;
    }
    loadVoices(3000).then((list) => {
      setVoices(list);
      setState("ready");
    });
  }, []);

  if (state === "unsupported") {
    return <p className="notice">This browser ({browser}) has no speech support at all.</p>;
  }
  if (state === "loading") return <p role="status">Checking your voices…</p>;

  const chosen = chooseDutchVoice(voices);
  const dutch = voices.filter((v) => v.lang.toLowerCase().replace("_", "-").startsWith("nl"));
  const rows: Row[] = voices.map((v) => ({ name: v.name, lang: v.lang, local: v.localService, isDefault: v.default }));

  function speakWith(v: SpeechSynthesisVoice) {
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(SAMPLE);
    u.voice = v;
    u.lang = v.lang;
    u.onstart = () => setLog(`Playing with ${v.name}…`);
    u.onend = () => setLog(`Finished: ${v.name}.`);
    u.onerror = (e) => setLog(`Error with ${v.name}: ${e.error}`);
    synth.speak(u);
  }

  async function testApp() {
    setLog("Asking the app to speak…");
    const ok = await speakDutch(SAMPLE);
    setLog(ok ? `The app is speaking with: ${chosen?.name}` : "The app stayed silent: no Dutch voice found.");
  }

  return (
    <div>
      <dl className="check-summary">
        <dt>Browser</dt><dd>{browser}</dd>
        <dt>Voices offered</dt><dd>{voices.length}</dd>
        <dt>Dutch voices</dt><dd>{dutch.length}</dd>
        <dt>DagNederlands uses</dt><dd>{chosen ? `${chosen.name} (${chosen.lang})` : "none, so audio stays silent"}</dd>
      </dl>

      <div className="btn-row" style={{ margin: "var(--space-5) 0" }}>
        <button className="btn" type="button" onClick={testApp}><SpeakerIcon /> Test the app&apos;s audio</button>
      </div>
      <p role="status" aria-live="polite" style={{ minHeight: "1.5em" }}>{log}</p>

      {!chosen && (
        <div className="notice" style={{ marginBottom: "var(--space-5)" }}>
          <p style={{ margin: 0 }}>
            No Dutch voice here. Try Microsoft Edge or Google Chrome (they include Dutch voices), or add Dutch in
            Windows Settings → Time &amp; language → Speech.
          </p>
        </div>
      )}

      <h2 style={{ fontSize: "var(--step-1)", margin: "var(--space-6) 0 var(--space-3)" }}>All voices</h2>
      <table className="compare">
        <thead><tr><th scope="col">Voice</th><th scope="col">Language</th><th scope="col"><span className="sr-only">Test</span></th></tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={`${r.name}-${i}`}>
              <th scope="row">{r.name}{r.isDefault ? " (default)" : ""}{r.local ? "" : " · online"}</th>
              <td>{r.lang}</td>
              <td>
                <button className="text-link" type="button" onClick={() => speakWith(voices[i]!)}>
                  Test<span className="sr-only"> {r.name}</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
