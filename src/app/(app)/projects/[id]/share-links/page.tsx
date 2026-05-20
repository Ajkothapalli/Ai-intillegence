import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProject } from '@/features/projects/queries'
import { createServerClient } from '@/lib/supabase/server'
import { ShareLinksClient } from './ShareLinksClient'

type Props = { params: Promise<{ id: string }> }

type ShareLinkRow = {
  id: string
  token: string
  expires_at: string
  created_at: string
  recommendation: {
    id: string
    hypothesis: string
    priority: number
  } | null
}

export default async function ShareLinksPage({ params }: Props) {
  const { id } = await params
  const [project, supabase] = await Promise.all([getProject(id), createServerClient()])
  if (!project) notFound()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const { data: links } = await supabase
    .from('share_links')
    .select('id, token, expires_at, created_at, recommendations(id, hypothesis, priority)')
    .eq('recommendations.project_id', id)
    .order('created_at', { ascending: false })

  const rows: ShareLinkRow[] = (links ?? []).map((l) => ({
    id: l.id,
    token: l.token as string,
    expires_at: l.expires_at as string,
    created_at: l.created_at as string,
    recommendation: l.recommendations
      ? (l.recommendations as unknown as { id: string; hypothesis: string; priority: number })
      : null,
  })).filter(l => l.recommendation !== null)

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-8 py-4">
        <Link href={`/projects/${id}`} className="text-sm text-[var(--foreground-muted)] hover:text-foreground transition-colors">
          ← {project.name}
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-8 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Share Links</h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            Manage public links to individual recommendations. Revoking a link stops all access immediately.
          </p>
        </div>

        <ShareLinksClient links={rows} projectId={id} />
      </div>
    </main>
  )
}
