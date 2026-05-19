import { notFound } from 'next/navigation'
import { getProject } from '@/features/projects/queries'
import { SettingsForm } from './settings-form'

type Props = { params: Promise<{ id: string }> }

export default async function SettingsPage({ params }: Props) {
  const { id } = await params
  const project = await getProject(id)
  if (!project) notFound()
  return <SettingsForm project={project} />
}
