import { z } from 'zod'

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100),
  description: z.string().max(500).optional(),
  app_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  target_audience: z.string().max(300).optional(),
  funnel_stages: z.string().optional(), // comma-separated, parsed server-side
  primary_metric: z.string().max(200).optional(),
  business_goal: z.string().max(500).optional(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
