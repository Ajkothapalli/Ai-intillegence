import { Skeleton } from '@/components/ui/skeleton'

export default function UploadsLoading() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-8 py-4">
        <Skeleton className="h-4 w-32" />
      </header>

      <div className="max-w-3xl mx-auto px-8 py-10 space-y-10">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-96" />
        </div>

        {[0, 1].map(i => (
          <section key={i} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-64" />
              </div>
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-32 w-full rounded-xl" />
          </section>
        ))}
      </div>
    </main>
  )
}
