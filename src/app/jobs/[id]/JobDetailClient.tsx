'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MapPin, IndianRupee, Calendar, Clock, ExternalLink, Building2 } from 'lucide-react'
import { jobs as seedJobs, Job } from '@/lib/data'
import { getCustomJobs } from '@/lib/storage'

export default function JobDetailClient({ id }: { id: string }) {
  const [job, setJob] = useState<Job | null>(null)

  useEffect(() => {
    const numId = Number(id)
    const allJobs = [...seedJobs, ...getCustomJobs()]
    setJob(allJobs.find(j => j.id === numId) || null)
  }, [id])

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <p className="text-gray-500">Job not found.</p>
        <Link href="/jobs" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">← Back to Jobs</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/jobs" className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm">
        <ArrowLeft className="h-4 w-4" /> Back to Jobs
      </Link>

      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className={`badge ${job.type === 'govt' ? 'badge-green' : job.type === 'startup' ? 'badge-purple' : 'badge-blue'} mb-2`}>
              {job.type.toUpperCase()}
            </span>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Building2 className="h-5 w-5 text-gray-400" />
            <span>{job.hospital_name}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-5 w-5 text-gray-400" />
            <span>{job.location}</span>
          </div>
          {(job.salary_text || job.salary_min) && (
            <div className="flex items-center gap-2 text-gray-600">
              <IndianRupee className="h-5 w-5 text-gray-400" />
              <span>{job.salary_text || `₹${job.salary_min?.toLocaleString()} - ₹${job.salary_max?.toLocaleString()}/month`}</span>
            </div>
          )}
          {job.walk_in_date && (
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span>Walk-in: {job.walk_in_date}</span>
            </div>
          )}
          {job.walk_in_recurring && (
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-5 w-5 text-gray-400" />
              <span>Recurring: {job.walk_in_recurring}</span>
            </div>
          )}
          {job.deadline && (
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-5 w-5 text-gray-400" />
              <span>Deadline: {job.deadline}</span>
            </div>
          )}
        </div>

        {job.description && (
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
          </div>
        )}

        {job.source && (
          <p className="text-sm text-gray-400 mb-6">Source: {job.source}</p>
        )}

        <div className="flex gap-3">
          {job.apply_url && (
            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center gap-2"
            >
              Apply Now <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
