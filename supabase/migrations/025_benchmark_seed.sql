-- Add columns to experiment_benchmarks for global seed data
alter table experiment_benchmarks
  add column if not exists hypothesis_type text,
  add column if not exists industry_category text check (industry_category in ('saas_b2c', 'marketplace', 'ecommerce', 'fintech', 'healthtech')),
  add column if not exists p95_lift numeric(8,4),
  add column if not exists p05_lift numeric(8,4),
  add column if not exists user_contributed boolean default true;

-- Make user_id nullable to support global seed rows
alter table experiment_benchmarks alter column user_id drop not null;
alter table experiment_benchmarks alter column project_id drop not null;

-- Seed 30 global benchmark rows (6 hypothesis types × 5 industries)
-- All rows have user_contributed = false and null user_id/project_id
insert into experiment_benchmarks (hypothesis_type, industry_category, win_rate, median_lift_percent, p95_lift, p05_lift, sample_size, user_contributed)
values
-- copy
('copy', 'saas_b2c',    0.55, 8.0,  22.0, 2.0, 340, false),
('copy', 'marketplace', 0.53, 7.0,  20.0, 1.5, 290, false),
('copy', 'ecommerce',   0.57, 9.0,  24.0, 2.5, 410, false),
('copy', 'fintech',     0.52, 7.5,  21.0, 2.0, 255, false),
('copy', 'healthtech',  0.56, 8.5,  23.0, 2.0, 180, false),
-- layout
('layout', 'saas_b2c',    0.48, 6.0,  18.0, 1.0, 280, false),
('layout', 'marketplace', 0.46, 5.0,  16.0, 0.8, 230, false),
('layout', 'ecommerce',   0.50, 7.0,  20.0, 1.5, 320, false),
('layout', 'fintech',     0.45, 5.5,  17.0, 1.0, 195, false),
('layout', 'healthtech',  0.49, 6.5,  19.0, 1.2, 145, false),
-- flow
('flow', 'saas_b2c',    0.62, 12.0, 28.0, 3.0, 195, false),
('flow', 'marketplace', 0.60, 11.0, 26.0, 2.5, 165, false),
('flow', 'ecommerce',   0.64, 13.0, 30.0, 3.5, 240, false),
('flow', 'fintech',     0.63, 12.5, 29.0, 3.0, 155, false),
('flow', 'healthtech',  0.61, 11.5, 27.0, 2.8, 110, false),
-- incentive
('incentive', 'saas_b2c',    0.70, 18.0, 35.0, 5.0, 420, false),
('incentive', 'marketplace', 0.72, 20.0, 38.0, 6.0, 380, false),
('incentive', 'ecommerce',   0.75, 22.0, 42.0, 7.0, 510, false),
('incentive', 'fintech',     0.68, 16.0, 32.0, 4.5, 300, false),
('incentive', 'healthtech',  0.65, 14.0, 28.0, 4.0, 210, false),
-- social_proof
('social_proof', 'saas_b2c',    0.58, 10.0, 24.0, 2.0, 315, false),
('social_proof', 'marketplace', 0.62, 12.0, 28.0, 3.0, 285, false),
('social_proof', 'ecommerce',   0.65, 14.0, 32.0, 4.0, 375, false),
('social_proof', 'fintech',     0.55, 9.0,  22.0, 2.0, 240, false),
('social_proof', 'healthtech',  0.60, 11.0, 26.0, 2.5, 165, false),
-- friction_removal
('friction_removal', 'saas_b2c',    0.65, 14.0, 30.0, 4.0, 260, false),
('friction_removal', 'marketplace', 0.68, 16.0, 33.0, 4.5, 230, false),
('friction_removal', 'ecommerce',   0.72, 18.0, 36.0, 5.0, 310, false),
('friction_removal', 'fintech',     0.70, 17.0, 34.0, 5.0, 200, false),
('friction_removal', 'healthtech',  0.63, 13.0, 28.0, 3.5, 140, false);
