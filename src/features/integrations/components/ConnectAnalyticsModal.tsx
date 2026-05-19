'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { platformCredentialSchemas } from '../schema'
import { createIntegration, validateIntegrationCredentials } from '../actions'
import type { Platform } from '../types'

type Props = {
  platform: Platform
  projectId: string
  platformName: string
  onClose: () => void
  onSuccess: () => void
}

const FIELD_HELP: Record<string, Record<string, string>> = {
  mixpanel: {
    project_id: 'Found in Mixpanel → Settings → Project Settings → Project ID',
    service_account_username: 'Create a service account in Mixpanel → Organization Settings → Service Accounts',
    service_account_secret: 'The secret generated when you created the service account',
  },
  amplitude: {
    api_key: 'Found in Amplitude → Settings → Projects → select project → API Key',
    secret_key: 'Found in Amplitude → Settings → Projects → select project → Secret Key',
  },
  ga4: {
    property_id: 'Found in Google Analytics → Admin → Property Settings → Property ID (numeric)',
    api_secret: 'Create an OAuth2 access token or API secret in Google Cloud Console',
  },
  posthog: {
    api_key: 'Found in PostHog → Settings → Project → Personal API Key',
    project_id: 'Found in PostHog → Settings → Project → Project ID',
    host: 'Your PostHog instance URL (default: https://app.posthog.com)',
  },
  heap: {
    app_id: 'Found in Heap → Account → Manage → Projects → App ID',
    api_key: 'Found in Heap → Account → Manage → API Keys',
  },
  segment: {
    workspace_slug: 'Your Segment workspace slug (from the URL: app.segment.com/YOUR_SLUG/)',
    access_token: 'Create an access token in Segment → Settings → Access Management → Tokens',
  },
  pendo: {
    integration_key: 'Found in Pendo → Settings → Integrations → Integration Keys',
  },
}

function getFieldsForPlatform(platform: Platform): string[] {
  const schema = platformCredentialSchemas[platform]
  const shape = (schema as { shape?: Record<string, unknown> }).shape
  if (!shape) return []
  return Object.keys(shape)
}

export function ConnectAnalyticsModal({ platform, projectId, platformName, onClose, onSuccess }: Props) {
  const [validating, setValidating] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null)

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<Record<string, string>>()

  const fields = getFieldsForPlatform(platform)
  const helpMap = FIELD_HELP[platform] ?? {}

  function validateWithSchema(values: Record<string, string>): string | null {
    const schema = platformCredentialSchemas[platform]
    const result = schema.safeParse(values)
    if (!result.success) return result.error.issues[0]?.message ?? 'Validation failed'
    return null
  }

  async function handleTest() {
    const values = getValues()
    const schemaError = validateWithSchema(values)
    if (schemaError) {
      setTestResult({ ok: false, message: schemaError })
      return
    }
    setValidating(true)
    setTestResult(null)
    const result = await validateIntegrationCredentials(platform, values)
    setValidating(false)
    if (result.success) {
      setTestResult({ ok: true, message: 'Connection successful!' })
    } else {
      setTestResult({ ok: false, message: result.error })
    }
  }

  async function onSubmit(data: Record<string, string>) {
    const schemaError = validateWithSchema(data)
    if (schemaError) {
      setTestResult({ ok: false, message: schemaError })
      return
    }
    setSubmitting(true)
    const result = await createIntegration(projectId, platform, data)
    setSubmitting(false)
    if (result.success) {
      onSuccess()
    } else {
      setTestResult({ ok: false, message: result.error })
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl border border-[var(--border)] shadow-xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Connect {platformName}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--foreground-muted)] hover:bg-gray-100 hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {fields.length === 0 ? (
          <p className="text-sm text-[var(--foreground-muted)]">
            This integration is file-based. Upload files from the project uploads page.
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {fields.map(field => {
              const label = field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
              const isSecret = field.toLowerCase().includes('secret') || field.toLowerCase().includes('key') || field.toLowerCase().includes('token')
              const fieldError = errors[field]
              return (
                <div key={field} className="space-y-1">
                  <label htmlFor={field} className="block text-xs font-semibold text-foreground">
                    {label}
                  </label>
                  <input
                    id={field}
                    type={isSecret ? 'password' : 'text'}
                    {...register(field)}
                    className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-foreground placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]"
                    placeholder={label}
                  />
                  {helpMap[field] && (
                    <p className="text-[11px] text-[var(--foreground-subtle)]">{helpMap[field]}</p>
                  )}
                  {fieldError?.message && (
                    <p className="text-[11px] text-red-500">{fieldError.message}</p>
                  )}
                </div>
              )
            })}

            {testResult && (
              <div className={`rounded-lg px-3 py-2 text-sm ${testResult.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                {testResult.message}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleTest}
                disabled={validating}
                className="flex-1 h-9 rounded-lg border border-[var(--border)] text-sm font-medium text-foreground hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {validating ? 'Testing...' : 'Test connection'}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 h-9 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50"
              >
                {submitting ? 'Connecting...' : 'Connect'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
