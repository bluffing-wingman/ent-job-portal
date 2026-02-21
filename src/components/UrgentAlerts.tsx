'use client'

import { AlertTriangle, Clock, Calendar } from 'lucide-react'
import { getUrgencyColor, getCountdownText } from '@/lib/utils'
import { Job } from '@/lib/data'

export default function UrgentAlerts({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) return null

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-red-500" />
        <h2 className="text-xl font-bold text-gray-900">Urgent Alerts</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => {
          const urgency = getUrgencyColor(job.walk_in_date, job.walk_in_recurring)
          const countdown = getCountdownText(job.walk_in_date, job.walk_in_recurring)

          const borderColor = urgency === 'red' ? 'border-red-400 bg-red-50'
            : urgency === 'yellow' ? 'border-yellow-400 bg-yellow-50'
            : urgency === 'gray' ? 'border-gray-300 bg-gray-50'
            : 'border-green-400 bg-green-50'

          const badgeColor = urgency === 'red' ? 'badge-red'
            : urgency === 'yellow' ? 'badge-yellow'
            : urgency === 'gray' ? 'bg-gray-100 text-gray-600'
            : 'badge-green'

          return (
            <div key={job.id} className={`rounded-xl border-2 p-5 ${borderColor} transition-all hover:shadow-md`}>
              <div className="flex items-start justify-between mb-3">
                <span className={`badge ${badgeColor} text-sm`}>
                  <Clock className="h-3 w-3 mr-1" />
                  {countdown}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
              <p className="text-sm text-gray-600 mb-1">{job.hospital_name}</p>
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                <Calendar className="h-3.5 w-3.5" />
                {job.walk_in_date || job.walk_in_recurring}
              </div>
              {job.salary_text && (
                <p className="text-sm font-medium text-gray-700 mb-3">{job.salary_text}</p>
              )}
              {job.apply_url && (
                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm w-full text-center block"
                >
                  View Details & Apply
                </a>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
