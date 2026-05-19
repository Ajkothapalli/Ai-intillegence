-- Platform enum
create type platform as enum (
  'mixpanel','amplitude','ga4','posthog','heap','segment','pendo',
  'hotjar','logrocket','google_sheets','google_docs','google_slides',
  'excel','word','powerpoint','pdf'
);

-- integrations table
create table integrations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  platform platform not null,
  credentials jsonb not null default '{}',
  status text not null default 'disconnected' check (status in ('connected','error','disconnected')),
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- integration_syncs table
create table integration_syncs (
  id uuid primary key default gen_random_uuid(),
  integration_id uuid not null references integrations(id) on delete cascade,
  status text not null check (status in ('running','complete','failed')),
  rows_fetched int,
  error_message text,
  created_at timestamptz not null default now()
);

-- RLS
alter table integrations enable row level security;
create policy "Users manage own integrations" on integrations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table integration_syncs enable row level security;
create policy "Users view own syncs" on integration_syncs
  for all using (
    exists (select 1 from integrations i where i.id = integration_syncs.integration_id and i.user_id = auth.uid())
  );
