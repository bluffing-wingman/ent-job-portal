'use client'

import { useState, useEffect } from 'react'
import { ClipboardList, Plus, Edit2, Trash2, Clock, X } from 'lucide-react'
import { getStatusLabel } from '@/lib/utils'
import { Application } from '@/lib/data'
import { getApplications, saveApplication, updateApplication, deleteApplication } from '@/lib/storage'

const statuses = ['applied', 'shortlisted', 'interview_scheduled', 'interviewed', 'offered', 'accepted', 'rejected', 'withdrawn']

const statusColors: Record<string, string> = {
  applied: 'badge-blue',
  shortlisted: 'badge-purple',
  interview_scheduled: 'badge-orange',
  interviewed: 'badge-orange',
  offered: 'badge-green',
  accepted: 'badge-green',
  rejected: 'badge-red',
  withdrawn: 'bg-gray-100 text-gray-600',
}

export default function TrackerPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Application | null>(null)
  const [form, setForm] = useState({
    hospital_name: '', position: '', applied_date: '', status: 'applied', follow_up_date: '', notes: ''
  })

  useEffect(() => {
    setApplications(getApplications())
  }, [])

  function refresh() {
    setApplications(getApplications())
  }

  function openNew() {
    setEditing(null)
    setForm({ hospital_name: '', position: '', applied_date: new Date().toISOString().split('T')[0], status: 'applied', follow_up_date: '', notes: '' })
    setShowModal(true)
  }

  function openEdit(app: Application) {
    setEditing(app)
    setForm({
      hospital_name: app.hospital_name, position: app.position,
      applied_date: app.applied_date, status: app.status,
      follow_up_date: app.follow_up_date || '', notes: app.notes || ''
    })
    setShowModal(true)
  }

  function handleSave() {
    if (editing) {
      updateApplication(editing.id, form)
    } else {
      saveApplication({
        hospital_name: form.hospital_name,
        position: form.position,
        applied_date: form.applied_date,
        status: form.status,
        follow_up_date: form.follow_up_date || null,
        notes: form.notes || null,
      })
    }
    setShowModal(false)
    refresh()
  }

  function handleDelete(id: number) {
    if (!confirm('Delete this application?')) return
    deleteApplication(id)
    refresh()
  }

  function getFollowUpStatus(date: string | null): { text: string; color: string } {
    if (!date) return { text: '', color: '' }
    const diff = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (diff < 0) return { text: `${Math.abs(diff)}d overdue`, color: 'text-red-600 font-medium' }
    if (diff === 0) return { text: 'Today', color: 'text-orange-600 font-medium' }
    return { text: `in ${diff}d`, color: 'text-gray-500' }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardList className="h-7 w-7 text-primary-500" />
            Application Tracker
          </h1>
          <p className="text-gray-500 mt-1">{applications.length} applications tracked</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Application
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="card text-center py-12">
          <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No applications tracked yet.</p>
          <button onClick={openNew} className="btn-primary mt-4">Add your first application</button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Hospital</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Position</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Applied</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Follow-up</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => {
                const followUp = getFollowUpStatus(app.follow_up_date)
                return (
                  <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{app.hospital_name}</td>
                    <td className="py-3 px-4 text-gray-600">{app.position}</td>
                    <td className="py-3 px-4 text-gray-600">{app.applied_date}</td>
                    <td className="py-3 px-4">
                      <span className={`badge ${statusColors[app.status] || 'bg-gray-100 text-gray-600'}`}>
                        {getStatusLabel(app.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {app.follow_up_date && (
                        <span className={`flex items-center gap-1 text-sm ${followUp.color}`}>
                          <Clock className="h-3 w-3" /> {followUp.text}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(app)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(app.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{editing ? 'Edit Application' : 'Add Application'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hospital</label>
                <input className="input-field" value={form.hospital_name} onChange={e => setForm(f => ({ ...f, hospital_name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <input className="input-field" value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Applied Date</label>
                <input type="date" className="input-field" value={form.applied_date} onChange={e => setForm(f => ({ ...f, applied_date: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="select-field" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  {statuses.map(s => <option key={s} value={s}>{getStatusLabel(s)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                <input type="date" className="input-field" value={form.follow_up_date} onChange={e => setForm(f => ({ ...f, follow_up_date: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea className="input-field" rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSave} className="btn-primary flex-1">{editing ? 'Update' : 'Add'} Application</button>
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
