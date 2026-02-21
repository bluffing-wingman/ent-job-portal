'use client'

import { useState } from 'react'
import { Settings, Plus, Play, Mail, Send, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'scraper' | 'notifications'>('jobs')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="h-7 w-7 text-primary-500" />
          Admin Panel
        </h1>
        <p className="text-gray-500 mt-1">Manage jobs, scraper, and notifications</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { key: 'jobs', label: 'Add Job', icon: Plus },
          { key: 'scraper', label: 'Scraper', icon: Play },
          { key: 'notifications', label: 'Notifications', icon: Mail },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" /> {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'jobs' && <AddJobForm />}
      {activeTab === 'scraper' && <ScraperPanel />}
      {activeTab === 'notifications' && <NotificationPanel />}
    </div>
  )
}

function AddJobForm() {
  const [form, setForm] = useState({
    title: '', hospital_name: '', location: 'Gurugram', type: 'private',
    salary_text: '', walk_in_date: '', walk_in_recurring: '',
    deadline: '', apply_url: '', description: '', source: ''
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setMessage('Job added successfully!')
        setForm({ title: '', hospital_name: '', location: 'Gurugram', type: 'private', salary_text: '', walk_in_date: '', walk_in_recurring: '', deadline: '', apply_url: '', description: '', source: '' })
      } else {
        setMessage('Failed to add job')
      }
    } catch {
      setMessage('Error adding job')
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 max-w-2xl">
      <h2 className="font-semibold text-lg">Add New Job</h2>
      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
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
          <select className="select-field" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
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
  )
}

function ScraperPanel() {
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<{ totalFound: number; newJobs: number; errors: string[] } | null>(null)
  const [runs, setRuns] = useState<Record<string, unknown>[]>([])

  async function runScraper() {
    setRunning(true)
    setResult(null)
    try {
      const res = await fetch('/api/scraper/run', { method: 'POST' })
      const data = await res.json()
      setResult(data)
      fetchRuns()
    } catch {
      setResult({ totalFound: 0, newJobs: 0, errors: ['Failed to connect'] })
    }
    setRunning(false)
  }

  async function fetchRuns() {
    const res = await fetch('/api/scraper/status')
    const data = await res.json()
    setRuns(data)
  }

  useState(() => { fetchRuns() })

  return (
    <div className="space-y-6">
      <div className="card max-w-2xl">
        <h2 className="font-semibold text-lg mb-4">Scraper Control</h2>
        <p className="text-sm text-gray-600 mb-4">
          Scrapes government job websites for ENT-related positions. Targets: Delhi Health Dept, Haryana Health, VMMC, AIIMS, HPSC.
        </p>
        <button onClick={runScraper} disabled={running} className="btn-primary flex items-center gap-2">
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          {running ? 'Scraping...' : 'Run Scraper Now'}
        </button>

        {result && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-sm"><strong>Jobs Found:</strong> {result.totalFound}</span>
              <span className="text-sm"><strong>New Jobs:</strong> {result.newJobs}</span>
            </div>
            {result.errors.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-red-600">Errors:</p>
                {result.errors.map((err, i) => (
                  <p key={i} className="text-sm text-red-500">{err}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {runs.length > 0 && (
        <div className="card max-w-2xl">
          <h3 className="font-semibold mb-3">Recent Scraper Runs</h3>
          <div className="space-y-2">
            {runs.slice(0, 10).map((run, i) => (
              <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-gray-100">
                <span className="text-gray-600 truncate flex-1">{run.source_url as string}</span>
                <span className={`badge ml-2 ${
                  run.status === 'completed' ? 'badge-green' :
                  run.status === 'failed' ? 'badge-red' : 'badge-yellow'
                }`}>
                  {run.status as string}
                </span>
                <span className="text-gray-400 ml-2 text-xs">{(run.started_at as string)?.slice(0, 16)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function NotificationPanel() {
  const [sending, setSending] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, string>>({})

  async function sendAction(type: string, url: string) {
    setSending(type)
    try {
      const res = await fetch(url, { method: 'POST' })
      const data = await res.json()
      setResults(r => ({ ...r, [type]: data.success ? 'Sent successfully!' : (data.error || 'Failed') }))
    } catch {
      setResults(r => ({ ...r, [type]: 'Failed to send' }))
    }
    setSending(null)
  }

  return (
    <div className="card max-w-2xl space-y-6">
      <h2 className="font-semibold text-lg">Email Notifications</h2>
      <p className="text-sm text-gray-600">
        Configure Gmail SMTP credentials in <code className="bg-gray-100 px-1 rounded">.env.local</code> to enable email notifications.
      </p>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium">Test Email</h3>
            <p className="text-sm text-gray-500">Send a test email to verify configuration</p>
          </div>
          <button
            onClick={() => sendAction('test', '/api/notifications/test')}
            disabled={sending === 'test'}
            className="btn-primary flex items-center gap-2"
          >
            {sending === 'test' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send Test
          </button>
        </div>
        {results.test && (
          <p className={`text-sm ${results.test.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{results.test}</p>
        )}

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium">Weekly Digest</h3>
            <p className="text-sm text-gray-500">Send the weekly job digest email now</p>
          </div>
          <button
            onClick={() => sendAction('digest', '/api/notifications/digest')}
            disabled={sending === 'digest'}
            className="btn-primary flex items-center gap-2"
          >
            {sending === 'digest' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            Send Digest
          </button>
        </div>
        {results.digest && (
          <p className={`text-sm ${results.digest.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{results.digest}</p>
        )}
      </div>
    </div>
  )
}
