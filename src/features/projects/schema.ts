import { z } from 'zod'

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100),
  description: z.string().max(500).optional(),
  app_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  target_audience: z.string().max(300).optional(),
  funnel_stages: z.string().optional(),
  primary_metric: z.string().max(200).optional(),
  business_goal: z.string().max(500).optional(),
})

export const updateProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100),
  description: z.string().max(500).optional(),
  app_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  target_audience: z.string().max(300).optional(),
  funnel_stages: z.string().optional(),
  primary_metric: z.string().max(200).optional(),
  business_goal: z.string().max(500).optional(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>

export const ALLOWED_CSV_MIME_TYPES = ['text/csv', 'application/vnd.ms-excel'] as const
export const ALLOWED_SCREENSHOT_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const
export const ALLOWED_USER_RESEARCH_MIME_TYPES = [
  'text/plain',
  'application/pdf',
  'video/mp4',
  'video/quicktime',
  'audio/mpeg',
  'audio/mp4',
  'application/vnd.ms-excel',
  'text/csv',
] as const
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024          // 10 MB (csv / screenshot)
export const MAX_USER_RESEARCH_FILE_SIZE_BYTES = 50 * 1024 * 1024 // 50 MB
export const MAX_CSV_COUNT = 1
export const MAX_SCREENSHOT_COUNT = 5
export const MAX_USER_RESEARCH_COUNT = 10

export const uploadFileSchema = z.object({
  mimeType: z.string(),
  fileSize: z.number().positive('File is empty'),
  fileName: z.string().min(1, 'File name is required'),
})

export type UploadFileInput = z.infer<typeof uploadFileSchema>
