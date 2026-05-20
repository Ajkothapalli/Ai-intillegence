import type { DbRecommendation } from '@/features/analysis/types'

function csvEscape(val: string | number | null | undefined): string {
  const s = String(val ?? '')
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export function generateRecommendationsCSV(recommendations: DbRecommendation[]): string {
  const headers = [
    'priority',
    'hypothesis',
    'experiment_type',
    'confidence',
    'estimated_reach',
    'target_segments',
    'evidence',
    'rationale',
    'created_at',
  ]

  const rows = recommendations.map(rec => [
    rec.priority,
    rec.hypothesis,
    rec.experiment_type,
    Math.round(rec.confidence * 100) + '%',
    rec.estimated_reach ?? '',
    rec.target_segments?.map(s => s.segment_name).join(' | ') ?? '',
    rec.evidence.join(' | '),
    rec.rationale ?? '',
    rec.created_at,
  ].map(csvEscape).join(','))

  return [headers.join(','), ...rows].join('\n')
}
