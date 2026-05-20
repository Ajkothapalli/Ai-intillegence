export type Platform =
  | 'mixpanel' | 'amplitude' | 'ga4' | 'posthog' | 'heap' | 'segment' | 'pendo'
  | 'hotjar' | 'logrocket'
  | 'google_sheets' | 'google_docs' | 'google_slides' | 'excel' | 'word' | 'powerpoint' | 'pdf'

export type IntegrationStatus = 'connected' | 'error' | 'disconnected'

export interface Integration {
  id: string
  project_id: string
  user_id: string
  platform: Platform
  credentials: Record<string, string>  // never return to client raw — scrub in queries
  status: IntegrationStatus
  error_message: string | null
  last_synced_at: string | null
  created_at: string
  updated_at: string
}

export interface IntegrationSync {
  id: string
  integration_id: string
  status: 'running' | 'complete' | 'failed'
  rows_fetched: number | null
  error_message: string | null
  created_at: string
}

// Safe version returned to client (no credentials)
export type SafeIntegration = Omit<Integration, 'credentials'>
