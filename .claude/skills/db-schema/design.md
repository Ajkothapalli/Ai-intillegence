# Database Schema Design

## Tables

### profiles
Extends `auth.users`. Created automatically via trigger on signup.
```sql
create table profiles (
  id uuid references auth.users primary key,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### projects
```sql
create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  description text,
  app_url text,
  target_audience text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
-- RLS: user_id = auth.uid()
```

### project_context
One-to-one with projects.
```sql
create table project_context (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects not null unique,
  funnel_stages text[],
  primary_metric text,
  business_goal text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
-- RLS: via project_id → projects.user_id = auth.uid()
```

### uploads
```sql
create table uploads (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects not null,
  type text check (type in ('csv', 'screenshot')) not null,
  storage_path text not null,
  file_name text not null,
  file_size_bytes bigint,
  created_at timestamptz default now()
);
-- RLS: via project_id → projects.user_id = auth.uid()
```

### analyses
```sql
create table analyses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects not null,
  status text check (status in ('pending', 'running', 'complete', 'failed')) default 'pending',
  model_used text,
  raw_output jsonb,
  error_message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
-- RLS: via project_id → projects.user_id = auth.uid()
```

### recommendations
```sql
create table recommendations (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid references analyses not null,
  hypothesis text not null,
  evidence text[] not null,
  confidence numeric(3,2) check (confidence between 0 and 1),
  priority integer check (priority between 1 and 5),
  experiment_type text,
  rationale text,
  created_at timestamptz default now()
);
-- RLS: via analysis_id → analyses → projects.user_id = auth.uid()
```
