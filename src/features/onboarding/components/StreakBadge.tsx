'use client'

type Props = {
  current: number
  longest: number
}

export function StreakBadge({ current, longest }: Props) {
  if (current === 0) return null

  const isHot = current >= 3

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 border ${isHot ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-[var(--border)]'}`}
      title={`Longest streak: ${longest} week${longest !== 1 ? 's' : ''}`}
    >
      <span className="text-base" aria-hidden="true">{isHot ? '🔥' : '📅'}</span>
      <div className="text-xs">
        <span className={`font-bold ${isHot ? 'text-amber-700' : 'text-foreground'}`}>
          {current}
        </span>
        <span className={`ml-0.5 ${isHot ? 'text-amber-600' : 'text-[var(--foreground-muted)]'}`}>
          {' '}week{current !== 1 ? 's' : ''} active
        </span>
      </div>
      {longest > current && (
        <span className="text-[10px] text-[var(--foreground-subtle)]">
          · best {longest}
        </span>
      )}
    </div>
  )
}
