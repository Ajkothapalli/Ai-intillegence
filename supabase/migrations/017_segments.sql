create table if not exists user_segments (
  id                  uuid primary key default gen_random_uuid(),
  project_id          uuid not null references projects(id) on delete cascade,
  user_id             uuid not null references auth.users(id) on delete cascade,
  name                text not null,
  description         text,
  source              text not null check (source in ('manual','mixpanel','amplitude','ga4','posthog','heap','segment_io','pendo')),
  external_cohort_id  text,
  dimensions          jsonb not null default '{}',
  user_count          int,
  last_synced_at      timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists user_segments_project_id_idx on user_segments (project_id);

alter table user_segments enable row level security;

create policy "Users manage own segments" on user_segments
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
