import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getCurrentWeekStart } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function GET() {
  const db = getDb()
  const weekStart = getCurrentWeekStart()

  const items = db.prepare(`
    SELECT ci.*,
      CASE WHEN cc.id IS NOT NULL THEN 1 ELSE 0 END as completed
    FROM checklist_items ci
    LEFT JOIN checklist_completions cc ON ci.id = cc.item_id AND cc.week_start = ?
    ORDER BY ci.sort_order
  `).all(weekStart)

  return NextResponse.json(items)
}
