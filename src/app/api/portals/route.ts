import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(request: NextRequest) {
  const db = getDb()
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  let query = 'SELECT * FROM portals WHERE 1=1'
  const params: string[] = []

  if (category) {
    query += ' AND category = ?'
    params.push(category)
  }

  query += ' ORDER BY category, name'
  const portals = db.prepare(query).all(...params)
  return NextResponse.json(portals)
}
