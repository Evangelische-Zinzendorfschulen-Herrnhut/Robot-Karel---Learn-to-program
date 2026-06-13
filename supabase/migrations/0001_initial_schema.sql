create extension if not exists "pgcrypto";

create type public.app_role as enum ('student', 'teacher', 'admin');
create type public.chapter_progress_status as enum ('not_started', 'started', 'completed');
create type public.exercise_progress_status as enum ('not_started', 'started', 'passed', 'needs_retry');
create type public.submission_status as enum ('queued', 'running', 'passed', 'failed', 'error', 'timeout');
create type public.exercise_difficulty as enum ('intro', 'easy', 'medium', 'hard', 'challenge');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role public.app_role not null default 'student',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  language text not null default 'de',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.chapters (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  slug text not null,
  title text not null,
  summary text,
  order_index integer not null,
  mdx_path text not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, slug),
  unique (course_id, order_index)
);

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid references public.chapters(id) on delete set null,
  slug text not null unique,
  title text not null,
  prompt text not null,
  difficulty public.exercise_difficulty not null default 'intro',
  order_index integer not null default 0,
  starter_code text not null,
  initial_world jsonb not null,
  goal_world jsonb not null,
  hints jsonb not null default '[]'::jsonb,
  concepts text[] not null default '{}',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.exercise_tests (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  name text not null,
  initial_world jsonb not null,
  goal_world jsonb not null,
  is_hidden boolean not null default false,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.chapter_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  status public.chapter_progress_status not null default 'not_started',
  last_seen_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, chapter_id)
);

create table public.exercise_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  status public.exercise_progress_status not null default 'not_started',
  latest_code text,
  best_submission_id uuid,
  started_at timestamptz,
  passed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, exercise_id)
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  code text not null,
  status public.submission_status not null,
  step_count integer,
  error_message text,
  test_results jsonb not null default '[]'::jsonb,
  action_replay jsonb,
  created_at timestamptz not null default now()
);

alter table public.exercise_progress
  add constraint exercise_progress_best_submission_fk
  foreign key (best_submission_id)
  references public.submissions(id)
  on delete set null;

create index chapters_course_order_idx on public.chapters(course_id, order_index);
create index exercises_chapter_order_idx on public.exercises(chapter_id, order_index);
create index exercise_tests_exercise_order_idx on public.exercise_tests(exercise_id, order_index);
create index submissions_user_exercise_created_idx on public.submissions(user_id, exercise_id, created_at desc);
create index chapter_progress_user_idx on public.chapter_progress(user_id);
create index exercise_progress_user_idx on public.exercise_progress(user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'name')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create trigger courses_set_updated_at
before update on public.courses
for each row execute function public.set_updated_at();

create trigger chapters_set_updated_at
before update on public.chapters
for each row execute function public.set_updated_at();

create trigger exercises_set_updated_at
before update on public.exercises
for each row execute function public.set_updated_at();

create trigger chapter_progress_set_updated_at
before update on public.chapter_progress
for each row execute function public.set_updated_at();

create trigger exercise_progress_set_updated_at
before update on public.exercise_progress
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.chapters enable row level security;
alter table public.exercises enable row level security;
alter table public.exercise_tests enable row level security;
alter table public.chapter_progress enable row level security;
alter table public.exercise_progress enable row level security;
alter table public.submissions enable row level security;

create policy "Profiles are readable by their owner"
on public.profiles for select
using (auth.uid() = id);

create policy "Profiles are insertable by their owner"
on public.profiles for insert
with check (auth.uid() = id);

create policy "Profiles are updatable by their owner"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Published courses are readable"
on public.courses for select
using (is_published = true);

create policy "Published chapters are readable"
on public.chapters for select
using (is_published = true);

create policy "Published exercises are readable"
on public.exercises for select
using (is_published = true);

create policy "Published exercise tests are readable when visible"
on public.exercise_tests for select
using (
  is_hidden = false
  and exists (
    select 1
    from public.exercises
    where exercises.id = exercise_tests.exercise_id
      and exercises.is_published = true
  )
);

create policy "Users can read their chapter progress"
on public.chapter_progress for select
using (auth.uid() = user_id);

create policy "Users can insert their chapter progress"
on public.chapter_progress for insert
with check (auth.uid() = user_id);

create policy "Users can update their chapter progress"
on public.chapter_progress for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can read their exercise progress"
on public.exercise_progress for select
using (auth.uid() = user_id);

create policy "Users can insert their exercise progress"
on public.exercise_progress for insert
with check (auth.uid() = user_id);

create policy "Users can update their exercise progress"
on public.exercise_progress for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can read their submissions"
on public.submissions for select
using (auth.uid() = user_id);

create policy "Users can insert their submissions"
on public.submissions for insert
with check (auth.uid() = user_id);
