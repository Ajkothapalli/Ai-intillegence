-- Funnel templates (global, read-only seed data)
create table if not exists funnel_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('saas_b2c', 'marketplace', 'ecommerce', 'fintech', 'healthtech')),
  stages jsonb not null,
  industry_median_drop_off jsonb not null,
  created_at timestamptz default now()
);

-- User funnel mappings (project-scoped)
create table if not exists user_funnel_mappings (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  template_id uuid not null references funnel_templates(id),
  stage_mappings jsonb not null default '{}',
  created_at timestamptz default now(),
  constraint user_funnel_mappings_project_id_key unique (project_id)
);

alter table user_funnel_mappings enable row level security;

create policy "Users manage their own funnel mappings"
  on user_funnel_mappings for all
  using (
    project_id in (select id from projects where user_id = auth.uid())
  )
  with check (
    project_id in (select id from projects where user_id = auth.uid())
  );

-- Seed 5 industry funnel templates
insert into funnel_templates (name, category, stages, industry_median_drop_off) values
(
  'SaaS B2C',
  'saas_b2c',
  '["Landing","Sign Up","Email Verify","Onboarding","First Value","Activated","Retained"]'::jsonb,
  '{"Landing\u2192Sign Up":35,"Sign Up\u2192Email Verify":25,"Email Verify\u2192Onboarding":20,"Onboarding\u2192First Value":30,"First Value\u2192Activated":25,"Activated\u2192Retained":20}'::jsonb
),
(
  'Marketplace',
  'marketplace',
  '["Landing","Browse","Item View","Add to Cart","Checkout","Purchase","Repeat"]'::jsonb,
  '{"Landing\u2192Browse":40,"Browse\u2192Item View":30,"Item View\u2192Add to Cart":55,"Add to Cart\u2192Checkout":25,"Checkout\u2192Purchase":20,"Purchase\u2192Repeat":45}'::jsonb
),
(
  'E-commerce',
  'ecommerce',
  '["Landing","Category","Product","Cart","Checkout","Payment","Confirmed"]'::jsonb,
  '{"Landing\u2192Category":35,"Category\u2192Product":30,"Product\u2192Cart":60,"Cart\u2192Checkout":30,"Checkout\u2192Payment":20,"Payment\u2192Confirmed":10}'::jsonb
),
(
  'Fintech',
  'fintech',
  '["Landing","Register","KYC","Account Setup","First Transaction","Retained"]'::jsonb,
  '{"Landing\u2192Register":40,"Register\u2192KYC":35,"KYC\u2192Account Setup":25,"Account Setup\u2192First Transaction":30,"First Transaction\u2192Retained":35}'::jsonb
),
(
  'Healthtech',
  'healthtech',
  '["Landing","Sign Up","Assessment","Plan Selection","First Session","Habit Formed"]'::jsonb,
  '{"Landing\u2192Sign Up":38,"Sign Up\u2192Assessment":28,"Assessment\u2192Plan Selection":32,"Plan Selection\u2192First Session":22,"First Session\u2192Habit Formed":50}'::jsonb
);
