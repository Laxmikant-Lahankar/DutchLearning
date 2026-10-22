# Dutch A1 Platform

Web platform for learning Dutch (A1 first) through reading, writing, listening and speaking.
This repository currently contains **Part 0: Foundation**. See `docs/ARCHITECTURE.md` for how later parts plug in.

## Stack

| Concern | Choice |
|---|---|
| Frontend and backend | Next.js 15 (App Router) with TypeScript |
| Database, auth, file storage | Supabase (PostgreSQL) |
| Hosting | Vercel (HTTPS and preview deployments included) |
| Validation | Zod |
| Tests | Vitest |
| CI | GitHub Actions |

## Run it locally

Requirements: Node 20+, a free Supabase project (optional until Part 1).

```bash
npm install
cp .env.example .env.local   # fill in Supabase values when you have them
npm run dev
```

Open http://localhost:3000. Check http://localhost:3000/api/health:
`"database": "unconfigured"` is expected until Supabase keys are set.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Local dev server |
| `npm run typecheck` | TypeScript check |
| `npm test` | Unit tests |
| `npm run build` | Production build |
| `npm run check` | All three of the above (run before pushing) |

## Environments

| Environment | Where | Database | Deploys from |
|---|---|---|---|
| Local | your machine | Supabase project "dev" (or local Supabase CLI) | n/a |
| Preview | Vercel preview URL | Supabase project "dev" | every pull request |
| Production | Vercel production domain | Supabase project "prod" | `main` branch |

Use two separate Supabase projects (dev and prod) so testing never touches learner data.

## Database migrations

SQL files live in `supabase/migrations/`, numbered in order. Apply them with the Supabase CLI:

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

## One-time setup checklist

1. Create a GitHub repository and push this code.
2. Create two Supabase projects: `dutch-platform-dev` and `dutch-platform-prod`.
3. Create a Vercel project from the repository. Add the environment variables from `.env.example` for Preview (dev project) and Production (prod project).
4. Push the migrations to each Supabase project.
5. In GitHub, require the CI check to pass before merging to `main`.
6. Add a free uptime monitor pointing at `/api/health`.

## Part 0 is done when

- [ ] `npm run check` passes locally and in CI
- [ ] Production URL loads over HTTPS and `/api/health` returns `"database": "ok"`
- [ ] Preview deployments appear on pull requests
- [ ] Migration `0001` is applied to dev and prod
- [ ] No secrets are committed (`.env.local` is git-ignored)
