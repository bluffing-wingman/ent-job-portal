import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const db = getDb()
  const runs = db.prepare(
    'SELECT * FROM scraper_runs ORDER BY started_at DESC LIMIT 20'
  ).all()
  return NextResponse.json(runs)
}
