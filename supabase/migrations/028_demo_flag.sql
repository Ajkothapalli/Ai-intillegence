alter table projects add column if not exists is_demo boolean default false;
alter table analyses add column if not exists is_demo boolean default false;
