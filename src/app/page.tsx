'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Briefcase, Building2, Globe, ClipboardList, CheckSquare, TrendingUp, Clock, ArrowRight, RefreshCw, Plus, Minus, X } from 'lucide-react'
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

  useEffect(() => { fetchData(false) }, [fetchData])

  useEffect(() => {
    if (!lastFetched) return
    const interval = setInterval(() => setTimeAgoText(timeAgo(lastFetched)), 15000)
    return () => clearInterval(interval)
  }, [lastFetched])

  if (loading || !data) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold">Welcome, Dr. Tanvi!</h1>
          <p className="mt-2 text-primary-100">Your ENT job search command center for Delhi-NCR</p>
        </div>
        <div className="text-center py-12 text-gray-400">Loading...</div>
      </div>
    )
  }

  const quickLinks = [
    { href: '/jobs', label: 'Browse Jobs', icon: Briefcase, color: 'bg-blue-50 text-blue-700 border-blue-200', desc: `${data.totalActive} active listings` },
    { href: '/hospitals', label: 'Hospitals', icon: Building2, color: 'bg-emerald-50 text-emerald-700 border-emerald-200', desc: `${data.totalHospitals} hospitals listed` },
    { href: '/portals', label: 'Job Portals', icon: Globe, color: 'bg-purple-50 text-purple-700 border-purple-200', desc: '17 portals with direct links' },
    { href: '/tracker', label: 'Applications', icon: ClipboardList, color: 'bg-orange-50 text-orange-700 border-orange-200', desc: 'Track your applications' },
    { href: '/checklist', label: 'Weekly Checklist', icon: CheckSquare, color: 'bg-pink-50 text-pink-700 border-pink-200', desc: '7 tasks to do weekly' },
  ]

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-8 text-white flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome, Dr. Tanvi!</h1>
          <p className="mt-2 text-primary-100">Your ENT job search command center for Delhi-NCR</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 text-sm bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Checking...' : 'Refresh'}
          </button>
          {lastFetched && (
            <span className="text-xs text-primary-200">Updated {timeAgoText}</span>
          )}
        </div>
      </div>

      <UrgentAlerts jobs={data.urgentJobs} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg"><Briefcase className="h-6 w-6 text-blue-600" /></div>
          <div><p className="text-2xl font-bold text-gray-900">{data.totalActive}</p><p className="text-sm text-gray-500">Active Jobs</p></div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-lg"><TrendingUp className="h-6 w-6 text-green-600" /></div>
          <div><p className="text-2xl font-bold text-gray-900">{data.totalHospitals}</p><p className="text-sm text-gray-500">Hospitals</p></div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-lg"><ClipboardList className="h-6 w-6 text-purple-600" /></div>
          <div><p className="text-2xl font-bold text-gray-900">{data.totalApplications}</p><p className="text-sm text-gray-500">Applications</p></div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-orange-50 rounded-lg"><Clock className="h-6 w-6 text-orange-600" /></div>
          <div><p className="text-2xl font-bold text-gray-900">{data.upcomingDeadlines}</p><p className="text-sm text-gray-500">Upcoming Deadlines</p></div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link key={link.href} href={link.href} className={`card border ${link.color} hover:shadow-lg transition-all group`}>
                <Icon className="h-8 w-8 mb-3" />
                <h3 className="font-semibold text-lg">{link.label}</h3>
                <p className="text-sm opacity-75 mt-1">{link.desc}</p>
                <ArrowRight className="h-4 w-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            )
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Jobs</h2>
          <Link href="/jobs" className="text-primary-600 hover:text-primary-700 text-sm font-medium">View all →</Link>
        </div>

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

        <div className="space-y-3">
          {data.recentJobs.map((job) => {
            const isNew = diff?.added.some(j => j.id === job.id)
            return (
              <div key={job.id} className={`card flex items-center justify-between ${isNew ? 'ring-2 ring-emerald-400' : ''}`}>
                <div>
                  {isNew && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mb-1">
                      <Plus className="h-3 w-3" /> New
                    </span>
                  )}
                  <h3 className="font-medium text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-500">{job.hospital_name} • {job.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge ${job.type === 'govt' ? 'badge-green' : 'badge-blue'}`}>
                    {job.type.toUpperCase()}
                  </span>
                  {Boolean(job.apply_url) && (
                    <a href={job.apply_url!} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">Apply</a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
