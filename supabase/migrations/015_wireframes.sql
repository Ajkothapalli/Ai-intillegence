-- Wireframes for recommendations (generated on demand)
create table if not exists wireframes (
  id               uuid primary key default gen_random_uuid(),
  recommendation_id uuid not null references recommendations(id) on delete cascade,
  html             text not null,
  description      text not null,
  created_at       timestamptz not null default now()
);

create index if not exists wireframes_recommendation_id_idx on wireframes (recommendation_id);

-- RLS: access via recommendation ownership chain
alter table wireframes enable row level security;

create policy "Users manage own wireframes" on wireframes
  for all
  using (
    recommendation_id in (
      select id from recommendations where user_id = auth.uid()
    )
  );
