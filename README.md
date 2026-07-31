# CareLens AI - AI-First Health Intelligence Platform for Remote Family Caregivers



**CareLens AI** is an AI-powered health intelligence platform designed for adult children living in another city who need to monitor and understand their aging parents' and family members' health journey—without manually sorting through dozens of medical reports from multiple hospitals and doctors.

Unlike traditional personal health record apps that merely store static PDFs, CareLens AI uses **Google Gemini 2.5 Flash API** to automatically parse medical document photos, extract clinical entities, detect multi-doctor prescription conflicts, generate continuous AI health stories, track biomarker lab trends, and generate shareable Emergency Health Cards.

---

## 🌟 Key Features

### 1. 🤖 Gemini 2.5 Flash Document Parsing
Upload paper prescriptions, hospital lab prints, scans, discharge summaries, or consultation notes (PNG, JPG, PDF). Gemini AI extracts:
- **Doctor Name & Clinical Specialty**
- **Hospital / Clinic & Department**
- **Visit Date & Report Classification**
- **Extracted Diagnoses**
- **Prescribed Medications, Dosages & Frequencies**
- **Lab Test Values, Units & Reference Ranges**
- **Doctor Recommendations & Return Visit Dates**

### 2. 📖 Continuous AI Health Story
Synthesizes all uploaded reports across time and multiple hospitals into a single, cohesive, plain-English health narrative. Caregivers don't need to read 20 separate PDFs to understand what changed over the past year.

### 3. ⚠️ Multi-Doctor Conflict Detection Engine
Automatically cross-references prescriptions across different doctors and hospitals. If Dr. Thorne prescribed *Metformin 500mg* and Dr. Kumar prescribed *Metformin 1000mg*, CareLens AI raises a prominent **Multi-Doctor Conflict Alert** warning caregivers to verify before administration.

### 4. 🎯 Granular Field Confidence & Human-in-the-Loop Verification
- Assigns field-level AI confidence scores for doctor names, visit dates, diagnoses, and medicines.
- Low-confidence fields (<80%) flag an **Interactive Extraction Review Form**, allowing caregivers to verify extracted text side-by-side with the original document scan.

### 5. 🚨 Emergency Health Card
One-click printable and shareable **Emergency Summary Card** containing:
- Critical Allergies & Blood Group
- Primary Medical Conditions
- Active Prescriptions & Dosages
- Primary Physician & Preferred Hospitals
- Emergency Contact Details

### 6. 📈 Longitudinal Biomarker Lab Trends
Interactive trend charts for tracking key biomarker metrics over time:
- **HbA1c (%)** & **Fasting Blood Sugar**
- **Serum Creatinine (Kidney Function)**
- **Blood Pressure (Systolic & Diastolic)**
- **Body Weight (kg)** & **Liver Enzymes (ALT/AST)**

### 7. 📅 Smart Follow-up Reminder System
Extracts return consultation dates from doctor prescription notes and converts them into upcoming caregiver reminders with countdown timers.

### 8. 👨‍👩‍👧‍👦 Multi-Family Member Support
Seamlessly switch between and manage profiles for:
- **Mother & Father**
- **Grandmother & Grandfather**
- **Mother-in-Law & Father-in-Law**
- **Spouse, Siblings, or Custom Family Members**

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **UI Logic**: [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **AI Model**: [Google Gemini 2.5 Flash API (`@google/genai`)](https://aistudio.google.com/)
- **Styling**: Vanilla CSS & Tailwind CSS
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.x or higher
- npm, yarn, or pnpm
- Google Gemini API Key (Get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey))

### 2. Installation
Clone the repository:
```bash
git clone https://github.com/ShanmukhaPabolu/carelens-ai.git
cd carelens-ai
```

Install dependencies:
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to launch CareLens AI.

---

## 🛡️ Responsible AI & Medical Disclaimer

> **IMPORTANT**: CareLens AI is a caregiver health intelligence and decision-support assistant designed for educational and organizational purposes. Extracted clinical data and AI insights do not constitute formal medical advice, diagnosis, or treatment plans. Always consult a qualified physician or certified healthcare provider before modifying any medical treatment or prescription dosage.
