import axios from 'axios'
import * as cheerio from 'cheerio'
import { getDb } from './db'
import { sendNewJobAlert } from './email'

const ENT_KEYWORDS = [
  'ENT', 'Otolaryngology', 'Otorhinolaryngology',
  'Ear, Nose', 'Ear Nose Throat', 'Head & Neck', 'Head and Neck',
  'ENT Surgeon', 'ENT surgeon', 'ENT department', 'ENT Department',
  '(ENT)', 'Rhinology', 'Laryngology', 'Cochlear',
]

interface ScraperTarget {
  name: string
  url: string
  parse: ($: cheerio.CheerioAPI, url: string) => ScrapedJob[]
}

interface ScrapedJob {
  title: string
  hospital_name: string
  location: string
  type: 'govt' | 'private' | 'startup'
  apply_url: string
  description: string
  source: string
}

function containsENTKeyword(text: string): boolean {
  return ENT_KEYWORDS.some(kw => {
    // For short uppercase keywords like 'ENT', use word boundary to avoid matching 'CONTENT', 'WENT' etc.
    if (kw === kw.toUpperCase() && kw.length <= 4) {
      return new RegExp(`\\b${kw}\\b`).test(text)
    }
    return text.toLowerCase().includes(kw.toLowerCase())
  })
}

const scraperTargets: ScraperTarget[] = [
  {
    name: 'Delhi Health Department',
    url: 'https://health.delhi.gov.in/vacancy',
    parse: ($, url) => {
      const jobs: ScrapedJob[] = []
      $('table tr, .view-content .views-row, .vacancy-item, a[href*=".pdf"]').each((_, el) => {
        const text = $(el).text()
        if (containsENTKeyword(text)) {
          const link = $(el).find('a').attr('href') || $(el).attr('href') || url
          jobs.push({
            title: text.trim().substring(0, 200) || 'ENT Position - Delhi Health Dept',
            hospital_name: 'Delhi Health Department',
            location: 'Delhi',
            type: 'govt',
            apply_url: link.startsWith('http') ? link : `https://health.delhi.gov.in${link}`,
            description: text.trim(),
            source: 'Delhi Health Dept Scraper',
          })
        }
      })
      return jobs
    },
  },
  {
    name: 'Haryana Health Department',
    url: 'https://haryanahealth.gov.in/notice-category/recruitments/',
    parse: ($, url) => {
      const jobs: ScrapedJob[] = []
      $('article, .entry-content a, table tr, .recruitment-item').each((_, el) => {
        const text = $(el).text()
        if (containsENTKeyword(text)) {
          const link = $(el).find('a').attr('href') || $(el).attr('href') || url
          jobs.push({
            title: text.trim().substring(0, 200) || 'ENT Position - Haryana Health',
            hospital_name: 'Haryana Health Department',
            location: 'Haryana',
            type: 'govt',
            apply_url: link.startsWith('http') ? link : `https://haryanahealth.gov.in${link}`,
            description: text.trim(),
            source: 'Haryana Health Dept Scraper',
          })
        }
      })
      return jobs
    },
  },
  {
    name: 'VMMC Safdarjung',
    url: 'https://vmmc-sjh.mohfw.gov.in/recruitment',
    parse: ($, url) => {
      const jobs: ScrapedJob[] = []
      $('table tr, a[href*=".pdf"], .recruitment-item, .content a').each((_, el) => {
        const text = $(el).text()
        if (containsENTKeyword(text)) {
          const link = $(el).find('a').attr('href') || $(el).attr('href') || url
          jobs.push({
            title: text.trim().substring(0, 200) || 'ENT Position - VMMC/Safdarjung',
            hospital_name: 'Safdarjung Hospital / VMMC',
            location: 'Delhi',
            type: 'govt',
            apply_url: link.startsWith('http') ? link : `https://vmmc-sjh.mohfw.gov.in${link}`,
            description: text.trim(),
            source: 'VMMC Scraper',
          })
        }
      })
      return jobs
    },
  },
  {
    name: 'AIIMS Exams',
    url: 'https://aiimsexams.ac.in',
    parse: ($, url) => {
      const jobs: ScrapedJob[] = []
      $('table tr, .recruitment a, a[href*=".pdf"], .content-area a').each((_, el) => {
        const text = $(el).text()
        if (containsENTKeyword(text)) {
          const link = $(el).find('a').attr('href') || $(el).attr('href') || url
          jobs.push({
            title: text.trim().substring(0, 200) || 'ENT Position - AIIMS',
            hospital_name: 'AIIMS Delhi',
            location: 'Delhi',
            type: 'govt',
            apply_url: link.startsWith('http') ? link : `https://aiimsexams.ac.in${link}`,
            description: text.trim(),
            source: 'AIIMS Scraper',
          })
        }
      })
      return jobs
    },
  },
  {
    name: 'HPSC',
    url: 'https://hpsc.gov.in',
    parse: ($, url) => {
      const jobs: ScrapedJob[] = []
      $('table tr, .advertisement a, a[href*=".pdf"]').each((_, el) => {
        const text = $(el).text()
        if (containsENTKeyword(text)) {
          const link = $(el).find('a').attr('href') || $(el).attr('href') || url
          jobs.push({
            title: text.trim().substring(0, 200) || 'ENT Position - HPSC',
            hospital_name: 'HPSC Haryana',
            location: 'Haryana',
            type: 'govt',
            apply_url: link.startsWith('http') ? link : `https://hpsc.gov.in${link}`,
            description: text.trim(),
            source: 'HPSC Scraper',
          })
        }
      })
      return jobs
    },
  },
]

export async function runScraper(targetIndex?: number): Promise<{ totalFound: number; newJobs: number; errors: string[] }> {
  const db = getDb()
  const targets = targetIndex !== undefined ? [scraperTargets[targetIndex]] : scraperTargets
  let totalFound = 0
  let newJobs = 0
  const errors: string[] = []

  for (const target of targets) {
    const runId = db.prepare(
      "INSERT INTO scraper_runs (source_url, status) VALUES (?, 'running')"
    ).run(target.url).lastInsertRowid

    try {
      const response = await axios.get(target.url, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ENTJobBot/1.0)',
        },
      })

      const $ = cheerio.load(response.data)
      const scrapedJobs = target.parse($, target.url)
      totalFound += scrapedJobs.length

      let newCount = 0
      for (const job of scrapedJobs) {
        // Deduplicate by title + hospital
        const existing = db.prepare(
          'SELECT id FROM jobs WHERE title = ? AND hospital_name = ?'
        ).get(job.title, job.hospital_name)

        if (!existing) {
          const result = db.prepare(`
            INSERT INTO jobs (title, hospital_name, location, type, apply_url, description, source)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `).run(job.title, job.hospital_name, job.location, job.type, job.apply_url, job.description, job.source)

          newCount++
          newJobs++

          // Send email alert for new job
          const newJob = db.prepare('SELECT * FROM jobs WHERE id = ?').get(result.lastInsertRowid) as Record<string, unknown>
          try {
            await sendNewJobAlert(newJob)
          } catch (emailErr) {
            console.error('Failed to send new job alert email:', emailErr)
          }
        }
      }

      db.prepare(
        "UPDATE scraper_runs SET status = 'completed', jobs_found = ?, new_jobs = ?, completed_at = datetime('now') WHERE id = ?"
      ).run(scrapedJobs.length, newCount, runId)

    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error'
      errors.push(`${target.name}: ${errMsg}`)
      db.prepare(
        "UPDATE scraper_runs SET status = 'failed', error_message = ?, completed_at = datetime('now') WHERE id = ?"
      ).run(errMsg, runId)
    }
  }

  return { totalFound, newJobs, errors }
}

export { scraperTargets }
