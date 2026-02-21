'use client'

import { useState, useEffect } from 'react'
import { CheckSquare, Square, ExternalLink, RefreshCw } from 'lucide-react'

interface ChecklistItem {
  id: number
  title: string
  url: string | null
  category: string | null
  sort_order: number
  completed: number
}

export default function ChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    const res = await fetch('/api/checklist')
    const data = await res.json()
    setItems(data)
    setLoading(false)
  }

  async function toggleItem(id: number) {
    await fetch(`/api/checklist/${id}`, { method: 'PUT' })
    fetchItems()
  }

  const completedCount = items.filter(i => i.completed).length
  const totalCount = items.length
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CheckSquare className="h-7 w-7 text-primary-500" />
          Weekly Checklist
        </h1>
        <p className="text-gray-500 mt-1">Resets every Monday. Stay consistent!</p>
      </div>

      {/* Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium text-gray-700">{completedCount} of {totalCount} completed</span>
          <span className="text-sm text-gray-500">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-primary-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {percentage === 100 && (
          <p className="text-sm text-green-600 font-medium mt-2">All tasks completed this week! Great job!</p>
        )}
      </div>

      {/* Items */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`card flex items-center gap-3 cursor-pointer transition-all ${
                item.completed ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'
              }`}
              onClick={() => toggleItem(item.id)}
            >
              {item.completed ? (
                <CheckSquare className="h-5 w-5 text-green-500 flex-shrink-0" />
              ) : (
                <Square className="h-5 w-5 text-gray-300 flex-shrink-0" />
              )}
              <span className={`flex-1 ${item.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                {item.title}
              </span>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 text-primary-500 hover:bg-primary-50 rounded"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
