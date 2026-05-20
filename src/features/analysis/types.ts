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
  x: number
  y: number
}

export type UIElement = {
  id: string
  label: string
  location: 'top' | 'middle' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
  issue: string
  current_state: string
  bounding_hint: {
    x: number
    y: number
    width: number
    height: number
  }
}

export type ScreenshotAnalysis = {
  screen_name: string
  overall_assessment: string
  friction_elements: UIElement[]
  trust_elements: UIElement[]
  clarity_elements: UIElement[]
}

export type TargetSegmentRef = {
  segment_id: string
  segment_name: string
  relevance_reason: string
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
  target_element: UIElement | null
  screenshot_id: string | null
  pm_summary: string | null
  target_segments: TargetSegmentRef[] | null
  estimated_reach: number | null
  created_at: string
  updated_at: string
}
