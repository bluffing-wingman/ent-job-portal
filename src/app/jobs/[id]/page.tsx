import { getDb } from '@/lib/db'
import { notFound } from 'next/navigation'
import JobDetailClient from './JobDetailClient'

export const dynamic = 'force-dynamic'

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const db = getDb()
  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(params.id)
  if (!job) notFound()
  return <JobDetailClient id={params.id} />
}
