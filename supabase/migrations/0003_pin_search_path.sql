-- Security advisor 0011: pin the search_path of the trigger helper from 0001,
-- so it can't be redirected to a same-named function in another schema.
alter function public.set_updated_at() set search_path = '';
