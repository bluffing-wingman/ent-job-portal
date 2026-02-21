'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Briefcase, Building2, Globe, ClipboardList, CheckSquare, TrendingUp, Clock, ArrowRight } from 'lucide-react'
import { jobs as seedJobs, Job } from '@/lib/data'
import { getCustomJobs, getApplications } from '@/lib/storage'
import UrgentAlerts from '@/components/UrgentAlerts'

export default function Dashboard() {
  const [allJobs, setAllJobs] = useState<Job[]>(seedJobs)
  const [appCount, setAppCount] = useState(0)

  useEffect(() => {
    const custom = getCustomJobs()
    setAllJobs([...seedJobs, ...custom])
    setAppCount(getApplications().length)
  }, [])

  const activeJobs = allJobs.filter(j => j.is_active)
  const urgentJobs = activeJobs.filter(j => j.walk_in_date || j.walk_in_recurring)
  const upcomingDeadlines = activeJobs.filter(j => j.deadline && new Date(j.deadline) > new Date()).length

  const quickLinks = [
    { href: '/jobs', label: 'Browse Jobs', icon: Briefcase, color: 'bg-blue-50 text-blue-700 border-blue-200', desc: `${activeJobs.length} active listings` },
    { href: '/hospitals', label: 'Hospitals', icon: Building2, color: 'bg-emerald-50 text-emerald-700 border-emerald-200', desc: '27 hospitals listed' },
    { href: '/portals', label: 'Job Portals', icon: Globe, color: 'bg-purple-50 text-purple-700 border-purple-200', desc: '17 portals with direct links' },
    { href: '/tracker', label: 'Applications', icon: ClipboardList, color: 'bg-orange-50 text-orange-700 border-orange-200', desc: 'Track your applications' },
    { href: '/checklist', label: 'Weekly Checklist', icon: CheckSquare, color: 'bg-pink-50 text-pink-700 border-pink-200', desc: '7 tasks to do weekly' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold">Welcome, Dr. Tanvi!</h1>
        <p className="mt-2 text-primary-100">Your ENT job search command center for Delhi-NCR</p>
      </div>

      {/* Urgent Alerts */}
      <UrgentAlerts jobs={urgentJobs} />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Briefcase className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{activeJobs.length}</p>
            <p className="text-sm text-gray-500">Active Jobs</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{allJobs.length}</p>
            <p className="text-sm text-gray-500">Total Listings</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-lg">
            <ClipboardList className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{appCount}</p>
            <p className="text-sm text-gray-500">Applications</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-orange-50 rounded-lg">
            <Clock className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{upcomingDeadlines}</p>
            <p className="text-sm text-gray-500">Upcoming Deadlines</p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
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

      {/* Recent Jobs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Jobs</h2>
          <Link href="/jobs" className="text-primary-600 hover:text-primary-700 text-sm font-medium">View all →</Link>
        </div>
        <div className="space-y-3">
          {activeJobs.slice(0, 5).map((job) => (
            <div key={job.id} className="card flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-500">{job.hospital_name} • {job.location}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge ${job.type === 'govt' ? 'badge-green' : 'badge-blue'}`}>
                  {job.type.toUpperCase()}
                </span>
                {job.apply_url && (
                  <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
                    Apply
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
