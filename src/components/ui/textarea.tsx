import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'flex min-h-[100px] w-full rounded-lg px-4 py-3 text-sm resize-none',
        'bg-[var(--input)] text-foreground',
        'placeholder:text-[var(--foreground-subtle)]',
        'border border-[var(--border)]',
        'transition-[border-color,background-color,box-shadow] duration-150 [transition-timing-function:var(--ease-default)]',
        'hover:bg-[var(--input-hover)] hover:border-[var(--border-strong)]',
        'focus-visible:outline-none',
        'focus-visible:bg-[var(--forest-50)]',
        'focus-visible:border-[var(--primary)]',
        'focus-visible:ring-2 focus-visible:ring-[var(--primary)]/12',
        'disabled:cursor-not-allowed disabled:opacity-40',
        error && 'border-[var(--rose-400)] focus-visible:ring-[var(--rose-400)]/20 focus-visible:border-[var(--rose-500)]',
        className
      )}
      {...props}
    />
  )
}
