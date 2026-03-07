import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { Job } from '@/lib/data'

export const dynamic = 'force-dynamic'

export async function GET() {
  const db = getDb()

  const totalActive = (db.prepare('SELECT COUNT(*) as count FROM jobs WHERE is_active = 1').get() as { count: number }).count
  const totalHospitals = (db.prepare('SELECT COUNT(*) as count FROM hospitals').get() as { count: number }).count
  const totalApplications = (db.prepare('SELECT COUNT(*) as count FROM applications').get() as { count: number }).count
  const upcomingDeadlines = (db.prepare("SELECT COUNT(*) as count FROM jobs WHERE is_active = 1 AND deadline > date('now')").get() as { count: number }).count

  const urgentJobs = db.prepare(`
    SELECT * FROM jobs WHERE is_active = 1 AND (
      walk_in_recurring IS NOT NULL
      OR (walk_in_date IS NOT NULL AND walk_in_date >= date('now'))
    )
    ORDER BY walk_in_date ASC
  `).all() as Job[]

  const recentJobs = db.prepare(
    'SELECT * FROM jobs WHERE is_active = 1 ORDER BY created_at DESC LIMIT 5'
  ).all() as Job[]

  return NextResponse.json({ totalActive, totalHospitals, totalApplications, upcomingDeadlines, urgentJobs, recentJobs })
}
