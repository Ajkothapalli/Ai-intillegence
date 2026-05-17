'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function firstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export interface DatePickerProps {
  value?: Date | null
  onChange?: (date: Date) => void
  placeholder?: string
  minDate?: Date
  maxDate?: Date
  className?: string
}

export function DatePicker({ value, onChange, placeholder = 'Pick a date', minDate, maxDate, className }: DatePickerProps) {
  const today = new Date()
  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState((value ?? today).getFullYear())
  const [viewMonth, setViewMonth] = useState((value ?? today).getMonth())
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  function selectDay(day: number) {
    onChange?.(new Date(viewYear, viewMonth, day))
    setOpen(false)
  }

  function jumpToday() {
    const d = today
    setViewMonth(d.getMonth())
    setViewYear(d.getFullYear())
    onChange?.(d)
    setOpen(false)
  }

  function isDisabled(day: number) {
    const d = new Date(viewYear, viewMonth, day)
    if (minDate && d < minDate) return true
    if (maxDate && d > maxDate) return true
    return false
  }

  function isToday(day: number) {
    return (
      today.getFullYear() === viewYear &&
      today.getMonth() === viewMonth &&
      today.getDate() === day
    )
  }

  function isSelected(day: number) {
    return !!(
      value &&
      value.getFullYear() === viewYear &&
      value.getMonth() === viewMonth &&
      value.getDate() === day
    )
  }

  const totalDays = daysInMonth(viewYear, viewMonth)
  const startPad  = firstDayOfMonth(viewYear, viewMonth)

  const label = value
    ? value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  return (
    <div ref={ref} className={cn('relative', className)}>
      {/* ── Trigger ── */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={cn(
          'flex h-9 w-full items-center gap-2 rounded-md border px-3 text-sm',
          'bg-white border-[var(--border)]',
          'transition-[border-color,background-color,box-shadow] duration-150 [transition-timing-function:var(--ease-default)]',
          'hover:bg-[var(--input-hover)] hover:border-[var(--border-strong)]',
          'focus-visible:outline-none focus-visible:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)]/12',
          'active:scale-[0.99] active:duration-[50ms]',
          open && 'border-[var(--primary)] ring-2 ring-[var(--primary)]/12 bg-[var(--forest-50)]',
          label ? 'text-foreground' : 'text-[var(--foreground-subtle)]'
        )}
      >
        {/* calendar icon */}
        <svg className="size-4 shrink-0 text-[var(--foreground-subtle)]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
          <rect x="2" y="3" width="12" height="11" rx="2"/>
          <path d="M5 1v3M11 1v3M2 7h12"/>
        </svg>
        <span className="flex-1 text-left">{label ?? placeholder}</span>
        {value && (
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onChange?.(undefined as unknown as Date) }}
            className="text-[var(--foreground-subtle)] hover:text-foreground transition-colors duration-100 leading-none"
          >
            ×
          </button>
        )}
      </button>

      {/* ── Calendar panel ── */}
      {open && (
        <div className={cn(
          'absolute z-50 mt-1.5 w-68 rounded-xl border border-[var(--border)]',
          'bg-white shadow-[var(--shadow-lg)] p-3',
          'motion-enter'
        )}>
          {/* Month nav */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={prevMonth}
              className="flex size-7 items-center justify-center rounded-lg text-[var(--foreground-subtle)] hover:bg-[var(--background-elevated)] hover:text-foreground transition-[background-color,color] duration-150 text-lg leading-none"
            >
              ‹
            </button>
            <span className="text-sm font-semibold text-foreground">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="flex size-7 items-center justify-center rounded-lg text-[var(--foreground-subtle)] hover:bg-[var(--background-elevated)] hover:text-foreground transition-[background-color,color] duration-150 text-lg leading-none"
            >
              ›
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS_SHORT.map(d => (
              <div key={d} className="flex items-center justify-center h-7 text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-subtle)]">
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7">
            {Array.from({ length: startPad }).map((_, i) => <div key={`pad-${i}`} />)}
            {Array.from({ length: totalDays }).map((_, i) => {
              const day = i + 1
              const disabled  = isDisabled(day)
              const todayDay  = isToday(day)
              const selected  = isSelected(day)
              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  onClick={() => selectDay(day)}
                  className={cn(
                    'flex size-8 items-center justify-center rounded-full text-sm mx-auto',
                    'transition-[background-color,color,transform] duration-150 [transition-timing-function:var(--ease-default)]',
                    'active:scale-[0.88] active:duration-[50ms]',
                    disabled  && 'opacity-25 cursor-not-allowed pointer-events-none',
                    selected  && 'bg-primary text-white font-semibold',
                    !selected && todayDay  && 'text-[var(--primary)] font-semibold ring-1 ring-[var(--primary)]/40',
                    !selected && !todayDay && !disabled && 'text-[var(--foreground-muted)] hover:bg-[var(--background-elevated)] hover:text-foreground',
                  )}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="mt-3 pt-2.5 border-t border-[var(--border)] flex items-center justify-between">
            <span className="text-xs text-[var(--foreground-subtle)]">
              {value ? value.toLocaleDateString('en-US', { weekday: 'long' }) : 'No date selected'}
            </span>
            <button
              type="button"
              onClick={jumpToday}
              className="text-xs text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors duration-150 font-medium"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
