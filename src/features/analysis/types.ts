export type Analysis = {
  id: string
  project_id: string
  user_id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  model: string
  error_message: string | null
  started_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export type ScreenshotAnnotation = {
  screenshot_index: number
  x: number // % from left
  y: number // % from top
}

export type DbRecommendation = {
  id: string
  analysis_id: string
  project_id: string
  user_id: string
  priority: number
  hypothesis: string
  experiment_type: string
  confidence: number
  evidence: string[]
  rationale: string | null
  screenshot_annotation: ScreenshotAnnotation | null
  created_at: string
  updated_at: string
}
