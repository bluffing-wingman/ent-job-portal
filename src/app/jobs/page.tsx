'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Briefcase, Search, MapPin, Clock, IndianRupee,
  Filter, ExternalLink, RefreshCw, Plus, Minus, X, Zap
} from 'lucide-react'
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

type CityFilter = '' | 'Gurugram' | 'Delhi'

const cityTabs: { id: CityFilter; label: string; emoji: string; activeClass: string; countClass: string; cardBadge: string }[] = [
  {
    id: '',
    label: 'All Cities',
    emoji: '🗺️',
    activeClass: 'bg-gray-800 text-white shadow-md',
    countClass: 'bg-white/20 text-white',
    cardBadge: '',
  },
  {
    id: 'Gurugram',
    label: 'Gurugram',
    emoji: '🏙️',
    activeClass: 'bg-violet-600 text-white shadow-md shadow-violet-200',
    countClass: 'bg-white/25 text-white',
    cardBadge: 'bg-violet-100 text-violet-700 ring-1 ring-violet-200',
  },
  {
    id: 'Delhi',
    label: 'Delhi',
    emoji: '🏛️',
    activeClass: 'bg-amber-500 text-white shadow-md shadow-amber-200',
    countClass: 'bg-white/25 text-white',
    cardBadge: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
  },
]

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [allJobs, setAllJobs] = useState<Job[]>([]) // unfiltered, for counts
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [cityFilter, setCityFilter] = useState<CityFilter>('')
  const [filters, setFilters] = useState({ type: '', search: '' })
  const [lastFetched, setLastFetched] = useState<Date | null>(null)
  const [timeAgoText, setTimeAgoText] = useState('')
  const [diff, setDiff] = useState<Diff | null>(null)
  const prevJobsRef = useRef<Job[]>([])

  const fetchJobs = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)

    // Fetch all jobs for city counts
    const allRes = await fetch('/api/jobs')
    const all: Job[] = await allRes.json()
    setAllJobs(all)

    // Fetch filtered jobs
    const params = new URLSearchParams()
    if (cityFilter) params.set('location', cityFilter)
    if (filters.type) params.set('type', filters.type)
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
      setDiff(added.length > 0 || removed.length > 0 ? { added, removed } : { added: [], removed: [] })
      setRefreshing(false)
    }

    prevJobsRef.current = newJobs
    setJobs(newJobs)
    setLastFetched(now)
    setTimeAgoText(timeAgo(now))
    setLoading(false)
  }, [cityFilter, filters])

  const AUTO_REFRESH_MS = 4 * 60 * 60 * 1000

  useEffect(() => { fetchJobs(false) }, [fetchJobs])
  useEffect(() => {
    const interval = setInterval(() => fetchJobs(true), AUTO_REFRESH_MS)
    return () => clearInterval(interval)
  }, [fetchJobs, AUTO_REFRESH_MS])
  useEffect(() => {
    if (!lastFetched) return
    const interval = setInterval(() => setTimeAgoText(timeAgo(lastFetched)), 15000)
    return () => clearInterval(interval)
  }, [lastFetched])

  // City counts from full list
  const cityCounts: Record<string, number> = {
    '': allJobs.length,
    'Gurugram': allJobs.filter(j => j.location === 'Gurugram').length,
    'Delhi': allJobs.filter(j => j.location === 'Delhi').length,
  }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Header ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-sky-600 to-primary-700 p-8 text-white shadow-lg">
        <div className="absolute inset-0 dot-pattern" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-xl">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold">Job Listings</h1>
            </div>
            <p className="text-sky-100 text-base">
              {loading ? 'Loading positions…' : `${jobs.length} ENT positions found`}
              {cityFilter && ` in ${cityFilter}`}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <button
              onClick={() => fetchJobs(true)}
              disabled={refreshing}
              className="flex items-center gap-2 text-sm bg-white/20 hover:bg-white/30 text-white px-3.5 py-2 rounded-xl transition-all active:scale-95 font-medium"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Checking…' : 'Refresh'}
            </button>
            {lastFetched && (
              <span className="text-xs text-sky-300">Updated {timeAgoText}</span>
            )}
          </div>
        </div>
      </div>

      {/* ── City Toggle ── BIG and prominent ── */}
      <div className="card-flat">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Filter by City</p>
        <div className="grid grid-cols-3 gap-3">
          {cityTabs.map(tab => {
            const count = cityCounts[tab.id] ?? 0
            const isActive = cityFilter === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setCityFilter(tab.id)}
                className={`relative flex flex-col items-center gap-1.5 py-4 px-3 rounded-2xl font-semibold transition-all duration-200 active:scale-95 ${
                  isActive
                    ? tab.activeClass
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span className="text-2xl leading-none">{tab.emoji}</span>
                <span className="text-sm font-bold">{tab.label}</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  isActive ? tab.countClass : 'bg-gray-200 text-gray-600'
                }`}>
                  {count} jobs
                </span>
              </button>
            )
          })}
        </div>

        {cityFilter && (
          <div className={`mt-3 flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-xl ${
            cityFilter === 'Gurugram' ? 'bg-violet-50 text-violet-700' : 'bg-amber-50 text-amber-700'
          }`}>
            <span>{cityFilter === 'Gurugram' ? '🏙️' : '🏛️'}</span>
            Showing jobs in <strong>{cityFilter}</strong>
            <button
              onClick={() => setCityFilter('')}
              className="ml-auto text-xs underline opacity-60 hover:opacity-100"
            >
              Show all
            </button>
          </div>
        )}
      </div>

      {/* ── Diff Banner ── */}
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

      {/* ── Additional Filters ── */}
      <div className="card-flat">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="font-semibold text-gray-700">More Filters</span>
          {(filters.search || filters.type) && (
            <button
              onClick={() => setFilters({ type: '', search: '' })}
              className="ml-auto text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs, hospitals…"
              className="input-field pl-10"
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            />
          </div>
          <select
            className="select-field"
            value={filters.type}
            onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
          >
            <option value="">All Types (Govt / Private / Startup)</option>
            <option value="govt">Government</option>
            <option value="private">Private</option>
            <option value="startup">Startup</option>
          </select>
        </div>
      </div>

      {/* ── Job Cards ── */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card-flat">
              <div className="flex gap-4">
                <div className="skeleton h-12 w-12 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-5 w-48 rounded-lg" />
                  <div className="skeleton h-4 w-64 rounded-lg" />
                  <div className="skeleton h-4 w-32 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="font-medium">No jobs found matching your filters.</p>
          <p className="text-sm mt-1">Try a different city or remove other filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const urgency = getUrgencyColor(job.walk_in_date || job.deadline, job.walk_in_recurring)
            const countdown = getCountdownText(job.walk_in_date || job.deadline, job.walk_in_recurring)
            const isNew = diff?.added.some(j => j.id === job.id)
            const salaryText = formatSalary(job.salary_min, job.salary_max, job.salary_text)

            const cityMeta = cityTabs.find(t => t.id === job.location) ?? cityTabs[0]

            const urgencyBadge =
              urgency === 'red' ? 'badge-red' :
              urgency === 'yellow' ? 'badge-yellow' :
              urgency === 'gray' ? 'bg-gray-100 text-gray-600' :
              'badge-green'

            const typeBadge =
              job.type === 'govt' ? 'badge-green' :
              job.type === 'startup' ? 'badge-purple' :
              'badge-blue'

            const typeGradient =
              job.type === 'govt' ? 'from-emerald-400 to-teal-600' :
              job.type === 'startup' ? 'from-violet-400 to-purple-600' :
              'from-sky-400 to-blue-600'

            return (
              <div
                key={job.id}
                className={`card transition-all duration-300 ${
                  isNew ? 'ring-2 ring-emerald-400 bg-emerald-50/20' : ''
                }`}
              >
                {isNew && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mb-3">
                    <Plus className="h-3 w-3" /> New Listing
                  </span>
                )}

                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Gradient type icon */}
                  <div className={`stat-icon flex-shrink-0 bg-gradient-to-br ${typeGradient} shadow-sm self-start`}>
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>

                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap mb-1">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors"
                      >
                        {job.title}
                      </Link>
                      <span className={`badge ${typeBadge}`}>{job.type.toUpperCase()}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1.5">
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="h-3.5 w-3.5 text-gray-400" />
                        {job.hospital_name}
                      </span>

                      {/* City badge — color-coded */}
                      {job.location && (
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                          job.location === 'Gurugram'
                            ? 'bg-violet-100 text-violet-700 ring-1 ring-violet-200'
                            : job.location === 'Delhi'
                            ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-200'
                            : 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'
                        }`}>
                          <span className="text-xs">{cityMeta.emoji}</span>
                          {job.location}
                        </span>
                      )}

                      {salaryText && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                          <IndianRupee className="h-3 w-3" />
                          {salaryText}
                        </span>
                      )}
                    </div>

                    {job.description && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>
                    )}
                  </div>

                  {/* Right: urgency + actions */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
                    {(job.walk_in_date || job.walk_in_recurring || job.deadline) && (
                      <span className={`badge ${urgencyBadge} text-xs`}>
                        {urgency === 'red' && <Zap className="h-3 w-3 mr-1" />}
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
                          className="btn-primary text-sm flex items-center gap-1 py-1.5"
                        >
                          Apply <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      <Link href={`/jobs/${job.id}`} className="btn-secondary text-sm py-1.5">
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
