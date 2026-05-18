import { AnalysisOutputSchema, type AnalysisOutput } from './schemas/recommendation'

export function parseAnalysisOutput(raw: string): AnalysisOutput {
  let json: unknown
  try {
    const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
    json = JSON.parse(match ? match[1].trim() : raw.trim())
  } catch {
    throw new Error('AI returned invalid JSON')
  }

  const result = AnalysisOutputSchema.safeParse(json)
  if (!result.success) {
    throw new Error(`AI output failed validation: ${result.error.issues[0].message}`)
  }

  return result.data
}
