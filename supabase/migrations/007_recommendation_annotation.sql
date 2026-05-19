-- Add screenshot annotation coordinates to recommendations
-- Stores { screenshot_index: number, x: number, y: number } (percentages 0-100)
alter table public.recommendations
  add column if not exists screenshot_annotation jsonb default null;
