import { NextResponse } from "next/server";
import { z } from "zod";
import { SKILLS, getLesson } from "@/lib/lessons";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const Body = z.object({
  lessonId: z.string().max(64),
  skill: z.enum(SKILLS as unknown as [string, ...string[]]),
  score: z.number().int().min(0).max(100),
});

/** Saves one row per learner, lesson and skill; redoing a skill updates the row (R-AC-03). */
export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !getLesson(parsed.data.lessonId)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const supabase = await createClient().catch(() => null);
  if (!supabase) return NextResponse.json({ ok: false }, { status: 503 });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  const { error } = await supabase.from("progress").upsert(
    {
      user_id: user.id,
      lesson_id: parsed.data.lessonId,
      skill: parsed.data.skill,
      score: parsed.data.score,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id,skill" },
  );

  if (error) {
    console.error("progress upsert failed", error.code);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
