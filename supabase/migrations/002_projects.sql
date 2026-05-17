-- Projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  app_url text,
  target_audience text,
  funnel_stages text[], -- e.g. ['awareness','activation','retention']
  primary_metric text,
  business_goal text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "Users can view own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can insert own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Users can delete own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

-- Project context table (rich metadata for AI)
create table if not exists public.project_context (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null,
  value text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.project_context enable row level security;

create policy "Users can manage own project context"
  on public.project_context for all
  using (auth.uid() = user_id);

-- Updated_at triggers
create trigger projects_updated_at
  before update on public.projects
  for each row execute procedure public.set_updated_at();

create trigger project_context_updated_at
  before update on public.project_context
  for each row execute procedure public.set_updated_at();
