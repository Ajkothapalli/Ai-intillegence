export type InsightType = 'rage_click' | 'error' | 'survey_response' | 'drop_off'

export interface SessionInsight {
  type: InsightType
  location: string
  frequency: number
  detail: string
}

export interface NormalisedSessionData {
  tool: string
  insights: SessionInsight[]
}
