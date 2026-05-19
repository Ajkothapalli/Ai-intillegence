import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <p className="text-6xl font-bold text-[#196262]">404</p>
        <div>
          <h1 className="text-xl font-bold">Page not found</h1>
          <p className="text-sm text-gray-500 mt-1">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex h-9 items-center rounded-full bg-[#196262] px-5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
