import { notFound } from 'next/navigation'
import { getProject } from '@/features/projects/queries'
import { getSegmentsByProject } from '@/features/segments/queries'
import { getIntegrationsByProject } from '@/features/integrations/queries'
import { SegmentsClient } from './SegmentsClient'

type Props = { params: Promise<{ id: string }> }

export default async function SegmentsPage({ params }: Props) {
  const { id } = await params
  const [project, segments, integrations] = await Promise.all([
    getProject(id),
    getSegmentsByProject(id),
    getIntegrationsByProject(id),
  ])
  if (!project) notFound()

  return <SegmentsClient projectId={id} initialSegments={segments} integrations={integrations} />
}
