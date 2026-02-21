'use client'

import { useState } from 'react'
import { Settings, Plus, Loader2 } from 'lucide-react'
import { saveCustomJob } from '@/lib/storage'

export default function AdminPage() {
  const [form, setForm] = useState({
    title: '', hospital_name: '', location: 'Gurugram', type: 'private' as 'govt' | 'private' | 'startup',
    salary_text: '', walk_in_date: '', walk_in_recurring: '',
    deadline: '', apply_url: '', description: '', source: ''
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    saveCustomJob({
      title: form.title,
      hospital_name: form.hospital_name,
      location: form.location,
      type: form.type,
      salary_min: null,
      salary_max: null,
      salary_text: form.salary_text || null,
      walk_in_date: form.walk_in_date || null,
      walk_in_recurring: form.walk_in_recurring || null,
      deadline: form.deadline || null,
      apply_url: form.apply_url || null,
      description: form.description || null,
      source: form.source || null,
    })

    setMessage('Job added successfully! View it on the Jobs page.')
    setForm({ title: '', hospital_name: '', location: 'Gurugram', type: 'private', salary_text: '', walk_in_date: '', walk_in_recurring: '', deadline: '', apply_url: '', description: '', source: '' })
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="h-7 w-7 text-primary-500" />
          Admin Panel
        </h1>
        <p className="text-gray-500 mt-1">Add new job listings</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4 max-w-2xl">
        <h2 className="font-semibold text-lg">Add New Job</h2>
        {message && (
          <div className="p-3 rounded-lg text-sm bg-green-50 text-green-700">{message}</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input className="input-field" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hospital *</label>
            <input className="input-field" required value={form.hospital_name} onChange={e => setForm(f => ({ ...f, hospital_name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <select className="select-field" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}>
              <option value="Gurugram">Gurugram</option>
              <option value="Delhi">Delhi</option>
              <option value="Haryana">Haryana</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select className="select-field" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as typeof form.type }))}>
              <option value="private">Private</option>
              <option value="govt">Government</option>
              <option value="startup">Startup</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
            <input className="input-field" placeholder="e.g. ₹67,000/month" value={form.salary_text} onChange={e => setForm(f => ({ ...f, salary_text: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Walk-in Date</label>
            <input type="date" className="input-field" value={form.walk_in_date} onChange={e => setForm(f => ({ ...f, walk_in_date: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recurring Walk-in</label>
            <input className="input-field" placeholder="e.g. Every Friday" value={form.walk_in_recurring} onChange={e => setForm(f => ({ ...f, walk_in_recurring: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
            <input type="date" className="input-field" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Apply URL</label>
            <input className="input-field" placeholder="https://..." value={form.apply_url} onChange={e => setForm(f => ({ ...f, apply_url: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea className="input-field" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <input className="input-field" placeholder="e.g. Delhi Health Dept" value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} />
          </div>
        </div>
        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          {saving ? 'Adding...' : 'Add Job'}
        </button>
      </form>
    </div>
  )
}
