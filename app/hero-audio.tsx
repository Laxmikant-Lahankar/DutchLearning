"use client";

import { useDutchVoice } from "@/app/dutch-voice";
import { SpeakerIcon } from "@/app/icons";
import { speakDutch } from "@/lib/speech";

/** Plays a Dutch word from a server-rendered page. */
export function HeroAudio({ text }: { text: string }) {
  const voice = useDutchVoice();
  // No Dutch voice on this device: hide the button rather than play Dutch in an English voice.
  if (voice === "no") return null;
  return (
    <button className="audio-btn on-brand" type="button" onClick={() => speakDutch(text)}>
      <SpeakerIcon />
      <span className="sr-only">Play <span lang="nl-BE">{text}</span></span>
    </button>
  );
}
