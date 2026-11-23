import type { FeedbackResponse } from "@/app/api/feedback/route";

export type Feedback = { state: "loading" } | FeedbackResponse;

/** Asks the server for a short AI explanation of a wrong typed answer. Never throws. */
export async function fetchFeedback(
  kind: "write" | "grammar",
  lessonId: string,
  index: number,
  answer: string,
): Promise<FeedbackResponse> {
  try {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, lessonId, index, answer }),
    });
    return (await res.json()) as FeedbackResponse;
  } catch {
    return { status: "unavailable" };
  }
}
