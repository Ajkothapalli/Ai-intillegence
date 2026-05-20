import Link from 'next/link'
import { NotFound as NotFoundIllustration } from '@/components/illustrations/product/NotFound'

const MESSAGES = [
  {
    headline: "This page ran an experiment and didn't survive.",
    sub: "Control group won. This URL has been deprecated with 99% confidence.",
  },
  {
    headline: "Our AI checked the funnel. You dropped off at step 1.",
    sub: "The good news: we have a recommendation for getting you back on track.",
  },
  {
    headline: "Confidence score: 0%. This page does not exist.",
    sub: "Even with more data, we couldn't improve that estimate.",
  },
  {
    headline: "We analysed the drop-off. It's you. The URL is wrong.",
    sub: "No offence — it happens to the best growth teams.",
  },
  {
    headline: "Hypothesis rejected. Page not found.",
    sub: "Statistical significance: very high. This page is definitely missing.",
  },
  {
    headline: "We ran the numbers. This isn't a page.",
    sub: "It could be a typo. It could be fate. Either way — back to dashboard.",
  },
]

function pickMessage() {
  return MESSAGES[Math.floor(Date.now() / 1000) % MESSAGES.length]
}

export default function NotFound() {
  const msg = pickMessage()

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8">

        {/* Illustration */}
        <NotFoundIllustration className="w-64 h-48 mx-auto" />

        {/* Witty copy */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-widest text-violet-500">
            404 · Page not found
          </p>
          <h1 className="text-2xl font-bold text-slate-900 leading-snug">
            {msg.headline}
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            {msg.sub}
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition-colors shadow-sm"
          >
            Back to dashboard →
          </Link>
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            New project
          </Link>
        </div>

      </div>
    </div>
  )
}
