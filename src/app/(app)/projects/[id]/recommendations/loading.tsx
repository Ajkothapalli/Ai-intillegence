import { Skeleton } from '@/components/ui/skeleton'

export default function RecommendationsLoading() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-8 py-4 flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-28" />
      </header>

      <div className="max-w-3xl mx-auto px-8 py-10 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>

        {[0, 1, 2].map(i => (
          <div key={i} className="bg-[var(--surface)] rounded-xl border border-[var(--border)] px-6 py-5 space-y-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-5 w-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-2 w-32 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
