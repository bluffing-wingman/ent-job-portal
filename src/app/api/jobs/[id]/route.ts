import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb()
  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(params.id)
  if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  return NextResponse.json(job)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb()
  const body = await request.json()

  const fields: string[] = []
  const values: (string | number | null)[] = []

  const allowedFields = ['title', 'hospital_name', 'location', 'type', 'salary_min', 'salary_max', 'salary_text', 'walk_in_date', 'walk_in_recurring', 'deadline', 'apply_url', 'description', 'source', 'is_active']

  for (const field of allowedFields) {
    if (field in body) {
      fields.push(`${field} = ?`)
      values.push(body[field])
    }
  }

  if (fields.length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 })

  fields.push("updated_at = datetime('now')")
  values.push(params.id)

  db.prepare(`UPDATE jobs SET ${fields.join(', ')} WHERE id = ?`).run(...values)
  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(params.id)
  return NextResponse.json(job)
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb()
  db.prepare('DELETE FROM jobs WHERE id = ?').run(params.id)
  return NextResponse.json({ success: true })
}
