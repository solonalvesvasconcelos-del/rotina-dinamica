-- Esquema para um banco novo. Revise o esquema existente antes de executar.
begin;
create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);
create table public.routine_settings (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null unique references auth.users(id) on delete cascade,
 default_wake_time time not null default '06:30',
 default_sleep_time time not null default '23:00',
 default_work_start time not null default '08:40',
 default_work_end time not null default '17:00',
 commute_minutes integer not null default 50 check (commute_minutes >= 0),
 gym_weekly_target integer not null default 3 check (gym_weekly_target >= 0),
 study_weekly_target integer not null default 3 check (study_weekly_target >= 0),
 uber_weekly_target integer not null default 3 check (uber_weekly_target >= 0)
);
create table public.work_shifts (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 shift_date date not null,
 shift_type text not null check (shift_type in ('regular','early','late','off','custom')),
 start_time time, end_time time, notes text,
 unique (user_id, shift_date)
);
create table public.daily_plans (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 plan_date date not null, selected_mode text not null, recommended_mode text not null,
 energy_level integer not null check (energy_level between 1 and 5),
 generated_plan jsonb not null default '{}', locked boolean not null default false,
 unique (user_id, plan_date), unique (id, user_id)
);
create table public.activities (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 daily_plan_id uuid,
 activity_date date not null, category text not null,
 title text not null check (length(trim(title)) > 0),
 start_time time, end_time time,
 completed boolean not null default false, completed_at timestamptz,
 foreign key (daily_plan_id, user_id) references public.daily_plans(id, user_id)
);
create table public.weekly_goals (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 week_start date not null check (extract(isodow from week_start) = 1),
 category text not null, target_count integer not null check (target_count >= 0),
 unit text not null default 'sessions' check (unit = 'sessions'),
 unique (user_id, week_start, category)
);
create table public.uber_sessions (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 session_date date not null, strategy text not null,
 trips integer not null default 0 check (trips >= 0),
 gross_earnings numeric not null default 0 check (gross_earnings >= 0),
 distance_km numeric not null default 0 check (distance_km >= 0), notes text
);
create table public.study_sessions (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 session_date date not null, subject text not null, topic text,
 duration_minutes integer not null default 0 check (duration_minutes >= 0),
 questions_done integer not null default 0 check (questions_done >= 0),
 score_percent numeric check (score_percent between 0 and 100)
);
alter table public.profiles enable row level security;
grant select, insert, update, delete on public.profiles to authenticated;
revoke all on public.profiles from anon;
create policy own_profile on public.profiles for all to authenticated
 using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
do $$
declare relation text;
begin
 foreach relation in array array['routine_settings','work_shifts','daily_plans','activities','weekly_goals','uber_sessions','study_sessions'] loop
  execute format('alter table public.%I enable row level security', relation);
  execute format('revoke all on public.%I from anon', relation);
  execute format('grant select, insert, update, delete on public.%I to authenticated', relation);
  execute format('create policy own_rows on public.%I for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)', relation);
  execute format('create index on public.%I (user_id)', relation);
 end loop;
end $$;
create function public.initialize_routine_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
 insert into public.profiles(id) values (new.id);
 insert into public.routine_settings(user_id) values (new.id);
 return new;
end $$;
revoke all on function public.initialize_routine_user() from public;
create trigger initialize_routine_user after insert on auth.users
 for each row execute function public.initialize_routine_user();
insert into public.profiles(id) select id from auth.users;
insert into public.routine_settings(user_id) select id from auth.users;
commit;
