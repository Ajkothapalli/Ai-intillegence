import { z } from 'zod'

export const SegmentSourceSchema = z.enum([
  'manual', 'mixpanel', 'amplitude', 'ga4', 'posthog', 'heap', 'segment_io', 'pendo',
])

export const SegmentDimensionsSchema = z.object({
  device:               z.array(z.string()).nullable().optional(),
  acquisition_channel:  z.array(z.string()).nullable().optional(),
  geography:            z.array(z.string()).nullable().optional(),
  plan_tier:            z.array(z.string()).nullable().optional(),
  behaviour:            z.array(z.string()).nullable().optional(),
  demographics: z.object({
    age_min: z.number().int().min(0).max(150),
    age_max: z.number().int().min(0).max(150),
    gender:  z.array(z.string()),
  }).nullable().optional(),
  lifecycle: z.array(z.string()).nullable().optional(),
})

export const CreateSegmentSchema = z.object({
  name:               z.string().min(1, 'Name is required').max(120),
  description:        z.string().max(500).optional(),
  source:             SegmentSourceSchema,
  external_cohort_id: z.string().optional(),
  dimensions:         SegmentDimensionsSchema,
  user_count:         z.number().int().nullable().optional(),
})

export const UpdateSegmentSchema = z.object({
  name:        z.string().min(1).max(120).optional(),
  description: z.string().max(500).optional(),
  dimensions:  SegmentDimensionsSchema.optional(),
  user_count:  z.number().int().nullable().optional(),
})
