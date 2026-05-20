-- Scheduled re-analysis configuration per project
create table if not exists analysis_schedules (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references projects(id) on delete cascade,
  frequency    text not null check (frequency in ('daily', 'weekly', 'monthly')),
  enabled      boolean not null default true,
  last_run_at  timestamptz,
  next_run_at  timestamptz not null,
  use_deep_model boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (project_id)
);

alter table analysis_schedules enable row level security;

create policy "Users can manage their own schedules"
  on analysis_schedules
  for all
  using (
    exists (
      select 1 from projects
      where projects.id = analysis_schedules.project_id
        and projects.user_id = auth.uid()
    )
  );

-- Index for cron job to find due schedules efficiently
create index if not exists analysis_schedules_next_run_idx
  on analysis_schedules (next_run_at)
  where enabled = true;
