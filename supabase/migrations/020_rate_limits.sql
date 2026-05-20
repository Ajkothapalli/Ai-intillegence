create table if not exists analysis_rate_limits (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  window_start timestamptz not null default now(),
  count        int not null default 0,
  created_at   timestamptz not null default now(),
  constraint analysis_rate_limits_user_id_key unique (user_id)
);

alter table analysis_rate_limits enable row level security;

create policy "Users read own rate limits" on analysis_rate_limits
  for select using (user_id = auth.uid());

create policy "Users insert own rate limits" on analysis_rate_limits
  for insert with check (user_id = auth.uid());

create policy "Users update own rate limits" on analysis_rate_limits
  for update using (user_id = auth.uid());
