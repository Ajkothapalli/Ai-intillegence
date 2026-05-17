import { cn } from '@/lib/utils'

function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--border)] bg-white text-[var(--card-foreground)]',
        'shadow-[var(--shadow-sm)]',
        'transition-[box-shadow,border-color] duration-200 [transition-timing-function:var(--ease-out)]',
        className
      )}
      {...props}
    />
  )
}

function CardGlass({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--forest-200)]',
        'bg-[var(--forest-50)]/80 backdrop-blur-md',
        'text-[var(--card-foreground)] shadow-[var(--shadow-md)]',
        'transition-[box-shadow,border-color] duration-200 [transition-timing-function:var(--ease-out)]',
        className
      )}
      {...props}
    />
  )
}

function CardGradient({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--border)]',
        'gradient-surface text-[var(--card-foreground)]',
        'shadow-[var(--shadow-md)]',
        'transition-[box-shadow,border-color] duration-200 [transition-timing-function:var(--ease-out)]',
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1.5 p-6', className)} {...props} />
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-base font-semibold leading-tight tracking-tight', className)} {...props} />
}

function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-[var(--foreground-muted)]', className)} {...props} />
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-6 pb-6', className)} {...props} />
}

function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center px-6 pb-6 pt-0', className)} {...props} />
}

export { Card, CardGlass, CardGradient, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
