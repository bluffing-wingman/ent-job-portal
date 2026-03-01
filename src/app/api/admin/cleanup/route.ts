import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Deletes all scraper-added jobs, keeping only manually seeded ones
export async function POST() {
  const db = getDb()
  const result = db.prepare(
    "DELETE FROM jobs WHERE source LIKE '%Scraper%'"
  ).run()
  return NextResponse.json({ deleted: result.changes })
}
