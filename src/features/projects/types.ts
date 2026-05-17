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
