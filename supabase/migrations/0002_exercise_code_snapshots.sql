create table if not exists public.exercise_code_snapshots (
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_slug text not null,
  latest_code text not null,
  status text not null default 'needs_retry'
    check (status in ('started', 'passed', 'needs_retry')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, exercise_slug)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists exercise_code_snapshots_set_updated_at on public.exercise_code_snapshots;
create trigger exercise_code_snapshots_set_updated_at
before update on public.exercise_code_snapshots
for each row execute function public.set_updated_at();

alter table public.exercise_code_snapshots enable row level security;

grant select, insert, update on public.exercise_code_snapshots to authenticated;

drop policy if exists "Users can read their exercise code snapshots"
on public.exercise_code_snapshots;
create policy "Users can read their exercise code snapshots"
on public.exercise_code_snapshots for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their exercise code snapshots"
on public.exercise_code_snapshots;
create policy "Users can insert their exercise code snapshots"
on public.exercise_code_snapshots for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their exercise code snapshots"
on public.exercise_code_snapshots;
create policy "Users can update their exercise code snapshots"
on public.exercise_code_snapshots for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
