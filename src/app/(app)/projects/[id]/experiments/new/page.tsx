import { notFound } from 'next/navigation'
import { getProject } from '@/features/projects/queries'
import { getExperimentAutofill } from '@/lib/experiments/autofill'
import { getSegmentsByProject } from '@/features/segments/queries'
import { ExperimentWizard } from './ExperimentWizard'

type Props = { params: Promise<{ id: string }> }

export default async function NewExperimentPage({ params }: Props) {
  const { id } = await params
  const [project, autofill, segments] = await Promise.all([
    getProject(id),
    getExperimentAutofill(id),
    getSegmentsByProject(id),
  ])
  if (!project) notFound()

  return (
    <div className="min-h-screen bg-[var(--forest-50)]">
      <ExperimentWizard
        projectId={id}
        projectName={project.name}
        autofill={autofill}
        segments={segments}
      />
    </div>
  )
}
