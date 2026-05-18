import { Skeleton } from '@/components/ui/skeleton'

export default function AnalysisLoading() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-8 py-4">
        <Skeleton className="h-4 w-32" />
      </header>

      <div className="max-w-3xl mx-auto px-8 py-10 space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-8 space-y-6">
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-11 w-40 rounded-full" />
        </div>
      </div>
    </main>
  )
}
