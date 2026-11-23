import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@/app/icons";
import { LESSONS, getLesson } from "@/lib/lessons";
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
  const number = LESSONS.indexOf(lesson) + 1;
  const following = LESSONS[number];
  const nextLesson = following ? { id: following.id, title: following.title } : null;

  return (
    <div className="container measure">
      <header className="page-head">
        <Link className="back-link" href="/learn"><ArrowLeftIcon /> My lessons</Link>
        <p className="eyebrow" style={{ marginTop: "var(--space-3)" }}>Lesson {number} · A1</p>
        <h1>{lesson.title}</h1>
      </header>
      <LessonPlayer lesson={lesson} initialDone={done} nextLesson={nextLesson} />
    </div>
  );
}
