import { NextResponse } from "next/server";
import { z } from "zod";
import { aiConfigured, aiDailyLimit, explainMistake } from "@/lib/ai";
import { getLesson } from "@/lib/lessons";
import { WRITE_PASS, similarity } from "@/lib/match";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const Body = z.object({
  lessonId: z.string().max(64),
  index: z.number().int().min(0).max(50),
  answer: z.string().max(200),
});

export type FeedbackResponse =
  | { status: "ok"; feedback: string }
  | { status: "limit" } // daily cap reached (R-AI-03)
  | { status: "unavailable" }; // AI off, failed, or not eligible (R-AI-04)

function reply(body: FeedbackResponse, status = 200) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return reply({ status: "unavailable" }, 400);

  // The expected answer comes from our own content, never from the browser.
  const phrase = getLesson(parsed.data.lessonId)?.phrases[parsed.data.index];
  if (!phrase) return reply({ status: "unavailable" }, 400);

  const { answer } = parsed.data;
  // Only wrong answers get AI feedback (R-AI-01, R-NF-05).
  if (!answer.trim() || similarity(answer, phrase.nl) >= WRITE_PASS) return reply({ status: "unavailable" });
  if (!aiConfigured()) return reply({ status: "unavailable" });

  const supabase = await createClient().catch(() => null);
  if (!supabase) return reply({ status: "unavailable" });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return reply({ status: "unavailable" }, 401);

  const { data: count, error } = await supabase.rpc("consume_ai_reply", { p_limit: aiDailyLimit() });
  if (error) {
    console.error("consume_ai_reply failed", error.code);
    return reply({ status: "unavailable" });
  }
  if (count === null) return reply({ status: "limit" });

  const feedback = await explainMistake({ english: phrase.en, expected: phrase.nl, answer });
  return reply(feedback ? { status: "ok", feedback } : { status: "unavailable" });
}
