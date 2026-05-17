import { Skeleton } from '@/components/ui/skeleton'

export default function ProjectLoading() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-8 py-4">
        <Skeleton className="h-4 w-28" />
      </header>

      <div className="max-w-4xl mx-auto px-8 py-10 space-y-8">
        {/* Title block */}
        <div className="space-y-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-32 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>

        {/* Nav cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6 space-y-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-36" />
            </div>
          ))}
        </div>

        {/* Business goal block */}
        <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6 space-y-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </main>
  )
}
