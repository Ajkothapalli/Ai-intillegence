-- Analyses table
create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'running', 'completed', 'failed')),
  model text not null default 'claude-sonnet-4-6',
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.analyses enable row level security;

create policy "Users can view own analyses"
  on public.analyses for select
  using (auth.uid() = user_id);

create policy "Users can insert own analyses"
  on public.analyses for insert
  with check (auth.uid() = user_id);

create policy "Users can update own analyses"
  on public.analyses for update
  using (auth.uid() = user_id);

-- Recommendations table
create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references public.analyses(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  priority integer not null check (priority between 1 and 5),
  hypothesis text not null,
  experiment_type text not null, -- e.g. 'A/B Test', 'Multivariate', 'Feature Flag'
  confidence numeric(3,2) not null check (confidence between 0 and 1),
  evidence jsonb not null default '[]', -- array of evidence strings
  rationale text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.recommendations enable row level security;

create policy "Users can view own recommendations"
  on public.recommendations for select
  using (auth.uid() = user_id);

create policy "Users can insert own recommendations"
  on public.recommendations for insert
  with check (auth.uid() = user_id);

create trigger analyses_updated_at
  before update on public.analyses
  for each row execute procedure public.set_updated_at();

create trigger recommendations_updated_at
  before update on public.recommendations
  for each row execute procedure public.set_updated_at();
