-- Progress per learner, lesson and skill (R-AC-03) and the daily AI feedback counter (R-AI-03, R-AI-05).
-- Lesson content lives in lib/lessons.ts for now (R-LV-01), so lesson_id is plain text, not a foreign key.

create table public.progress (
  user_id      uuid        not null references auth.users (id) on delete cascade,
  lesson_id    text        not null,
  skill        text        not null check (skill in ('read', 'listen', 'write', 'speak')),
  score        smallint    not null check (score between 0 and 100), -- percentage
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id, skill)
);

alter table public.progress enable row level security;

create policy "progress: read own"   on public.progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "progress: insert own" on public.progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "progress: update own" on public.progress for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create table public.ai_usage (
  user_id uuid    not null references auth.users (id) on delete cascade,
  day     date    not null default current_date,
  count   integer not null default 0 check (count >= 0),
  primary key (user_id, day)
);

alter table public.ai_usage enable row level security;

-- Learners may read their own counter but never write it directly, otherwise they could reset it.
create policy "ai_usage: read own" on public.ai_usage for select to authenticated using ((select auth.uid()) = user_id);

-- Atomic increment (R-AI-05): one statement, so two quick requests cannot both slip past the cap.
-- Returns the new count, or null when the learner has already reached p_limit today.
create or replace function public.consume_ai_reply(p_limit integer)
returns integer
language sql
security definer
set search_path = ''
as $$
  insert into public.ai_usage as u (user_id, day, count)
  values (auth.uid(), current_date, 1)
  on conflict (user_id, day) do update
    set count = u.count + 1
    where u.count < p_limit
  returning u.count;
$$;

revoke execute on function public.consume_ai_reply(integer) from public, anon;
grant execute on function public.consume_ai_reply(integer) to authenticated;
