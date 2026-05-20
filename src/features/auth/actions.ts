'use server'

import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { signUpSchema, signInSchema, resetPasswordSchema, updatePasswordSchema, updateProfileSchema } from './schema'
import type { AuthActionResult, AuthField } from './types'
import { revalidatePath } from 'next/cache'

export type PasswordResetResult = { success: true } | { success: false; error: string }

export async function signUp(_prev: AuthActionResult | null, formData: FormData): Promise<AuthActionResult> {
  const raw = {
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const parsed = signUpSchema.safeParse(raw)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return { success: false, error: issue.message, field: (issue.path[0] as AuthField) ?? 'form' }
  }

  const industry = (formData.get('industry') as string | null) ?? 'saas_b2c'
  const industryCustom = (formData.get('industry_custom') as string | null) ?? ''

  const supabase = await createServerClient()
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { full_name: parsed.data.fullName, industry, industry_custom: industryCustom } },
  })

  if (error) {
    return { success: false, error: error.message, field: 'form' }
  }

  // No session — email verification required; callback route will seed demo
  if (!data.session) {
    redirect(`/verify-email?email=${encodeURIComponent(parsed.data.email)}`)
  }

  // Session returned immediately — seed demo project now
  if (data.user) {
    const { seedDemoProject } = await import('@/lib/demo/seedDemoProject')
    const { count } = await supabase.from('projects').select('id', { count: 'exact', head: true }).eq('user_id', data.user.id)
    if ((count ?? 0) === 0) {
      await seedDemoProject(supabase, data.user.id, industry)
    }
  }

  redirect('/dashboard?onboarding=true')
}

export async function signIn(_prev: AuthActionResult | null, formData: FormData): Promise<AuthActionResult> {
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const parsed = signInSchema.safeParse(raw)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return { success: false, error: issue.message, field: (issue.path[0] as AuthField) ?? 'form' }
  }

  const supabase = await createServerClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return { success: false, error: 'Incorrect email or password.', field: 'password' }
  }

  redirect('/dashboard')
}

export async function signOut(): Promise<void> {
  const supabase = await createServerClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function requestPasswordReset(
  _prev: PasswordResetResult | null,
  formData: FormData,
): Promise<PasswordResetResult> {
  const parsed = resetPasswordSchema.safeParse({ email: formData.get('email') })
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  const supabase = await createServerClient()
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function updatePassword(
  _prev: PasswordResetResult | null,
  formData: FormData,
): Promise<PasswordResetResult> {
  const parsed = updatePasswordSchema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No active session. Please use the link from your email.' }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password })
  if (error) return { success: false, error: error.message }

  redirect('/dashboard')
}

export async function updateProfile(
  _prev: PasswordResetResult | null,
  formData: FormData,
): Promise<PasswordResetResult> {
  const parsed = updateProfileSchema.safeParse({ full_name: formData.get('full_name') })
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase.auth.updateUser({ data: { full_name: parsed.data.full_name } })
  if (error) return { success: false, error: error.message }

  revalidatePath('/profile')
  return { success: true }
}
