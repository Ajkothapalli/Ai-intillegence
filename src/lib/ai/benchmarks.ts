import { createServerClient } from '@/lib/supabase/server'

export type BenchmarkResult = {
  hypothesis_type: string
  median_lift_percent: number
  win_rate: number
  sample_size: number
  p95_lift: number
  p05_lift: number
}

const HYPOTHESIS_KEYWORDS: Record<string, string[]> = {
  copy:             ['copy', 'headline', 'cta', 'text', 'message', 'wording', 'label', 'button text'],
  layout:           ['layout', 'visual', 'design', 'position', 'placement', 'above the fold', 'hierarchy'],
  flow:             ['flow', 'step', 'sequence', 'onboarding', 'checkout flow', 'wizard', 'funnel'],
  incentive:        ['discount', 'reward', 'offer', 'price', 'incentive', 'free', 'trial', 'coupon'],
  social_proof:     ['review', 'testimonial', 'trust', 'rating', 'social proof', 'logo', 'badge'],
  friction_removal: ['simplify', 'reduce', 'remove', 'barrier', 'friction', 'fewer fields', 'streamline'],
}

export function inferHypothesisType(hypothesis: string): string {
  const lower = hypothesis.toLowerCase()
  let bestType = 'copy'
  let bestScore = 0
  for (const [type, keywords] of Object.entries(HYPOTHESIS_KEYWORDS)) {
    const score = keywords.filter(kw => lower.includes(kw)).length
    if (score > bestScore) { bestScore = score; bestType = type }
  }
  return bestType
}

export async function getBenchmarksForAnalysis(
  hypothesisType: string,
  industryCategory?: string,
): Promise<BenchmarkResult | null> {
  const supabase = await createServerClient()

  // Try exact match with industry
  if (industryCategory) {
    const { data } = await supabase
      .from('experiment_benchmarks')
      .select('hypothesis_type, median_lift_percent, win_rate, sample_size, p95_lift, p05_lift')
      .eq('hypothesis_type', hypothesisType)
      .eq('industry_category', industryCategory)
      .is('user_id', null)
      .single()

    if (data?.median_lift_percent != null) {
      return {
        hypothesis_type: hypothesisType,
        median_lift_percent: Number(data.median_lift_percent),
        win_rate: Number(data.win_rate),
        sample_size: Number(data.sample_size),
        p95_lift: Number(data.p95_lift ?? 0),
        p05_lift: Number(data.p05_lift ?? 0),
      }
    }
  }

  // Fall back: hypothesis_type only, average across industries
  const { data: rows } = await supabase
    .from('experiment_benchmarks')
    .select('median_lift_percent, win_rate, sample_size, p95_lift, p05_lift')
    .eq('hypothesis_type', hypothesisType)
    .is('user_id', null)

  if (!rows || rows.length === 0) return null

  const avg = (vals: number[]) => vals.reduce((a, b) => a + b, 0) / vals.length
  return {
    hypothesis_type: hypothesisType,
    median_lift_percent: avg(rows.map(r => Number(r.median_lift_percent ?? 0))),
    win_rate: avg(rows.map(r => Number(r.win_rate ?? 0))),
    sample_size: Math.round(avg(rows.map(r => Number(r.sample_size ?? 0)))),
    p95_lift: avg(rows.map(r => Number(r.p95_lift ?? 0))),
    p05_lift: avg(rows.map(r => Number(r.p05_lift ?? 0))),
  }
}

export function buildBenchmarkContextBlock(
  benchmarks: Map<string, BenchmarkResult>,
): string {
  if (benchmarks.size === 0) return ''
  const lines = ['## Experiment Benchmark Data', 'Historical win rates and lift data for each experiment type (use to calibrate confidence scores):']
  for (const [type, b] of benchmarks) {
    lines.push(`- ${type}: median lift ${b.median_lift_percent.toFixed(1)}%, win rate ${Math.round(b.win_rate * 100)}%, based on ${b.sample_size} experiments (p5: ${b.p05_lift.toFixed(1)}%, p95: ${b.p95_lift.toFixed(1)}%)`)
  }
  return lines.join('\n')
}
