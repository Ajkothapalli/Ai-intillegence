import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export function Input({ className, error, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'flex h-11 w-full rounded-lg px-4 py-2.5 text-sm',
        'bg-[var(--input)] text-foreground',
        'placeholder:text-[var(--foreground-subtle)]',
        'border border-[var(--border)]',
        'shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)]',
        'transition-[border-color,background-color,box-shadow] duration-150 [transition-timing-function:var(--ease-default)]',
        'hover:bg-[var(--input-hover)] hover:border-[var(--border-strong)]',
        'focus-visible:outline-none',
        'focus-visible:bg-[rgba(124,58,237,0.06)]',
        'focus-visible:border-[var(--primary)]',
        'focus-visible:ring-2 focus-visible:ring-[var(--primary)]/20',
        'focus-visible:shadow-[inset_0_1px_3px_rgba(0,0,0,0.2),0_0_0_1px_rgba(124,58,237,0.15)]',
        'disabled:cursor-not-allowed disabled:opacity-40',
        error && 'border-[var(--rose-500)] focus-visible:ring-[var(--rose-500)]/25 focus-visible:border-[var(--rose-400)]',
        className
      )}
      {...props}
    />
  )
}
