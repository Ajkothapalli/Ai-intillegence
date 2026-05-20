'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Notification } from '../actions'
import { markNotificationRead, markAllRead } from '../actions'

interface Props {
  notifications: Notification[]
}

const TYPE_ICON: Record<string, string> = {
  analysis_complete:  '✓',
  analysis_failed:    '✕',
  schedule_ran:       '↺',
  share_link_viewed:  '◎',
}

export function NotificationBell({ notifications }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [marking, startMark] = useTransition()

  const unread = notifications.filter(n => !n.read).length

  function handleMarkAll() {
    startMark(async () => {
      await markAllRead()
      router.refresh()
    })
  }

  function handleRead(id: string) {
    startMark(async () => {
      await markNotificationRead(id)
      router.refresh()
    })
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`Notifications${unread > 0 ? ` — ${unread} unread` : ''}`}
        onClick={() => setOpen(v => !v)}
        className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-violet-400 focus:outline-none"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M9 2a5 5 0 00-5 5v3l-1.5 2.5h13L14 10V7a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
          <path d="M7.5 14.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-violet-600 text-[9px] font-bold text-white flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute right-0 top-10 z-40 w-80 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
              <div className="flex items-center gap-2">
                {unread > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAll}
                    disabled={marking}
                    className="text-xs text-violet-600 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
                <Link href="/notifications" className="text-xs text-slate-400 hover:text-slate-600" onClick={() => setOpen(false)}>
                  See all
                </Link>
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-xs text-slate-400 text-center">No notifications yet.</p>
              ) : (
                notifications.slice(0, 10).map(n => (
                  <div
                    key={n.id}
                    className={`flex gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${n.read ? 'opacity-60' : ''}`}
                  >
                    <span className="shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[11px] font-bold mt-0.5">
                      {TYPE_ICON[n.type] ?? '•'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{n.title}</p>
                      {n.body && <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.body}</p>}
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    {!n.read && (
                      <button
                        type="button"
                        onClick={() => handleRead(n.id)}
                        className="shrink-0 w-2 h-2 rounded-full bg-violet-500 mt-1.5 hover:bg-violet-700 transition-colors"
                        aria-label="Mark as read"
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
