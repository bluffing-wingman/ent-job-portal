'use client'

import { useState, useEffect, useMemo } from 'react'
import { Building2, ExternalLink, Globe, Stethoscope, Search, Filter, MapPin } from 'lucide-react'

interface Hospital {
  id: number
  name: string
  location: string
  tier: string
  type: string
  career_url: string | null
  website_url: string | null
  ent_dept_info: string | null
}

const tierStyles: Record<string, {
  label: string
  accent: string
  headerBg: string
  headerText: string
  badgeBg: string
  badgeText: string
  iconBg: string
}> = {
  tier1: {
    label: 'Tier 1 — Corporate Hospitals',
    accent: 'border-blue-500',
    headerBg: 'bg-blue-50',
    headerText: 'text-blue-800',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-700',
    iconBg: 'bg-blue-100',
  },
  tier2: {
    label: 'Tier 2 — Multispecialty',
    accent: 'border-teal-500',
    headerBg: 'bg-teal-50',
    headerText: 'text-teal-800',
    badgeBg: 'bg-teal-100',
    badgeText: 'text-teal-700',
    iconBg: 'bg-teal-100',
  },
  govt: {
    label: 'Government / Public',
    accent: 'border-emerald-500',
    headerBg: 'bg-emerald-50',
    headerText: 'text-emerald-800',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-700',
    iconBg: 'bg-emerald-100',
  },
  startup: {
    label: 'Startups / Chains',
    accent: 'border-violet-500',
    headerBg: 'bg-violet-50',
    headerText: 'text-violet-800',
    badgeBg: 'bg-violet-100',
    badgeText: 'text-violet-700',
    iconBg: 'bg-violet-100',
  },
  clinic: {
    label: 'ENT Clinics & Specialty Centers',
    accent: 'border-rose-500',
    headerBg: 'bg-rose-50',
    headerText: 'text-rose-800',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-700',
    iconBg: 'bg-rose-100',
  },
  college: {
    label: 'Medical Colleges with ENT Departments',
    accent: 'border-amber-500',
    headerBg: 'bg-amber-50',
    headerText: 'text-amber-800',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-700',
    iconBg: 'bg-amber-100',
  },
}

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [search, setSearch] = useState('')
  const [filterTier, setFilterTier] = useState('')
  const [filterType, setFilterType] = useState('')

  useEffect(() => {
    fetch('/api/hospitals').then(r => r.json()).then(setHospitals).catch(() => setHospitals([]))
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return hospitals.filter(h =>
      (!q || h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q) || h.ent_dept_info?.toLowerCase().includes(q)) &&
      (!filterTier || h.tier === filterTier) &&
      (!filterType || h.type === filterType)
    )
  }, [hospitals, search, filterTier, filterType])

  const grouped = filtered.reduce((acc, h) => {
    if (!acc[h.tier]) acc[h.tier] = []
    acc[h.tier].push(h)
    return acc
  }, {} as Record<string, Hospital[]>)

  const tierOrder = ['tier1', 'tier2', 'govt', 'clinic', 'college', 'startup'] as const

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ── Header ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-700 p-8 text-white shadow-lg">
        <div className="absolute inset-0 dot-pattern" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-xl">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold">Hospital Directory</h1>
            </div>
            <p className="text-teal-100 text-base">
              {hospitals.length} ENT departments mapped across Delhi-NCR
            </p>
          </div>
          <div className="shrink-0 hidden sm:flex flex-col items-end gap-2">
            <span className="text-4xl font-extrabold text-white/90">{filtered.length}</span>
            <span className="text-xs text-teal-200 font-medium uppercase tracking-wide">Showing</span>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="card-flat">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="font-semibold text-gray-700">Search & Filter</span>
          {(search || filterTier || filterType) && (
            <button
              onClick={() => { setSearch(''); setFilterTier(''); setFilterType('') }}
              className="ml-auto text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative sm:col-span-1">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search hospitals, locations, ENT info…"
              className="input-field pl-10"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="select-field" value={filterTier} onChange={e => setFilterTier(e.target.value)}>
            <option value="">All Tiers</option>
            <option value="tier1">Tier 1 — Corporate</option>
            <option value="tier2">Tier 2 — Multispecialty</option>
            <option value="govt">Government</option>
            <option value="clinic">ENT Clinics</option>
            <option value="college">Medical Colleges</option>
            <option value="startup">Startups / Chains</option>
          </select>
          <select className="select-field" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">All Types</option>
            <option value="govt">Government</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="font-medium">No hospitals match your search.</p>
          <p className="text-sm mt-1">Try adjusting your filters.</p>
        </div>
      )}

      {/* ── Grouped Sections ── */}
      {tierOrder.map((tier) => {
        const group = grouped[tier]
        if (!group || group.length === 0) return null
        const tierInfo = tierStyles[tier]
        return (
          <div key={tier}>
            {/* Section header */}
            <div className={`flex items-center gap-3 mb-5 pl-4 border-l-4 ${tierInfo.accent}`}>
              <div className={`p-1.5 rounded-lg ${tierInfo.iconBg}`}>
                <Building2 className={`h-4 w-4 ${tierInfo.headerText}`} />
              </div>
              <h2 className={`text-lg font-bold ${tierInfo.headerText}`}>{tierInfo.label}</h2>
              <span className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full ${tierInfo.badgeBg} ${tierInfo.badgeText}`}>
                {group.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.map((hospital) => (
                <div
                  key={hospital.id}
                  className="card flex flex-col"
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 leading-tight">{hospital.name}</h3>
                    <span className={`badge flex-shrink-0 ${hospital.type === 'govt' ? 'badge-green' : 'badge-blue'}`}>
                      {hospital.type === 'govt' ? 'Govt' : 'Private'}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                    <span>{hospital.location}</span>
                  </div>

                  {/* ENT info */}
                  {hospital.ent_dept_info && (
                    <div className="flex items-start gap-2 text-sm text-gray-600 mb-4 bg-primary-50/60 border border-primary-100 p-2.5 rounded-xl flex-1">
                      <Stethoscope className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{hospital.ent_dept_info}</span>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-auto pt-2">
                    {hospital.career_url && (
                      <a
                        href={hospital.career_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-sm flex items-center gap-1 flex-1 justify-center py-1.5"
                      >
                        Careers <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {hospital.website_url && (
                      <a
                        href={hospital.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-sm flex items-center gap-1 flex-1 justify-center py-1.5"
                      >
                        <Globe className="h-3 w-3" /> Website
                      </a>
                    )}
                    {!hospital.career_url && !hospital.website_url && (
                      <span className="text-xs text-gray-400 italic">No links available</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
