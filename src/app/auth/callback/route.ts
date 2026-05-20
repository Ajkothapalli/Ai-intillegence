import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createServerClient()
    await supabase.auth.exchangeCodeForSession(code)

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { count } = await supabase
        .from('projects')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)

      if ((count ?? 0) === 0) {
        const industry = (user.user_metadata?.industry as string | undefined) ?? 'saas_b2c'
        const { seedDemoProject } = await import('@/lib/demo/seedDemoProject')
        await seedDemoProject(supabase, user.id, industry)
        return NextResponse.redirect(new URL('/dashboard?onboarding=true', request.url))
      }
    }
  }

  return NextResponse.redirect(new URL(next, request.url))
}
