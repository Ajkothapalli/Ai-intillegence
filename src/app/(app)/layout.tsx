import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Toaster } from 'sonner'
import { Suspense } from 'react'
import { createServerClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'
import { NotificationBell } from '@/features/notifications/components/NotificationBell'
import { getNotifications } from '@/features/notifications/actions'
import { SpotlightController } from '@/features/onboarding/components/SpotlightController'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const email    = user.email ?? ''
  const userName = user.user_metadata?.full_name as string | undefined
  const notifications = await getNotifications()

  return (
    <div className="h-screen w-full flex overflow-hidden bg-slate-100">

      <Sidebar userEmail={email} userName={userName} />

      {/*
       * Main area: takes ALL remaining width after the sidebar.
       * flex-1 min-w-0 prevents shrinking below available space.
       */}
      <div className="flex flex-col flex-1 min-w-0 h-full">

        {/* Top bar — full width of remaining space, desktop only */}
        <div className="hidden lg:flex items-center justify-end gap-2 h-14 px-6 xl:px-8 bg-white/95 backdrop-blur-sm border-b border-[var(--border)] flex-shrink-0 sticky top-0 z-20">
          <NotificationBell notifications={notifications} />
          <Link
            href="/projects/new"
            data-spotlight-target="new-experiment"
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-sm)] transition-all hover:bg-[var(--primary-hover)] hover:-translate-y-px active:translate-y-0"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <path d="M6.5 1.5v10M1.5 6.5h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            New experiment
          </Link>
        </div>

        {/* Mobile top bar content (notification + CTA) — sits below Sidebar's fixed mobile bar */}
        <div className="lg:hidden flex items-center justify-end gap-2 h-10 px-4 bg-white border-b border-[var(--border)] flex-shrink-0 sticky top-14 z-20">
          <NotificationBell notifications={notifications} />
          <Link
            href="/projects/new"
            data-spotlight-target="new-experiment"
            className="inline-flex h-7 items-center gap-1 rounded-full bg-primary px-3 text-xs font-semibold text-primary-foreground transition-all hover:bg-[var(--primary-hover)]"
          >
            <svg width="11" height="11" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <path d="M6.5 1.5v10M1.5 6.5h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            New
          </Link>
        </div>

        {/* Scrollable page content */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 min-h-0 overflow-y-auto focus-visible:outline-none bg-white pt-14 lg:pt-0"
        >
          {children}
        </main>

      </div>

      <Suspense fallback={null}>
        <SpotlightController />
      </Suspense>

      <Toaster position="bottom-right" richColors />
    </div>
  )
}
