import { z } from 'zod'

export const mixpanelSchema = z.object({
  project_id: z.string().min(1, 'Project ID required'),
  service_account_username: z.string().min(1, 'Username required'),
  service_account_secret: z.string().min(1, 'Secret required'),
})
export const amplitudeSchema = z.object({
  api_key: z.string().min(1, 'API key required'),
  secret_key: z.string().min(1, 'Secret key required'),
})
export const ga4Schema = z.object({
  property_id: z.string().min(1, 'Property ID required'),
  api_secret: z.string().min(1, 'API secret required'),
})
export const posthogSchema = z.object({
  api_key: z.string().min(1, 'API key required'),
  project_id: z.string().min(1, 'Project ID required'),
  host: z.string().url().default('https://app.posthog.com'),
})
export const heapSchema = z.object({
  app_id: z.string().min(1, 'App ID required'),
  api_key: z.string().min(1, 'API key required'),
})
export const segmentSchema = z.object({
  workspace_slug: z.string().min(1, 'Workspace slug required'),
  access_token: z.string().min(1, 'Access token required'),
})
export const pendoSchema = z.object({
  integration_key: z.string().min(1, 'Integration key required'),
})
// Session tools — no credentials (file-based)
export const hotjarSchema = z.object({})
export const logRocketSchema = z.object({})
// Document platforms — no credentials (file-based)
export const documentSchema = z.object({})

export const platformCredentialSchemas = {
  mixpanel: mixpanelSchema,
  amplitude: amplitudeSchema,
  ga4: ga4Schema,
  posthog: posthogSchema,
  heap: heapSchema,
  segment: segmentSchema,
  pendo: pendoSchema,
  hotjar: hotjarSchema,
  logrocket: logRocketSchema,
  google_sheets: documentSchema,
  google_docs: documentSchema,
  google_slides: documentSchema,
  excel: documentSchema,
  word: documentSchema,
  powerpoint: documentSchema,
  pdf: documentSchema,
} as const

export type MixpanelCredentials = z.infer<typeof mixpanelSchema>
export type AmplitudeCredentials = z.infer<typeof amplitudeSchema>
export type GA4Credentials = z.infer<typeof ga4Schema>
export type PostHogCredentials = z.infer<typeof posthogSchema>
export type HeapCredentials = z.infer<typeof heapSchema>
export type SegmentCredentials = z.infer<typeof segmentSchema>
export type PendoCredentials = z.infer<typeof pendoSchema>

export type PlatformCredentials =
  | ({ platform: 'mixpanel' } & MixpanelCredentials)
  | ({ platform: 'amplitude' } & AmplitudeCredentials)
  | ({ platform: 'ga4' } & GA4Credentials)
  | ({ platform: 'posthog' } & PostHogCredentials)
  | ({ platform: 'heap' } & HeapCredentials)
  | ({ platform: 'segment' } & SegmentCredentials)
  | ({ platform: 'pendo' } & PendoCredentials)
  | { platform: 'hotjar' }
  | { platform: 'logrocket' }
  | { platform: 'google_sheets' }
  | { platform: 'google_docs' }
  | { platform: 'google_slides' }
  | { platform: 'excel' }
  | { platform: 'word' }
  | { platform: 'powerpoint' }
  | { platform: 'pdf' }
