/**
 * Browser speech helpers (client only).
 * Listening uses the device's own Dutch voice for now; pre-generated neural audio (R-LS-04) will
 * make it sound the same on every device.
 * Speaking uses the browser's recognition; server transcription is R-SP-04.
 */

import { chooseDutchVoice } from "./voices";

export const DUTCH = "nl-BE";

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

let voicesPromise: Promise<SpeechSynthesisVoice[]> | null = null;

/**
 * Browsers fill the voice list asynchronously: getVoices() is often empty on the first call,
 * which made the first tap fall back to the default (English) voice. Wait for it, briefly.
 */
export function loadVoices(timeoutMs = 2000): Promise<SpeechSynthesisVoice[]> {
  if (!canSpeak()) return Promise.resolve([]);
  const synth = window.speechSynthesis;
  const now = synth.getVoices();
  if (now.length) return Promise.resolve(now);
  voicesPromise ??= new Promise((resolve) => {
    const done = () => {
      synth.removeEventListener("voiceschanged", done);
      clearTimeout(timer);
      const list = synth.getVoices();
      if (!list.length) voicesPromise = null; // try again next time
      resolve(list);
    };
    const timer = setTimeout(done, timeoutMs);
    synth.addEventListener("voiceschanged", done);
  });
  return voicesPromise;
}

/** Whether this device can speak Dutch with a real Dutch voice. */
export async function hasDutchVoice(): Promise<boolean> {
  return chooseDutchVoice(await loadVoices()) !== undefined;
}

/**
 * Plays a Dutch phrase with a Dutch voice. A new call stops whatever was playing (R-RD-01).
 * Returns false, and stays silent, when the device has no Dutch voice: reading Dutch with an
 * English voice teaches the wrong sounds.
 */
export async function speakDutch(text: string, rate = 0.95): Promise<boolean> {
  if (!canSpeak()) return false;
  const synth = window.speechSynthesis;
  synth.cancel();
  const voice = chooseDutchVoice(await loadVoices());
  if (!voice) return false;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voice;
  utterance.lang = voice.lang;
  utterance.rate = rate;
  synth.speak(utterance);
  return true;
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
