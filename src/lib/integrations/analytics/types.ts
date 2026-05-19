export interface FunnelStage {
  name: string
  users: number
  drop_off_rate: number
  avg_time_seconds: number
}

export interface NormalisedFunnelData {
  stages: FunnelStage[]
  dimension?: string
  segment?: string
  fetched_at: string
}
