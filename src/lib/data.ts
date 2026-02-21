export interface Job {
  id: number
  title: string
  hospital_name: string
  location: string
  type: 'govt' | 'private' | 'startup'
  salary_min: number | null
  salary_max: number | null
  salary_text: string | null
  walk_in_date: string | null
  walk_in_recurring: string | null
  deadline: string | null
  apply_url: string | null
  description: string | null
  source: string | null
  is_active: boolean
  created_at: string
}

export interface Hospital {
  id: number
  name: string
  location: string
  tier: 'tier1' | 'tier2' | 'govt' | 'startup'
  type: 'private' | 'govt'
  career_url: string | null
  website_url: string | null
  ent_dept_info: string | null
}

export interface Portal {
  id: number
  name: string
  category: 'general' | 'medical' | 'government'
  url: string
  search_url: string | null
  description: string | null
  is_registered: boolean
}

export interface ChecklistItem {
  id: number
  title: string
  url: string | null
  category: string | null
  sort_order: number
}

export interface Application {
  id: number
  hospital_name: string
  position: string
  applied_date: string
  status: string
  follow_up_date: string | null
  notes: string | null
}

export const jobs: Job[] = [
  {
    id: 1,
    title: 'Senior Resident (ENT) - Walk-in Interview',
    hospital_name: 'NC Joshi Memorial Hospital',
    location: 'Delhi',
    type: 'govt',
    salary_min: 67000, salary_max: 67000,
    salary_text: '₹67,000/month (Level 11 - 7th CPC)',
    walk_in_date: '2025-02-23',
    walk_in_recurring: null,
    deadline: '2025-02-23',
    apply_url: 'https://health.delhi.gov.in/vacancy',
    description: 'Walk-in interview for Senior Resident in ENT department. Bring original documents, 2 passport photos, and DNB/MS certificate. Reporting time: 10:00 AM.',
    source: 'Delhi Health Department',
    is_active: true,
    created_at: '2026-02-21',
  },
  {
    id: 2,
    title: 'Senior Resident (ENT) - Recurring Walk-in',
    hospital_name: 'Bhagwan Swaminarayan Arogyam Hospital (BSAH)',
    location: 'Delhi',
    type: 'govt',
    salary_min: 67000, salary_max: 67000,
    salary_text: '₹67,000/month (Level 11 - 7th CPC)',
    walk_in_date: null,
    walk_in_recurring: 'Every Friday',
    deadline: null,
    apply_url: 'https://health.delhi.gov.in/vacancy',
    description: 'Recurring walk-in interviews every Friday for Senior Resident positions. Delhi govt hospital under GNCTD. Bring all original documents.',
    source: 'Delhi Health Department',
    is_active: true,
    created_at: '2026-02-21',
  },
  {
    id: 3,
    title: 'Senior Resident (ENT/Otolaryngology)',
    hospital_name: 'Safdarjung Hospital / VMMC',
    location: 'Delhi',
    type: 'govt',
    salary_min: 67000, salary_max: 80000,
    salary_text: '₹67,000 - ₹80,000/month',
    walk_in_date: null,
    walk_in_recurring: null,
    deadline: '2025-03-15',
    apply_url: 'https://vmmc-sjh.mohfw.gov.in/recruitment',
    description: 'Senior Resident vacancy in ENT department at VMMC & Safdarjung Hospital. Apply online through official portal.',
    source: 'VMMC Website',
    is_active: true,
    created_at: '2026-02-21',
  },
  {
    id: 4,
    title: 'Senior Resident (ENT) - Regular Recruitment',
    hospital_name: 'AIIMS Delhi',
    location: 'Delhi',
    type: 'govt',
    salary_min: 67000, salary_max: 90000,
    salary_text: '₹67,000 - ₹90,000/month + allowances',
    walk_in_date: null,
    walk_in_recurring: null,
    deadline: '2025-03-31',
    apply_url: 'https://www.aiimsexams.ac.in',
    description: 'AIIMS New Delhi regular recruitment for Senior Resident in Otorhinolaryngology (ENT). Online application through aiimsexams.ac.in.',
    source: 'AIIMS Exams Portal',
    is_active: true,
    created_at: '2026-02-21',
  },
]

export const hospitals: Hospital[] = [
  // Tier 1 - Corporate
  { id: 1, name: 'Medanta - The Medicity', location: 'Gurugram', tier: 'tier1', type: 'private', career_url: 'https://www.medanta.org/careers', website_url: 'https://www.medanta.org', ent_dept_info: 'Major ENT department with cochlear implant program' },
  { id: 2, name: 'Fortis Memorial Research Institute', location: 'Gurugram', tier: 'tier1', type: 'private', career_url: 'https://www.fortishealthcare.com/careers', website_url: 'https://www.fortishealthcare.com', ent_dept_info: 'Full ENT department with skull base surgery unit' },
  { id: 3, name: 'Artemis Hospital', location: 'Gurugram', tier: 'tier1', type: 'private', career_url: 'https://www.artemishospitals.com/careers', website_url: 'https://www.artemishospitals.com', ent_dept_info: 'ENT and Head & Neck Surgery department' },
  { id: 4, name: 'Max Super Speciality Hospital', location: 'Gurugram', tier: 'tier1', type: 'private', career_url: 'https://jobs.maxhealthcare.in', website_url: 'https://www.maxhealthcare.in', ent_dept_info: 'Comprehensive ENT services across multiple locations' },
  { id: 5, name: 'Paras Hospitals', location: 'Gurugram', tier: 'tier1', type: 'private', career_url: 'https://www.parashospitals.com/career', website_url: 'https://www.parashospitals.com', ent_dept_info: 'Growing ENT department' },
  { id: 6, name: 'CK Birla Hospital', location: 'Gurugram', tier: 'tier1', type: 'private', career_url: 'https://www.ckbirlahospital.com/careers', website_url: 'https://www.ckbirlahospital.com', ent_dept_info: 'ENT department with modern facilities' },
  { id: 7, name: 'Narayana Health', location: 'Gurugram', tier: 'tier1', type: 'private', career_url: 'https://www.narayanahealth.org/careers', website_url: 'https://www.narayanahealth.org', ent_dept_info: 'Established ENT services' },
  { id: 8, name: 'Manipal Hospital', location: 'Gurugram', tier: 'tier1', type: 'private', career_url: 'https://www.manipalhospitals.com/careers', website_url: 'https://www.manipalhospitals.com', ent_dept_info: 'Full-service ENT department' },

  // Tier 2 - Multispecialty
  { id: 9, name: 'W Pratiksha Hospital', location: 'Gurugram', tier: 'tier2', type: 'private', career_url: 'https://www.wpratiksha.com/career', website_url: 'https://www.wpratiksha.com', ent_dept_info: 'Growing multispecialty with ENT' },
  { id: 10, name: 'SGT Hospital', location: 'Gurugram', tier: 'tier2', type: 'private', career_url: 'https://sgtuniversity.ac.in/career', website_url: 'https://sgtuniversity.ac.in', ent_dept_info: 'Teaching hospital with ENT residency' },
  { id: 11, name: 'Park Hospital', location: 'Gurugram', tier: 'tier2', type: 'private', career_url: 'https://www.parkhospital.in/career', website_url: 'https://www.parkhospital.in', ent_dept_info: 'ENT services available' },
  { id: 12, name: 'Signature Hospital', location: 'Gurugram', tier: 'tier2', type: 'private', career_url: null, website_url: 'https://signaturehospital.net', ent_dept_info: 'Small ENT unit' },
  { id: 13, name: 'Marengo Asia Hospital', location: 'Gurugram', tier: 'tier2', type: 'private', career_url: 'https://www.marengoasiahospitals.com/career', website_url: 'https://www.marengoasiahospitals.com', ent_dept_info: 'Recently rebranded, expanding ENT' },
  { id: 14, name: 'Miracles Mediclinic', location: 'Gurugram', tier: 'tier2', type: 'private', career_url: null, website_url: 'https://www.miraclesmediclinic.com', ent_dept_info: 'Multispecialty with ENT' },
  { id: 15, name: 'Mayom Hospital', location: 'Gurugram', tier: 'tier2', type: 'private', career_url: null, website_url: 'https://www.mayomhospital.com', ent_dept_info: 'Small multispecialty' },
  { id: 16, name: 'Optimus Hospital', location: 'Gurugram', tier: 'tier2', type: 'private', career_url: null, website_url: 'https://optimushospitalgurgaon.com', ent_dept_info: 'Growing facility' },
  { id: 17, name: 'Aman Hospital', location: 'Gurugram', tier: 'tier2', type: 'private', career_url: null, website_url: 'https://amanhospitals.in', ent_dept_info: 'Multispecialty hospital' },

  // Government / Public
  { id: 18, name: 'NC Joshi Memorial Hospital', location: 'Delhi', tier: 'govt', type: 'govt', career_url: 'https://health.delhi.gov.in/vacancy', website_url: 'https://health.delhi.gov.in', ent_dept_info: 'Delhi govt hospital - active walk-in recruitment for SR ENT' },
  { id: 19, name: 'Bhagwan Swaminarayan Arogyam Hospital (BSAH)', location: 'Delhi', tier: 'govt', type: 'govt', career_url: 'https://health.delhi.gov.in/vacancy', website_url: 'https://health.delhi.gov.in', ent_dept_info: 'Delhi govt - recurring Friday walk-in interviews' },
  { id: 20, name: 'Safdarjung Hospital / VMMC', location: 'Delhi', tier: 'govt', type: 'govt', career_url: 'https://vmmc-sjh.mohfw.gov.in/recruitment', website_url: 'https://www.vmmc-sjh.nic.in', ent_dept_info: 'Major teaching hospital with large ENT dept' },
  { id: 21, name: 'AIIMS Delhi', location: 'Delhi', tier: 'govt', type: 'govt', career_url: 'https://www.aiimsexams.ac.in', website_url: 'https://www.aiims.edu', ent_dept_info: 'Premier institute - regular SR recruitment' },
  { id: 22, name: 'RML Hospital', location: 'Delhi', tier: 'govt', type: 'govt', career_url: 'https://rmlh.nic.in', website_url: 'https://rmlh.nic.in', ent_dept_info: 'Central govt hospital with ENT dept' },
  { id: 23, name: 'Lady Hardinge Medical College', location: 'Delhi', tier: 'govt', type: 'govt', career_url: 'https://lhmc-hosp.gov.in', website_url: 'https://lhmc-hosp.gov.in', ent_dept_info: 'Govt medical college with ENT dept' },
  { id: 24, name: 'Sir Ganga Ram Hospital', location: 'Delhi', tier: 'govt', type: 'private', career_url: 'https://www.sgrh.com/career', website_url: 'https://www.sgrh.com', ent_dept_info: 'Semi-private charitable hospital with strong ENT' },
  { id: 25, name: 'Janakpuri Super Speciality Hospital (JSSHS)', location: 'Delhi', tier: 'govt', type: 'govt', career_url: 'https://health.delhi.gov.in/vacancy', website_url: 'https://health.delhi.gov.in', ent_dept_info: 'Delhi govt super speciality' },
  { id: 26, name: 'Civil Hospital Gurugram', location: 'Gurugram', tier: 'govt', type: 'govt', career_url: 'https://haryanahealth.gov.in', website_url: 'https://haryanahealth.gov.in', ent_dept_info: 'District hospital - Haryana govt' },

  // Startup
  { id: 27, name: 'Pristyn Care', location: 'Gurugram', tier: 'startup', type: 'private', career_url: 'https://www.pristyncare.com/careers', website_url: 'https://www.pristyncare.com', ent_dept_info: 'ENT-focused healthtech startup, high volume surgeries' },
]

export const portals: Portal[] = [
  // General
  { id: 1, name: 'Naukri.com', category: 'general', url: 'https://www.naukri.com', search_url: 'https://www.naukri.com/ent-surgeon-jobs-in-delhi-ncr', description: "India's largest job portal - strong medical listings", is_registered: true },
  { id: 2, name: 'LinkedIn', category: 'general', url: 'https://www.linkedin.com', search_url: 'https://www.linkedin.com/jobs/search/?keywords=ENT%20surgeon&location=Delhi%20NCR', description: 'Professional networking - connect with hospital HRs directly', is_registered: true },
  { id: 3, name: 'Indeed India', category: 'general', url: 'https://www.indeed.co.in', search_url: 'https://www.indeed.co.in/jobs?q=ENT+surgeon&l=Gurgaon', description: 'Global job board with Indian listings', is_registered: false },
  { id: 4, name: 'Glassdoor', category: 'general', url: 'https://www.glassdoor.co.in', search_url: 'https://www.glassdoor.co.in/Job/delhi-ncr-ent-jobs-SRCH_IL.0,9_IC2858403_KO10,13.htm', description: 'Job listings with salary insights and company reviews', is_registered: false },
  { id: 5, name: 'PlacementIndia', category: 'general', url: 'https://www.placementindia.com', search_url: 'https://www.placementindia.com/job-search/ent-surgeon-jobs', description: 'Indian job portal with medical positions', is_registered: false },
  { id: 6, name: 'Foundit (Monster India)', category: 'general', url: 'https://www.foundit.in', search_url: 'https://www.foundit.in/srp/results?query=ENT+surgeon&locations=Delhi+NCR', description: 'Rebranded Monster India - good medical listings', is_registered: false },

  // Medical
  { id: 7, name: 'MedVacancies', category: 'medical', url: 'https://www.medvacancies.com', search_url: 'https://www.medvacancies.com/search?q=ENT', description: 'Dedicated medical job portal for India', is_registered: false },
  { id: 8, name: 'IndianRDA', category: 'medical', url: 'https://www.indianrda.com', search_url: 'https://www.indianrda.com/jobs', description: 'Resident Doctors Association - job listings and updates', is_registered: false },
  { id: 9, name: 'DoctorsJobIndia', category: 'medical', url: 'https://www.doctorsjobindia.com', search_url: 'https://www.doctorsjobindia.com/ent-jobs', description: 'India-specific doctor job listings', is_registered: false },
  { id: 10, name: 'OhmJobs', category: 'medical', url: 'https://www.ohmjobs.com', search_url: 'https://www.ohmjobs.com/search?specialty=ENT', description: 'Healthcare recruitment platform', is_registered: false },
  { id: 11, name: 'DoctorsInCiti', category: 'medical', url: 'https://www.doctorsinciti.com', search_url: 'https://www.doctorsinciti.com/jobs', description: 'Doctor job portal with city-wise listings', is_registered: false },
  { id: 12, name: 'DocThub', category: 'medical', url: 'https://www.docthub.com', search_url: 'https://www.docthub.com/jobs?q=ENT', description: 'Medical professional networking and jobs', is_registered: false },

  // Government
  { id: 13, name: 'Delhi Health Department', category: 'government', url: 'https://health.delhi.gov.in', search_url: 'https://health.delhi.gov.in/vacancy', description: 'Official Delhi govt health vacancies - primary source for walk-ins', is_registered: false },
  { id: 14, name: 'Haryana Health Department', category: 'government', url: 'https://haryanahealth.gov.in', search_url: 'https://haryanahealth.gov.in/notice-category/recruitments/', description: 'Haryana state health recruitment notices', is_registered: false },
  { id: 15, name: 'HPSC (Haryana PSC)', category: 'government', url: 'https://hpsc.gov.in', search_url: 'https://hpsc.gov.in', description: 'Haryana Public Service Commission - specialist doctor posts', is_registered: false },
  { id: 16, name: 'AIIMS Exams Portal', category: 'government', url: 'https://aiimsexams.ac.in', search_url: 'https://aiimsexams.ac.in', description: 'All AIIMS recruitment - Senior Resident and Faculty positions', is_registered: false },
  { id: 17, name: 'VMMC Safdarjung', category: 'government', url: 'https://vmmc-sjh.mohfw.gov.in', search_url: 'https://vmmc-sjh.mohfw.gov.in/recruitment', description: 'VMMC & Safdarjung Hospital official recruitment page', is_registered: false },
]

export const checklistItems: ChecklistItem[] = [
  { id: 1, title: 'Check Delhi Health Dept vacancies', url: 'https://health.delhi.gov.in/vacancy', category: 'government', sort_order: 1 },
  { id: 2, title: 'Check Haryana Health Dept notices', url: 'https://haryanahealth.gov.in/notice-category/recruitments/', category: 'government', sort_order: 2 },
  { id: 3, title: 'Search Naukri.com for new ENT positions', url: 'https://www.naukri.com/ent-surgeon-jobs-in-delhi-ncr', category: 'portals', sort_order: 3 },
  { id: 4, title: 'Search LinkedIn for ENT openings', url: 'https://www.linkedin.com/jobs/search/?keywords=ENT%20surgeon&location=Delhi%20NCR', category: 'portals', sort_order: 4 },
  { id: 5, title: 'Check top 5 hospital career pages', url: null, category: 'hospitals', sort_order: 5 },
  { id: 6, title: 'Follow up on pending applications', url: null, category: 'applications', sort_order: 6 },
  { id: 7, title: 'Update resume if needed', url: null, category: 'personal', sort_order: 7 },
]
