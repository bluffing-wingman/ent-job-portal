import cron from 'node-cron'
import { runScraper } from '../src/lib/scraper'
import { sendWalkInReminder, sendWeeklyDigest } from '../src/lib/email'
import Database from 'better-sqlite3'
import path from 'path'
import { differenceInDays, parseISO, nextFriday } from 'date-fns'

const DB_PATH = path.resolve(process.env.DATABASE_PATH || './data/portal.db')

function getSchedulerDb() {
  const db = new Database(DB_PATH)
  db.pragma('journal_mode = WAL')
  return db
}

console.log('=== ENT Job Portal Scheduler Started ===')
console.log(`Time: ${new Date().toISOString()}`)
console.log(`Database: ${DB_PATH}`)

// Every 6 hours — run all scrapers
cron.schedule('0 */6 * * *', async () => {
  console.log(`[${new Date().toISOString()}] Running scheduled scraper...`)
  try {
    const result = await runScraper()
    console.log(`Scraper complete: ${result.totalFound} found, ${result.newJobs} new`)
    if (result.errors.length > 0) {
      console.log('Scraper errors:', result.errors)
    }
  } catch (err) {
    console.error('Scraper failed:', err)
  }
})

// Daily at 8 AM IST (2:30 AM UTC) — walk-in reminders
cron.schedule('30 2 * * *', async () => {
  console.log(`[${new Date().toISOString()}] Checking walk-in reminders...`)
  const db = getSchedulerDb()

  try {
    // Check fixed-date walk-ins
    const upcomingJobs = db.prepare(`
      SELECT * FROM jobs WHERE is_active = 1 AND walk_in_date IS NOT NULL
    `).all() as Record<string, unknown>[]

    for (const job of upcomingJobs) {
      const days = differenceInDays(parseISO(job.walk_in_date as string), new Date())
      if (days === 2 || days === 1 || days === 0) {
        await sendWalkInReminder(job, days)
      }
    }

    // Check recurring Friday walk-ins on Wednesday (2 days before) and Thursday (1 day before)
    const recurringJobs = db.prepare(`
      SELECT * FROM jobs WHERE is_active = 1 AND walk_in_recurring IS NOT NULL
    `).all() as Record<string, unknown>[]

    const today = new Date()
    const dayOfWeek = today.getDay() // 0=Sun, 3=Wed, 4=Thu

    for (const job of recurringJobs) {
      const recurring = (job.walk_in_recurring as string).toLowerCase()
      if (recurring.includes('friday')) {
        if (dayOfWeek === 3) await sendWalkInReminder(job, 2) // Wednesday → 2 days
        if (dayOfWeek === 4) await sendWalkInReminder(job, 1) // Thursday → 1 day
      }
    }

    db.close()
    console.log('Walk-in reminders checked.')
  } catch (err) {
    console.error('Walk-in reminder failed:', err)
    db.close()
  }
})

// Sunday at 7 PM IST (1:30 PM UTC) — weekly digest
cron.schedule('30 13 * * 0', async () => {
  console.log(`[${new Date().toISOString()}] Sending weekly digest...`)
  try {
    await sendWeeklyDigest()
    console.log('Weekly digest sent.')
  } catch (err) {
    console.error('Weekly digest failed:', err)
  }
})

console.log('Cron jobs scheduled:')
console.log('  - Scraper: Every 6 hours')
console.log('  - Walk-in reminders: Daily at 8 AM IST')
console.log('  - Weekly digest: Sunday 7 PM IST')
console.log('Waiting for scheduled events...')

// Keep process alive
process.on('SIGINT', () => {
  console.log('\nScheduler stopped.')
  process.exit(0)
})
