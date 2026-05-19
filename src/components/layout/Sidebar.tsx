'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { signOut } from '@/features/auth/actions'
import { IllustratedAvatar } from '@/components/ui/illustrated-avatar'

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconGrid() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false">
      <rect x="2" y="2" width="6" height="6" rx="1.5" fill="currentColor" />
      <rect x="10" y="2" width="6" height="6" rx="1.5" fill="currentColor" />
      <rect x="2" y="10" width="6" height="6" rx="1.5" fill="currentColor" />
      <rect x="10" y="10" width="6" height="6" rx="1.5" fill="currentColor" />
    </svg>
  )
}

function IconBeaker() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false">
      <path d="M6.5 2v5.5L2.5 14a1 1 0 00.9 1.5h11.2a1 1 0 00.9-1.5L11.5 7.5V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 2h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="6.5" cy="12" r="1" fill="currentColor" />
      <circle cx="10" cy="13.5" r="0.75" fill="currentColor" />
    </svg>
  )
}

function IconPlug() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false">
      <path d="M6 2v4M12 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="4" y="6" width="10" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 11v3M7 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconGear() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false">
      <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.58 3.58l1.42 1.42M13 13l1.42 1.42M3.58 14.42L5 13M13 5l1.42-1.42"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconSignOut() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M14 8H6"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconUser() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.5 13.5C2.5 11 5 9 8 9s5.5 2 5.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function IconChevronsLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M11 12L7 8l4-4M7 12L3 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconMenu() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false">
      <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconClose() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconLogo() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M2 8h3M8 2v12M11 5l3 3-3 3" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Nav config ────────────────────────────────────────────────────────────────

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  isActive: (p: string) => boolean
}

const NAV: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <IconGrid />,
    isActive: p => p === '/dashboard',
  },
  {
    href: '/experiments',
    label: 'Experiments',
    icon: <IconBeaker />,
    isActive: p => p === '/experiments' || p.startsWith('/experiments/') || p.startsWith('/projects/'),
  },
  {
    href: '/integrations',
    label: 'Integrations',
    icon: <IconPlug />,
    isActive: p => p === '/integrations' || p.startsWith('/integrations/'),
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: <IconGear />,
    isActive: p => p === '/settings' || p.startsWith('/settings/'),
  },
]

// ── Shared nav list (used in both desktop pill & mobile drawer) ───────────────

function NavList({
  collapsed,
  pathname,
}: {
  collapsed: boolean
  pathname: string
}) {
  return (
    <ul className="flex-1 p-2 space-y-1 overflow-y-auto" role="list">
      {NAV.map(item => {
        const active = item.isActive(pathname)
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 h-10 rounded-xl text-sm font-medium',
                'transition-colors duration-100',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40 focus-visible:ring-offset-1',
                collapsed ? 'justify-center px-0' : 'px-3',
                active
                  ? 'bg-primary text-white shadow-[0_1px_6px_rgba(25,98,98,0.35)]'
                  : 'text-[var(--foreground-muted)] hover:bg-[var(--primary)]/8 hover:text-foreground',
              )}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

// ── Profile popover menu ──────────────────────────────────────────────────────

function ProfilePopover({
  userEmail,
  userName,
  open,
  onClose,
}: {
  userEmail: string
  userName?: string
  open: boolean
  onClose: () => void
}) {
  const displayName = userName || userEmail.split('@')[0]

  if (!open) return null

  return (
    <div
      className="absolute bottom-full left-0 right-0 mb-2 mx-2 z-50 bg-white rounded-xl border border-[var(--border)] shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden"
      role="menu"
      aria-label="Profile menu"
    >
      {/* User info header */}
      <div className="px-3 py-3 border-b border-[var(--border)] bg-[var(--forest-50)]/40">
        <p className="text-xs font-semibold text-foreground truncate">{displayName}</p>
        <p className="text-[10px] text-[var(--foreground-subtle)] truncate mt-0.5">{userEmail}</p>
      </div>

      {/* Menu items */}
      <div className="p-1">
        <Link
          href="/profile"
          onClick={onClose}
          role="menuitem"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--foreground-muted)] hover:bg-[var(--forest-50)] hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/30"
        >
          <IconUser />
          <span>Profile</span>
        </Link>
      </div>

      {/* Divider + sign out */}
      <div className="border-t border-[var(--border)] p-1">
        <form action={signOut}>
          <button
            type="submit"
            role="menuitem"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--foreground-muted)] hover:bg-red-50 hover:text-red-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/30"
          >
            <IconSignOut />
            <span>Sign out</span>
          </button>
        </form>
      </div>
    </div>
  )
}

// ── User footer (used in both desktop pill & mobile drawer) ───────────────────

function UserFooter({
  collapsed,
  userEmail,
  userName,
}: {
  collapsed: boolean
  userEmail: string
  userName?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const displayName = userName || userEmail.split('@')[0]

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  if (collapsed) {
    return (
      <div ref={ref} className="relative flex flex-col items-center p-2 border-t border-black/5">
        <ProfilePopover userEmail={userEmail} userName={userName} open={open} onClose={() => setOpen(false)} />
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-label={`${displayName} — Open profile menu`}
          aria-expanded={open}
          aria-haspopup="menu"
          className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40 focus-visible:ring-offset-1 transition-transform hover:scale-105"
        >
          <IllustratedAvatar seed={userEmail} size={34} />
        </button>
      </div>
    )
  }

  return (
    <div ref={ref} className="relative p-3 border-t border-black/5">
      <ProfilePopover userEmail={userEmail} userName={userName} open={open} onClose={() => setOpen(false)} />
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label="Open profile menu"
        aria-expanded={open}
        aria-haspopup="menu"
        className="w-full flex items-center gap-2.5 rounded-xl p-1.5 -mx-1.5 hover:bg-black/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/30 group text-left"
      >
        <IllustratedAvatar seed={userEmail} size={36} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground truncate group-hover:text-[var(--primary)] transition-colors">
            {displayName}
          </p>
          <p className="text-[10px] text-[var(--foreground-subtle)] truncate mt-0.5">{userEmail}</p>
        </div>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          aria-hidden="true"
          className={cn('shrink-0 text-[var(--foreground-subtle)] transition-transform duration-150', open ? 'rotate-180' : '')}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}

// ── Sidebar component ─────────────────────────────────────────────────────────

interface Props {
  userEmail: string
  userName?: string
}

export function Sidebar({ userEmail, userName }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMobileOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      {/* ── Mobile backdrop ──────────────────────────────────────── */}
      <div
        className={cn(
          'fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-200',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ── Mobile floating drawer ────────────────────────────────── */}
      {/* Matches the pill style — appears as a floating card from the left */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className={cn(
          'fixed z-50 lg:hidden',
          'top-3 bottom-3 left-3 w-64',
          'flex flex-col rounded-2xl overflow-hidden',
          'bg-[var(--forest-50)] shadow-[0_8px_40px_rgba(0,0,0,0.18)]',
          'transition-transform duration-250 ease-[cubic-bezier(0.32,0.72,0,1)]',
          mobileOpen ? 'translate-x-0' : '-translate-x-[calc(100%+12px)]',
        )}
      >
        {/* Mobile drawer brand */}
        <div className="flex items-center gap-2.5 px-4 h-16 border-b border-black/5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-[var(--shadow-sm)]">
            <IconLogo />
          </div>
          <span className="text-sm font-semibold text-foreground tracking-tight flex-1">
            Experiment Intelligence
          </span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-[var(--foreground-muted)] hover:bg-black/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/30"
          >
            <IconClose />
          </button>
        </div>

        <NavList collapsed={false} pathname={pathname} />
        <UserFooter collapsed={false} userEmail={userEmail} userName={userName} />
      </div>

      {/* ── Mobile top bar ────────────────────────────────────────── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 z-30 flex items-center gap-3 px-4 bg-white/80 backdrop-blur-md border-b border-black/5">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={mobileOpen}
          aria-controls="main-sidebar"
          className="flex items-center justify-center w-9 h-9 rounded-xl text-[var(--foreground-muted)] hover:bg-[var(--forest-50)] hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/30"
        >
          <IconMenu />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-[var(--shadow-sm)]">
            <IconLogo />
          </div>
          <span className="text-sm font-semibold text-foreground tracking-tight">
            Experiment Intelligence
          </span>
        </div>
      </header>

      {/* ── Desktop pill sidebar ──────────────────────────────────── */}
      {/* Rounded on ALL sides — floats inside the padded shell */}
      <nav
        id="main-sidebar"
        aria-label="Main navigation"
        className={cn(
          'hidden lg:flex flex-col shrink-0 overflow-hidden',
          'bg-[var(--forest-50)]',
          'transition-[width,border-radius] duration-200 ease-in-out will-change-[width]',
          collapsed ? 'w-[68px] rounded-full' : 'w-56 rounded-2xl',
        )}
      >
        {/* Brand */}
        <div className={cn(
          'flex items-center gap-2.5 h-16 shrink-0 border-b border-black/5 overflow-hidden',
          collapsed ? 'justify-center px-0' : 'px-4',
        )}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-[var(--shadow-sm)]">
            <IconLogo />
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold text-foreground tracking-tight whitespace-nowrap">
              Experiment Intelligence
            </span>
          )}
        </div>

        {/* Nav */}
        <NavList collapsed={collapsed} pathname={pathname} />

        {/* Collapse toggle */}
        <div className={cn(
          'flex items-center border-t border-black/5 p-2',
          collapsed ? 'justify-center' : 'justify-end',
        )}>
          <button
            type="button"
            onClick={() => setCollapsed(c => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-[var(--foreground-subtle)] hover:bg-[var(--primary)]/8 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/30"
          >
            <span className={cn('transition-transform duration-200', collapsed ? 'rotate-180' : '')}>
              <IconChevronsLeft />
            </span>
          </button>
        </div>

        {/* User */}
        <UserFooter collapsed={collapsed} userEmail={userEmail} userName={userName} />
      </nav>
    </>
  )
}
