create table if not exists experiment_benchmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  experiment_type text not null,
  sample_size int not null default 0,
  win_rate numeric(5,4) not null default 0,
  median_lift_percent numeric(8,4) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint experiment_benchmarks_user_type_project unique (user_id, experiment_type, project_id)
);
alter table experiment_benchmarks enable row level security;
create policy "Users manage own benchmarks" on experiment_benchmarks for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Outcome columns on experiment_runs
alter table experiment_runs add column if not exists lift_percent numeric(8,4);
alter table experiment_runs add column if not exists outcome_notes text;
