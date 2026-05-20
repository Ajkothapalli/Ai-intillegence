alter table recommendations add column if not exists target_segments jsonb;
alter table recommendations add column if not exists estimated_reach int;
