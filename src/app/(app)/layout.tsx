import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Toaster } from 'sonner'
import { createServerClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const email    = user.email ?? ''
  const userName = user.user_metadata?.full_name as string | undefined

  return (
    /*
     * Shell: full-screen with padding on all sides so both the pill sidebar
     * and content box float inside the tinted background — matching the wireframe.
     */
    <div className="h-screen flex gap-3 p-3 overflow-hidden bg-[var(--forest-100)]">

      <Sidebar userEmail={email} userName={userName} />

      {/*
       * Content box: rounded on all sides with a primary-tinted border,
       * scrolls independently. Mobile: no rounding/border (full-screen feel)
       * with top offset for the fixed header.
       */}
      <main
        id="main-content"
        tabIndex={-1}
        className={[
          'flex-1 min-h-0 overflow-y-auto focus-visible:outline-none',
          'lg:rounded-2xl lg:border lg:border-[var(--primary)]/20 lg:bg-white',
          'bg-white pt-14 lg:pt-0',
        ].join(' ')}
      >
        {/* Persistent top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-end px-6 py-3 bg-white/90 backdrop-blur-sm border-b border-[var(--border)]">
          <Link
            href="/projects/new"
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-sm)] transition-all hover:bg-[var(--primary-hover)] hover:-translate-y-px active:translate-y-0"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <path d="M6.5 1.5v10M1.5 6.5h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            New experiment
          </Link>
        </div>

        {children}
      </main>

      <Toaster position="bottom-right" richColors />
    </div>
  )
}
