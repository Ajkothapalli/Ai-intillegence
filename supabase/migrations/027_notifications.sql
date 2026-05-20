create table if not exists notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  project_id  uuid references projects(id) on delete cascade,
  type        text not null check (type in ('analysis_complete', 'analysis_failed', 'schedule_ran', 'share_link_viewed')),
  title       text not null,
  body        text,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table notifications enable row level security;

create policy "Users can manage their own notifications"
  on notifications
  for all
  using (user_id = auth.uid());

create index if not exists notifications_user_unread_idx
  on notifications (user_id, created_at desc)
  where read = false;
