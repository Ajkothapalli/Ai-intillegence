'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { updateProject, deleteProject } from '@/features/projects/actions'
import { createSchedule, deleteSchedule, updateSchedule } from '@/features/analysis/actions'
import { updateProjectSchema, type UpdateProjectInput } from '@/features/projects/schema'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import type { Project } from '@/features/projects/types'

type AnalysisSchedule = {
  id: string
  frequency: 'daily' | 'weekly' | 'monthly'
  enabled: boolean
  use_deep_model: boolean
  next_run_at: string
}

function ScheduleSection({ projectId, schedule }: { projectId: string; schedule: AnalysisSchedule | null }) {
  const router = useRouter()
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>(schedule?.frequency ?? 'weekly')
  const [deepModel, setDeepModel] = useState(schedule?.use_deep_model ?? false)
  const [saving, startSave] = useTransition()
  const [removing, startRemove] = useTransition()

  function handleSave() {
    startSave(async () => {
      const result = await createSchedule(projectId, frequency, deepModel)
      if (result.success) { toast.success('Schedule saved'); router.refresh() }
      else toast.error(result.error)
    })
  }

  function handleToggle(enabled: boolean) {
    startSave(async () => {
      const result = await updateSchedule(projectId, { enabled })
      if (result.success) router.refresh()
      else toast.error(result.error)
    })
  }

  function handleRemove() {
    startRemove(async () => {
      const result = await deleteSchedule(projectId)
      if (result.success) { toast.success('Schedule removed'); router.refresh() }
      else toast.error(result.error)
    })
  }

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] p-8 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-foreground">Scheduled re-analysis</h2>
        <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
          Automatically re-run AI analysis on a schedule using your latest uploads.
        </p>
      </div>

      {schedule ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-violet-50 border border-violet-200 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-violet-800 capitalize">{schedule.frequency} analysis</p>
              <p className="text-xs text-violet-600 mt-0.5">
                Next run: {new Date(schedule.next_run_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                {schedule.use_deep_model && ' · Deep model'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleToggle(!schedule.enabled)}
                disabled={saving}
                className={`h-7 px-3 rounded-full border text-xs font-semibold transition-colors ${schedule.enabled ? 'border-violet-300 text-violet-700 hover:bg-violet-100' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
              >
                {schedule.enabled ? 'Enabled' : 'Paused'}
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={removing}
                className="h-7 px-3 rounded-full border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2">
            {(['daily', 'weekly', 'monthly'] as const).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFrequency(f)}
                className={`flex-1 py-2 rounded-lg border text-xs font-semibold capitalize transition-colors ${frequency === f ? 'bg-violet-600 text-white border-violet-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={deepModel} onChange={e => setDeepModel(e.target.checked)} className="accent-violet-600" />
            <span className="text-sm text-slate-700">Use deep model (Opus — more thorough, slower)</span>
          </label>
          <Button type="button" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Enable schedule'}
          </Button>
        </div>
      )}
    </div>
  )
}

export function SettingsForm({ project, schedule }: { project: Project; schedule: AnalysisSchedule | null }) {
  const router = useRouter()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, startDelete] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProjectInput>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: project.name,
      description: project.description ?? '',
      app_url: project.app_url ?? '',
      target_audience: project.target_audience ?? '',
      funnel_stages: project.funnel_stages?.join(', ') ?? '',
      primary_metric: project.primary_metric ?? '',
      business_goal: project.business_goal ?? '',
    },
  })

  async function onSubmit(data: UpdateProjectInput) {
    const result = await updateProject(project.id, data)
    if (result.success) {
      toast.success('Project saved')
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  function handleDelete() {
    startDelete(async () => {
      const result = await deleteProject(project.id)
      if (!result.success) toast.error(result.error)
    })
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-8 py-4">
        <Link href={`/projects/${project.id}`} className="text-sm text-[var(--foreground-muted)] hover:text-foreground transition-colors">
          ← {project.name}
        </Link>
      </header>

      <div className="max-w-2xl mx-auto px-8 py-10 space-y-10">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Project settings</h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            Update project details used by the AI to generate recommendations.
          </p>
        </div>

        {/* ── Edit form ─────────────────────────────────────── */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-[var(--border)] p-8 space-y-6">
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-sm font-medium text-foreground">
              Project name <span className="text-destructive">*</span>
            </label>
            <Input id="name" type="text" error={!!errors.name} {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="description" className="block text-sm font-medium text-foreground">Description</label>
            <Textarea id="description" rows={3} {...register('description')} />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="app_url" className="block text-sm font-medium text-foreground">App / product URL</label>
            <Input id="app_url" type="url" error={!!errors.app_url} {...register('app_url')} />
            {errors.app_url && <p className="text-xs text-destructive">{errors.app_url.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="target_audience" className="block text-sm font-medium text-foreground">Target audience</label>
            <Input id="target_audience" type="text" {...register('target_audience')} />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="funnel_stages" className="block text-sm font-medium text-foreground">Funnel stages</label>
            <Input id="funnel_stages" type="text" placeholder="Awareness, Signup, Activation, Retention" {...register('funnel_stages')} />
            <p className="text-xs text-[var(--foreground-subtle)]">Comma-separated</p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="primary_metric" className="block text-sm font-medium text-foreground">Primary metric</label>
            <Input id="primary_metric" type="text" {...register('primary_metric')} />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="business_goal" className="block text-sm font-medium text-foreground">Business goal</label>
            <Textarea id="business_goal" rows={2} {...register('business_goal')} />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save changes'}
          </Button>
        </form>

        {/* ── Schedule ─────────────────────────────────────── */}
        <ScheduleSection projectId={project.id} schedule={schedule} />

        {/* ── Danger zone ───────────────────────────────────── */}
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-red-700">Danger zone</h2>
            <p className="text-xs text-red-600 mt-0.5">
              Permanently deletes this project, all uploads, analyses, and recommendations. This cannot be undone.
            </p>
          </div>

          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="inline-flex h-9 items-center rounded-full border border-red-300 bg-white px-4 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              Delete project
            </button>
          ) : (
            <div className="bg-white rounded-lg border border-red-200 p-4 space-y-3">
              <p className="text-sm font-semibold text-red-700">
                Are you sure? This will permanently delete <strong>{project.name}</strong> and all its data.
                This cannot be undone.
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex h-8 items-center rounded-full bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {deleting ? 'Deleting…' : 'Yes, delete project'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="text-sm text-[var(--foreground-muted)] hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
