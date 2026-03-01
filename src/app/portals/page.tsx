'use client'

import { useState, useEffect, useMemo } from 'react'
import { Globe, ExternalLink, Search, CheckCircle2, Circle } from 'lucide-react'

interface Portal {
  id: number
  name: string
  category: string
  url: string
  search_url: string | null
  is_registered: number
  description: string | null
}

const categoryLabels: Record<string, { label: string; color: string }> = {
  general: { label: 'General Job Portals', color: 'text-blue-700' },
  medical: { label: 'Medical-Specific Portals', color: 'text-emerald-700' },
  government: { label: 'Government Portals', color: 'text-orange-700' },
}

export default function PortalsPage() {
  const [portals, setPortals] = useState<Portal[]>([])
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  useEffect(() => {
    fetch('/api/portals').then(r => r.json()).then(setPortals).catch(() => setPortals([]))
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return portals.filter(p =>
      (!q || p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)) &&
      (!filterCategory || p.category === filterCategory)
    )
  }, [portals, search, filterCategory])

  const grouped = filtered.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = []
    acc[p.category].push(p)
    return acc
  }, {} as Record<string, Portal[]>)

  const categoryOrder = ['general', 'medical', 'government'] as const

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Globe className="h-7 w-7 text-primary-500" />
          Job Portals
        </h1>
        <p className="text-gray-500 mt-1">{filtered.length} of {portals.length} portals with pre-configured ENT search links</p>
      </div>

      <div className="card">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search portals..."
              className="input-field pl-10"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="select-field w-48" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="general">General</option>
            <option value="medical">Medical</option>
            <option value="government">Government</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">No portals match your search.</div>
      )}

      {categoryOrder.map((cat) => {
        const group = grouped[cat]
        if (!group || group.length === 0) return null
        const catInfo = categoryLabels[cat]
        return (
          <div key={cat}>
            <h2 className={`text-xl font-bold mb-4 ${catInfo.color}`}>
              {catInfo.label} ({group.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.map((portal) => (
                <div key={portal.id} className="card hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{portal.name}</h3>
                    {portal.is_registered ? (
                      <span className="badge badge-green flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Registered
                      </span>
                    ) : (
                      <span className="badge bg-gray-100 text-gray-500 flex items-center gap-1">
                        <Circle className="h-3 w-3" /> Not registered
                      </span>
                    )}
                  </div>
                  {portal.description && (
                    <p className="text-sm text-gray-600 mb-4">{portal.description}</p>
                  )}
                  <div className="flex gap-2">
                    {portal.search_url && (
                      <a
                        href={portal.search_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-sm flex items-center gap-1 flex-1 justify-center"
                      >
                        <Search className="h-3 w-3" /> Search ENT Jobs
                      </a>
                    )}
                    <a
                      href={portal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-sm flex items-center gap-1 flex-1 justify-center"
                    >
                      Visit <ExternalLink className="h-3 w-3" />
                    </a>
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
