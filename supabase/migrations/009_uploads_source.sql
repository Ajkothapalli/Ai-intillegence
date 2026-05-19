alter table uploads add column if not exists source text not null default 'manual';
alter table uploads add column if not exists tool text;
