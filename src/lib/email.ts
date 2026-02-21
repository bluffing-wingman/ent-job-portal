import nodemailer from 'nodemailer'
import { getDb } from './db'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

interface EmailOptions {
  to: string
  subject: string
  html: string
  type: string
  jobId?: number
}

function isDuplicate(type: string, jobId?: number): boolean {
  const db = getDb()
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  if (jobId) {
    const existing = db.prepare(
      'SELECT id FROM notifications_log WHERE type = ? AND job_id = ? AND sent_at > ?'
    ).get(type, jobId, cutoff)
    return !!existing
  }

  const existing = db.prepare(
    'SELECT id FROM notifications_log WHERE type = ? AND sent_at > ?'
  ).get(type, cutoff)
  return !!existing
}

export async function sendEmail({ to, subject, html, type, jobId }: EmailOptions): Promise<boolean> {
  if (isDuplicate(type, jobId)) {
    console.log(`Skipping duplicate email: ${type} for job ${jobId}`)
    return false
  }

  try {
    await transporter.sendMail({
      from: `"ENT Job Portal" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    })

    const db = getDb()
    db.prepare(
      'INSERT INTO notifications_log (type, recipient, subject, job_id) VALUES (?, ?, ?, ?)'
    ).run(type, to, subject, jobId || null)

    console.log(`Email sent: ${subject} to ${to}`)
    return true
  } catch (error) {
    console.error('Email send failed:', error)
    const db = getDb()
    db.prepare(
      "INSERT INTO notifications_log (type, recipient, subject, job_id, status) VALUES (?, ?, ?, ?, 'failed')"
    ).run(type, to, subject, jobId || null)
    return false
  }
}

export async function sendWalkInReminder(job: Record<string, unknown>, daysUntil: number): Promise<boolean> {
  const to = process.env.NOTIFICATION_EMAIL || ''
  return sendEmail({
    to,
    subject: `⚠️ Walk-in ${daysUntil === 0 ? 'TODAY' : `in ${daysUntil} day${daysUntil > 1 ? 's' : ''}`}: ${job.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0ea5e9; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin:0;">Walk-in Interview Reminder</h2>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <h3>${job.title}</h3>
          <p><strong>Hospital:</strong> ${job.hospital_name}</p>
          <p><strong>Location:</strong> ${job.location}</p>
          <p><strong>Date:</strong> ${job.walk_in_date || job.walk_in_recurring}</p>
          <p><strong>Salary:</strong> ${job.salary_text || 'Not specified'}</p>
          <p>${job.description || ''}</p>
          ${job.apply_url ? `<p><a href="${job.apply_url}" style="background:#0ea5e9;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block;">View Details</a></p>` : ''}
          <hr style="border-color:#e5e7eb;"/>
          <p style="color:#6b7280;font-size:12px;">Sent by Dr. Tanvi's ENT Job Portal</p>
        </div>
      </div>
    `,
    type: 'walk_in_reminder',
    jobId: job.id as number,
  })
}

export async function sendNewJobAlert(job: Record<string, unknown>): Promise<boolean> {
  const to = process.env.NOTIFICATION_EMAIL || ''
  return sendEmail({
    to,
    subject: `🆕 New ENT Job: ${job.title} at ${job.hospital_name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #10b981; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin:0;">New Job Found!</h2>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <h3>${job.title}</h3>
          <p><strong>Hospital:</strong> ${job.hospital_name}</p>
          <p><strong>Location:</strong> ${job.location}</p>
          <p><strong>Type:</strong> ${job.type}</p>
          <p><strong>Salary:</strong> ${job.salary_text || 'Not specified'}</p>
          <p>${job.description || ''}</p>
          ${job.apply_url ? `<p><a href="${job.apply_url}" style="background:#10b981;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block;">Apply Now</a></p>` : ''}
          <hr style="border-color:#e5e7eb;"/>
          <p style="color:#6b7280;font-size:12px;">Sent by Dr. Tanvi's ENT Job Portal</p>
        </div>
      </div>
    `,
    type: 'new_job_alert',
    jobId: job.id as number,
  })
}

export async function sendWeeklyDigest(): Promise<boolean> {
  const db = getDb()
  const to = process.env.NOTIFICATION_EMAIL || ''

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const newJobs = db.prepare('SELECT * FROM jobs WHERE created_at > ? AND is_active = 1').all(weekAgo) as Record<string, unknown>[]
  const totalActive = (db.prepare('SELECT COUNT(*) as count FROM jobs WHERE is_active = 1').get() as { count: number }).count
  const totalApps = (db.prepare('SELECT COUNT(*) as count FROM applications').get() as { count: number }).count
  const upcomingWalkIns = db.prepare("SELECT * FROM jobs WHERE is_active = 1 AND (walk_in_date > date('now') OR walk_in_recurring IS NOT NULL)").all() as Record<string, unknown>[]

  const jobRows = newJobs.map(j => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${j.title}</td>
      <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${j.hospital_name}</td>
      <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${j.salary_text || 'N/A'}</td>
    </tr>
  `).join('')

  return sendEmail({
    to,
    subject: `📊 Weekly Job Digest — ${newJobs.length} new jobs this week`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0ea5e9; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin:0;">Weekly Job Digest</h2>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <div style="display:flex;gap:12px;margin-bottom:20px;">
            <div style="background:#f0f9ff;padding:12px;border-radius:8px;flex:1;text-align:center;">
              <div style="font-size:24px;font-weight:bold;color:#0ea5e9;">${totalActive}</div>
              <div style="font-size:12px;color:#6b7280;">Active Jobs</div>
            </div>
            <div style="background:#f0fdf4;padding:12px;border-radius:8px;flex:1;text-align:center;">
              <div style="font-size:24px;font-weight:bold;color:#10b981;">${newJobs.length}</div>
              <div style="font-size:12px;color:#6b7280;">New This Week</div>
            </div>
            <div style="background:#faf5ff;padding:12px;border-radius:8px;flex:1;text-align:center;">
              <div style="font-size:24px;font-weight:bold;color:#8b5cf6;">${totalApps}</div>
              <div style="font-size:12px;color:#6b7280;">Applications</div>
            </div>
          </div>
          ${newJobs.length > 0 ? `
            <h3>New Jobs This Week</h3>
            <table style="width:100%;border-collapse:collapse;">
              <thead><tr style="background:#f9fafb;">
                <th style="padding:8px;text-align:left;">Position</th>
                <th style="padding:8px;text-align:left;">Hospital</th>
                <th style="padding:8px;text-align:left;">Salary</th>
              </tr></thead>
              <tbody>${jobRows}</tbody>
            </table>
          ` : '<p>No new jobs found this week.</p>'}
          ${upcomingWalkIns.length > 0 ? `
            <h3 style="margin-top:20px;">Upcoming Walk-ins</h3>
            <ul>${upcomingWalkIns.map(w => `<li><strong>${w.hospital_name}</strong> — ${w.walk_in_date || w.walk_in_recurring}</li>`).join('')}</ul>
          ` : ''}
          <hr style="border-color:#e5e7eb;"/>
          <p style="color:#6b7280;font-size:12px;">Sent by Dr. Tanvi's ENT Job Portal</p>
        </div>
      </div>
    `,
    type: 'weekly_digest',
  })
}
