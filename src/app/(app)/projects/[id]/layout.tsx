import { createServerClient } from '@/lib/supabase/server'

type Props = {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export default async function ProjectLayout({ children, params }: Props) {
  const { id } = await params
  const supabase = await createServerClient()

  // Count active share links for this project
  const { count } = await supabase
    .from('share_links')
    .select('id', { count: 'exact', head: true })
    .eq('recommendations.project_id', id)
    .gt('expires_at', new Date().toISOString())

  const activeCount = count ?? 0

  return (
    <div className="relative">
      {activeCount > 0 && (
        <div className="absolute top-4 right-20 z-20 pointer-events-none hidden lg:block">
          <a
            href={`/projects/${id}/share-links`}
            className="pointer-events-auto inline-flex items-center gap-1.5 text-[10px] font-semibold bg-violet-600 text-white px-2.5 py-1 rounded-full shadow-sm hover:bg-violet-700 transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M9 2a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM3 4.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM9 7.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M4.5 5.5l3-1.5M4.5 7.5l3 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            {activeCount} share {activeCount === 1 ? 'link' : 'links'}
          </a>
        </div>
      )}
      {children}
    </div>
  )
}
