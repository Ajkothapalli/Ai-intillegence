import { z } from 'zod'

export const EXPERIMENT_TYPES = [
  { value: 'copy',            label: 'Copy',             icon: '✏️' },
  { value: 'layout',         label: 'Layout',           icon: '⬛' },
  { value: 'flow',           label: 'Flow',             icon: '➡️' },
  { value: 'incentive',      label: 'Incentive',        icon: '🎁' },
  { value: 'social_proof',   label: 'Social Proof',     icon: '⭐' },
  { value: 'friction_removal', label: 'Friction Removal', icon: '✂️' },
] as const

export type ExperimentTypeValue = typeof EXPERIMENT_TYPES[number]['value']

export const OWNER_ROLES = [
  { value: 'pm',            label: 'PM' },
  { value: 'designer',      label: 'Designer' },
  { value: 'engineer',      label: 'Engineer' },
  { value: 'data_analyst',  label: 'Data Analyst' },
] as const

export const step1Schema = z.object({
  name:            z.string().min(1, 'Name is required'),
  hypothesis:      z.string().min(10, 'Hypothesis must be at least 10 characters'),
  experiment_type: z.string().min(1, 'Select an experiment type'),
})

export const step2Schema = z.object({
  segment_id:         z.string().nullable().optional(),
  segment_rationale:  z.string().optional(),
})

export const step3Schema = z.object({
  success_metric:   z.string().min(1, 'Success metric is required'),
  start_date:       z.string().min(1, 'Start date is required'),
  end_date:         z.string().min(1, 'End date is required'),
  sample_size_goal: z.coerce.number().min(100).optional().or(z.literal('')).transform(v => v === '' ? undefined : v),
  owner_name:       z.string().optional(),
  owner_role:       z.enum(['pm', 'designer', 'engineer', 'data_analyst']).optional(),
  notes:            z.string().optional(),
}).refine(d => !d.start_date || !d.end_date || d.end_date > d.start_date, {
  message: 'End date must be after start date',
  path: ['end_date'],
})

export const fullExperimentSchema = step1Schema.merge(step2Schema).merge(
  z.object({
    success_metric:   z.string().min(1, 'Success metric is required'),
    start_date:       z.string().min(1, 'Start date is required'),
    end_date:         z.string().min(1, 'End date is required'),
    sample_size_goal: z.coerce.number().min(100).optional().or(z.literal('')).transform(v => v === '' ? undefined : v),
    owner_name:       z.string().optional(),
    owner_role:       z.enum(['pm', 'designer', 'engineer', 'data_analyst']).optional(),
    notes:            z.string().optional(),
    recommendation_id: z.string().optional(),
  })
).refine(d => !d.start_date || !d.end_date || d.end_date > d.start_date, {
  message: 'End date must be after start date',
  path: ['end_date'],
})

export type FullExperimentInput = z.infer<typeof fullExperimentSchema>
