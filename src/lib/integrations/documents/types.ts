export interface ParsedDocument {
  type: 'funnel_data' | 'research_context'
  content: string  // CSV string for funnel_data, plain text for research_context (max 50k chars)
  source: string   // platform name
  detectedFormat?: string  // e.g. "Funnel data — 8 stages found"
}
