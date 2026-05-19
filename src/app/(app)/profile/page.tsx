import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { IllustratedAvatar } from '@/components/ui/illustrated-avatar'
import { ProfileNameEdit } from './profile-name-edit'

export default async function ProfilePage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const email    = user.email ?? ''
  const fullName = user.user_metadata?.full_name as string | undefined
  const displayName = fullName || email.split('@')[0]

  return (
    <div className="max-w-xl mx-auto px-6 lg:px-8 py-8">

      <h1 className="text-2xl font-bold text-foreground tracking-tight mb-8">Profile</h1>

      {/* Avatar card */}
      <div className="bg-white rounded-2xl border border-[var(--border)] p-6 flex items-center gap-5 mb-6">
        <IllustratedAvatar seed={email} size={80} />
        <div>
          <p className="text-lg font-bold text-foreground">{displayName}</p>
          <p className="text-sm text-[var(--foreground-muted)] mt-0.5">{email}</p>
          <p className="text-xs text-[var(--foreground-subtle)] mt-2">
            Member since {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl border border-[var(--border)] divide-y divide-[var(--border)]">
        <div className="px-5 py-4">
          <p className="text-xs font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider mb-1">Full name</p>
          <ProfileNameEdit initialName={fullName ?? ''} />
        </div>
        <div className="px-5 py-4">
          <p className="text-xs font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider mb-1">Email</p>
          <p className="text-sm text-foreground">{email}</p>
          <p className="text-[11px] text-[var(--foreground-subtle)] mt-0.5">Email cannot be changed here</p>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider mb-1">User ID</p>
          <p className="text-xs text-[var(--foreground-subtle)] font-mono">{user.id}</p>
        </div>
      </div>

    </div>
  )
}
