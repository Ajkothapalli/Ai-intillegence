'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type NotificationType = 'analysis_complete' | 'analysis_failed' | 'schedule_ran' | 'share_link_viewed'

export type Notification = {
  id: string
  project_id: string | null
  type: NotificationType
  title: string
  body: string | null
  read: boolean
  created_at: string
}

export async function getNotifications(): Promise<Notification[]> {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('notifications')
    .select('id, project_id, type, title, body, read, created_at')
    .order('created_at', { ascending: false })
    .limit(50)
  return (data ?? []) as Notification[]
}

export async function markNotificationRead(id: string): Promise<void> {
  const supabase = await createServerClient()
  await supabase.from('notifications').update({ read: true }).eq('id', id)
  revalidatePath('/notifications')
}

export async function markAllRead(): Promise<void> {
  const supabase = await createServerClient()
  await supabase.from('notifications').update({ read: true }).eq('read', false)
  revalidatePath('/notifications')
}

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  body?: string,
  projectId?: string,
): Promise<void> {
  const supabase = await createServerClient()
  await supabase.from('notifications').insert({
    user_id: userId,
    type,
    title,
    body: body ?? null,
    project_id: projectId ?? null,
  })
}
