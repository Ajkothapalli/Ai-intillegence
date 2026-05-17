import { analysisOutputSchema, type AnalysisOutput } from './schemas'

export function parseAnalysisOutput(raw: string): AnalysisOutput {
  let json: unknown
  try {
    // Extract JSON from markdown code blocks if present
    const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
    json = JSON.parse(match ? match[1].trim() : raw.trim())
  } catch {
    throw new Error('AI returned invalid JSON')
  }

  const result = analysisOutputSchema.safeParse(json)
  if (!result.success) {
    throw new Error(`AI output failed validation: ${result.error.issues[0].message}`)
  }

  return result.data
}
