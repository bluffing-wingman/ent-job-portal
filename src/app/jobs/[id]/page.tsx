import { jobs } from '@/lib/data'
import JobDetailClient from './JobDetailClient'

export function generateStaticParams() {
  return jobs.map((job) => ({ id: String(job.id) }))
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  return <JobDetailClient id={params.id} />
}
