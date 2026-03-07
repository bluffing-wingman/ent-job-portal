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
  tier: 'tier1' | 'tier2' | 'govt' | 'startup' | 'clinic' | 'college'
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
    salary_min: 67700, salary_max: 208700,
    salary_text: '₹67,700 – ₹2,08,700/month (Level 11 - 7th CPC)',
    walk_in_date: '2026-02-23',
    walk_in_recurring: null,
    deadline: '2026-02-23',
    apply_url: 'https://health.delhi.gov.in/vacancy',
    description: 'Walk-in interview for Senior Resident (1 post) in ENT department. Bring original documents, self-attested photocopies, 2 passport photos, and DNB/MS certificate. Reporting time: 10:00 AM. No application fee. Eligibility: MS/MD/DNB/Diploma in ENT, registered with Delhi Medical Council. Max age 45 years.',
    source: 'Delhi Health Department',
    is_active: false,
    created_at: '2026-02-13',
  },
  {
    id: 2,
    title: 'Senior Resident (ENT) - Recurring Walk-in',
    hospital_name: 'Dr. Baba Saheb Ambedkar Hospital (BSAH)',
    location: 'Delhi',
    type: 'govt',
    salary_min: 67700, salary_max: 208700,
    salary_text: '₹67,700+/month (Level 11 - 7th CPC)',
    walk_in_date: null,
    walk_in_recurring: 'Every Friday',
    deadline: null,
    apply_url: 'https://forms.gle/yrddTVt6NGdKYQRDA',
    description: 'Recurring walk-in interviews every Friday (except holidays) for Senior Resident - ENT (1 post, adhoc basis). Venue: Office of Medical Director, BSAH Hospital, Sector VI, Rohini, Delhi-110085. Registration: 9:00 AM – 10:00 AM. Eligibility: MBBS + PG Degree/DNB/Diploma in ENT. Delhi Medical Council registration required. Max age 45 years.',
    source: 'Delhi Health Department',
    is_active: true,
    created_at: '2026-02-28',
  },
  {
    id: 3,
    title: 'Senior Resident (ENT) - Adhoc Basis',
    hospital_name: 'Safdarjung Hospital / VMMC',
    location: 'Delhi',
    type: 'govt',
    salary_min: 67700, salary_max: 208700,
    salary_text: '₹67,700 – ₹2,08,700/month (7th CPC)',
    walk_in_date: null,
    walk_in_recurring: null,
    deadline: null,
    apply_url: 'https://vmmc-sjh.mohfw.gov.in/recruitment',
    description: 'Advertisement for Senior Resident on Adhoc basis (Notice dated 28.02.2026). Apply through VMMC official recruitment portal. Send application to Medical Superintendent, VMMC & Safdarjung Hospital, New Delhi-110029. Also check Nov 2025 regular-basis notice for additional ENT vacancies.',
    source: 'VMMC Recruitment Portal',
    is_active: true,
    created_at: '2026-02-28',
  },
  {
    id: 4,
    title: 'Senior Resident (ENT/Otorhinolaryngology)',
    hospital_name: 'AIIMS Delhi',
    location: 'Delhi',
    type: 'govt',
    salary_min: 67700, salary_max: 208700,
    salary_text: '₹67,700 – ₹2,08,700/month + NPA allowances',
    walk_in_date: null,
    walk_in_recurring: null,
    deadline: null,
    apply_url: 'https://www.aiimsexams.ac.in',
    description: 'AIIMS New Delhi periodic recruitment for Senior Resident in Otorhinolaryngology (ENT). Apply online at aiimsexams.ac.in. New notifications released regularly — check portal and subscribe to alerts. One of the highest-paying govt SR positions.',
    source: 'AIIMS Exams Portal',
    is_active: true,
    created_at: '2026-02-21',
  },
  {
    id: 5,
    title: 'ENT Surgeon / Consultant',
    hospital_name: 'Pristyn Care',
    location: 'Delhi / Gurugram',
    type: 'startup',
    salary_min: null, salary_max: null,
    salary_text: 'Performance-linked (competitive)',
    walk_in_date: null,
    walk_in_recurring: null,
    deadline: null,
    apply_url: 'https://www.naukri.com/pristyn-care-jobs-careers-4545234',
    description: 'Pristyn Care is hiring ENT consultants across Delhi-NCR (Feb 2026). Role covers minimally invasive ENT surgeries — FESS, tonsillectomy, septoplasty, adenoidectomy — at partner hospitals. All admin, billing, and patient acquisition managed by Pristyn. 90+ clinics, 400+ partner hospitals, high surgical volume.',
    source: 'Naukri.com / Pristyn Care Careers',
    is_active: true,
    created_at: '2026-02-28',
  },
]

export const hospitals: Hospital[] = [
  // ===== TIER 1 - Corporate Hospitals (Delhi & Gurugram only) =====
  { id: 1, name: 'Medanta - The Medicity', location: 'Gurugram', tier: 'tier1', type: 'private', career_url: 'https://www.medanta.org/careers', website_url: 'https://www.medanta.org', ent_dept_info: 'Major ENT department with cochlear implant program' },
  { id: 2, name: 'Fortis Memorial Research Institute', location: 'Gurugram', tier: 'tier1', type: 'private', career_url: 'https://www.fortishealthcare.com/careers', website_url: 'https://www.fortishealthcare.com', ent_dept_info: 'Full ENT department with skull base surgery unit' },
  { id: 3, name: 'Artemis Hospital', location: 'Gurugram', tier: 'tier1', type: 'private', career_url: 'https://www.artemishospitals.com/careers', website_url: 'https://www.artemishospitals.com', ent_dept_info: 'ENT and Head & Neck Surgery department' },
  { id: 4, name: 'Max Super Speciality Hospital', location: 'Gurugram', tier: 'tier1', type: 'private', career_url: 'https://jobs.maxhealthcare.in', website_url: 'https://www.maxhealthcare.in', ent_dept_info: 'Comprehensive ENT services across multiple locations' },
  { id: 5, name: 'Paras Hospitals', location: 'Gurugram', tier: 'tier1', type: 'private', career_url: 'https://www.parashospitals.com/career', website_url: 'https://www.parashospitals.com', ent_dept_info: 'Growing ENT department' },
  { id: 6, name: 'CK Birla Hospital', location: 'Gurugram', tier: 'tier1', type: 'private', career_url: 'https://www.ckbirlahospital.com/careers', website_url: 'https://www.ckbirlahospital.com', ent_dept_info: 'ENT department with modern facilities' },
  { id: 7, name: 'Narayana Health', location: 'Gurugram', tier: 'tier1', type: 'private', career_url: 'https://www.narayanahealth.org/careers', website_url: 'https://www.narayanahealth.org', ent_dept_info: 'Established ENT services' },
  { id: 8, name: 'Manipal Hospital Gurugram', location: 'Gurugram', tier: 'tier1', type: 'private', career_url: 'https://www.manipalhospitals.com/careers', website_url: 'https://www.manipalhospitals.com', ent_dept_info: 'Full-service ENT department' },
  { id: 28, name: 'Indraprastha Apollo Hospital', location: 'Delhi', tier: 'tier1', type: 'private', career_url: 'https://www.apollohospitals.com/careers', website_url: 'https://www.apollohospitals.com/delhi/indraprastha-apollo-hospitals', ent_dept_info: '52 specialties, ENT dept with laser surgeries, phonosurgery, endoscopic DCR' },
  { id: 29, name: 'BLK-Max Super Speciality Hospital', location: 'Delhi', tier: 'tier1', type: 'private', career_url: 'https://www.maxhealthcare.in/careers', website_url: 'https://www.blkmaxhospital.com', ent_dept_info: '650-bed hospital, ENT with advanced robotic surgery capabilities' },
  { id: 32, name: 'Manipal Hospital Dwarka', location: 'Delhi', tier: 'tier1', type: 'private', career_url: 'https://www.manipalhospitals.com/careers', website_url: 'https://www.manipalhospitals.com/delhi/specialities/ear-nose-throat/', ent_dept_info: 'Advanced ENT department in Dwarka, Delhi' },

  // ===== TIER 2 - Multispecialty Hospitals (Delhi & Gurugram only) =====
  { id: 9, name: 'W Pratiksha Hospital', location: 'Gurugram', tier: 'tier2', type: 'private', career_url: 'https://www.wpratiksha.com/career', website_url: 'https://www.wpratiksha.com', ent_dept_info: 'Growing multispecialty with ENT' },
  { id: 10, name: 'SGT Hospital', location: 'Gurugram', tier: 'tier2', type: 'private', career_url: 'https://sgtuniversity.ac.in/career', website_url: 'https://sgtuniversity.ac.in', ent_dept_info: 'Teaching hospital with ENT residency, offers MS ENT' },
  { id: 11, name: 'Park Hospital', location: 'Gurugram', tier: 'tier2', type: 'private', career_url: 'https://www.parkhospital.in/career', website_url: 'https://www.parkhospital.in', ent_dept_info: 'ENT services available' },
  { id: 12, name: 'Signature Hospital', location: 'Gurugram', tier: 'tier2', type: 'private', career_url: null, website_url: 'https://signaturehospital.net', ent_dept_info: 'Small ENT unit' },
  { id: 13, name: 'Marengo Asia Hospital', location: 'Gurugram', tier: 'tier2', type: 'private', career_url: 'https://www.marengoasiahospitals.com/career', website_url: 'https://www.marengoasiahospitals.com', ent_dept_info: 'Recently rebranded, expanding ENT' },
  { id: 14, name: 'Miracles Mediclinic', location: 'Gurugram', tier: 'tier2', type: 'private', career_url: null, website_url: 'https://www.miraclesmediclinic.com', ent_dept_info: 'Multispecialty with ENT' },
  { id: 15, name: 'Mayom Hospital', location: 'Gurugram', tier: 'tier2', type: 'private', career_url: null, website_url: 'https://www.mayomhospital.com', ent_dept_info: 'Small multispecialty' },
  { id: 16, name: 'Optimus Hospital', location: 'Gurugram', tier: 'tier2', type: 'private', career_url: null, website_url: 'https://optimushospitalgurgaon.com', ent_dept_info: 'Growing facility' },
  { id: 17, name: 'Aman Hospital', location: 'Gurugram', tier: 'tier2', type: 'private', career_url: null, website_url: 'https://amanhospitals.in', ent_dept_info: 'Multispecialty hospital' },
  { id: 33, name: 'Primus Super Speciality Hospital', location: 'Delhi', tier: 'tier2', type: 'private', career_url: null, website_url: 'https://primushospital.com', ent_dept_info: 'India\'s first genuine Binaural Cochlear Implantation performed here' },
  { id: 34, name: 'Venkateshwar Hospital', location: 'Delhi', tier: 'tier2', type: 'private', career_url: null, website_url: 'https://www.venkateshwarhospitals.com', ent_dept_info: '325-bed, ENT with cochlear implant services, Prof. J.M. Hans' },
  { id: 35, name: 'Maharaja Agrasen Hospital', location: 'Delhi', tier: 'tier2', type: 'private', career_url: null, website_url: 'https://www.mahdwarka.in', ent_dept_info: 'Charitable trust, one of the best ENT departments in Dwarka' },
  { id: 36, name: 'Aakash Healthcare', location: 'Delhi', tier: 'tier2', type: 'private', career_url: 'https://aakashhealthcare.com/careers', website_url: 'https://aakashhealthcare.com', ent_dept_info: '300-bed, ENT HOD Dr. Abhinit Kumar (33 yrs exp)' },
  { id: 37, name: 'Sant Parmanand Hospital', location: 'Delhi', tier: 'tier2', type: 'private', career_url: null, website_url: 'https://www.sphdelhi.org', ent_dept_info: 'ENT with audiometry, speech therapy, tinnitus, vertigo & sleep apnea clinics' },
  { id: 44, name: 'Moolchand Medcity', location: 'Delhi', tier: 'tier2', type: 'private', career_url: null, website_url: 'https://www.moolchandhealthcare.com', ent_dept_info: 'Eye & ENT services at Lajpat Nagar' },
  { id: 45, name: 'Dharamshila Narayana Hospital', location: 'Delhi', tier: 'tier2', type: 'private', career_url: 'https://www.narayanahealth.org/careers', website_url: 'https://www.narayanahealth.org', ent_dept_info: 'ENT services alongside core oncology focus' },
  { id: 46, name: 'Apollo Spectra', location: 'Delhi', tier: 'tier2', type: 'private', career_url: null, website_url: 'https://www.apollospectra.com', ent_dept_info: 'Day-care surgical chain, ENT as core specialty, multiple Delhi locations' },

  // ===== GOVERNMENT / PUBLIC (Delhi & Gurugram only) =====
  { id: 18, name: 'NC Joshi Memorial Hospital', location: 'Delhi', tier: 'govt', type: 'govt', career_url: 'https://health.delhi.gov.in/vacancy', website_url: 'https://health.delhi.gov.in', ent_dept_info: 'Delhi govt hospital - active walk-in recruitment for SR ENT' },
  { id: 19, name: 'Dr. Baba Saheb Ambedkar Hospital (BSAH)', location: 'Delhi', tier: 'govt', type: 'govt', career_url: 'https://forms.gle/yrddTVt6NGdKYQRDA', website_url: 'https://health.delhi.gov.in', ent_dept_info: 'Delhi govt - recurring Friday walk-in interviews for SR ENT. Sector VI, Rohini.' },
  { id: 20, name: 'Safdarjung Hospital / VMMC', location: 'Delhi', tier: 'govt', type: 'govt', career_url: 'https://vmmc-sjh.mohfw.gov.in/recruitment', website_url: 'https://www.vmmc-sjh.nic.in', ent_dept_info: 'Major teaching hospital with large ENT dept, UG & PG programs' },
  { id: 21, name: 'AIIMS Delhi', location: 'Delhi', tier: 'govt', type: 'govt', career_url: 'https://www.aiimsexams.ac.in', website_url: 'https://www.aiims.edu', ent_dept_info: 'Premier institute - regular SR recruitment, MS/MCh/fellowship' },
  { id: 22, name: 'RML Hospital / ABVIMS', location: 'Delhi', tier: 'govt', type: 'govt', career_url: 'https://rmlh.nic.in', website_url: 'https://rmlh.nic.in', ent_dept_info: '1,400-bed tertiary care, active ENT dept with PG training' },
  { id: 23, name: 'Lady Hardinge Medical College', location: 'Delhi', tier: 'govt', type: 'govt', career_url: 'https://lhmc-hosp.gov.in', website_url: 'https://lhmc-hosp.gov.in', ent_dept_info: 'Otorhinolaryngology & Head-Neck Surgery with SSK & KSC hospitals' },
  { id: 24, name: 'Sir Ganga Ram Hospital', location: 'Delhi', tier: 'govt', type: 'private', career_url: 'https://www.sgrh.com/career', website_url: 'https://www.sgrh.com', ent_dept_info: 'Semi-private charitable hospital with strong ENT' },
  { id: 25, name: 'Janakpuri Super Speciality Hospital (JSSHS)', location: 'Delhi', tier: 'govt', type: 'govt', career_url: 'https://health.delhi.gov.in/vacancy', website_url: 'https://health.delhi.gov.in', ent_dept_info: 'Delhi govt super speciality' },
  { id: 26, name: 'Civil Hospital Gurugram', location: 'Gurugram', tier: 'govt', type: 'govt', career_url: 'https://haryanahealth.gov.in', website_url: 'https://haryanahealth.gov.in', ent_dept_info: 'District hospital - Haryana govt' },
  { id: 47, name: 'Sanjay Gandhi Memorial Hospital', location: 'Delhi', tier: 'govt', type: 'govt', career_url: 'https://health.delhi.gov.in/vacancy', website_url: 'https://sgmh.delhi.gov.in', ent_dept_info: 'Delhi state govt, OPD & indoor services, routine/emergency ENT surgery' },
  { id: 48, name: 'Rajiv Gandhi Super Speciality Hospital', location: 'Delhi', tier: 'govt', type: 'govt', career_url: 'https://rgssh.delhi.gov.in', website_url: 'https://rgssh.delhi.gov.in', ent_dept_info: '650-bed autonomous tertiary care, Dilshad Garden' },

  // ===== STARTUPS / CHAINS =====
  { id: 27, name: 'Pristyn Care', location: 'Gurugram', tier: 'startup', type: 'private', career_url: 'https://www.pristyncare.com/careers', website_url: 'https://www.pristyncare.com', ent_dept_info: 'Healthtech unicorn, 90+ clinics, 400+ partner hospitals, ENT is core specialty' },

  // ===== ENT CLINICS & SPECIALTY CENTERS (Delhi & Gurugram) =====
  { id: 49, name: 'MedFirst ENT Centre', location: 'Delhi', tier: 'clinic', type: 'private', career_url: null, website_url: 'https://entdelhi.com', ent_dept_info: 'Dr. (Major) Rajesh Bhardwaj (MBBS AIIMS, 35+ yrs), audiology, endoscopic diagnostics. Vasant Vihar.' },
  { id: 50, name: 'Delhi ENT Multispeciality Hospital', location: 'Delhi', tier: 'clinic', type: 'private', career_url: null, website_url: 'https://delhienthospital.co.in', ent_dept_info: 'Dedicated ENT hospital, 7 doctors, speech therapy, audiometry. Jasola.' },
  { id: 51, name: 'Adventis ENT & Cochlear Implant Clinic', location: 'Delhi', tier: 'clinic', type: 'private', career_url: null, website_url: 'https://www.adventis.in', ent_dept_info: 'Dr. Ameet Kishore FRCS(UK), 1500+ cochlear implants, neuro-otology. GK-I.' },
  { id: 52, name: 'Dr. Hans Centre for ENT, Hearing & Vertigo', location: 'Delhi', tier: 'clinic', type: 'private', career_url: null, website_url: 'https://drjmhans.com', ent_dept_info: 'Prof. Padamashree J.M. Hans, chain of clinics in Delhi & Gurugram' },
  { id: 53, name: 'Delhi Center for ENT & Allergic Diseases', location: 'Delhi', tier: 'clinic', type: 'private', career_url: null, website_url: 'https://delhient.in', ent_dept_info: 'Dr. Ravinder Singh Chauhan, ENT & Head-Neck surgery, allergy treatment' },
  { id: 54, name: 'Dr. Dhingra\'s ENT Care Centre', location: 'Delhi', tier: 'clinic', type: 'private', career_url: null, website_url: 'https://drdhingraent.com', ent_dept_info: 'Dr. Neeru Chugh Dhingra (MBBS MAMC, MS LHMC, DNB), allergy, sinus, head-neck. Pitampura.' },
  { id: 55, name: 'Dr. Rahul Bhargava / BENTAC Clinic', location: 'Delhi', tier: 'clinic', type: 'private', career_url: null, website_url: 'https://drrahulbhargava.com', ent_dept_info: 'Rhinology, allergy, endoscopic ear surgery, sleep apnea, pediatric ENT. Rohini.' },
  { id: 56, name: 'Sanaansh ENT & AllergyDoc Clinic', location: 'Gurugram', tier: 'clinic', type: 'private', career_url: null, website_url: 'https://drsarikaverma.com', ent_dept_info: 'Dr. Sarika Verma (DNB Gold Medallist), FESS, allergy testing, 12 AllergyDoc centres. Sector 31.' },
  { id: 57, name: 'Gurgaon ENT Clinic', location: 'Gurugram', tier: 'clinic', type: 'private', career_url: null, website_url: 'https://gurgaonentclinic.com', ent_dept_info: 'Dr. Ravinder Gera, cochlear implants, rhinoplasty, skull base surgery. Gurudwara Road.' },
  { id: 58, name: 'Vkare ENT Centre', location: 'Gurugram', tier: 'clinic', type: 'private', career_url: null, website_url: 'https://www.vkareentcentre.com', ent_dept_info: 'Dr. Manuj Jain & Dr. Rachana Gaddipati, rhinoplasty, sleep apnea, vertigo. Sushant Lok.' },
  { id: 59, name: 'ENT360 Clinic', location: 'Gurugram', tier: 'clinic', type: 'private', career_url: null, website_url: 'https://ent360.in', ent_dept_info: 'Dr. Akanksha Saxena, DLF Phase 1, comprehensive ENT care' },
  { id: 60, name: 'Dr. Manish Prakash ENT Clinic', location: 'Gurugram', tier: 'clinic', type: 'private', career_url: null, website_url: 'https://www.entgurgaon.com', ent_dept_info: 'MS (AIIMS), DNB, DOHNS (UK), sinus surgery, stitchless ear surgery, snoring surgery. South City-1.' },
  { id: 61, name: 'Vista ENT Clinic', location: 'Gurugram', tier: 'clinic', type: 'private', career_url: null, website_url: 'https://entgurgaon.co.in', ent_dept_info: 'Dr. Harsh Vardhan (DLO, DNB, MNAMS), skull base surgery, cochlear implants. Sector 82A.' },
  { id: 62, name: 'Pathania ENT Clinic', location: 'Gurugram', tier: 'clinic', type: 'private', career_url: null, website_url: 'https://pathaniaentclinic.com', ent_dept_info: 'Dr. Prof. Vishal Pathania, ear-nose-throat & neck disorders, hearing aids' },
  { id: 63, name: 'Dr. Manorama\'s ENT Clinic', location: 'Gurugram', tier: 'clinic', type: 'private', career_url: null, website_url: 'https://www.drmanoramaent.com', ent_dept_info: 'ENT treatments and allergy specialist' },

  // ===== TIER 1 - Additional Gurugram =====
  { id: 71, name: 'Shalby Sanar International Hospital', location: 'Gurugram', tier: 'tier1', type: 'private', career_url: 'https://www.shalbyinternational.com/careers', website_url: 'https://www.shalbyinternational.com', ent_dept_info: 'Dept of ENT, Cochlear Implant & Voice Disorders; 150-bed superspecialty; cochlear implants, FESS, skull base surgery, laser voice surgery. Golf Course Road, Sector 53.' },

  // ===== TIER 2 - Additional Gurugram =====
  { id: 72, name: 'Healic Multispecialty Hospital', location: 'Gurugram', tier: 'tier2', type: 'private', career_url: null, website_url: 'https://www.healic.in', ent_dept_info: 'ENT surgical unit with precision care; 24/7 emergency; locations at Sector 50 and Sohna Road (Sector 68).' },
  { id: 73, name: 'Rainbow Children\'s Hospital', location: 'Gurugram', tier: 'tier2', type: 'private', career_url: 'https://www.rainbowhospitals.in/careers', website_url: 'https://www.rainbowhospitals.in', ent_dept_info: 'Pediatric ENT unit; dedicated pediatric multispecialty chain; Sector 82.' },
  { id: 74, name: 'Shivam Hospital', location: 'Gurugram', tier: 'tier2', type: 'private', career_url: null, website_url: 'https://shivamhealthcare.in', ent_dept_info: 'NABH-accredited 35-bed multispecialty; ENT (Ear, Nose & Throat) dept; 15 specialties incl. ortho, gynae, paediatrics. NH-1, Jal Vayu Vihar, Sector 30.' },
  { id: 75, name: 'Umkal Hospital', location: 'Gurugram', tier: 'tier2', type: 'private', career_url: 'https://umkalhospital.com/career', website_url: 'https://umkalhospital.com', ent_dept_info: 'ENT dept with Dr. Manuj Jain & Dr. Rachana Gaddipati; sinus, skull base surgery, cochlear implants, hearing loss, tinnitus. Sushant Lok Phase 1, near IFFCO Metro.' },
  { id: 76, name: 'Sheetla Apollo Spectra Hospital', location: 'Gurugram', tier: 'tier2', type: 'private', career_url: null, website_url: 'https://apollospectrasheetlahospital.com', ent_dept_info: 'ENT surgical specialty; hearing loss, sinus, tonsil, throat surgeries; Apollo Spectra franchise. Sector 8.' },
  { id: 77, name: 'Miracles Apollo Cradle & Spectra', location: 'Gurugram', tier: 'tier2', type: 'private', career_url: null, website_url: 'https://www.miracleshealth.com/miracles-apollo-cradle-spectra-sec-82', ent_dept_info: 'ENT as core specialty alongside maternity & surgical care; Apollo Spectra partner. Vatika India Next, Sector 82.' },
  { id: 78, name: 'Pushpanjali Hospital', location: 'Gurugram', tier: 'tier2', type: 'private', career_url: null, website_url: 'https://www.pushpanjalimedicalcentre.co.in', ent_dept_info: 'ENT and urology available; 24-hour multispecialty; ECHS empanelled. Civil Lines, near Rajiv Chowk.' },

  // ===== MEDICAL COLLEGES (Delhi & Gurugram only) =====
  { id: 64, name: 'MAMC & Lok Nayak Hospital (LNJP)', location: 'Delhi', tier: 'college', type: 'govt', career_url: 'https://lnjp.delhi.gov.in', website_url: 'https://lnjp.delhi.gov.in', ent_dept_info: 'Maulana Azad Medical College, ENT OPD 400-500 patients/day, MS ENT & DNB programs' },
  { id: 65, name: 'UCMS & GTB Hospital', location: 'Delhi', tier: 'college', type: 'govt', career_url: 'https://gtbh.delhi.gov.in', website_url: 'https://gtbh.delhi.gov.in', ent_dept_info: 'Delhi University college, ENT excels in bionic cochlear implants, UG/PG training' },
  { id: 66, name: 'Hindu Rao Hospital / NDMC Medical College', location: 'Delhi', tier: 'college', type: 'govt', career_url: null, website_url: 'https://www.hindurao.com', ent_dept_info: 'Municipal medical college, ENT indoor/outdoor/operative/emergency care' },
  { id: 67, name: 'Deen Dayal Upadhyay Hospital', location: 'Delhi', tier: 'college', type: 'govt', career_url: 'https://health.delhi.gov.in/vacancy', website_url: 'https://dduh.delhi.gov.in', ent_dept_info: 'Delhi state, DNB course PG training in ENT, Hari Nagar' },
  { id: 68, name: 'Lal Bahadur Shastri Hospital', location: 'Delhi', tier: 'college', type: 'govt', career_url: 'https://health.delhi.gov.in/vacancy', website_url: 'https://lbsh.delhi.gov.in', ent_dept_info: 'Delhi state, ENT diagnostic, medical & surgical facilities, Khichripur' },
  { id: 69, name: 'HIMSR / Jamia Hamdard', location: 'Delhi', tier: 'college', type: 'private', career_url: null, website_url: 'https://www.himsr.co.in', ent_dept_info: 'Deemed university, 710-bed hospital, ENT among 24 departments' },
  { id: 70, name: 'SGT Medical College', location: 'Gurugram', tier: 'college', type: 'private', career_url: 'https://sgtuniversity.ac.in/career', website_url: 'https://sgtuniversity.ac.in/medical/programmes/ms-in-oto-rhino-laryngology', ent_dept_info: 'MS in Otorhinolaryngology (3-year PG), NMC recognized' },
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
