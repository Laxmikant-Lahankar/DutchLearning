/**
 * Browser speech helpers (client only).
 * Listening uses the device's own voice for now; pre-generated neural audio is R-LS-04.
 * Speaking uses the browser's recognition; server transcription is R-SP-04.
 */

export const DUTCH = "nl-BE";

function pickVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang.replace("_", "-") === "nl-BE") ??
    voices.find((v) => v.lang.replace("_", "-") === "nl-NL") ??
    voices.find((v) => v.lang.toLowerCase().startsWith("nl"))
  );
}

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Plays a Dutch phrase. A new call stops whatever was playing (R-RD-01). */
export function speakDutch(text: string, rate = 0.95): void {
  if (!canSpeak()) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = DUTCH;
  const voice = pickVoice();
  if (voice) utterance.voice = voice;
  utterance.rate = rate;
  synth.speak(utterance);
}

export function stopSpeaking(): void {
  if (canSpeak()) window.speechSynthesis.cancel();
}

// Minimal typing for the Web Speech recognition API, which TypeScript's DOM lib does not include.
export interface Recognition {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  abort(): void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}

type RecognitionCtor = new () => Recognition;

export function getRecognition(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}
