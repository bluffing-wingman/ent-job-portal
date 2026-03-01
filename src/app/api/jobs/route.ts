import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const db = getDb()
  const { searchParams } = new URL(request.url)

  const type = searchParams.get('type')
  const location = searchParams.get('location')
  const search = searchParams.get('search')
  const active = searchParams.get('active') !== 'false'

  let query = 'SELECT * FROM jobs WHERE 1=1'
  const params: (string | number)[] = []

  if (active) {
    query += ' AND is_active = 1'
  }
  if (type) {
    query += ' AND type = ?'
    params.push(type)
  }
  if (location) {
    query += ' AND location LIKE ?'
    params.push(`%${location}%`)
  }
  if (search) {
    query += ' AND (title LIKE ? OR hospital_name LIKE ? OR description LIKE ?)'
    params.push(`%${search}%`, `%${search}%`, `%${search}%`)
  }

  query += ' ORDER BY CASE WHEN walk_in_date IS NOT NULL THEN 0 ELSE 1 END, walk_in_date ASC, deadline ASC, created_at DESC'

  const jobs = db.prepare(query).all(...params)
  return NextResponse.json(jobs)
}

export async function POST(request: NextRequest) {
  const db = getDb()
  const body = await request.json()

  const stmt = db.prepare(`
    INSERT INTO jobs (title, hospital_name, location, type, salary_min, salary_max, salary_text, walk_in_date, walk_in_recurring, deadline, apply_url, description, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const result = stmt.run(
    body.title, body.hospital_name, body.location || 'Gurugram',
    body.type, body.salary_min || null, body.salary_max || null,
    body.salary_text || null, body.walk_in_date || null,
    body.walk_in_recurring || null, body.deadline || null,
    body.apply_url || null, body.description || null, body.source || null
  )

  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(result.lastInsertRowid)
  return NextResponse.json(job, { status: 201 })
}
