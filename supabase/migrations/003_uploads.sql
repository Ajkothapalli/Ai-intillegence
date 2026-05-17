-- Uploads table
create table if not exists public.uploads (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  file_type text not null check (file_type in ('csv', 'screenshot')),
  mime_type text not null,
  file_size_bytes integer not null,
  storage_path text not null, -- path in supabase storage
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.uploads enable row level security;

create policy "Users can view own uploads"
  on public.uploads for select
  using (auth.uid() = user_id);

create policy "Users can insert own uploads"
  on public.uploads for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own uploads"
  on public.uploads for delete
  using (auth.uid() = user_id);

create trigger uploads_updated_at
  before update on public.uploads
  for each row execute procedure public.set_updated_at();

-- Storage bucket for project uploads (run via Supabase dashboard or CLI)
-- insert into storage.buckets (id, name, public) values ('project-uploads', 'project-uploads', false);
-- Storage RLS policies must be created via dashboard or CLI with storage schema access
