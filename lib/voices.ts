/** Choosing a Dutch voice from what the browser offers. Pure, so it can be unit-tested. */

export interface VoiceLike {
  name: string;
  lang: string;
}

function langOf(v: VoiceLike): string {
  return v.lang.replace("_", "-").toLowerCase();
}

/** Natural/online voices (Edge "Online (Natural)", Chrome "Google") sound far better than old desktop voices. */
function quality(v: VoiceLike): number {
  return /natural|online|google|neural|premium|enhanced/i.test(v.name) ? 1 : 0;
}

/**
 * Flemish first (nl-BE), then Netherlands Dutch (nl-NL), then any Dutch; better-sounding voices first
 * within each. Returns undefined when the device has no Dutch voice at all: then we must NOT speak,
 * because the browser would read Dutch with an English voice, which teaches the wrong sounds.
 */
export function chooseDutchVoice<V extends VoiceLike>(voices: readonly V[]): V | undefined {
  const rank = (v: V) => {
    const lang = langOf(v);
    const region = lang === "nl-be" ? 0 : lang === "nl-nl" ? 1 : lang.startsWith("nl") ? 2 : 9;
    return region * 2 + (1 - quality(v));
  };
  const dutch = voices.filter((v) => langOf(v).startsWith("nl"));
  return [...dutch].sort((a, b) => rank(a) - rank(b))[0];
}
