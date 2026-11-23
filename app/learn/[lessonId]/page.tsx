import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLesson } from "@/lib/lessons";
import { doneSkills, getMyProgress } from "@/lib/progress";
import { LessonPlayer } from "./lesson-player";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lessonId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lesson = getLesson((await params).lessonId);
  return { title: lesson?.title ?? "Lesson" };
}

export default async function LessonPage({ params }: Props) {
  const lesson = getLesson((await params).lessonId);
  if (!lesson) notFound();
  const done = [...doneSkills(await getMyProgress(), lesson.id)];

  return (
    <section className="section">
      <div className="container narrow">
        <p><Link href="/learn">← My lessons</Link></p>
        <h1><span aria-hidden="true">{lesson.emoji} </span>{lesson.title}</h1>
        <LessonPlayer lesson={lesson} initialDone={done} />
      </div>
    </section>
  );
}
