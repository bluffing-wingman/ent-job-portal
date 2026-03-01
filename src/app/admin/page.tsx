'use client'

import { useState } from 'react'
import { Settings, Plus, Loader2, Play, Mail, AlertCircle, CheckCircle } from 'lucide-react'

export default function AdminPage() {
  const [form, setForm] = useState({
    title: '', hospital_name: '', location: 'Gurugram', type: 'private' as 'govt' | 'private' | 'startup',
    salary_text: '', walk_in_date: '', walk_in_recurring: '',
    deadline: '', apply_url: '', description: '', source: ''
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [scraperRunning, setScraperRunning] = useState(false)
  const [scraperResult, setScraperResult] = useState<string | null>(null)

  const [emailSending, setEmailSending] = useState(false)
  const [emailResult, setEmailResult] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        }),
      })

      if (res.ok) {
        setMessage('Job added successfully! View it on the Jobs page.')
        setForm({ title: '', hospital_name: '', location: 'Gurugram', type: 'private', salary_text: '', walk_in_date: '', walk_in_recurring: '', deadline: '', apply_url: '', description: '', source: '' })
      } else {
        setMessage('Failed to add job. Please try again.')
      }
    } catch {
      setMessage('Failed to add job. Please try again.')
    }

    setSaving(false)
  }

  async function runScraper() {
    setScraperRunning(true)
    setScraperResult(null)
    try {
      const res = await fetch('/api/scraper/run', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setScraperResult(`Scraper completed. Found ${data.totalFound ?? 0} jobs, ${data.newJobs ?? 0} new.`)
      } else {
        setScraperResult(`Scraper error: ${data.error || 'Unknown error'}`)
      }
    } catch {
      setScraperResult('Failed to run scraper.')
    }
    setScraperRunning(false)
  }

  async function sendTestEmail() {
    setEmailSending(true)
    setEmailResult(null)
    try {
      const res = await fetch('/api/notifications/test', { method: 'POST' })
      const data = await res.json()
      if (res.ok && data.success) {
        setEmailResult('Test email sent successfully!')
      } else {
        setEmailResult(`Email failed: ${data.error || 'Check GMAIL_USER and GMAIL_APP_PASSWORD env vars'}`)
      }
    } catch {
      setEmailResult('Failed to send test email.')
    }
    setEmailSending(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="h-7 w-7 text-primary-500" />
          Admin Panel
        </h1>
        <p className="text-gray-500 mt-1">Manage jobs, scraper, and notifications</p>
      </div>

      {/* Add Job Form */}
      <form onSubmit={handleSubmit} className="card space-y-4 max-w-2xl">
        <h2 className="font-semibold text-lg">Add New Job</h2>
        {message && (
          <div className={`p-3 rounded-lg text-sm ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message}</div>
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

      {/* Scraper Control */}
      <div className="card max-w-2xl">
        <h2 className="font-semibold text-lg mb-4">Scraper</h2>
        <p className="text-sm text-gray-500 mb-4">Run the web scraper to check government job sites for new ENT listings.</p>
        <button onClick={runScraper} disabled={scraperRunning} className="btn-primary flex items-center gap-2">
          {scraperRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          {scraperRunning ? 'Running...' : 'Run Scraper'}
        </button>
        {scraperResult && (
          <div className={`mt-3 p-3 rounded-lg text-sm flex items-center gap-2 ${scraperResult.includes('error') || scraperResult.includes('Failed') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {scraperResult.includes('error') || scraperResult.includes('Failed') ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            {scraperResult}
          </div>
        )}
      </div>

      {/* Email Notifications */}
      <div className="card max-w-2xl">
        <h2 className="font-semibold text-lg mb-4">Email Notifications</h2>
        <p className="text-sm text-gray-500 mb-4">Send a test email to verify notification setup. Requires GMAIL_USER and GMAIL_APP_PASSWORD environment variables.</p>
        <button onClick={sendTestEmail} disabled={emailSending} className="btn-primary flex items-center gap-2">
          {emailSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          {emailSending ? 'Sending...' : 'Send Test Email'}
        </button>
        {emailResult && (
          <div className={`mt-3 p-3 rounded-lg text-sm flex items-center gap-2 ${emailResult.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {emailResult.includes('success') ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {emailResult}
          </div>
        )}
      </div>
    </div>
  )
}
