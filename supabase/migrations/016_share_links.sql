-- Share links for PM briefs (public read by token)
create table if not exists share_links (
  id               uuid primary key default gen_random_uuid(),
  recommendation_id uuid not null references recommendations(id) on delete cascade,
  token            text unique not null default encode(gen_random_bytes(16), 'hex'),
  expires_at       timestamptz not null default (now() + interval '30 days'),
  created_at       timestamptz not null default now()
);

create index if not exists share_links_token_idx on share_links (token);
create index if not exists share_links_recommendation_id_idx on share_links (recommendation_id);

alter table share_links enable row level security;

-- Public read by token (no auth required for SELECT)
create policy "Public read by token" on share_links
  for select using (true);

-- Only owner can insert/delete
create policy "Owners insert share links" on share_links
  for insert
  with check (
    recommendation_id in (
      select id from recommendations where user_id = auth.uid()
    )
  );

create policy "Owners delete share links" on share_links
  for delete
  using (
    recommendation_id in (
      select id from recommendations where user_id = auth.uid()
    )
  );
