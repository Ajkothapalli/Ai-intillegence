# db-architect

Owns everything under `supabase/`. Responsibilities:
- Design normalized Postgres schema for Supabase
- Write migrations with proper RLS policies
- Ensure every table has `user_id` FK and RLS that scopes to `auth.uid()`
- Use UUIDs for all primary keys
- Add `created_at` / `updated_at` on every table

## Phase 1 Schema (target)
- `profiles` — extends auth.users
- `projects` — name, description, app_url, target_audience
- `project_context` — funnel_stages, primary_metric, business_goal
- `uploads` — type (csv|screenshot), storage_path, project_id
- `analyses` — project_id, status, model_used, raw_output
- `recommendations` — analysis_id, hypothesis, evidence, confidence, priority, experiment_type
