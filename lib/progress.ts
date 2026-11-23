import "server-only";
import type { Skill } from "@/lib/lessons";
import { isSkill } from "@/lib/lessons";
import { createClient } from "@/lib/supabase/server";

export interface ProgressRow {
  lesson_id: string;
  skill: Skill;
  score: number;
}

/** The signed-in learner's progress rows. RLS limits this to their own rows. */
export async function getMyProgress(): Promise<ProgressRow[]> {
  const supabase = await createClient().catch(() => null);
  if (!supabase) return [];
  const { data, error } = await supabase.from("progress").select("lesson_id, skill, score");
  if (error || !data) return [];
  return data.filter((r): r is ProgressRow => isSkill(r.skill));
}

export function doneSkills(rows: ProgressRow[], lessonId: string): Set<Skill> {
  return new Set(rows.filter((r) => r.lesson_id === lessonId).map((r) => r.skill));
}
