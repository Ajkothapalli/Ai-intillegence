import { createServerClient } from '@/lib/supabase/server'
import { getAnalysisWithRecommendations } from '@/features/analysis/queries'
import { generateRecommendationsCSV } from '@/lib/export/recommendationsCSV'
import type { NextRequest } from 'next/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ analysisId: string }> },
) {
  const { analysisId } = await params

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const result = await getAnalysisWithRecommendations(analysisId)
  if (!result) return new Response('Not found', { status: 404 })

  const csv = generateRecommendationsCSV(result.recommendations)
  const date = (result.analysis.completed_at ?? result.analysis.created_at).slice(0, 10)

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="recommendations-${date}.csv"`,
    },
  })
}
