# Dr. Tanvi's ENT Job Search Portal

## Project Overview
A centralized job search portal for **Dr. Tanvi Maurya**, a DNB-qualified ENT surgeon who recently moved to Gurgaon and is looking for a job in Delhi-NCR. The portal aggregates hospital listings, job portals, current openings, and provides tools to track applications.

## Live URLs
- **Vercel (full-stack, live):** https://my-project-gray-sigma.vercel.app
- **GitHub Pages (static, outdated):** https://bluffing-wingman.github.io/ent-job-portal/
- **GitHub Repo:** https://github.com/bluffing-wingman/ent-job-portal

## Vercel Project
- **Vercel Account:** ashishsrijan-2680s-projects
- **Project Name:** my-project
- **Dashboard:** https://vercel.com/ashishsrijan-2680s-projects/my-project/settings
- **Cron:** Runs daily at 8:00 AM UTC (1:30 PM IST) — hits `/api/cron` to run scraper

## GitHub
- **Account:** bluffing-wingman
- **Auth:** Logged in via `gh auth` (GitHub CLI)

## Tech Stack
- **Framework:** Next.js 14 (App Router) with TypeScript
- **Styling:** Tailwind CSS v3 (downgraded from v4 for compatibility with `@tailwind` directives)
- **Database:** SQLite via `better-sqlite3` — stored in `/tmp/portal.db` on Vercel (ephemeral!)
- **Icons:** lucide-react
- **Email:** Nodemailer (Gmail SMTP) — NOT configured yet (needs GMAIL_APP_PASSWORD)
- **Scraper:** cheerio + axios — targets 5 govt job sites
- **Node.js:** v22.14.0 installed manually at `~/.local/node/` (no Homebrew)

## Known Limitations / Critical Issue
- **SQLite in `/tmp` is ephemeral on Vercel.** Data resets on every cold start. This means:
  - New jobs added via Admin panel disappear after idle time
  - Application tracker data is lost
  - Checklist progress resets
  - Scraper results don't persist
- **Fix needed:** Migrate to a persistent database (Vercel Postgres, Turso, or PlanetScale free tier)
- **Email notifications not working** — Gmail credentials not set in Vercel env vars
- **No authentication** — anyone with the link can access everything including Admin

## Environment Variables Needed on Vercel
Set these at https://vercel.com/ashishsrijan-2680s-projects/my-project/settings → Environment Variables:
- `GMAIL_USER` — Gmail address for sending notifications
- `GMAIL_APP_PASSWORD` — Gmail App Password (not regular password)
- `NOTIFICATION_EMAIL` — Email to receive job alerts
- `CRON_SECRET` — Random string to secure the `/api/cron` endpoint

## Database Schema (8 tables)
- **jobs** — title, hospital_name, location, type (govt/private/startup), salary, walk_in_date, deadline, apply_url, etc.
- **hospitals** — name, location, tier (tier1/tier2/govt/startup), career_url, website_url, ent_dept_info
- **portals** — name, category (general/medical/government), url, search_url, is_registered
- **applications** — hospital_name, position, applied_date, status, follow_up_date, notes
- **checklist_items** — title, url, category, sort_order
- **checklist_completions** — item_id, week_start (auto-resets weekly)
- **scraper_runs** — source_url, status, jobs_found, new_jobs, error_message
- **notifications_log** — type, recipient, subject, sent_at, status

## Seed Data
- **4 jobs:** NC Joshi walk-in, BSAH every Friday, VMMC, AIIMS
- **70 hospitals/facilities:**
  - 13 Tier-1 Corporate (Medanta, Fortis, Artemis, Max, Apollo, BLK-Max, Amrita, Jaypee, etc.)
  - 23 Tier-2 Multispecialty (incl. Noida, Faridabad, Ghaziabad hospitals)
  - 11 Government/Public
  - 8 ENT Clinics & Specialty Centers (MedFirst, Delhi ENT Hospital, Adventis, etc.)
  - 14 Medical Colleges with ENT Departments (MAMC/LNJP, UCMS/GTB, ESIC Faridabad, Sharda, etc.)
  - 1 Startup (Pristyn Care)
- **17 portals:** 6 general (Naukri, LinkedIn, etc.), 6 medical (MedVacancies, etc.), 5 government
- **7 weekly checklist items**

## Pages
| Route | Type | Description |
|-------|------|-------------|
| `/` | Server component | Dashboard with urgent alerts, stats, quick links, recent jobs |
| `/jobs` | Client component | Job listings with filters, fetches from `/api/jobs` |
| `/jobs/[id]` | Server + Client | Job detail page |
| `/hospitals` | Client component | 27 hospitals grouped by tier, fetches from `/api/hospitals` |
| `/portals` | Client component | 17 portals grouped by category, fetches from `/api/portals` |
| `/tracker` | Client component | Application tracker with CRUD, fetches from `/api/applications` |
| `/checklist` | Client component | Weekly checklist with toggle, fetches from `/api/checklist` |
| `/admin` | Client component | Add jobs, run scraper, send test email |

## API Routes (all `force-dynamic`)
- `GET/POST /api/jobs` — list with filters, create job
- `GET/PUT/DELETE /api/jobs/[id]` — single job CRUD
- `GET /api/hospitals` — list hospitals (filter by tier/type)
- `GET /api/portals` — list portals (filter by category)
- `GET/POST /api/applications` — list and create applications
- `PUT/DELETE /api/applications/[id]` — update/delete application
- `GET /api/checklist` — items with current week completion status
- `PUT /api/checklist/[id]` — toggle completion
- `POST /api/scraper/run` — trigger web scraper manually
- `GET /api/scraper/status` — last 20 scraper runs
- `POST /api/notifications/test` — send test email
- `POST /api/notifications/digest` — trigger weekly digest
- `GET /api/cron` — Vercel Cron endpoint (secured by CRON_SECRET Bearer token)

## Scraper Targets
1. Delhi Health Dept — `health.delhi.gov.in/vacancy`
2. Haryana Health Dept — `haryanahealth.gov.in/notice-category/recruitments/`
3. VMMC Safdarjung — `vmmc-sjh.mohfw.gov.in/recruitment`
4. AIIMS — `aiimsexams.ac.in`
5. HPSC — `hpsc.gov.in`

## Key Files
- `src/lib/db.ts` — Database connection, schema init, auto-seeding logic
- `src/lib/data.ts` — All embedded seed data + TypeScript interfaces
- `src/lib/email.ts` — Nodemailer Gmail SMTP with duplicate prevention
- `src/lib/scraper.ts` — cheerio+axios scraper for govt sites
- `src/lib/utils.ts` — Urgency colors, countdown text, salary formatting
- `src/lib/storage.ts` — localStorage helpers (leftover from static version, no longer used)
- `src/components/Navbar.tsx` — Responsive nav with mobile menu
- `src/components/UrgentAlerts.tsx` — Countdown cards for walk-in dates
- `vercel.json` — Cron config (daily at 8 AM UTC)
- `scripts/seed-db.ts` — Standalone seeding script (for local use)
- `scripts/scheduler.ts` — Standalone cron scheduler (for local use)

## Design
- **Color Palette:** Medical blue (#0ea5e9 primary), white backgrounds, green accents
- **Urgency Colors:** Red (< 3 days), Yellow (< 7 days), Green (7+ days), Gray (recurring)
- **Status Colors:** Blue (applied), Purple (shortlisted), Orange (interview), Green (offered/accepted), Red (rejected)
- **Mobile-responsive** — designed for phone access

## Past Issues & Fixes
- Node.js installed via direct binary (no Homebrew/sudo)
- Tailwind v4 → downgraded to v3 (`@tailwind` directives incompatible)
- ESLint 9 → downgraded to ESLint 8 (`.eslintrc.json` support)
- `Boolean()` wrapper needed for `{job.apply_url && (...)}` to avoid TypeScript error
- API routes needed `export const dynamic = 'force-dynamic'` to prevent prerendering errors
- Vercel Hobby plan: cron limited to once/day (changed from every 6 hours)

## Next Steps
1. **Migrate to persistent database** (Vercel Postgres or Turso) to fix data loss on cold starts
2. **Set up Gmail App Password** and configure email env vars on Vercel
3. **Add authentication** to protect Admin panel
4. **Update seed data** with current job openings as they're found
