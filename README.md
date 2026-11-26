# Udyog Saarthi (Problem Statement 159)

> **"Every Ability Deserves an Opportunity"**

**Official Project Title:** Udyog Saarthi App - Progressive Web-based Application for Adults undergoing Job Coaching for opportunities under 4% reservation in NIEPMD and other Institutions.  
**Sponsoring Organization:** Ministry of Social Justice and Empowerment, Government of India.  
**Domain:** Smart Automation / Social Impact / Accessible Employment.  
**Primary Framework:** Cross-platform Mobile Application using React Native and Expo (SDK 58).

---

## 🌟 Vision & Mission
Udyog Saarthi is a dedicated, accessible employment ecosystem designed for Persons with Disabilities (PwDs), including individuals with Intellectual Disability, Autism Spectrum Disorder, Multiple Disabilities, Mental Illness, and Specific Learning Disabilities.

The ecosystem empowers candidates across their entire employment lifecycle:
$$\text{Discover} \longrightarrow \text{Understand} \longrightarrow \text{Prepare} \longrightarrow \text{Apply} \longrightarrow \text{Qualify} \longrightarrow \text{Get Placed} \longrightarrow \text{Workplace Support}$$

---

## 📱 Day 1 Development Achievements

On **Day 1: Project Foundation and Candidate Experience**, the following milestones were completed:

1. **Expo React Native Foundation:**
   - Initialized with Expo SDK 52 and Expo Router file-based routing.
   - Clean architecture separating routes (`app/`), reusable components (`src/components/`), state contexts (`src/context/`), network services (`src/services/`), design tokens (`src/constants/`), and storage utilities (`src/utils/`).
   - Configured for cross-platform compatibility (Android, iOS, Web) and verified for Expo Go.

2. **Mobile Design System & Theme Foundation:**
   - Established design tokens aligned with national government aesthetics and WCAG 2.1 AA accessibility guidelines:
     - **Primary:** Deep Blue (`#2457A6`)
     - **Secondary:** Teal (`#168C83`)
     - **Background:** Crisp Light Slate (`#F7F9FC`)
     - **Surface/Card:** Pure White (`#FFFFFF`)
     - **Text:** High Contrast Slate (`#172033`)
     - **Border Radius:** 12–16px rounded corners
   - High Contrast Mode with pure black/white contrast and high-legibility borders.
   - Reusable accessible UI components: `Button`, `Input`, `Card`, `Header`, `StepIndicator`, and `SelectOption`.

3. **Supabase Authentication & Role-Based Access Control:**
   - Multi-role architecture supporting **Candidate**, **Parent / Guardian**, **Job Coach**, and **Administrator**.
   - Secure authentication flow leveraging official Supabase Auth sessions.
   - Fallback offline/development simulated session provider for local development without external credentials.
   - Persistent session storage via `@react-native-async-storage/async-storage` and `expo-secure-store`.
   - `AuthContext` with reactive state synchronization via `onAuthStateChange`.

4. **Express.js REST API & PostgreSQL Database Integration:**
   - Standalone Node.js Express backend (`server/`) with structured MVC architecture.
   - PostgreSQL schema with Row Level Security (RLS) policies:
     - `public.users` (Auth-linked accounts with role checks)
     - `public.candidate_profiles` (Educational, vocational, skills, and aspirations)
     - `public.disability_profiles` (Strictly protected UDID reference, Washington Group functional difficulties, and accommodation needs)
   - Verified REST endpoints with token authentication middleware and error handling:
     - `GET  /api/health`
     - `POST /api/auth/register`
     - `GET  /api/auth/me`
     - `GET  /api/profile/me`
     - `POST /api/profile/me`
     - `PUT  /api/profile/me`

5. **Personalized Candidate Dashboard:**
   - Personalized greeting and government affiliation badge.
   - Dynamic profile strength indicator (percentage & missing section prompt).
   - 6-stage Employment Journey Tracker: *Saved (3) → Applied (2) → Examination (1) → Interview (0) → Placed (0)*.
   - Active application admit card & exam reminder cards.
   - Upcoming recruitment deadlines tracker.
   - Recommended 4% reservation opportunities section (preview for Day 2).
   - Quick action shortcuts to Saarthi Learning, Job Coach Mentorship, and Saarthi AI.

6. **Candidate Learning & Employment Profile Setup:**
   - Multi-section guided wizard:
     1. **Section 1: Personal Information** (Name, DOB, phone, email, address)
     2. **Section 2: Education** (Highest qualification, school/institute, literacy level)
     3. **Section 3: Skills & Training** (Core skills, vocational training, computer proficiency)
     4. **Section 4: Employment Aspirations** (Preferred sector, location, career interests)
     5. **Section 5: Support Requirements & Accommodations** (Disability category, optional UDID, Washington Group functional assessment, assistive devices, exam scribe/compensatory time)
   - Bi-directional sync with Express REST backend and local caching.

7. **Universal Accessibility Toolbar:**
   - Always-accessible floating accessibility shortcut (`A11y`).
   - Dynamic font scaling: Incremental scaling ($90\%$ to $140\%$) across all text elements.
   - One-tap High Contrast Mode toggle.
   - Text-to-Speech (TTS) integration using `expo-speech` with Indian English locale (`en-IN`).
   - Standard React Native accessibility tags: `accessibilityRole`, `accessibilityLabel`, `accessibilityHint`, `accessibilityState`.
   - Persistent accessibility preferences remembered across app restarts.

---

## 📂 Repository Structure

```
udyog-saarthi/
│
├── app/                                 # Expo Router Navigation Routes
│   ├── _layout.js                       # Root application layout (Providers & Toolbar)
│   ├── index.js                         # Welcoming Landing Page
│   │
│   ├── (auth)/                          # Authentication Routes
│   │   ├── _layout.js                   # Auth Stack Layout
│   │   ├── login.js                     # Sign In Screen with validation
│   │   └── register.js                  # Registration & Role Selection Screen
│   │
│   ├── (tabs)/                          # Main Application Tab Navigation
│   │   ├── _layout.js                   # Bottom Tab Bar Layout (Lucide Icons)
│   │   ├── index.js                     # Candidate Dashboard
│   │   ├── jobs.js                      # Opportunity Explorer (Day 2 Foundation)
│   │   ├── learn.js                     # Saarthi Learning Center (Day 3 & 4)
│   │   ├── assistant.js                 # Saarthi AI Assistant Screen
│   │   └── profile.js                   # Candidate Profile & Logout Screen
│   │
│   └── profile/
│       └── setup.js                     # Multi-Section Candidate Profile Wizard
│
├── src/                                 # Shared Frontend Architecture
│   ├── components/
│   │   ├── common/                      # Reusable UI components
│   │   │   ├── Button.js                # Accessible Button (touch target >= 48px)
│   │   │   ├── Input.js                 # Form Input with labels & validation
│   │   │   ├── Card.js                  # Elevated Card with accessibility role
│   │   │   ├── Header.js                # Navigation Bar with back action
│   │   │   └── AccessibilityToolbar.js  # Floating Accessibility Control Sheet
│   │   │
│   │   ├── dashboard/                   # Dashboard Specific Widgets
│   │   │   ├── GreetingHeader.js        # Personalized greeting & alert badge
│   │   │   ├── ProfileProgressCard.js   # Profile completion progress meter
│   │   │   ├── ApplicationProgressCard.js # 6-stage Employment Journey Tracker
│   │   │   ├── UpcomingDeadlinesCard.js # Recruitment & exam deadlines
│   │   │   ├── RecommendedJobsSection.js# Sample 4% reservation listings
│   │   │   └── QuickActionShortcuts.js  # Learning, Coach & AI shortcuts
│   │   │
│   │   └── forms/                       # Form Specific Widgets
│   │       ├── StepIndicator.js         # Multi-step progress bar
│   │       └── SelectOption.js          # Accessible radio/pill selector
│   │
│   ├── context/
│   │   ├── AuthContext.js               # Supabase Auth & Session Provider
│   │   └── AccessibilityContext.js      # Font scale, contrast & audio state
│   │
│   ├── services/
│   │   ├── api.js                       # Axios instance with Bearer interceptor
│   │   ├── authService.js               # Supabase client auth methods
│   │   ├── profileService.js            # Profile GET / POST API client
│   │   └── supabase.js                  # Supabase JS client configuration
│   │
│   ├── constants/
│   │   ├── Colors.js                    # Standard & High Contrast theme tokens
│   │   └── Config.js                    # Application constants & role definitions
│   │
│   ├── hooks/
│   │   └── useAccessibility.js          # Accessibility convenience hook
│   │
│   └── utils/
│       └── storage.js                   # Unified AsyncStorage & SecureStore wrapper
│
├── server/                              # Node.js Express REST Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js              # Supabase & PostgreSQL client / Dev Store
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js        # Register and Auth Me handlers
│   │   │   └── profileController.js     # Profile GET, POST, and PUT handlers
│   │   │
│   │   ├── middleware/
│   │   │   ├── authenticate.js          # Bearer JWT verification middleware
│   │   │   ├── authorize.js             # Role-based access control middleware
│   │   │   └── errorHandler.js          # Central JSON error response handler
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js            # /api/auth routes
│   │   │   └── profileRoutes.js         # /api/profile routes
│   │   │
│   │   ├── app.js                       # Express app configuration & middleware
│   │   └── server.js                    # Server HTTP listener
│   │
│   ├── .env.example                     # Backend environment template
│   └── package.json                     # Backend dependencies
│
├── database/
│   ├── schema.sql                       # Complete PostgreSQL schema with RLS
│   └── seed.sql                         # Synthetic development seed data
│
├── assets/
│   └── images/                          # Mobile icons, splash, and branding
│
├── .env.example                         # Frontend environment template
├── .gitignore                           # Git ignore rules (node_modules, .env)
├── app.json                             # Expo application configuration
├── babel.config.js                      # Babel configuration for Expo
├── package.json                         # Frontend dependencies
└── README.md                            # Comprehensive project documentation
```

---

## 🗄️ Database Architecture (PostgreSQL)

The database uses PostgreSQL with Supabase Row Level Security (RLS) enabled on all tables:

### 1. `public.users`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | Matches Supabase Auth user ID |
| `full_name` | VARCHAR(255) | NOT NULL | User's full legal name |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Account email address |
| `phone` | VARCHAR(20) | NULL | 10-digit mobile number |
| `role` | VARCHAR(50) | NOT NULL | `candidate`, `parent`, `job_coach`, `administrator` |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Registration timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

### 2. `public.candidate_profiles`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | Unique profile record ID |
| `user_id` | UUID | REFERENCES users(id) ON DELETE CASCADE | Owner candidate |
| `date_of_birth` | DATE | NULL | Date of birth |
| `address` | TEXT | NULL | Residential address & PIN |
| `education` | VARCHAR(255) | NULL | Highest education qualification |
| `literacy_level` | VARCHAR(100) | NULL | Language reading/writing level |
| `skills` | TEXT | NULL | Core vocational/technical skills |
| `previous_training` | TEXT | NULL | Prior training (e.g. NIEPMD course) |
| `computer_proficiency` | VARCHAR(100) | NULL | Computer literacy level |
| `preferred_sector` | VARCHAR(255) | NULL | Preferred employment sector |
| `preferred_location` | VARCHAR(255) | NULL | Desired job location |
| `career_interests` | TEXT | NULL | Specific roles of interest |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Auto-updated via trigger |

### 3. `public.disability_profiles` *(Separately Protected)*
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | Unique disability record ID |
| `user_id` | UUID | REFERENCES users(id) ON DELETE CASCADE | Owner candidate |
| `udid_reference` | VARCHAR(100) | NULL (Optional) | Unique Disability ID card reference |
| `disability_category` | VARCHAR(255) | NULL | Specified disability category |
| `functional_difficulties` | JSONB | DEFAULT '{}' | Washington Group question responses |
| `assistive_devices` | TEXT | NULL | Assistive equipment used/needed |
| `human_assistance_requirements`| TEXT | NULL | Exam scribe, buddy, extra time |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Auto-updated via trigger |

---

## 🔌 API Endpoints Implemented

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/api/health` | No | System health, database connection, and version status |
| `POST` | `/api/auth/register` | No | Syncs newly registered Supabase Auth user to database |
| `GET` | `/api/auth/me` | Yes (`Bearer <token>`) | Retrieves current authenticated user record |
| `GET` | `/api/profile/me` | Yes (`Bearer <token>`) | Fetches candidate profile and protected disability profile |
| `POST` | `/api/profile/me` | Yes (`Bearer <token>`) | Creates / updates candidate profile and support needs |
| `PUT` | `/api/profile/me` | Yes (`Bearer <token>`) | Upserts candidate profile and support needs |

---

## 🚀 How to Run the Project

### 1. Prerequisites
- **Node.js**: v18+ (verified on v25.6.1)
- **npm**: v9+ (verified on v11.9.0)
- **Expo Go App**: Installed on your physical Android or iOS mobile phone (available free on Google Play and Apple App Store)

---

### 2. Running the Backend Server
```bash
# 1. Navigate to the server folder
cd server

# 2. Install dependencies (if not already installed)
npm install

# 3. Create .env from template (optional, works with built-in development store)
cp .env.example .env

# 4. Start the Express server
npm start
```
The server starts at `http://localhost:5000`.  
Verify health by visiting `http://localhost:5000/api/health`.

---

### 3. Running the Mobile Application
```bash
# 1. From the project root directory
npm install

# 2. Configure .env from template
cp .env.example .env

# 3. Start Expo development server
npx expo start
```

---

### 4. Opening in Expo Go on a Physical Phone

> **Important for Physical Devices:**  
> When testing on a physical phone over local Wi-Fi, `localhost` refers to the phone itself. To connect the mobile app to the backend on your laptop:
> 1. Find your computer's local IP address (e.g. `192.168.1.15`).
> 2. Set `EXPO_PUBLIC_API_URL=http://<YOUR_LAN_IP>:5000/api` in your `.env` file.
> 3. Start Expo: `npx expo start`.
> 4. Open **Expo Go** on your Android phone and scan the QR code displayed in the terminal.
> 5. On iOS, scan the QR code using the default Camera app and tap **Open in Expo Go**.

---

## ⚙️ Environment Variables Guide

### Frontend (`.env` in root):
```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Backend REST API URL
# For physical phone testing, use your machine's LAN IP:
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (`server/.env`):
```env
PORT=5001
NODE_ENV=development

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key-here

# Supabase Credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# PostgreSQL Direct Connection String (Optional)
DATABASE_URL=postgresql://postgres.your-project:your-password@aws-0-region.pooler.supabase.com:6543/postgres
```

---

## 🚀 Day 2 Development Achievements: Opportunity Explorer & AI Job Assistance

On **Day 2: Employment Opportunity Explorer + AI Job Assistance**, the complete employment ecosystem was delivered:

### 1. Module A: Mobile Opportunity Explorer (`app/(tabs)/jobs.js`)
- Full opportunity discovery experience with debounced multi-keyword search (title, organization, skills).
- Sector filtering chips: **All**, **Government**, **Public Sector Undertakings (PSUs)**, and **Private Sector**.
- Comprehensive filter modal (`JobFilters`) supporting location, minimum qualification, and verified disability categories.
- Saved jobs bookmarking toggle with instant local reflection and backend persistence.
- Reusable UI cards: `JobCard`, `SectorBadge`, `DeadlineBadge`, `EligibilityCard`, `JobRecommendationCard`, `EmptyState`.

### 2. Module B: Database Architecture & Row-Level Security
- Migration `002_jobs_and_applications.sql`:
  - `jobs`: Stores verified vacancy data, educational criteria, reservation details, scribes, pay scale, official application portal URLs, and source verification dates.
  - `saved_jobs`: User bookmarks with unique `(user_id, job_id)` constraint and strict RLS policies.
  - `job_applications`: Application lifecycle tracking from `saved` to `placed`.
- Migration `003_reminders.sql`:
  - `reminders`: Scheduled deadline countdowns and exam reminders with RLS protection.

### 3. Module C: Sample Opportunities (Realistic & Verified Demo Data)
- 10 comprehensive sample listings spanning Government (NIEPMD, SSC, Postal), PSU (NTPC, BHEL, SBI, IOCL), and Private Sector (Lemon Tree, Tata Communications, Enable India partner network).
- All sample listings clearly tagged with visible `DEMO DATA` banners.
- No invented reservations or active circulars; strict adherence to official 4% PwD reservation standards under the RPwD Act 2016.

### 4. Module D: AI-Powered Notification Simplification (`/api/ai/simplify`)
- Express proxy route integrating Google Gemini (`gemini-1.5-flash`).
- Protects API keys on the server; mobile client never exposes secret credentials.
- Translates dense, bureaucratic gazette circulars into plain language bullet points:
  - Simple Title & Role Meaning
  - Who Can Apply (Eligibility summary)
  - Required Skills
  - Critical Application Deadlines
  - Required Scanned Documents & UDID Proof
  - Step-by-Step Application Instructions
  - Important Legal & Reservation Disclaimers
- Built-in Text-to-Speech (TTS) using `expo-speech` with Read Aloud toggle and pause/stop controls.

### 5. Module E: Transparent Personalized Matching Engine (`/api/jobs/recommended`)
- Evaluates candidate education, registered skills, preferred region, and sector interest.
- **Strict Accessibility Guardrail:** Disability category is **NEVER** used as a penalty; reservation quotas expand candidate opportunities.
- Delivers transparent match scores (60% - 98%) with itemized human-readable match explanations (`matchReasons`).
- Integrated into both the Candidate Dashboard (`RecommendedJobsSection.js`) and Opportunities explorer.

### 6. Module F: Application Recording and Tracking (`app/applications/`)
- Candidates record external government portal submissions with registration numbers, roll numbers, and scribe requests.
- Multi-stage tracker supporting: `Saved` → `Applied` → `Examination` → `Interview` → `Selected / Placed`.
- Dashboard summary stage counters synced to backend `/api/applications/stats`.
- Application detail view (`app/applications/[id].js`) with timeline updates and direct links back to official recruitment portals.

### 7. Module G: Application Deadline Reminders (`/api/reminders`)
- Deadline urgency indicators for vacancies closing within 14 days.
- 1-tap "Remind Me 3 Days Before Deadline" scheduling directly on the job detail screen.
- Backend calendar reminders API (`GET`, `POST`, `DELETE /api/reminders`).

---

## 🧪 Verification & Automated Testing Results

The project has been verified with end-to-end automated test suites:

- **Syntax & Compilation Test:** All JavaScript and JSX files across `app/`, `src/`, and `server/` validated using Babel (`babel-preset-expo`) and Node.js VM.
- **REST API End-to-End Suite:**
  - `GET  /api/health` -> **PASSED** (200 OK)
  - `GET  /api/jobs` -> **PASSED** (200 OK, verified 10 demo opportunities)
  - `GET  /api/jobs?sector=Government` -> **PASSED** (200 OK, verified sector filtering)
  - `GET  /api/jobs/:id` -> **PASSED** (200 OK, full reservation & qualification details)
  - `POST /api/jobs/:id/save` -> **PASSED** (201 Created, bookmarked)
  - `DELETE /api/jobs/:id/save` -> **PASSED** (200 OK, unbookmarked)
  - `POST /api/ai/simplify` -> **PASSED** (200 OK, verified structured plain-language summary)
  - `GET  /api/jobs/recommended` -> **PASSED** (200 OK, verified transparent scoring & reasons)
  - `POST /api/applications` -> **PASSED** (201 Created, application submission logged)
  - `GET  /api/applications/stats` -> **PASSED** (200 OK, stage metrics calculated)
  - `PATCH /api/applications/:id` -> **PASSED** (200 OK, status moved to examination)
  - `POST /api/reminders` -> **PASSED** (201 Created, deadline reminder set)
  - `DELETE /api/reminders/:id` -> **PASSED** (200 OK, reminder deleted)

---

## 📋 Git Commit History

### Day 1 Commits:
1. `cde1d76` - `chore: initialize Udyog Saarthi Expo project`
2. `78cac7e` - `feat: establish mobile design system and navigation`
3. `a407337` - `feat: implement Supabase authentication`
4. `e19b4e8` - `feat: integrate Express backend and PostgreSQL`
5. `526c92b` - `feat: build personalized candidate dashboard`
6. `3a2ce6b` - `feat: implement candidate learning and employment profile`
7. `c1324f6` - `feat: implement mobile accessibility controls`
8. `44439c0` - `chore: complete Day 1 mobile foundation`

### Day 2 Commits:
1. `bc841ce` - `feat: implement job database and opportunity APIs`
2. `e2d18f0` - `feat: build mobile opportunity explorer`
3. `4e43ca8` - `feat: implement detailed job information screens`
4. `29ec610` - `feat: integrate Gemini AI job notification simplification`
5. `d3a4088` - `feat: implement personalized job recommendations`
6. `4e1f40c` - `feat: implement job application tracking`
7. `215d2af` - `feat: add application deadline reminders`
8. `chore: complete Day 2 employment ecosystem` *(Final consolidation)*

---

## 🔮 Roadmap: Upcoming Modules (Day 3+)

- **Day 3:** Saarthi Learning Center with practice tests, adaptive quizzes, and model question papers.
- **Day 4:** Job Coach Connect: 1-on-1 coaching requests, accommodation requests, and mentor chat.
- **Day 5:** Employment Journey Tracker integration & offline synchronization with SQLite.
- **Day 6:** Administrator & Coach web-friendly portals with analytics.
- **Day 7:** End-to-end security hardening, voice localization in Hindi, and pilot deployment for NIEPMD.
