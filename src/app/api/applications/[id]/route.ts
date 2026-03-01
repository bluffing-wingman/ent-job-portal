import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb()
  const body = await request.json()

  const fields: string[] = []
  const values: (string | number | null)[] = []

  const allowedFields = ['hospital_name', 'position', 'applied_date', 'status', 'follow_up_date', 'notes']

  for (const field of allowedFields) {
    if (field in body) {
      fields.push(`${field} = ?`)
      values.push(body[field])
    }
  }

  if (fields.length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 })

  fields.push("updated_at = datetime('now')")
  values.push(params.id)

  db.prepare(`UPDATE applications SET ${fields.join(', ')} WHERE id = ?`).run(...values)
  const app = db.prepare('SELECT * FROM applications WHERE id = ?').get(params.id)
  return NextResponse.json(app)
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb()
  db.prepare('DELETE FROM applications WHERE id = ?').run(params.id)
  return NextResponse.json({ success: true })
}
