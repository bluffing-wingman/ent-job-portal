import { NextRequest, NextResponse } from 'next/server'
import { runScraper } from '@/lib/scraper'

export async function GET(request: NextRequest) {
  // Verify this is called by Vercel Cron (not a random visitor)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await runScraper()
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Scraper failed' },
      { status: 500 }
    )
  }
}
