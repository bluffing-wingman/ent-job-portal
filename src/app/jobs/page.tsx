'use client'

import { useState, useEffect, useMemo } from 'react'
import { Briefcase, Search, MapPin, Clock, IndianRupee, Filter, ExternalLink } from 'lucide-react'
import { getUrgencyColor, getCountdownText, formatSalary } from '@/lib/utils'
import { jobs as seedJobs, Job } from '@/lib/data'
import { getCustomJobs } from '@/lib/storage'
import Link from 'next/link'

export default function JobsPage() {
  const [allJobs, setAllJobs] = useState<Job[]>(seedJobs)
  const [filters, setFilters] = useState({ type: '', location: '', search: '' })

  useEffect(() => {
    const custom = getCustomJobs()
    setAllJobs([...seedJobs, ...custom])
  }, [])

  const filteredJobs = useMemo(() => {
    return allJobs.filter(j => {
      if (!j.is_active) return false
      if (filters.type && j.type !== filters.type) return false
      if (filters.location && !j.location.toLowerCase().includes(filters.location.toLowerCase())) return false
      if (filters.search) {
        const s = filters.search.toLowerCase()
        if (!j.title.toLowerCase().includes(s) && !j.hospital_name.toLowerCase().includes(s) && !(j.description || '').toLowerCase().includes(s)) return false
      }
      return true
    })
  }, [allJobs, filters])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="h-7 w-7 text-primary-500" />
            Job Listings
          </h1>
          <p className="text-gray-500 mt-1">{filteredJobs.length} positions found</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-700">Filters</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              className="input-field pl-10"
              value={filters.search}
              onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
            />
          </div>
          <select
            className="select-field"
            value={filters.type}
            onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
          >
            <option value="">All Types</option>
            <option value="govt">Government</option>
            <option value="private">Private</option>
            <option value="startup">Startup</option>
          </select>
          <select
            className="select-field"
            value={filters.location}
            onChange={(e) => setFilters(f => ({ ...f, location: e.target.value }))}
          >
            <option value="">All Locations</option>
            <option value="Gurugram">Gurugram</option>
            <option value="Delhi">Delhi</option>
            <option value="Haryana">Haryana</option>
          </select>
        </div>
      </div>

      {/* Job Cards */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No jobs found matching your filters.</div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const urgency = getUrgencyColor(job.walk_in_date || job.deadline, job.walk_in_recurring)
            const countdown = getCountdownText(job.walk_in_date || job.deadline, job.walk_in_recurring)

            return (
              <div key={job.id} className="card hover:shadow-lg transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-2 flex-wrap">
                      <Link href={`/jobs/${job.id}`} className="text-lg font-semibold text-gray-900 hover:text-primary-600">
                        {job.title}
                      </Link>
                      <span className={`badge ${job.type === 'govt' ? 'badge-green' : job.type === 'startup' ? 'badge-purple' : 'badge-blue'}`}>
                        {job.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />{job.hospital_name} • {job.location}
                      </span>
                      {(job.salary_text || job.salary_min) && (
                        <span className="flex items-center gap-1">
                          <IndianRupee className="h-3.5 w-3.5" />{formatSalary(job.salary_min, job.salary_max, job.salary_text)}
                        </span>
                      )}
                    </div>
                    {job.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{job.description}</p>
                    )}
                    {job.source && (
                      <p className="text-xs text-gray-400 mt-2">Source: {job.source}</p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2 min-w-fit">
                    {(job.walk_in_date || job.walk_in_recurring || job.deadline) && (
                      <span className={`badge ${
                        urgency === 'red' ? 'badge-red' :
                        urgency === 'yellow' ? 'badge-yellow' :
                        urgency === 'gray' ? 'bg-gray-100 text-gray-600' :
                        'badge-green'
                      }`}>
                        <Clock className="h-3 w-3 mr-1" />
                        {countdown}
                      </span>
                    )}
                    <div className="flex gap-2">
                      {job.apply_url && (
                        <a
                          href={job.apply_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary text-sm flex items-center gap-1"
                        >
                          Apply <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      <Link href={`/jobs/${job.id}`} className="btn-secondary text-sm">
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
