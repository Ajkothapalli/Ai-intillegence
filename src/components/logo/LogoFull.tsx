import { LogoMark } from './LogoMark'

type LogoVariant = 'horizontal' | 'stacked' | 'icon-only'

interface LogoFullProps {
  variant?: LogoVariant
  theme?: 'dark' | 'light'
  className?: string
}

export function LogoFull({ variant = 'horizontal', theme = 'dark', className }: LogoFullProps) {
  const primaryColor = theme === 'light' ? '#ffffff' : '#1e293b'
  const secondaryColor = theme === 'light' ? 'rgba(255,255,255,0.7)' : '#334155'

  if (variant === 'icon-only') {
    return <LogoMark className={className} />
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center gap-3 ${className ?? ''}`}>
        <LogoMark className="h-16 w-16" />
        <div className="text-center leading-snug">
          <div
            style={{ color: primaryColor }}
            className="text-xl font-bold tracking-tight"
          >
            Experiment
          </div>
          <div
            style={{ color: secondaryColor }}
            className="text-xl font-normal tracking-tight"
          >
            Intelligence
          </div>
        </div>
      </div>
    )
  }

  // horizontal (default)
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ''}`}>
      <LogoMark className="h-8 w-8 flex-shrink-0" />
      <div className="flex flex-col leading-none">
        <span
          style={{ color: primaryColor }}
          className="text-sm font-bold tracking-tight"
        >
          Experiment
        </span>
        <span
          style={{ color: secondaryColor }}
          className="text-sm font-normal tracking-tight"
        >
          Intelligence
        </span>
      </div>
    </div>
  )
}
