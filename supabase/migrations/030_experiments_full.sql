alter table experiment_runs add column if not exists success_metric text;
alter table experiment_runs add column if not exists sample_size_goal int;
alter table experiment_runs add column if not exists owner_name text;
alter table experiment_runs add column if not exists owner_role text check (owner_role in ('pm','designer','engineer','data_analyst'));
alter table experiment_runs add column if not exists notes text;
alter table experiment_runs add column if not exists start_date date;
alter table experiment_runs add column if not exists end_date date;
alter table experiment_runs add column if not exists experiment_type text;
alter table experiment_runs add column if not exists segment_rationale text;
