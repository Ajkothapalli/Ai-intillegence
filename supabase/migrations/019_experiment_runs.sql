create table if not exists experiment_runs (
  id                uuid primary key default gen_random_uuid(),
  project_id        uuid not null references projects(id) on delete cascade,
  user_id           uuid not null references auth.users(id) on delete cascade,
  recommendation_id uuid references recommendations(id) on delete set null,
  name              text not null,
  hypothesis        text,
  status            text not null default 'planned' check (status in ('planned', 'running', 'completed', 'failed')),
  segment_id        uuid references user_segments(id) on delete set null,
  segment_snapshot  jsonb,
  outcome           text,
  started_at        timestamptz,
  completed_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists experiment_runs_project_id_idx on experiment_runs (project_id);

alter table experiment_runs enable row level security;

create policy "Users manage own experiment runs" on experiment_runs
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
