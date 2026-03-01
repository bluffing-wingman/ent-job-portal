'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Briefcase, Search, MapPin, Clock, IndianRupee, Filter, ExternalLink, RefreshCw, Plus, Minus, X } from 'lucide-react'
import { getUrgencyColor, getCountdownText, formatSalary } from '@/lib/utils'
import Link from 'next/link'

interface Job {
  id: number; title: string; hospital_name: string; location: string; type: string
  salary_min: number | null; salary_max: number | null; salary_text: string | null
  walk_in_date: string | null; walk_in_recurring: string | null; deadline: string | null
  apply_url: string | null; description: string | null; source: string | null
}

interface Diff {
  added: Job[]
  removed: Job[]
}

function timeAgo(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000)
  if (secs < 10) return 'just now'
  if (secs < 60) return `${secs}s ago`
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  return `${hrs}h ago`
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filters, setFilters] = useState({ type: '', location: '', search: '' })
  const [lastFetched, setLastFetched] = useState<Date | null>(null)
  const [timeAgoText, setTimeAgoText] = useState('')
  const [diff, setDiff] = useState<Diff | null>(null)
  const prevJobsRef = useRef<Job[]>([])

  const fetchJobs = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    const params = new URLSearchParams()
    if (filters.type) params.set('type', filters.type)
    if (filters.location) params.set('location', filters.location)
    if (filters.search) params.set('search', filters.search)

    const res = await fetch(`/api/jobs?${params}`)
    const newJobs: Job[] = await res.json()
    const now = new Date()

    if (isRefresh) {
      const prev = prevJobsRef.current
      const prevIds = new Set(prev.map(j => j.id))
      const newIds = new Set(newJobs.map(j => j.id))
      const added = newJobs.filter(j => !prevIds.has(j.id))
      const removed = prev.filter(j => !newIds.has(j.id))
      if (added.length > 0 || removed.length > 0) {
        setDiff({ added, removed })
      } else {
        setDiff({ added: [], removed: [] }) // no changes but still show "no changes"
      }
      setRefreshing(false)
    }

    prevJobsRef.current = newJobs
    setJobs(newJobs)
    setLastFetched(now)
    setTimeAgoText(timeAgo(now))
    setLoading(false)
  }, [filters])

  // Initial load
  useEffect(() => {
    fetchJobs(false)
  }, [fetchJobs])

  // Keep "time ago" text ticking
  useEffect(() => {
    if (!lastFetched) return
    const interval = setInterval(() => setTimeAgoText(timeAgo(lastFetched)), 15000)
    return () => clearInterval(interval)
  }, [lastFetched])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="h-7 w-7 text-primary-500" /> Job Listings
          </h1>
          <p className="text-gray-500 mt-1">{jobs.length} positions found</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={() => fetchJobs(true)}
            disabled={refreshing}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Checking...' : 'Refresh'}
          </button>
          {lastFetched && (
            <span className="text-xs text-gray-400">Updated {timeAgoText}</span>
          )}
        </div>
      </div>

      {diff !== null && (
        <div className={`rounded-xl border px-4 py-3 flex items-start gap-3 ${
          diff.added.length === 0 && diff.removed.length === 0
            ? 'bg-gray-50 border-gray-200 text-gray-600'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <div className="flex-1 space-y-1 text-sm">
            {diff.added.length === 0 && diff.removed.length === 0 ? (
              <p className="font-medium">No changes — listings are up to date.</p>
            ) : (
              <>
                {diff.added.map(j => (
                  <p key={j.id} className="flex items-center gap-1.5">
                    <Plus className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span><strong>New:</strong> {j.title} — {j.hospital_name}</span>
                  </p>
                ))}
                {diff.removed.map(j => (
                  <p key={j.id} className="flex items-center gap-1.5 text-red-700">
                    <Minus className="h-3.5 w-3.5 text-red-500 shrink-0" />
                    <span><strong>Removed:</strong> {j.title} — {j.hospital_name}</span>
                  </p>
                ))}
              </>
            )}
          </div>
          <button onClick={() => setDiff(null)} className="text-gray-400 hover:text-gray-600 mt-0.5">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="card">
        <div className="flex items-center gap-2 mb-4"><Filter className="h-4 w-4 text-gray-500" /><span className="font-medium text-gray-700">Filters</span></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <input type="text" placeholder="Search jobs..." className="input-field pl-10" value={filters.search} onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))} />
          </div>
          <select className="select-field" value={filters.type} onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}>
            <option value="">All Types</option>
            <option value="govt">Government</option>
            <option value="private">Private</option>
            <option value="startup">Startup</option>
          </select>
          <select className="select-field" value={filters.location} onChange={(e) => setFilters(f => ({ ...f, location: e.target.value }))}>
            <option value="">All Locations</option>
            <option value="Gurugram">Gurugram</option>
            <option value="Delhi">Delhi</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No jobs found matching your filters.</div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const urgency = getUrgencyColor(job.walk_in_date || job.deadline, job.walk_in_recurring)
            const countdown = getCountdownText(job.walk_in_date || job.deadline, job.walk_in_recurring)
            const isNew = diff?.added.some(j => j.id === job.id)
            return (
              <div key={job.id} className={`card hover:shadow-lg transition-all ${isNew ? 'ring-2 ring-emerald-400' : ''}`}>
                {isNew && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mb-2">
                    <Plus className="h-3 w-3" /> New
                  </span>
                )}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-2 flex-wrap">
                      <Link href={`/jobs/${job.id}`} className="text-lg font-semibold text-gray-900 hover:text-primary-600">{job.title}</Link>
                      <span className={`badge ${job.type === 'govt' ? 'badge-green' : job.type === 'startup' ? 'badge-purple' : 'badge-blue'}`}>{job.type.toUpperCase()}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.hospital_name} • {job.location}</span>
                      {(job.salary_text || job.salary_min) && <span className="flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5" />{formatSalary(job.salary_min, job.salary_max, job.salary_text)}</span>}
                    </div>
                    {job.description && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{job.description}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2 min-w-fit">
                    {(job.walk_in_date || job.walk_in_recurring || job.deadline) && (
                      <span className={`badge ${urgency === 'red' ? 'badge-red' : urgency === 'yellow' ? 'badge-yellow' : urgency === 'gray' ? 'bg-gray-100 text-gray-600' : 'badge-green'}`}>
                        <Clock className="h-3 w-3 mr-1" />{countdown}
                      </span>
                    )}
                    <div className="flex gap-2">
                      {job.apply_url && <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm flex items-center gap-1">Apply <ExternalLink className="h-3 w-3" /></a>}
                      <Link href={`/jobs/${job.id}`} className="btn-secondary text-sm">Details</Link>
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
