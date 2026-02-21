import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  const db = getDb()
  const applications = db.prepare('SELECT * FROM applications ORDER BY applied_date DESC').all()
  return NextResponse.json(applications)
}

export async function POST(request: NextRequest) {
  const db = getDb()
  const body = await request.json()

  const stmt = db.prepare(`
    INSERT INTO applications (hospital_name, position, applied_date, status, follow_up_date, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  const result = stmt.run(
    body.hospital_name, body.position, body.applied_date,
    body.status || 'applied', body.follow_up_date || null, body.notes || null
  )

  const app = db.prepare('SELECT * FROM applications WHERE id = ?').get(result.lastInsertRowid)
  return NextResponse.json(app, { status: 201 })
}
