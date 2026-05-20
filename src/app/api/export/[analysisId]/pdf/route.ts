import { createServerClient } from '@/lib/supabase/server'
import { getAnalysisWithRecommendations } from '@/features/analysis/queries'
import { getProject } from '@/features/projects/queries'
import { renderToBuffer } from '@react-pdf/renderer'
import { RecommendationsPDF } from '@/lib/export/recommendationsPDF'
import { createElement } from 'react'
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

  const project = await getProject(result.analysis.project_id)
  const date = (result.analysis.completed_at ?? result.analysis.created_at).slice(0, 10)

  const element = createElement(RecommendationsPDF, {
    projectName: project?.name ?? 'Project',
    analysisDate: new Date(result.analysis.completed_at ?? result.analysis.created_at)
      .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    model: result.analysis.model,
    recommendations: result.recommendations,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(element as any)
  const uint8 = new Uint8Array(buffer)

  return new Response(uint8, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="recommendations-${date}.pdf"`,
    },
  })
}
