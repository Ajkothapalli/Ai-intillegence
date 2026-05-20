-- Gamification: streaks and feature ring actions

create table if not exists user_streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_active_week text, -- ISO week: YYYY-WWW
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create table if not exists ring_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ring text not null, -- data | analysis | experiments | segments | integrations
  action text not null,
  completed_at timestamptz not null default now(),
  unique(user_id, ring, action)
);

alter table user_streaks enable row level security;
alter table ring_actions enable row level security;

create policy "users see own streak" on user_streaks
  for all using (auth.uid() = user_id);

create policy "users see own ring actions" on ring_actions
  for all using (auth.uid() = user_id);
