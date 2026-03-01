import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const db = getDb()
  const { searchParams } = new URL(request.url)

  const tier = searchParams.get('tier')
  const type = searchParams.get('type')

  let query = 'SELECT * FROM hospitals WHERE 1=1'
  const params: string[] = []

  if (tier) {
    query += ' AND tier = ?'
    params.push(tier)
  }
  if (type) {
    query += ' AND type = ?'
    params.push(type)
  }

  query += ' ORDER BY tier, name'

  const hospitals = db.prepare(query).all(...params)
  return NextResponse.json(hospitals)
}
