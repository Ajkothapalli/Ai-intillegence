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

export type CreateProjectInput = z.infer<typeof createProjectSchema>

export const ALLOWED_CSV_MIME_TYPES = ['text/csv', 'application/vnd.ms-excel'] as const
export const ALLOWED_SCREENSHOT_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
export const MAX_CSV_COUNT = 1
export const MAX_SCREENSHOT_COUNT = 5

export const uploadFileSchema = z.object({
  mimeType: z.string(),
  fileSize: z.number().max(MAX_FILE_SIZE_BYTES, 'File must be under 10 MB'),
  fileName: z.string().min(1, 'File name is required'),
})

export type UploadFileInput = z.infer<typeof uploadFileSchema>
