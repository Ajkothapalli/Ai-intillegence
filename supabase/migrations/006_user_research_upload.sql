-- Add 'user_research' to the file_type check constraint
alter table public.uploads drop constraint if exists uploads_file_type_check;
alter table public.uploads add constraint uploads_file_type_check
  check (file_type in ('csv', 'screenshot', 'user_research'));

-- Update the storage bucket: allow new MIME types and raise the size limit to 50 MB
update storage.buckets
set
  file_size_limit  = 52428800, -- 50 MB
  allowed_mime_types = array[
    'text/csv',
    'application/vnd.ms-excel',
    'image/png',
    'image/jpeg',
    'image/webp',
    'text/plain',
    'application/pdf',
    'video/mp4',
    'video/quicktime',
    'audio/mpeg',
    'audio/mp4'
  ]
where id = 'uploads';
