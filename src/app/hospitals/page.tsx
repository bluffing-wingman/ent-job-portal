'use client'

import { useState, useEffect, useMemo } from 'react'
import { Building2, ExternalLink, Globe, Stethoscope, Search, Filter } from 'lucide-react'

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

const tierLabels: Record<string, { label: string; color: string }> = {
  tier1: { label: 'Tier 1 — Corporate Hospitals', color: 'text-blue-700' },
  tier2: { label: 'Tier 2 — Multispecialty', color: 'text-teal-700' },
  govt: { label: 'Government / Public', color: 'text-green-700' },
  startup: { label: 'Startups / Chains', color: 'text-purple-700' },
  clinic: { label: 'ENT Clinics & Specialty Centers', color: 'text-rose-700' },
  college: { label: 'Medical Colleges with ENT Departments', color: 'text-amber-700' },
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Building2 className="h-7 w-7 text-primary-500" />
          Hospital Directory
        </h1>
        <p className="text-gray-500 mt-1">{filtered.length} of {hospitals.length} hospitals in Delhi-NCR</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-4"><Filter className="h-4 w-4 text-gray-500" /><span className="font-medium text-gray-700">Search & Filter</span></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative sm:col-span-1">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search hospitals..."
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
        <div className="text-center py-12 text-gray-500">No hospitals match your search.</div>
      )}

      {tierOrder.map((tier) => {
        const group = grouped[tier]
        if (!group || group.length === 0) return null
        const tierInfo = tierLabels[tier]
        return (
          <div key={tier}>
            <h2 className={`text-xl font-bold mb-4 ${tierInfo.color}`}>
              {tierInfo.label} ({group.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.map((hospital) => (
                <div key={hospital.id} className="card hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{hospital.name}</h3>
                    <span className={`badge ${hospital.type === 'govt' ? 'badge-green' : 'badge-blue'}`}>
                      {hospital.type === 'govt' ? 'Govt' : 'Private'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{hospital.location}</p>
                  {hospital.ent_dept_info && (
                    <div className="flex items-start gap-2 text-sm text-gray-600 mb-4 bg-gray-50 p-2 rounded-lg">
                      <Stethoscope className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" />
                      <span>{hospital.ent_dept_info}</span>
                    </div>
                  )}
                  <div className="flex gap-2 mt-auto">
                    {hospital.career_url && (
                      <a
                        href={hospital.career_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-sm flex items-center gap-1 flex-1 justify-center"
                      >
                        Careers <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {hospital.website_url && (
                      <a
                        href={hospital.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-sm flex items-center gap-1 flex-1 justify-center"
                      >
                        <Globe className="h-3 w-3" /> Website
                      </a>
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
