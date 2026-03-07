'use client'

import { AlertTriangle, Clock, Calendar, Zap } from 'lucide-react'
import { getUrgencyColor, getCountdownText } from '@/lib/utils'
import { Job } from '@/lib/data'

export default function UrgentAlerts({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) return null

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="relative">
          <div className="absolute inset-0 bg-red-400/30 rounded-xl blur-sm animate-pulse-slow" />
          <div className="relative p-2 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-sm">
            <AlertTriangle className="h-4 w-4 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Urgent Alerts</h2>
          <p className="text-sm text-gray-500">
            {jobs.length} active opening{jobs.length !== 1 ? 's' : ''} requiring attention
          </p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-100 px-3 py-1.5 rounded-full ring-1 ring-red-200">
          <Zap className="h-3 w-3" />
          {jobs.length} ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => {
          const urgency = getUrgencyColor(job.walk_in_date, job.walk_in_recurring)
          const countdown = getCountdownText(job.walk_in_date, job.walk_in_recurring)

          const cardStyle =
            urgency === 'red'
              ? 'bg-gradient-to-br from-red-50 to-rose-100 border-red-200 ring-2 ring-red-200/60 shadow-urgent'
              : urgency === 'yellow'
              ? 'bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-200 ring-1 ring-amber-200/60'
              : urgency === 'gray'
              ? 'bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200 ring-1 ring-sky-200/60'
              : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 ring-1 ring-emerald-200/60'

          const countdownColor =
            urgency === 'red'
              ? 'text-red-700'
              : urgency === 'yellow'
              ? 'text-amber-700'
              : urgency === 'gray'
              ? 'text-sky-700'
              : 'text-emerald-700'

          const btnStyle =
            urgency === 'red'
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : urgency === 'yellow'
              ? 'bg-amber-500 hover:bg-amber-600 text-white'
              : 'bg-primary-600 hover:bg-primary-700 text-white'

          return (
            <div
              key={job.id}
              className={`relative rounded-2xl border-2 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${cardStyle}`}
            >
              {urgency === 'red' && (
                <div className="absolute top-4 right-4">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                  </span>
                </div>
              )}

              <div className={`text-3xl font-extrabold mb-2 ${countdownColor}`}>
                {countdown}
              </div>

              <h3 className="font-semibold text-gray-900 mb-0.5">{job.title}</h3>
              <p className="text-sm text-gray-600 font-medium mb-3">{job.hospital_name}</p>

              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{job.walk_in_date || job.walk_in_recurring}</span>
              </div>

              {job.salary_text && (
                <p className="text-xs font-semibold text-gray-600 mb-3 bg-white/60 px-2.5 py-1 rounded-lg inline-block">
                  {job.salary_text}
                </p>
              )}

              {job.apply_url && (
                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-1 flex items-center justify-center gap-1.5 w-full text-sm font-semibold py-2 rounded-xl shadow-sm transition-all active:scale-95 ${btnStyle}`}
                >
                  <Clock className="h-3.5 w-3.5" />
                  View Details &amp; Apply
                </a>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
