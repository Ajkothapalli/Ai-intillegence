import { describe, it, expect } from 'vitest'
import { computeConfidence } from '@/lib/ai/confidence'

describe('computeConfidence', () => {
  it('returns prior_only when benchmark is null', () => {
    const result = computeConfidence(0.7, null)
    expect(result.dataSource).toBe('prior_only')
    expect(result.final).toBe(0.7)
    expect(result.historicalAdjustment).toBe(0)
  })

  it('returns prior_only when sample_size < 3', () => {
    const result = computeConfidence(0.7, { sample_size: 2, win_rate: 0.8, median_lift_percent: 10 })
    expect(result.dataSource).toBe('prior_only')
    expect(result.final).toBe(0.7)
  })

  it('boosts confidence when win_rate > 0.5 with sufficient data', () => {
    const result = computeConfidence(0.6, { sample_size: 20, win_rate: 0.8, median_lift_percent: 15 })
    expect(result.final).toBeGreaterThan(0.6)
    expect(result.dataSource).toBe('history_dominant')
  })

  it('dampens confidence when win_rate < 0.5', () => {
    const result = computeConfidence(0.7, { sample_size: 20, win_rate: 0.2, median_lift_percent: -5 })
    expect(result.final).toBeLessThan(0.7)
  })

  it('returns history_informed when sample_size between 3 and 9', () => {
    const result = computeConfidence(0.6, { sample_size: 5, win_rate: 0.7, median_lift_percent: 8 })
    expect(result.dataSource).toBe('history_informed')
  })

  it('clamps final to [0.05, 0.99]', () => {
    const high = computeConfidence(0.99, { sample_size: 100, win_rate: 1.0, median_lift_percent: 50 })
    expect(high.final).toBeLessThanOrEqual(0.99)

    const low = computeConfidence(0.01, { sample_size: 100, win_rate: 0.0, median_lift_percent: -50 })
    expect(low.final).toBeGreaterThanOrEqual(0.05)
  })
})
