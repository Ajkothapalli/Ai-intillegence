-- Add visual design proposal fields to recommendations
alter table recommendations
  add column if not exists target_element jsonb,
  add column if not exists screenshot_id  uuid references uploads(id),
  add column if not exists pm_summary     text;
