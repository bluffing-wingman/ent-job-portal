import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { jobs, hospitals, portals, checklistItems } from './data';

// On Vercel, only /tmp is writable. Locally, use ./data/
const isVercel = !!process.env.VERCEL;
const DB_PATH = isVercel ? '/tmp/portal.db' : (process.env.DATABASE_PATH || './data/portal.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = path.resolve(DB_PATH);
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeSchema(db);
    seedIfEmpty(db);
  }
  return db;
}

function initializeSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      hospital_name TEXT NOT NULL,
      location TEXT NOT NULL DEFAULT 'Gurugram',
      type TEXT NOT NULL CHECK(type IN ('govt', 'private', 'startup')),
      salary_min INTEGER,
      salary_max INTEGER,
      salary_text TEXT,
      walk_in_date TEXT,
      walk_in_recurring TEXT,
      deadline TEXT,
      apply_url TEXT,
      description TEXT,
      source TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS hospitals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      location TEXT NOT NULL DEFAULT 'Gurugram',
      tier TEXT NOT NULL CHECK(tier IN ('tier1', 'tier2', 'govt', 'startup', 'clinic', 'college')),
      type TEXT NOT NULL CHECK(type IN ('private', 'govt')),
      career_url TEXT,
      website_url TEXT,
      ent_dept_info TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS portals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL CHECK(category IN ('general', 'medical', 'government')),
      url TEXT NOT NULL,
      search_url TEXT,
      description TEXT,
      is_registered INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hospital_name TEXT NOT NULL,
      position TEXT NOT NULL,
      applied_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'applied' CHECK(status IN ('applied', 'shortlisted', 'interview_scheduled', 'interviewed', 'offered', 'accepted', 'rejected', 'withdrawn')),
      follow_up_date TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS checklist_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT,
      category TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS checklist_completions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id INTEGER NOT NULL,
      week_start TEXT NOT NULL,
      completed_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (item_id) REFERENCES checklist_items(id),
      UNIQUE(item_id, week_start)
    );

    CREATE TABLE IF NOT EXISTS scraper_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_url TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      jobs_found INTEGER DEFAULT 0,
      new_jobs INTEGER DEFAULT 0,
      error_message TEXT,
      started_at TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS notifications_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      recipient TEXT NOT NULL,
      subject TEXT NOT NULL,
      job_id INTEGER,
      sent_at TEXT NOT NULL DEFAULT (datetime('now')),
      status TEXT NOT NULL DEFAULT 'sent'
    );
  `);
}

function seedIfEmpty(db: Database.Database) {
  // Use INSERT OR IGNORE so new entries from data.ts are added even if DB already has data
  // (hospitals and portals have UNIQUE constraints on name, checklist_items on title+sort_order)

  // Seed hospitals
  const insertHospital = db.prepare(`INSERT OR IGNORE INTO hospitals (name, location, tier, type, career_url, website_url, ent_dept_info) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  const hospTx = db.transaction(() => {
    for (const h of hospitals) {
      insertHospital.run(h.name, h.location, h.tier, h.type, h.career_url, h.website_url, h.ent_dept_info);
    }
  });
  hospTx();

  const jobCount = (db.prepare('SELECT COUNT(*) as c FROM jobs').get() as { c: number }).c;
  if (jobCount === 0) {
    // Seed jobs only on first init (jobs are managed dynamically after that)
    const insertJob = db.prepare(`INSERT INTO jobs (title, hospital_name, location, type, salary_min, salary_max, salary_text, walk_in_date, walk_in_recurring, deadline, apply_url, description, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    const jobTx = db.transaction(() => {
      for (const j of jobs) {
        insertJob.run(j.title, j.hospital_name, j.location, j.type, j.salary_min, j.salary_max, j.salary_text, j.walk_in_date, j.walk_in_recurring, j.deadline, j.apply_url, j.description, j.source);
      }
    });
    jobTx();
  }

  // Seed portals
  const insertPortal = db.prepare(`INSERT OR IGNORE INTO portals (name, category, url, search_url, description, is_registered) VALUES (?, ?, ?, ?, ?, ?)`);
  const portalTx = db.transaction(() => {
    for (const p of portals) {
      insertPortal.run(p.name, p.category, p.url, p.search_url, p.description, p.is_registered ? 1 : 0);
    }
  });
  portalTx();

  const checklistCount = (db.prepare('SELECT COUNT(*) as c FROM checklist_items').get() as { c: number }).c;
  if (checklistCount === 0) {
    // Seed checklist only on first init
    const insertChecklist = db.prepare(`INSERT INTO checklist_items (title, url, category, sort_order) VALUES (?, ?, ?, ?)`);
    const checkTx = db.transaction(() => {
      for (const c of checklistItems) {
        insertChecklist.run(c.title, c.url, c.category, c.sort_order);
      }
    });
    checkTx();
  }
}

export default getDb;
