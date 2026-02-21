'use client'

import { useState, useEffect } from 'react'
import { Globe, ExternalLink, Search, CheckCircle2, Circle } from 'lucide-react'

interface Portal {
  id: number
  name: string
  category: string
  url: string
  search_url: string | null
  description: string | null
  is_registered: number
}

const categoryLabels: Record<string, { label: string; color: string; bg: string }> = {
  general: { label: 'General Job Portals', color: 'text-blue-700', bg: 'bg-blue-50' },
  medical: { label: 'Medical-Specific Portals', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  government: { label: 'Government Portals', color: 'text-orange-700', bg: 'bg-orange-50' },
}

export default function PortalsPage() {
  const [portals, setPortals] = useState<Portal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/portals')
      .then(r => r.json())
      .then(data => { setPortals(data); setLoading(false) })
  }, [])

  const grouped = portals.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = []
    acc[p.category].push(p)
    return acc
  }, {} as Record<string, Portal[]>)

  const categoryOrder = ['general', 'medical', 'government']

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Globe className="h-7 w-7 text-primary-500" />
          Job Portals
        </h1>
        <p className="text-gray-500 mt-1">{portals.length} portals with pre-configured ENT search links</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading portals...</div>
      ) : (
        categoryOrder.map((cat) => {
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
        })
      )}
    </div>
  )
}
