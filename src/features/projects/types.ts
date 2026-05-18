export type Project = {
  id: string
  user_id: string
  name: string
  description: string | null
  app_url: string | null
  target_audience: string | null
  funnel_stages: string[] | null
  primary_metric: string | null
  business_goal: string | null
  created_at: string
  updated_at: string
}

export type Upload = {
  id: string
  project_id: string
  user_id: string
  file_name: string
  file_type: 'csv' | 'screenshot' | 'user_research'
  mime_type: string
  file_size_bytes: number
  storage_path: string
  created_at: string
  updated_at: string
}
