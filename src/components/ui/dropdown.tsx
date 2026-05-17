'use client'

import { useState, useRef, useEffect, useId } from 'react'
import { cn } from '@/lib/utils'

export interface DropdownOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface DropdownProps {
  options: DropdownOption[]
  value?: string | null
  onChange?: (value: string) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  error?: boolean
  className?: string
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  disabled,
  error,
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(o => !o) }
    if (e.key === 'Escape') setOpen(false)
    if (e.key === 'ArrowDown' && open) {
      e.preventDefault()
      const cur = options.findIndex(o => o.value === value)
      const next = options.slice(cur + 1).find(o => !o.disabled)
      if (next) onChange?.(next.value)
    }
    if (e.key === 'ArrowUp' && open) {
      e.preventDefault()
      const cur = options.findIndex(o => o.value === value)
      const prev = [...options.slice(0, cur)].reverse().find(o => !o.disabled)
      if (prev) onChange?.(prev.value)
    }
  }

  const selected = options.find(o => o.value === value)
  const isActive = open || focused
  const listboxId = `${id}-listbox`

  return (
    <div ref={ref} className={cn('relative', className)}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5"
        >
          {label}
        </label>
      )}

      {/* ── Trigger ── */}
      <button
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex h-9 w-full items-center justify-between gap-2 rounded-md border px-3 text-sm text-left bg-white',
          'border-[var(--border)]',
          'transition-[border-color,background-color,box-shadow] duration-150 [transition-timing-function:var(--ease-default)]',
          'hover:bg-[var(--input-hover)] hover:border-[var(--border-strong)]',
          'focus-visible:outline-none focus-visible:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)]/12',
          'active:scale-[0.99] active:duration-[50ms]',
          'disabled:cursor-not-allowed disabled:opacity-40',
          isActive && !disabled && 'border-[var(--primary)] ring-2 ring-[var(--primary)]/12 bg-[var(--forest-50)]',
          error && !isActive && 'border-[var(--rose-400)]',
          error && isActive && 'border-[var(--rose-500)] ring-2 ring-[var(--rose-400)]/20',
        )}
      >
        <span className={cn('flex-1 truncate', selected ? 'text-foreground' : 'text-[var(--foreground-subtle)]')}>
          {selected?.label ?? placeholder}
        </span>
        {/* Chevron */}
        <svg
          className={cn(
            'size-4 shrink-0 text-[var(--foreground-subtle)]',
            'transition-transform duration-150 [transition-timing-function:var(--ease-default)]',
            open && 'rotate-180'
          )}
          viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"
        >
          <path d="M4 6l4 4 4-4"/>
        </svg>
      </button>

      {/* ── Options panel ── */}
      {open && (
        <div
          id={listboxId}
          role="listbox"
          className={cn(
            'absolute z-50 mt-1.5 w-full rounded-lg border border-[var(--border)]',
            'bg-white shadow-[var(--shadow-lg)]',
            'overflow-hidden motion-enter'
          )}
        >
          <div className="max-h-60 overflow-y-auto p-1" style={{ scrollbarWidth: 'none' }}>
            {options.map(opt => {
              const isSelected = opt.value === value
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={opt.disabled}
                  onClick={() => { onChange?.(opt.value); setOpen(false) }}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-left',
                    'transition-[background-color,color] duration-100',
                    'disabled:pointer-events-none disabled:opacity-40',
                    isSelected
                      ? 'bg-[var(--forest-50)] text-[var(--forest-800)] font-medium'
                      : 'text-[var(--foreground-muted)] hover:bg-[var(--background-elevated)] hover:text-foreground'
                  )}
                >
                  <span className="flex-1 truncate">
                    {opt.label}
                    {opt.description && (
                      <span className="block text-[11px] text-[var(--foreground-subtle)] font-normal mt-0.5">
                        {opt.description}
                      </span>
                    )}
                  </span>
                  {isSelected && (
                    <svg className="size-4 shrink-0 text-[var(--primary)]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 8l4 4 6-6"/>
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
