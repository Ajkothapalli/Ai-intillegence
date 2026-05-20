create table if not exists onboarding_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  steps_completed text[] not null default '{}',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint onboarding_progress_user_id_key unique (user_id)
);
alter table onboarding_progress enable row level security;
create policy "Users manage own onboarding" on onboarding_progress for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
