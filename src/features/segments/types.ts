export type SegmentSource =
  | 'manual'
  | 'mixpanel'
  | 'amplitude'
  | 'ga4'
  | 'posthog'
  | 'heap'
  | 'segment_io'
  | 'pendo'

export type SegmentDimensions = {
  device: string[] | null
  acquisition_channel: string[] | null
  geography: string[] | null
  plan_tier: string[] | null
  behaviour: string[] | null
  demographics: { age_min: number; age_max: number; gender: string[] } | null
  lifecycle: string[] | null
}

export type UserSegment = {
  id: string
  project_id: string
  user_id: string
  name: string
  description: string | null
  source: SegmentSource
  external_cohort_id: string | null
  dimensions: Partial<SegmentDimensions>
  user_count: number | null
  last_synced_at: string | null
  created_at: string
  updated_at: string
}

export type ExternalCohort = {
  id: string
  name: string
  user_count: number | null
  description: string | null
  dimensions: Partial<SegmentDimensions>
}
