# DagNederlands

Learn Dutch from A1, starting with Flemish Dutch (nl-BE): phrases and grammar, practised by reading, listening, writing and speaking.

**Every answer is typed.** No multiple choice, tapping or dragging: typing the Dutch yourself is what makes it stick. Listen is dictation; grammar drills are fill-the-gap, rewrite and translate.
A1 is free with Google sign-in. The requirements live in the "DagNederlands: Requirements" doc; IDs such as R-RD-01 below refer to it.

## Stack

| Concern | Choice |
|---|---|
| Frontend and backend | Next.js 15 (App Router) with TypeScript |
| Database and auth | Supabase (PostgreSQL with row-level security, Google sign-in) |
| AI writing feedback | Anthropic API, `claude-haiku-5-5` by default (`ANTHROPIC_MODEL`) |
| Hosting | Vercel |
| Validation and tests | Zod, Vitest |
| CI | GitHub Actions |

## Layout

```
app/                     Pages and API routes
  learn/                 Dashboard and lesson player (signed-in only)
  api/progress           Saves one row per learner, lesson and skill
  api/feedback           AI explanation for wrong Write answers, with a daily cap
  auth/                  Google OAuth callback and sign-out
lib/
  lessons.ts             12 A1 lessons of phrases (not yet reviewed by a native speaker, R-LV-03)
  grammar.ts             One grammar lesson per unit: explanation + typed drills (original content)
  match.ts               Answer checks: Write/Listen 80%, Speak 75%, grammar exact
  ai.ts                  Server-only Anthropic call
  speech.ts              Browser speech synthesis and recognition
supabase/migrations/     Numbered SQL migrations
middleware.ts            Refreshes sessions; sends signed-out visitors from /learn to /login
```

## Run it locally

Requirements: Node 20+, a Supabase project with the Google provider turned on.

```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev
```

Without Supabase keys the public pages work and `/learn` redirects to `/login`.
Without `ANTHROPIC_API_KEY`, wrong Write answers still show the correct Dutch, just without the explanation.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Local dev server |
| `npm run typecheck` | TypeScript check |
| `npm test` | Unit tests |
| `npm run build` | Production build |
| `npm run check` | All three (run before pushing) |

## Database migrations

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

`0002_progress_and_ai_usage.sql` creates `progress` and `ai_usage` with RLS, plus `consume_ai_reply()`, which raises the daily AI counter in one atomic statement.

## Setup checklist

1. Create Supabase projects for dev and prod (an EU region suits Belgian learners), and apply the migrations to each.
2. In Supabase Auth, enable Google and add `<site>/auth/callback` to the redirect URLs.
3. In Vercel, add the variables from `.env.example`. `ANTHROPIC_API_KEY` must never get a `NEXT_PUBLIC_` prefix.
4. Set `NEXT_PUBLIC_CONTACT_EMAIL` so the privacy page offers account deletion by email (R-AC-04).
5. In GitHub, require the CI check to pass before merging to `main`.
