import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-8 py-4 flex items-center justify-between">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-14" />
      </header>

      <div className="max-w-4xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>

        <div className="grid gap-4">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="bg-[var(--surface)] rounded-xl border border-[var(--border)] px-6 py-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-72" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-3 w-20 ml-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
