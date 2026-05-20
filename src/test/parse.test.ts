import { describe, it, expect } from 'vitest'
import { parseAnalysisOutput } from '@/lib/ai/parse'

const minRec = {
  hypothesis: 'Add trust badges to checkout',
  experiment_type: 'A/B Test',
  priority: 1,
  confidence: 0.85,
  evidence: ['Drop-off at checkout is 40%'],
  impact_score: 8,
  effort_score: 3,
  target_segments: [],
}

const validJson = JSON.stringify({ recommendations: [minRec] })

describe('parseAnalysisOutput', () => {
  it('parses plain JSON', () => {
    const result = parseAnalysisOutput(validJson)
    expect(result.recommendations).toHaveLength(1)
    expect(result.recommendations[0].hypothesis).toBe('Add trust badges to checkout')
  })

  it('parses JSON wrapped in markdown code fence', () => {
    const wrapped = `Here is the analysis:\n\`\`\`json\n${validJson}\n\`\`\``
    const result = parseAnalysisOutput(wrapped)
    expect(result.recommendations).toHaveLength(1)
  })

  it('parses JSON in plain code fence', () => {
    const wrapped = `\`\`\`\n${validJson}\n\`\`\``
    const result = parseAnalysisOutput(wrapped)
    expect(result.recommendations[0].confidence).toBe(0.85)
  })

  it('throws on invalid JSON', () => {
    expect(() => parseAnalysisOutput('not json at all')).toThrow('AI returned invalid JSON')
  })

  it('throws on JSON that fails schema validation', () => {
    const bad = JSON.stringify({ recommendations: [{ hypothesis: 'x' }] })
    expect(() => parseAnalysisOutput(bad)).toThrow('AI output failed validation')
  })

  it('parses optional summary field', () => {
    const withSummary = JSON.stringify({ recommendations: [minRec], summary: 'Great analysis' })
    const result = parseAnalysisOutput(withSummary)
    expect(result.summary).toBe('Great analysis')
  })
})
