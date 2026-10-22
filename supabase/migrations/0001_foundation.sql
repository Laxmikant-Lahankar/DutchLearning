-- Foundation: shared helpers used by later migrations.
-- Tables for users, content and progress arrive in Parts 1, 2 and 8.

-- Keeps updated_at current. Attach with:
--   create trigger set_updated_at before update on <table>
--   for each row execute function public.set_updated_at();
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
