import { NextResponse } from 'next/server'
import { runScraper } from '@/lib/scraper'

export async function POST() {
  try {
    const result = await runScraper()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Scraper failed' },
      { status: 500 }
    )
  }
}
