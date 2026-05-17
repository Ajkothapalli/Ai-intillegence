'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOURS    = Array.from({ length: 24 }, (_, i) => i)
const MINUTES  = [0, 15, 30, 45]

export interface ScheduleValue {
  days:   number[]   /* 0=Mon … 6=Sun */
  hour:   number     /* 0–23 */
  minute: number     /* 0 | 15 | 30 | 45 */
}

export interface SchedulerProps {
  value?:    ScheduleValue
  onChange?: (value: ScheduleValue) => void
  label?:    string
  className?: string
}

const defaultSchedule: ScheduleValue = { days: [0], hour: 9, minute: 0 }

function fmt(h: number, m: number) {
  const period = h < 12 ? 'AM' : 'PM'
  const hour   = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

function ordinal(days: number[]) {
  if (days.length === 0) return 'No days selected'
  if (days.length === 7) return 'Every day'
  if (JSON.stringify(days) === JSON.stringify([0, 1, 2, 3, 4])) return 'Weekdays'
  if (JSON.stringify(days) === JSON.stringify([5, 6])) return 'Weekends'
  return days.map(d => WEEKDAYS[d]).join(', ')
}

export function Scheduler({ value = defaultSchedule, onChange, label = 'Schedule', className }: SchedulerProps) {
  const [hourRef, setHourRef] = useState<HTMLDivElement | null>(null)

  function toggleDay(i: number) {
    const days = value.days.includes(i)
      ? value.days.filter(d => d !== i)
      : [...value.days, i].sort((a, b) => a - b)
    onChange?.({ ...value, days })
  }

  function setHour(hour: number) {
    onChange?.({ ...value, hour })
    if (hourRef) {
      const btn = hourRef.querySelector(`[data-hour="${hour}"]`) as HTMLElement | null
      btn?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }

  function setMinute(minute: number) {
    onChange?.({ ...value, minute })
  }

  const summary = `${ordinal(value.days)} at ${fmt(value.hour, value.minute)}`

  return (
    <div className={cn('rounded-xl border border-[var(--border)] bg-white p-5 space-y-5 shadow-[var(--shadow-sm)]', className)}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="text-xs text-[var(--foreground-subtle)] mt-0.5">{summary}</p>
        </div>
        {/* Clock icon */}
        <svg className="size-4 text-[var(--foreground-subtle)] shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="8" cy="8" r="6"/>
          <path d="M8 5v3l2 2"/>
        </svg>
      </div>

      {/* ── Day selector ── */}
      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-subtle)]">Repeat on</p>
        <div className="flex gap-1">
          {WEEKDAYS.map((day, i) => {
            const active = value.days.includes(i)
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(i)}
                className={cn(
                  'flex-1 h-8 rounded-full text-[11px] font-semibold border',
                  'transition-[background-color,color,border-color,transform] duration-150 [transition-timing-function:var(--ease-default)]',
                  'active:scale-[0.90] active:duration-[50ms]',
                  active
                    ? 'bg-[var(--forest-50)] border-[var(--forest-300)] text-[var(--forest-700)]'
                    : 'bg-transparent border-[var(--border)] text-[var(--foreground-subtle)] hover:border-[var(--border-strong)] hover:text-foreground'
                )}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Time selector ── */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-subtle)]">Time</p>
          <p className="text-sm font-semibold text-[var(--primary)]">{fmt(value.hour, value.minute)}</p>
        </div>

        <div className="flex gap-2">
          {/* Hour scroll */}
          <div className="flex-1 space-y-1">
            <p className="text-[10px] text-[var(--foreground-subtle)] text-center">Hour</p>
            <div
              ref={setHourRef}
              className="h-40 overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--background-elevated)] divide-y divide-[var(--border-hairline)] scroll-smooth"
              style={{ scrollbarWidth: 'none' }}
            >
              {HOURS.map(h => (
                <button
                  key={h}
                  data-hour={h}
                  type="button"
                  onClick={() => setHour(h)}
                  className={cn(
                    'w-full py-1.5 text-sm text-center',
                    'transition-[background-color,color] duration-100',
                    value.hour === h
                      ? 'bg-primary text-white font-semibold sticky top-0 bottom-0 z-10'
                      : 'text-[var(--foreground-muted)] hover:bg-white hover:text-foreground'
                  )}
                >
                  {String(h).padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>

          {/* Separator */}
          <div className="flex items-center pt-6">
            <span className="text-xl font-bold text-[var(--foreground-subtle)]">:</span>
          </div>

          {/* Minute grid */}
          <div className="flex-1 space-y-1">
            <p className="text-[10px] text-[var(--foreground-subtle)] text-center">Minute</p>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--background-elevated)] divide-y divide-[var(--border-hairline)]">
              {MINUTES.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMinute(m)}
                  className={cn(
                    'w-full py-2.5 text-sm text-center',
                    'transition-[background-color,color,transform] duration-150 [transition-timing-function:var(--ease-default)]',
                    'active:scale-[0.96] active:duration-[50ms]',
                    value.minute === m
                      ? 'bg-primary text-white font-semibold'
                      : 'text-[var(--foreground-muted)] hover:bg-white hover:text-foreground'
                  )}
                >
                  :{String(m).padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
