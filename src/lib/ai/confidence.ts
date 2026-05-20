interface BenchmarkData {
  sample_size: number
  win_rate: number
  median_lift_percent: number
}

export interface ConfidenceFactors {
  base: number
  historicalAdjustment: number
  final: number
  dataSource: 'prior_only' | 'history_informed' | 'history_dominant'
}

export function computeConfidence(
  baseConfidence: number,
  benchmark: BenchmarkData | null,
): ConfidenceFactors {
  if (!benchmark || benchmark.sample_size < 3) {
    return {
      base: baseConfidence,
      historicalAdjustment: 0,
      final: baseConfidence,
      dataSource: 'prior_only',
    }
  }

  // Weight historical data more as sample size grows (caps at 0.4 weight at n=20+)
  const historicalWeight = Math.min(benchmark.sample_size / 50, 0.4)
  // Positive win_rate > 0.5 boosts confidence; below 0.5 dampens it
  const winRateSignal = (benchmark.win_rate - 0.5) * 0.3
  const adjustment = winRateSignal * historicalWeight

  const final = Math.max(0.05, Math.min(0.99, baseConfidence + adjustment))
  const dataSource = benchmark.sample_size >= 10 ? 'history_dominant' : 'history_informed'

  return {
    base: baseConfidence,
    historicalAdjustment: adjustment,
    final,
    dataSource,
  }
}
