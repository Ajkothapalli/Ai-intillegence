import Link from 'next/link'
import { getNotifications, markAllRead } from '@/features/notifications/actions'

const TYPE_LABEL: Record<string, string> = {
  analysis_complete:  'Analysis complete',
  analysis_failed:    'Analysis failed',
  schedule_ran:       'Scheduled analysis ran',
  share_link_viewed:  'Share link viewed',
}

export default async function NotificationsPage() {
  const notifications = await getNotifications()
  const unread = notifications.filter(n => !n.read).length

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-8 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-sm text-[var(--foreground-muted)] hover:text-foreground transition-colors">
          ← Dashboard
        </Link>
        {unread > 0 && (
          <form action={markAllRead}>
            <button type="submit" className="text-xs text-violet-600 font-medium hover:underline">
              Mark all read
            </button>
          </form>
        )}
      </header>

      <div className="max-w-2xl mx-auto px-8 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            {notifications.length === 0 ? 'No notifications yet.' : `${notifications.length} notification${notifications.length === 1 ? '' : 's'}`}
          </p>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12 text-sm text-slate-400">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mx-auto mb-3 text-slate-200" aria-hidden="true">
              <path d="M20 6a12 12 0 00-12 12v7L5 29h30l-3-4V18A12 12 0 0020 6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M17 33a3 3 0 006 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            You&apos;re all caught up.
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map(n => (
              <div
                key={n.id}
                className={`bg-white rounded-xl border px-5 py-4 space-y-1 ${n.read ? 'border-slate-100 opacity-70' : 'border-slate-200'}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                  <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                    {TYPE_LABEL[n.type] ?? n.type}
                  </span>
                </div>
                {n.body && <p className="text-sm text-slate-500">{n.body}</p>}
                <div className="flex items-center justify-between pt-0.5">
                  <p className="text-xs text-slate-400">
                    {new Date(n.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {n.project_id && (
                    <Link href={`/projects/${n.project_id}`} className="text-xs text-violet-600 hover:underline">
                      View project →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
