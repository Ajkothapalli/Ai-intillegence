'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const ALLOWED_CSV_TYPES = ['text/csv', 'application/csv', 'text/plain']
const ALLOWED_SCREENSHOT_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']

type UploadResult = { success: true } | { success: false; error: string }

export async function uploadFile(projectId: string, formData: FormData): Promise<UploadResult> {
  const file = formData.get('file') as File | null
  if (!file || file.size === 0) return { success: false, error: 'No file provided' }

  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: 'File exceeds 10 MB limit' }
  }

  const mimeType = file.type
  const isCSV = ALLOWED_CSV_TYPES.includes(mimeType) || file.name.endsWith('.csv')
  const isScreenshot = ALLOWED_SCREENSHOT_TYPES.includes(mimeType)

  if (!isCSV && !isScreenshot) {
    return { success: false, error: 'Only CSV files and screenshots (PNG, JPEG, WebP, GIF) are allowed' }
  }

  const fileType = isCSV ? 'csv' : 'screenshot'

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const ext = file.name.split('.').pop() ?? 'bin'
  const storagePath = `${user.id}/${projectId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error: storageError } = await supabase.storage
    .from('project-uploads')
    .upload(storagePath, file, { contentType: mimeType, upsert: false })

  if (storageError) return { success: false, error: storageError.message }

  const { error: dbError } = await supabase.from('uploads').insert({
    project_id: projectId,
    user_id: user.id,
    file_name: file.name,
    file_type: fileType,
    mime_type: mimeType,
    file_size_bytes: file.size,
    storage_path: storagePath,
  })

  if (dbError) {
    await supabase.storage.from('project-uploads').remove([storagePath])
    return { success: false, error: dbError.message }
  }

  revalidatePath(`/projects/${projectId}/uploads`)
  return { success: true }
}

export async function deleteUpload(uploadId: string, projectId: string): Promise<UploadResult> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { data: upload, error: fetchError } = await supabase
    .from('uploads')
    .select('storage_path')
    .eq('id', uploadId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !upload) return { success: false, error: 'Upload not found' }

  await supabase.storage.from('project-uploads').remove([upload.storage_path])

  const { error } = await supabase.from('uploads').delete().eq('id', uploadId)
  if (error) return { success: false, error: error.message }

  revalidatePath(`/projects/${projectId}/uploads`)
  return { success: true }
}

export async function listUploads(projectId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('uploads')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}
