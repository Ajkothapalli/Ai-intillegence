import { cn } from '@/lib/utils'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  initials?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'forest' | 'cobalt' | 'ember'
}

const sizeClass = { sm: 'size-7 text-xs', md: 'size-9 text-sm', lg: 'size-12 text-base', xl: 'size-16 text-xl' }

const variantClass = {
  forest: 'bg-primary',
  cobalt: 'bg-[var(--cobalt-600)]',
  ember:  'bg-[var(--ember-600)]',
}

export function Avatar({ src, alt, initials, size = 'md', variant = 'forest', className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full',
        'font-bold text-white ring-2 ring-[var(--border)]',
        'transition-transform duration-200 [transition-timing-function:var(--ease-spring)]',
        'hover:scale-105 active:scale-95 active:duration-[50ms]',
        variantClass[variant],
        sizeClass[size],
        className
      )}
      {...props}
    >
      {src
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={src} alt={alt ?? ''} className="h-full w-full object-cover" />
        : <span className="tracking-tight">{initials ?? alt?.charAt(0).toUpperCase() ?? '?'}</span>
      }
    </div>
  )
}
