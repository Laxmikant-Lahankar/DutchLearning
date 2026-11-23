import { NextResponse } from "next/server";
import { z } from "zod";
import { aiConfigured, aiDailyLimit, explainMistake } from "@/lib/ai";
import { drillEnglish, drillSolution, getGrammar } from "@/lib/grammar";
import { getLesson } from "@/lib/lessons";
import { WRITE_PASS, gradeDrill, similarity } from "@/lib/match";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const Body = z.object({
  kind: z.enum(["write", "grammar"]).default("write"),
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

/** The expected answer always comes from our own content, never from the browser. */
function lookup(kind: "write" | "grammar", lessonId: string, index: number, answer: string) {
  if (kind === "write") {
    const phrase = getLesson(lessonId)?.phrases[index];
    if (!phrase) return null;
    return { english: phrase.en, expected: phrase.nl, wrong: similarity(answer, phrase.nl) < WRITE_PASS, rule: undefined };
  }
  const lesson = getGrammar(lessonId);
  const drill = lesson?.drills[index];
  if (!lesson || !drill) return null;
  return {
    english: drillEnglish(drill),
    expected: drillSolution(drill),
    wrong: !gradeDrill(answer, drill.answers, drill.kind === "gap" ? drill.text : undefined),
    rule: lesson.title,
  };
}

export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return reply({ status: "unavailable" }, 400);

  const { kind, lessonId, index, answer } = parsed.data;
  const item = lookup(kind, lessonId, index, answer);
  if (!item) return reply({ status: "unavailable" }, 400);

  // Only wrong answers get AI feedback (R-AI-01, R-NF-05).
  if (!answer.trim() || !item.wrong) return reply({ status: "unavailable" });
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

  const feedback = await explainMistake({ english: item.english, expected: item.expected, answer, rule: item.rule });
  return reply(feedback ? { status: "ok", feedback } : { status: "unavailable" });
}
