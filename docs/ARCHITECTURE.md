# Architecture

## Layout

```
src/
  app/            Routes, pages and API route handlers (Next.js App Router)
  lib/            Shared code: env validation, Supabase clients
  features/       (added per part) auth, content, lesson, evaluation, audio, speaking, progress, vocab, assessments
supabase/
  migrations/     Numbered SQL migrations
docs/             Project documentation
```

## Rules that keep later parts easy

1. **Activities are data.** Lessons are stored as typed activities. Each type gets one renderer and one evaluator (Parts 3, 4, 5). New content should never need new code.
2. **Language and variant live in the data.** Content rows carry `language`, `level` and `variant` (for example `nl-BE`) so A2 and other languages need only content (Part 2).
3. **Authorization is enforced on the server and in the database.** Every table uses row-level security. Never rely on hiding buttons in the UI.
4. **Secrets stay server-side.** Only `NEXT_PUBLIC_*` values reach the browser. The service-role key is never imported into client code.
5. **Pre-generate audio.** Audio files are produced at content-build time and stored in Supabase Storage (Part 6).
6. **Voice data.** Do not store raw recordings unless a clear requirement and user consent exist (Part 7, Part 14).

## Where each part plugs in

| Part | Lands in |
|---|---|
| 1 Auth and profile | `src/features/auth`, Supabase Auth with Google provider, middleware to refresh sessions |
| 2 Content model | `supabase/migrations`, `src/features/content` |
| 3-4 Lesson player and renderers | `src/features/lesson` |
| 5 Evaluation | `src/features/evaluation` (pure functions, unit-tested) |
| 6 Audio | `src/features/audio`, Supabase Storage |
| 7 Speaking | `src/features/speaking` |
| 8 Progress | `src/features/progress`, tables with RLS |
