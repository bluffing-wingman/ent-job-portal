import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getCurrentWeekStart } from '@/lib/utils'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb()
  const weekStart = getCurrentWeekStart()

  // Check if already completed this week
  const existing = db.prepare(
    'SELECT * FROM checklist_completions WHERE item_id = ? AND week_start = ?'
  ).get(params.id, weekStart)

  if (existing) {
    // Uncomplete — remove the record
    db.prepare('DELETE FROM checklist_completions WHERE item_id = ? AND week_start = ?').run(params.id, weekStart)
  } else {
    // Complete — add record
    db.prepare('INSERT INTO checklist_completions (item_id, week_start) VALUES (?, ?)').run(params.id, weekStart)
  }

  return NextResponse.json({ toggled: true })
}
