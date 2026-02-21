import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.resolve('./data');
const DB_PATH = path.join(DB_DIR, 'portal.db');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Delete existing DB for fresh seed
if (fs.existsSync(DB_PATH)) {
  fs.unlinkSync(DB_PATH);
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create schema
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

// ==================== SEED HOSPITALS ====================

const insertHospital = db.prepare(`
  INSERT INTO hospitals (name, location, tier, type, career_url, website_url, ent_dept_info)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const hospitals = [
  // Tier 1 - Corporate
  ['Medanta - The Medicity', 'Gurugram', 'tier1', 'private', 'https://www.medanta.org/careers', 'https://www.medanta.org', 'Major ENT department with cochlear implant program'],
  ['Fortis Memorial Research Institute', 'Gurugram', 'tier1', 'private', 'https://www.fortishealthcare.com/careers', 'https://www.fortishealthcare.com', 'Full ENT department with skull base surgery unit'],
  ['Artemis Hospital', 'Gurugram', 'tier1', 'private', 'https://www.artemishospitals.com/careers', 'https://www.artemishospitals.com', 'ENT and Head & Neck Surgery department'],
  ['Max Super Speciality Hospital', 'Gurugram', 'tier1', 'private', 'https://jobs.maxhealthcare.in', 'https://www.maxhealthcare.in', 'Comprehensive ENT services across multiple locations'],
  ['Paras Hospitals', 'Gurugram', 'tier1', 'private', 'https://www.parashospitals.com/career', 'https://www.parashospitals.com', 'Growing ENT department'],
  ['CK Birla Hospital', 'Gurugram', 'tier1', 'private', 'https://www.ckbirlahospital.com/careers', 'https://www.ckbirlahospital.com', 'ENT department with modern facilities'],
  ['Narayana Health', 'Gurugram', 'tier1', 'private', 'https://www.narayanahealth.org/careers', 'https://www.narayanahealth.org', 'Established ENT services'],
  ['Manipal Hospital', 'Gurugram', 'tier1', 'private', 'https://www.manipalhospitals.com/careers', 'https://www.manipalhospitals.com', 'Full-service ENT department'],

  // Tier 2 - Multispecialty
  ['W Pratiksha Hospital', 'Gurugram', 'tier2', 'private', 'https://www.wpratiksha.com/career', 'https://www.wpratiksha.com', 'Growing multispecialty with ENT'],
  ['SGT Hospital', 'Gurugram', 'tier2', 'private', 'https://sgtuniversity.ac.in/career', 'https://sgtuniversity.ac.in', 'Teaching hospital with ENT residency'],
  ['Park Hospital', 'Gurugram', 'tier2', 'private', 'https://www.parkhospital.in/career', 'https://www.parkhospital.in', 'ENT services available'],
  ['Signature Hospital', 'Gurugram', 'tier2', 'private', null, 'https://signaturehospital.net', 'Small ENT unit'],
  ['Marengo Asia Hospital', 'Gurugram', 'tier2', 'private', 'https://www.marengoasiahospitals.com/career', 'https://www.marengoasiahospitals.com', 'Recently rebranded, expanding ENT'],
  ['Miracles Mediclinic', 'Gurugram', 'tier2', 'private', null, 'https://www.miraclesmediclinic.com', 'Multispecialty with ENT'],
  ['Mayom Hospital', 'Gurugram', 'tier2', 'private', null, 'https://www.mayomhospital.com', 'Small multispecialty'],
  ['Optimus Hospital', 'Gurugram', 'tier2', 'private', null, 'https://optimushospitalgurgaon.com', 'Growing facility'],
  ['Aman Hospital', 'Gurugram', 'tier2', 'private', null, 'https://amanhospitals.in', 'Multispecialty hospital'],

  // Government / Public
  ['NC Joshi Memorial Hospital', 'Delhi', 'govt', 'govt', 'https://health.delhi.gov.in/vacancy', 'https://health.delhi.gov.in', 'Delhi govt hospital - active walk-in recruitment for SR ENT'],
  ['Bhagwan Swaminarayan Arogyam Hospital (BSAH)', 'Delhi', 'govt', 'govt', 'https://health.delhi.gov.in/vacancy', 'https://health.delhi.gov.in', 'Delhi govt - recurring Friday walk-in interviews'],
  ['Safdarjung Hospital / VMMC', 'Delhi', 'govt', 'govt', 'https://vmmc-sjh.mohfw.gov.in/recruitment', 'https://www.vmmc-sjh.nic.in', 'Major teaching hospital with large ENT dept'],
  ['AIIMS Delhi', 'Delhi', 'govt', 'govt', 'https://www.aiimsexams.ac.in', 'https://www.aiims.edu', 'Premier institute - regular SR recruitment'],
  ['RML Hospital', 'Delhi', 'govt', 'govt', 'https://rmlh.nic.in', 'https://rmlh.nic.in', 'Central govt hospital with ENT dept'],
  ['Lady Hardinge Medical College', 'Delhi', 'govt', 'govt', 'https://lhmc-hosp.gov.in', 'https://lhmc-hosp.gov.in', 'Govt medical college with ENT dept'],
  ['Sir Ganga Ram Hospital', 'Delhi', 'govt', 'private', 'https://www.sgrh.com/career', 'https://www.sgrh.com', 'Semi-private charitable hospital with strong ENT'],
  ['Janakpuri Super Speciality Hospital (JSSHS)', 'Delhi', 'govt', 'govt', 'https://health.delhi.gov.in/vacancy', 'https://health.delhi.gov.in', 'Delhi govt super speciality'],
  ['Civil Hospital Gurugram', 'Gurugram', 'govt', 'govt', 'https://haryanahealth.gov.in', 'https://haryanahealth.gov.in', 'District hospital - Haryana govt'],

  // Startup / Chain
  ['Pristyn Care', 'Gurugram', 'startup', 'private', 'https://www.pristyncare.com/careers', 'https://www.pristyncare.com', 'ENT-focused healthtech startup, high volume surgeries'],
];

const insertHospitalTx = db.transaction(() => {
  for (const h of hospitals) {
    insertHospital.run(...h);
  }
});
insertHospitalTx();
console.log(`✓ Inserted ${hospitals.length} hospitals`);

// ==================== SEED JOBS ====================

const insertJob = db.prepare(`
  INSERT INTO jobs (title, hospital_name, location, type, salary_min, salary_max, salary_text, walk_in_date, walk_in_recurring, deadline, apply_url, description, source)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const jobs = [
  [
    'Senior Resident (ENT) - Walk-in Interview',
    'NC Joshi Memorial Hospital',
    'Delhi',
    'govt',
    67000, 67000,
    '₹67,000/month (Level 11 - 7th CPC)',
    '2025-02-23',
    null,
    '2025-02-23',
    'https://health.delhi.gov.in/vacancy',
    'Walk-in interview for Senior Resident in ENT department. Bring original documents, 2 passport photos, and DNB/MS certificate. Reporting time: 10:00 AM.',
    'Delhi Health Department'
  ],
  [
    'Senior Resident (ENT) - Recurring Walk-in',
    'Bhagwan Swaminarayan Arogyam Hospital (BSAH)',
    'Delhi',
    'govt',
    67000, 67000,
    '₹67,000/month (Level 11 - 7th CPC)',
    null,
    'Every Friday',
    null,
    'https://health.delhi.gov.in/vacancy',
    'Recurring walk-in interviews every Friday for Senior Resident positions. Delhi govt hospital under GNCTD. Bring all original documents.',
    'Delhi Health Department'
  ],
  [
    'Senior Resident (ENT/Otolaryngology)',
    'Safdarjung Hospital / VMMC',
    'Delhi',
    'govt',
    67000, 80000,
    '₹67,000 - ₹80,000/month',
    null,
    null,
    '2025-03-15',
    'https://vmmc-sjh.mohfw.gov.in/recruitment',
    'Senior Resident vacancy in ENT department at VMMC & Safdarjung Hospital. Apply online through official portal.',
    'VMMC Website'
  ],
  [
    'Senior Resident (ENT) - Regular Recruitment',
    'AIIMS Delhi',
    'Delhi',
    'govt',
    67000, 90000,
    '₹67,000 - ₹90,000/month + allowances',
    null,
    null,
    '2025-03-31',
    'https://www.aiimsexams.ac.in',
    'AIIMS New Delhi regular recruitment for Senior Resident in Otorhinolaryngology (ENT). Online application through aiimsexams.ac.in.',
    'AIIMS Exams Portal'
  ],
];

const insertJobTx = db.transaction(() => {
  for (const j of jobs) {
    insertJob.run(...j);
  }
});
insertJobTx();
console.log(`✓ Inserted ${jobs.length} jobs`);

// ==================== SEED PORTALS ====================

const insertPortal = db.prepare(`
  INSERT INTO portals (name, category, url, search_url, description, is_registered)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const portals = [
  // General
  ['Naukri.com', 'general', 'https://www.naukri.com', 'https://www.naukri.com/ent-surgeon-jobs-in-delhi-ncr', 'India\'s largest job portal - strong medical listings', 1],
  ['LinkedIn', 'general', 'https://www.linkedin.com', 'https://www.linkedin.com/jobs/search/?keywords=ENT%20surgeon&location=Delhi%20NCR', 'Professional networking - connect with hospital HRs directly', 1],
  ['Indeed India', 'general', 'https://www.indeed.co.in', 'https://www.indeed.co.in/jobs?q=ENT+surgeon&l=Gurgaon', 'Global job board with Indian listings', 0],
  ['Glassdoor', 'general', 'https://www.glassdoor.co.in', 'https://www.glassdoor.co.in/Job/delhi-ncr-ent-jobs-SRCH_IL.0,9_IC2858403_KO10,13.htm', 'Job listings with salary insights and company reviews', 0],
  ['PlacementIndia', 'general', 'https://www.placementindia.com', 'https://www.placementindia.com/job-search/ent-surgeon-jobs', 'Indian job portal with medical positions', 0],
  ['Foundit (Monster India)', 'general', 'https://www.foundit.in', 'https://www.foundit.in/srp/results?query=ENT+surgeon&locations=Delhi+NCR', 'Rebranded Monster India - good medical listings', 0],

  // Medical-Specific
  ['MedVacancies', 'medical', 'https://www.medvacancies.com', 'https://www.medvacancies.com/search?q=ENT', 'Dedicated medical job portal for India', 0],
  ['IndianRDA', 'medical', 'https://www.indianrda.com', 'https://www.indianrda.com/jobs', 'Resident Doctors Association - job listings and updates', 0],
  ['DoctorsJobIndia', 'medical', 'https://www.doctorsjobindia.com', 'https://www.doctorsjobindia.com/ent-jobs', 'India-specific doctor job listings', 0],
  ['OhmJobs', 'medical', 'https://www.ohmjobs.com', 'https://www.ohmjobs.com/search?specialty=ENT', 'Healthcare recruitment platform', 0],
  ['DoctorsInCiti', 'medical', 'https://www.doctorsinciti.com', 'https://www.doctorsinciti.com/jobs', 'Doctor job portal with city-wise listings', 0],
  ['DocThub', 'medical', 'https://www.docthub.com', 'https://www.docthub.com/jobs?q=ENT', 'Medical professional networking and jobs', 0],

  // Government
  ['Delhi Health Department', 'government', 'https://health.delhi.gov.in', 'https://health.delhi.gov.in/vacancy', 'Official Delhi govt health vacancies - primary source for walk-ins', 0],
  ['Haryana Health Department', 'government', 'https://haryanahealth.gov.in', 'https://haryanahealth.gov.in/notice-category/recruitments/', 'Haryana state health recruitment notices', 0],
  ['HPSC (Haryana PSC)', 'government', 'https://hpsc.gov.in', 'https://hpsc.gov.in', 'Haryana Public Service Commission - specialist doctor posts', 0],
  ['AIIMS Exams Portal', 'government', 'https://aiimsexams.ac.in', 'https://aiimsexams.ac.in', 'All AIIMS recruitment - Senior Resident and Faculty positions', 0],
  ['VMMC Safdarjung', 'government', 'https://vmmc-sjh.mohfw.gov.in', 'https://vmmc-sjh.mohfw.gov.in/recruitment', 'VMMC & Safdarjung Hospital official recruitment page', 0],
];

const insertPortalTx = db.transaction(() => {
  for (const p of portals) {
    insertPortal.run(...p);
  }
});
insertPortalTx();
console.log(`✓ Inserted ${portals.length} portals`);

// ==================== SEED CHECKLIST ITEMS ====================

const insertChecklist = db.prepare(`
  INSERT INTO checklist_items (title, url, category, sort_order)
  VALUES (?, ?, ?, ?)
`);

const checklistItems = [
  ['Check Delhi Health Dept vacancies', 'https://health.delhi.gov.in/vacancy', 'government', 1],
  ['Check Haryana Health Dept notices', 'https://haryanahealth.gov.in/notice-category/recruitments/', 'government', 2],
  ['Search Naukri.com for new ENT positions', 'https://www.naukri.com/ent-surgeon-jobs-in-delhi-ncr', 'portals', 3],
  ['Search LinkedIn for ENT openings', 'https://www.linkedin.com/jobs/search/?keywords=ENT%20surgeon&location=Delhi%20NCR', 'portals', 4],
  ['Check top 5 hospital career pages', null, 'hospitals', 5],
  ['Follow up on pending applications', null, 'applications', 6],
  ['Update resume if needed', null, 'personal', 7],
];

const insertChecklistTx = db.transaction(() => {
  for (const c of checklistItems) {
    insertChecklist.run(...c);
  }
});
insertChecklistTx();
console.log(`✓ Inserted ${checklistItems.length} checklist items`);

db.close();
console.log('\n✅ Database seeded successfully at:', DB_PATH);
