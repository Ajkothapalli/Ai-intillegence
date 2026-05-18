-- Create the uploads storage bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'uploads',
  'uploads',
  false,
  10485760, -- 10 MB
  array['text/csv', 'application/vnd.ms-excel', 'image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do nothing;

-- Storage RLS: each user can only access their own folder
-- Path structure: {userId}/{projectId}/{timestamp}-{filename}

create policy "Users can upload to own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'uploads'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can view own uploads"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'uploads'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete own uploads"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'uploads'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
