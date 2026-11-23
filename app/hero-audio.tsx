"use client";

import { SpeakerIcon } from "@/app/icons";
import { speakDutch } from "@/lib/speech";

/** Plays a Dutch word from a server-rendered page. */
export function HeroAudio({ text }: { text: string }) {
  return (
    <button className="audio-btn on-brand" type="button" onClick={() => speakDutch(text)}>
      <SpeakerIcon />
      <span className="sr-only">Play <span lang="nl-BE">{text}</span></span>
    </button>
  );
}
