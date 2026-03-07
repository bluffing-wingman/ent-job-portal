'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Link from 'next/link'
import {
  Briefcase, Building2, Globe, ClipboardList, CheckSquare,
  TrendingUp, Clock, ArrowRight, RefreshCw, Plus, Minus, X, Stethoscope, MapPin
} from 'lucide-react'
import UrgentAlerts from '@/components/UrgentAlerts'
import { Job } from '@/lib/data'

interface DashboardData {
  totalActive: number
  totalHospitals: number
  totalApplications: number
  upcomingDeadlines: number
  urgentJobs: Job[]
  recentJobs: Job[]
}

interface Diff {
  added: Job[]
  removed: Job[]
}

type CityFilter = '' | 'Gurugram' | 'Delhi'

const cityTabs: {
  id: CityFilter
  label: string
  emoji: string
  activeClass: string
  countClass: string
}[] = [
  { id: '',         label: 'All Cities', emoji: '🗺️', activeClass: 'bg-gray-800 text-white shadow-md',                         countClass: 'bg-white/20 text-white' },
  { id: 'Gurugram', label: 'Gurugram',   emoji: '🏙️', activeClass: 'bg-violet-600 text-white shadow-md shadow-violet-200',     countClass: 'bg-white/25 text-white' },
  { id: 'Delhi',    label: 'Delhi',      emoji: '🏛️', activeClass: 'bg-amber-500  text-white shadow-md shadow-amber-200',      countClass: 'bg-white/25 text-white' },
]

function timeAgo(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000)
  if (secs < 10) return 'just now'
  if (secs < 60) return `${secs}s ago`
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  return `${hrs}h ago`
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastFetched, setLastFetched] = useState<Date | null>(null)
  const [timeAgoText, setTimeAgoText] = useState('')
  const [diff, setDiff] = useState<Diff | null>(null)
  const [cityFilter, setCityFilter] = useState<CityFilter>('')
  const prevJobsRef = useRef<Job[]>([])

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    const res = await fetch('/api/dashboard')
    const newData: DashboardData = await res.json()
    const now = new Date()

    if (isRefresh) {
      const prev = prevJobsRef.current
      const prevIds = new Set(prev.map(j => j.id))
      const newIds = new Set(newData.recentJobs.map(j => j.id))
      const added = newData.recentJobs.filter(j => !prevIds.has(j.id))
      const removed = prev.filter(j => !newIds.has(j.id))
      setDiff({ added, removed })
      setRefreshing(false)
    }

    prevJobsRef.current = newData.recentJobs
    setData(newData)
    setLastFetched(now)
    setTimeAgoText(timeAgo(now))
    setLoading(false)
  }, [])

  const AUTO_REFRESH_MS = 4 * 60 * 60 * 1000
  useEffect(() => { fetchData(false) }, [fetchData])
  useEffect(() => {
    const interval = setInterval(() => fetchData(true), AUTO_REFRESH_MS)
    return () => clearInterval(interval)
  }, [fetchData, AUTO_REFRESH_MS])
  useEffect(() => {
    if (!lastFetched) return
    const interval = setInterval(() => setTimeAgoText(timeAgo(lastFetched)), 15000)
    return () => clearInterval(interval)
  }, [lastFetched])

  // All unique jobs across both lists (for city counts)
  const allJobs = useMemo(() => {
    if (!data) return []
    const seen = new Set<number>()
    return [...data.urgentJobs, ...data.recentJobs].filter(j => {
      if (seen.has(j.id)) return false
      seen.add(j.id)
      return true
    })
  }, [data])

  const cityCounts = useMemo(() => ({
    '': allJobs.length,
    'Gurugram': allJobs.filter(j => j.location === 'Gurugram').length,
    'Delhi':    allJobs.filter(j => j.location === 'Delhi').length,
  }), [allJobs])

  // Filtered job lists
  const filteredUrgent = useMemo(() =>
    data ? (cityFilter ? data.urgentJobs.filter(j => j.location === cityFilter) : data.urgentJobs) : [],
    [data, cityFilter]
  )
  const filteredRecent = useMemo(() =>
    data ? (cityFilter ? data.recentJobs.filter(j => j.location === cityFilter) : data.recentJobs) : [],
    [data, cityFilter]
  )

  // Loading skeleton
  if (loading || !data) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="relative hero-gradient rounded-3xl overflow-hidden">
          <div className="absolute inset-0 dot-pattern" />
          <div className="relative px-8 py-10">
            <p className="text-sky-200 text-sm font-semibold uppercase tracking-wider mb-2">ENT Job Portal · Delhi-NCR</p>
            <h1 className="text-4xl font-extrabold text-white">Welcome, Dr. Tanvi! 👋</h1>
            <p className="mt-2 text-sky-100 text-base">Your ENT job search command center for Delhi-NCR</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card-flat">
              <div className="skeleton h-10 w-10 rounded-2xl mb-3" />
              <div className="skeleton h-7 w-16 rounded-lg mb-2" />
              <div className="skeleton h-4 w-24 rounded-lg" />
            </div>
          ))}
        </div>
        <div className="text-center py-4 text-gray-400 text-sm animate-pulse">Loading dashboard…</div>
      </div>
    )
  }

  const stats = [
    { value: data.totalActive,       label: 'Active Jobs',         icon: Briefcase,    gradient: 'from-sky-400 to-blue-600' },
    { value: data.totalHospitals,    label: 'Hospitals Listed',    icon: TrendingUp,   gradient: 'from-emerald-400 to-teal-600' },
    { value: data.totalApplications, label: 'Applications',        icon: ClipboardList,gradient: 'from-violet-400 to-purple-600' },
    { value: data.upcomingDeadlines, label: 'Upcoming Deadlines',  icon: Clock,        gradient: 'from-orange-400 to-amber-600' },
  ]

  const quickLinks = [
    { href: '/jobs',      label: 'Browse Jobs',    icon: Briefcase,    desc: `${data.totalActive} active listings`,      iconGradient: 'from-sky-400 to-blue-600',    ring: 'hover:ring-blue-200' },
    { href: '/hospitals', label: 'Hospitals',      icon: Building2,    desc: `${data.totalHospitals} hospitals listed`,  iconGradient: 'from-emerald-400 to-teal-600', ring: 'hover:ring-emerald-200' },
    { href: '/portals',   label: 'Job Portals',    icon: Globe,        desc: '17 portals with direct links',             iconGradient: 'from-violet-400 to-purple-600',ring: 'hover:ring-purple-200' },
    { href: '/tracker',   label: 'Applications',   icon: ClipboardList,desc: 'Track every application',                  iconGradient: 'from-orange-400 to-amber-600', ring: 'hover:ring-orange-200' },
    { href: '/checklist', label: 'Weekly Tasks',   icon: CheckSquare,  desc: '7 tasks to do weekly',                     iconGradient: 'from-pink-400 to-rose-600',    ring: 'hover:ring-pink-200' },
  ]

  const activeCityTab = cityTabs.find(t => t.id === cityFilter)!

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ── Hero ── */}
      <div className="relative hero-gradient rounded-3xl overflow-hidden shadow-lg">
        <div className="absolute inset-0 dot-pattern" />
        <div className="relative px-8 py-10 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-white/20 rounded-xl">
                <Stethoscope className="h-4 w-4 text-white" />
              </div>
              <p className="text-sky-200 text-sm font-semibold uppercase tracking-wider">ENT Job Portal · Delhi-NCR</p>
            </div>
            <h1 className="text-4xl font-extrabold text-white leading-tight">
              Welcome, Dr. Tanvi! <span className="animate-pulse-slow inline-block">👋</span>
            </h1>
            <p className="mt-2.5 text-sky-100 text-base max-w-lg">
              Your ENT job search command center. Track hospitals, monitor deadlines, and stay ahead of every opportunity.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <button
              onClick={() => fetchData(true)}
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

      {/* ── City Filter ── */}
      <div className="card-flat">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
          <MapPin className="h-3 w-3 inline mr-1 -mt-0.5" />
          Filter by City
        </p>
        <div className="grid grid-cols-3 gap-3">
          {cityTabs.map(tab => {
            const count = cityCounts[tab.id] ?? 0
            const isActive = cityFilter === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setCityFilter(tab.id)}
                className={`flex flex-col items-center gap-1.5 py-4 px-3 rounded-2xl font-semibold transition-all duration-200 active:scale-95 ${
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
                  {count} job{count !== 1 ? 's' : ''}
                </span>
              </button>
            )
          })}
        </div>

        {/* Active city banner */}
        {cityFilter && (
          <div className={`mt-3 flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-xl ${
            cityFilter === 'Gurugram' ? 'bg-violet-50 text-violet-700' : 'bg-amber-50 text-amber-700'
          }`}>
            <span>{activeCityTab.emoji}</span>
            Showing alerts &amp; jobs in <strong>{cityFilter}</strong>
            <button
              onClick={() => setCityFilter('')}
              className="ml-auto text-xs underline opacity-60 hover:opacity-100 font-normal"
            >
              Show all cities
            </button>
          </div>
        )}
      </div>

      {/* ── Urgent Alerts (city-filtered) ── */}
      <UrgentAlerts jobs={filteredUrgent} />

      {/* ── Stats (overall totals) ── */}
      <div>
        {cityFilter && (
          <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            Overall totals for all of Delhi-NCR
          </p>
        )}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="card flex items-center gap-4">
                <div className={`stat-icon bg-gradient-to-br ${stat.gradient} shadow-sm`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 leading-tight">{stat.label}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Quick Access ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Quick Access</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`card-flat group cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 hover:ring-2 ${link.ring} flex flex-col`}
              >
                <div className={`stat-icon bg-gradient-to-br ${link.iconGradient} shadow-sm mb-4 self-start`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-0.5 group-hover:text-primary-600 transition-colors">
                  {link.label}
                </h3>
                <p className="text-xs text-gray-500 flex-1">{link.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary-500 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  Open <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── Recent Jobs (city-filtered) ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Recent Jobs
              {cityFilter && (
                <span className={`ml-2 text-base font-semibold ${
                  cityFilter === 'Gurugram' ? 'text-violet-600' : 'text-amber-600'
                }`}>
                  in {cityFilter}
                </span>
              )}
            </h2>
          </div>
          <Link
            href="/jobs"
            className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-1 group"
          >
            View all <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Diff banner */}
        {diff !== null && (
          <div className={`rounded-xl border px-4 py-3 flex items-start gap-3 mb-4 ${
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

        {filteredRecent.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <Briefcase className="h-10 w-10 mx-auto text-gray-200 mb-2" />
            <p className="text-sm font-medium">No recent jobs in {cityFilter}.</p>
            <button
              onClick={() => setCityFilter('')}
              className="mt-2 text-xs text-primary-500 underline"
            >
              Show all cities
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRecent.map((job) => {
              const isNew = diff?.added.some(j => j.id === job.id)
              return (
                <div
                  key={job.id}
                  className={`card flex items-center justify-between gap-4 ${
                    isNew ? 'ring-2 ring-emerald-400 bg-emerald-50/30' : ''
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Type icon */}
                    <div className={`stat-icon flex-shrink-0 ${
                      job.type === 'govt'    ? 'bg-gradient-to-br from-emerald-400 to-teal-600' :
                      job.type === 'startup' ? 'bg-gradient-to-br from-violet-400 to-purple-600' :
                                              'bg-gradient-to-br from-sky-400 to-blue-600'
                    }`}>
                      <Briefcase className="h-4 w-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      {isNew && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mb-1">
                          <Plus className="h-3 w-3" /> New
                        </span>
                      )}
                      <h3 className="font-semibold text-gray-900 truncate">{job.title}</h3>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <p className="text-sm text-gray-500 truncate">{job.hospital_name}</p>
                        {/* City badge */}
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                          job.location === 'Gurugram' ? 'bg-violet-100 text-violet-700' :
                          job.location === 'Delhi'    ? 'bg-amber-100 text-amber-700' :
                                                       'bg-slate-100 text-slate-600'
                        }`}>
                          {job.location === 'Gurugram' ? '🏙️' : job.location === 'Delhi' ? '🏛️' : '📍'}
                          {job.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`badge ${
                      job.type === 'govt' ? 'badge-green' : job.type === 'startup' ? 'badge-purple' : 'badge-blue'
                    }`}>
                      {job.type.toUpperCase()}
                    </span>
                    {Boolean(job.apply_url) && (
                      <a
                        href={job.apply_url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-sm py-1.5"
                      >
                        Apply
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
