import { describe, it, expect } from 'vitest'
import { inferHypothesisType, buildBenchmarkContextBlock } from '@/lib/ai/benchmarks'
import type { BenchmarkResult } from '@/lib/ai/benchmarks'

describe('inferHypothesisType', () => {
  it('detects copy hypotheses', () => {
    expect(inferHypothesisType('Change the CTA button text to be more action-oriented')).toBe('copy')
    expect(inferHypothesisType('Rewrite the headline on the landing page')).toBe('copy')
  })

  it('detects layout hypotheses', () => {
    expect(inferHypothesisType('Move the pricing table above the fold')).toBe('layout')
  })

  it('detects flow hypotheses', () => {
    expect(inferHypothesisType('Simplify the onboarding flow from 5 steps to 3')).toBe('flow')
  })

  it('detects incentive hypotheses', () => {
    expect(inferHypothesisType('Offer a 20% discount to users who abandon checkout')).toBe('incentive')
  })

  it('detects social_proof hypotheses', () => {
    expect(inferHypothesisType('Show trust badges and testimonials near the signup button')).toBe('social_proof')
  })

  it('detects friction_removal hypotheses', () => {
    expect(inferHypothesisType('Remove the optional fields from the signup form to reduce friction')).toBe('friction_removal')
  })

  it('defaults to copy for unrecognised hypothesis', () => {
    expect(inferHypothesisType('Do something completely unrelated')).toBe('copy')
  })
})

describe('buildBenchmarkContextBlock', () => {
  it('returns empty string for empty map', () => {
    expect(buildBenchmarkContextBlock(new Map())).toBe('')
  })

  it('includes benchmark data for each type', () => {
    const b: BenchmarkResult = {
      hypothesis_type: 'copy',
      median_lift_percent: 12.5,
      win_rate: 0.6,
      sample_size: 30,
      p95_lift: 25,
      p05_lift: 2,
    }
    const result = buildBenchmarkContextBlock(new Map([['copy', b]]))
    expect(result).toContain('copy')
    expect(result).toContain('12.5%')
    expect(result).toContain('60%')
    expect(result).toContain('30 experiments')
  })
})
