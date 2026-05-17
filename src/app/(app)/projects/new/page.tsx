'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { createProject } from '@/features/projects/actions'
import { createProjectSchema, type CreateProjectInput } from '@/features/projects/schema'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'

export default function NewProjectPage() {
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
  })

  async function onSubmit(data: CreateProjectInput) {
    setServerError(null)
    const result = await createProject(data)
    if (!result.success) setServerError(result.error)
    // on success the server action calls redirect() — navigation happens automatically
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-8 py-4">
        <Link href="/dashboard" className="text-sm text-[var(--foreground-muted)] hover:text-foreground transition-colors">
          ← Back to dashboard
        </Link>
      </header>

      <div className="max-w-2xl mx-auto px-8 py-10">
        <h1 className="text-2xl font-bold text-foreground mb-2">New project</h1>
        <p className="text-sm text-[var(--foreground-muted)] mb-8">
          Tell us about your product so the AI can generate relevant experiment hypotheses.
        </p>

        {serverError && (
          <div className="mb-6">
            <Alert variant="destructive">{serverError}</Alert>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-8 space-y-6"
        >
          {/* Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-sm font-medium text-foreground">
              Project name <span className="text-destructive">*</span>
            </label>
            <Input
              id="name"
              type="text"
              placeholder="e.g. Checkout funnel Q3"
              error={!!errors.name}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="description" className="block text-sm font-medium text-foreground">
              Description
            </label>
            <Textarea
              id="description"
              rows={3}
              placeholder="What are you trying to improve?"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* App URL */}
          <div className="space-y-1.5">
            <label htmlFor="app_url" className="block text-sm font-medium text-foreground">
              App / product URL
            </label>
            <Input
              id="app_url"
              type="url"
              placeholder="https://myapp.com"
              error={!!errors.app_url}
              {...register('app_url')}
            />
            {errors.app_url && (
              <p className="text-xs text-destructive">{errors.app_url.message}</p>
            )}
          </div>

          {/* Target audience */}
          <div className="space-y-1.5">
            <label htmlFor="target_audience" className="block text-sm font-medium text-foreground">
              Target audience
            </label>
            <Input
              id="target_audience"
              type="text"
              placeholder="e.g. Mobile users aged 25–40 in the US"
              {...register('target_audience')}
            />
          </div>

          {/* Funnel stages */}
          <div className="space-y-1.5">
            <label htmlFor="funnel_stages" className="block text-sm font-medium text-foreground">
              Funnel stages
            </label>
            <Input
              id="funnel_stages"
              type="text"
              placeholder="e.g. Awareness, Signup, Activation, Retention"
              {...register('funnel_stages')}
            />
            <p className="text-xs text-[var(--foreground-subtle)]">Comma-separated list of your funnel stages</p>
          </div>

          {/* Primary metric */}
          <div className="space-y-1.5">
            <label htmlFor="primary_metric" className="block text-sm font-medium text-foreground">
              Primary metric
            </label>
            <Input
              id="primary_metric"
              type="text"
              placeholder="e.g. 7-day retention rate, checkout conversion"
              {...register('primary_metric')}
            />
          </div>

          {/* Business goal */}
          <div className="space-y-1.5">
            <label htmlFor="business_goal" className="block text-sm font-medium text-foreground">
              Business goal
            </label>
            <Textarea
              id="business_goal"
              rows={2}
              placeholder="e.g. Increase MRR by 15% by improving activation in the onboarding flow"
              {...register('business_goal')}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating…' : 'Create project'}
            </Button>
            <Link href="/dashboard" className="text-sm text-[var(--foreground-muted)] hover:text-foreground transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}
