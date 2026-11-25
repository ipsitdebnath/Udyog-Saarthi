# Udyog Saarthi (Problem Statement 159)

> **Every Ability Deserves an Opportunity**

Udyog Saarthi is an inclusive employment assistance mobile application designed for Persons with Disabilities (PwDs), particularly individuals with Intellectual Disability, Autism Spectrum Disorder, Multiple Disabilities, Mental Illness, and Specific Learning Disabilities.

Developed for the Ministry of Social Justice and Empowerment, Government of India, for candidates undergoing job coaching for opportunities under the 4% reservation in NIEPMD and other institutions.

---

## Tech Stack
- **Frontend:** React Native, Expo SDK 52, Expo Router, Lucide Icons
- **Backend:** Node.js, Express.js, REST API
- **Database & Auth:** Supabase PostgreSQL, Supabase Auth
- **AI Integration:** Google Gemini API (Backend Orchestrated)
- **Accessibility:** High Contrast Mode, Dynamic Font Resizing, Screen Reader Support (WCAG 2.1 AA / GIGW aligned)

---

## Project Structure
```
udyog-saarthi/
├── app/                  # Expo Router navigation routes
│   ├── (auth)/           # Authentication screens (Login, Register)
│   ├── (tabs)/           # Main application tab screens (Dashboard, Jobs, Learn, Assistant, Profile)
│   ├── profile/          # Profile setup flow
│   ├── _layout.js        # Root navigation layout
│   └── index.js          # Landing page
├── assets/               # Branding and graphical assets
├── database/             # PostgreSQL schema and seed migrations
├── server/               # Express.js REST API server
└── src/                  # Reusable components, hooks, services, contexts, constants
```

## Running the Application
### Frontend (Mobile App):
```bash
npm install
npx expo start
```
Scan the QR code using Expo Go on Android or iOS.

### Backend:
```bash
cd server
npm install
npm run dev
```
