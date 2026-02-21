import { Application } from './data'

const APPS_KEY = 'ent_portal_applications'
const CHECKLIST_KEY = 'ent_portal_checklist'
const JOBS_KEY = 'ent_portal_custom_jobs'

// ---- Applications ----

export function getApplications(): Application[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(APPS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveApplication(app: Omit<Application, 'id'>): Application {
  const apps = getApplications()
  const newApp: Application = { ...app, id: Date.now() }
  apps.push(newApp)
  localStorage.setItem(APPS_KEY, JSON.stringify(apps))
  return newApp
}

export function updateApplication(id: number, updates: Partial<Application>): void {
  const apps = getApplications()
  const idx = apps.findIndex(a => a.id === id)
  if (idx !== -1) {
    apps[idx] = { ...apps[idx], ...updates }
    localStorage.setItem(APPS_KEY, JSON.stringify(apps))
  }
}

export function deleteApplication(id: number): void {
  const apps = getApplications().filter(a => a.id !== id)
  localStorage.setItem(APPS_KEY, JSON.stringify(apps))
}

// ---- Checklist ----

function getWeekStart(): string {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(now.setDate(diff))
  return monday.toISOString().split('T')[0]
}

export function getCompletedItems(): number[] {
  if (typeof window === 'undefined') return []
  const weekStart = getWeekStart()
  const data = localStorage.getItem(CHECKLIST_KEY)
  if (!data) return []
  const parsed = JSON.parse(data)
  if (parsed.weekStart !== weekStart) {
    // Auto-reset for new week
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify({ weekStart, completed: [] }))
    return []
  }
  return parsed.completed || []
}

export function toggleChecklistItem(id: number): number[] {
  const weekStart = getWeekStart()
  const completed = getCompletedItems()
  const idx = completed.indexOf(id)
  if (idx !== -1) {
    completed.splice(idx, 1)
  } else {
    completed.push(id)
  }
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify({ weekStart, completed }))
  return completed
}

// ---- Custom Jobs (added via admin) ----

import { Job } from './data'

export function getCustomJobs(): Job[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(JOBS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveCustomJob(job: Omit<Job, 'id' | 'is_active' | 'created_at'>): Job {
  const jobs = getCustomJobs()
  const newJob: Job = {
    ...job,
    id: Date.now(),
    is_active: true,
    created_at: new Date().toISOString().split('T')[0],
  }
  jobs.push(newJob)
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs))
  return newJob
}
