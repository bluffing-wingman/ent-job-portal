import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = process.env.DATABASE_PATH || './data/portal.db';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = path.resolve(DB_PATH);
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeSchema(db);
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
      tier TEXT NOT NULL CHECK(tier IN ('tier1', 'tier2', 'govt', 'startup')),
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

export default getDb;
