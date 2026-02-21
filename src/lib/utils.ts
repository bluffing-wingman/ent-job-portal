import { differenceInDays, differenceInHours, format, startOfWeek, parseISO, nextFriday, isAfter, isBefore, addDays } from 'date-fns'

export function getUrgencyColor(dateStr: string | null, recurring?: string | null): string {
  if (recurring) return 'yellow' // recurring walk-ins always yellow
  if (!dateStr) return 'green'
  const days = differenceInDays(parseISO(dateStr), new Date())
  if (days < 0) return 'gray'
  if (days < 3) return 'red'
  if (days < 7) return 'yellow'
  return 'green'
}

export function getCountdownText(dateStr: string | null, recurring?: string | null): string {
  if (recurring) {
    // Calculate next occurrence for recurring
    if (recurring.toLowerCase().includes('friday')) {
      const next = nextFriday(new Date())
      const days = differenceInDays(next, new Date())
      if (days === 0) return 'Today!'
      if (days === 1) return 'Tomorrow!'
      return `${days} days (next Friday)`
    }
    return recurring
  }
  if (!dateStr) return 'No deadline'
  const target = parseISO(dateStr)
  const now = new Date()
  const days = differenceInDays(target, now)
  if (days < 0) return 'Expired'
  if (days === 0) {
    const hours = differenceInHours(target, now)
    return hours <= 0 ? 'Today!' : `${hours} hours left`
  }
  if (days === 1) return 'Tomorrow!'
  return `${days} days left`
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A'
  return format(parseISO(dateStr), 'MMM d, yyyy')
}

export function formatSalary(min?: number | null, max?: number | null, text?: string | null): string {
  if (text) return text
  if (min && max && min !== max) return `₹${(min/1000).toFixed(0)}K - ₹${(max/1000).toFixed(0)}K/month`
  if (min) return `₹${(min/1000).toFixed(0)}K/month`
  return 'Not specified'
}

export function getCurrentWeekStart(): string {
  return format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    applied: 'blue',
    shortlisted: 'purple',
    interview_scheduled: 'orange',
    interviewed: 'orange',
    offered: 'green',
    accepted: 'green',
    rejected: 'red',
    withdrawn: 'gray',
  }
  return colors[status] || 'gray'
}

export function getStatusLabel(status: string): string {
  return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}
