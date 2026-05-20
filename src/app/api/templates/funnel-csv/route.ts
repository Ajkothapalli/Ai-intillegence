import { generateFunnelCSVTemplate } from '@/lib/export/csvTemplate'

export async function GET() {
  const csv = generateFunnelCSVTemplate()
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="funnel-data-template.csv"',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
