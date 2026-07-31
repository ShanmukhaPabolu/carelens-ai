import { ParentProfile, MedicalReport, FollowUpItem, ParentHealthStatusCard, MissingHealthRecordAlert } from '../types/medical';

export const INITIAL_PARENT_PROFILES: ParentProfile[] = [
  {
    id: 'parent_mother',
    name: 'Lakshmi Devi',
    relationship: 'Mother',
    age: 58,
    gender: 'Female',
    bloodGroup: 'O+',
    allergies: ['Penicillin', 'Sulfa drugs'],
    primaryCondition: 'Type 2 Diabetes & Hypertension',
    conditions: ['Type 2 Diabetes', 'Hypertension', 'Diabetic Nephropathy Risk', 'Mild Osteoarthritis'],
    primaryDoctor: 'Dr. Aris Thorne (Endocrinologist)',
    hospital: 'Apex Heart & Metabolic Institute',
    hospitalPreference: 'Apollo Speciality Hospital & Apex Cardiac Institute',
    emergencyContactName: 'Rohan Devi (Son / Caregiver)',
    emergencyContactPhone: '+1 (555) 392-8812',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'parent_father',
    name: 'Ramesh Devi',
    relationship: 'Father',
    age: 62,
    gender: 'Male',
    bloodGroup: 'B+',
    allergies: ['Aspirin (Mild GI irritation)'],
    primaryCondition: 'Hypertension & Hyperlipidemia',
    conditions: ['Essential Hypertension', 'Hypercholesterolemia', 'GERD', 'Mild CAD Risk'],
    primaryDoctor: 'Dr. Evelyn Vance (Cardiologist)',
    hospital: 'St. Jude Cardiac Center',
    hospitalPreference: 'St. Jude Cardiac Center & Metro Heart Institute',
    emergencyContactName: 'Rohan Devi (Son / Caregiver)',
    emergencyContactPhone: '+1 (555) 392-8812',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
  },
];

// Helper to generate sample SVG prescription base64
function makeSampleSvgBase64(docName: string, patientName: string, dateStr: string, textContent: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750" fill="#ffffff">
    <rect width="600" height="750" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="30" y="30" width="540" height="80" fill="#f8fafc" rx="8"/>
    <text x="50" y="70" font-family="Arial" font-size="20" font-weight="bold" fill="#0f172a">CARE CLINICAL PRESCRIPTION SCAN</text>
    <text x="50" y="95" font-family="Arial" font-size="12" fill="#475569">${docName} | Date: ${dateStr}</text>
    <line x1="30" y1="130" x2="570" y2="130" stroke="#cbd5e1" stroke-width="2"/>
    <text x="50" y="165" font-family="Arial" font-size="13" font-weight="bold" fill="#2563eb">PATIENT: ${patientName}</text>
    <foreignObject x="50" y="190" width="500" height="500">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Arial; font-size: 13px; color: #334155; line-height: 1.6;">
        ${textContent}
      </div>
    </foreignObject>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// 5 Distinct Reports for Mother (Lakshmi Devi)
export const MOTHER_REPORTS: MedicalReport[] = [
  {
    id: 'report_m1',
    parentId: 'parent_mother',
    uploadDate: '2026-07-18T10:30:00Z',
    visitDate: '2026-07-18',
    doctorName: 'Dr. Aris Thorne',
    doctorSpecialty: 'Endocrinology',
    hospital: 'Apex Heart & Metabolic Institute',
    department: 'Outpatient Endocrinology',
    patientName: 'Lakshmi Devi',
    reportType: 'prescription',
    fileUrl: makeSampleSvgBase64('Dr. Aris Thorne', 'Lakshmi Devi', 'July 18, 2026', 'Metformin dosage increased to 1000mg twice daily. Ramipril 5mg continued. HbA1c: 7.8%. Creatinine: 1.1 mg/dL.'),
    diagnoses: ['Type 2 Diabetes (Uncontrolled)', 'Essential Hypertension'],
    medicines: [
      { name: 'Metformin HCl', dosage: '1000 mg', frequency: 'Twice daily', status: 'changed', previousDosage: '500 mg', confidence: 96 },
      { name: 'Ramipril', dosage: '5 mg', frequency: 'Once daily', status: 'changed', previousDosage: '2.5 mg', confidence: 94 },
      { name: 'Vitamin D3', dosage: '60,000 IU', frequency: 'Once weekly', status: 'new', confidence: 92 },
    ],
    labResults: [
      { testName: 'HbA1c', value: 7.8, unit: '%', referenceRange: '4.0 - 5.6', status: 'abnormal_high', confidence: 98 },
      { testName: 'Fasting Blood Glucose', value: 154, unit: 'mg/dL', referenceRange: '70 - 99', status: 'abnormal_high', confidence: 96 },
      { testName: 'Serum Creatinine', value: 1.1, unit: 'mg/dL', referenceRange: '0.6 - 1.0', status: 'abnormal_high', confidence: 95 },
      { testName: 'Systolic BP', value: 142, unit: 'mmHg', referenceRange: '90 - 120', status: 'abnormal_high', confidence: 97 },
      { testName: 'Diastolic BP', value: 88, unit: 'mmHg', referenceRange: '60 - 80', status: 'abnormal_high', confidence: 97 },
    ],
    doctorRecommendations: ['Low-sodium diet', 'Daily 30-min walk', 'Repeat HbA1c in 90 days'],
    followUpDate: '2026-10-18',
    aiConfidenceScore: 95,
    fieldConfidence: {
      doctorName: 98,
      doctorSpecialty: 96,
      hospital: 95,
      visitDate: 99,
      diagnoses: 94,
      reportType: 98,
    },
    needsReview: false,
    aiMode: 'simulator',
    caregiverSummary: "Mother's HbA1c increased to 7.8%. Dr. Thorne increased Metformin dosage from 500mg to 1000mg twice daily. Ramipril adjusted to 5mg. Vitamin D3 started.",
    changeHighlights: [
      { id: 'mc1', field: 'Metformin', category: 'medicine', oldValue: '500 mg', newValue: '1000 mg twice daily', description: 'Dosage increased due to elevated glycemic levels.', severity: 'warning' },
      { id: 'mc2', field: 'HbA1c', category: 'lab', oldValue: '7.4%', newValue: '7.8%', description: 'Glycemic control worsened over 2.5 months.', severity: 'warning' },
    ],
    doctorConflicts: [
      {
        id: 'conflict_m1',
        severity: 'warning',
        title: 'Dosage Discrepancy & Kidney Function Caution',
        description: '⚠ Dr. Aris Thorne prescribed Metformin 1000 mg twice daily. Previous consultation with Dr. Rao noted Metformin 500 mg daily. Serum Creatinine is 1.1 mg/dL (borderline elevated).',
        doctorNames: ['Dr. Aris Thorne', 'Dr. K. Rao'],
        reportIds: ['report_m1'],
        recommendation: 'Please confirm Metformin dosage with Dr. Thorne before increasing dose, especially with creatinine at 1.1 mg/dL. This is only an alert, never medical advice.',
      },
    ],
  },
  {
    id: 'report_m2',
    parentId: 'parent_mother',
    uploadDate: '2026-06-12T14:15:00Z',
    visitDate: '2026-06-12',
    doctorName: 'Dr. Vikram Seth',
    doctorSpecialty: 'Orthopedics',
    hospital: 'City Spine & Joint Care',
    department: 'Orthopedics OPD',
    patientName: 'Lakshmi Devi',
    reportType: 'prescription',
    fileUrl: makeSampleSvgBase64('Dr. Vikram Seth', 'Lakshmi Devi', 'June 12, 2026', 'Knee Osteoarthritis: Prescribed Naproxen Sodium 500mg twice daily for joint inflammation.'),
    diagnoses: ['Bilateral Knee Osteoarthritis', 'Low Back Pain'],
    medicines: [
      { name: 'Naproxen Sodium', dosage: '500 mg', frequency: 'Twice daily after meals', status: 'new', confidence: 76 },
      { name: 'Pantoprazole', dosage: '40 mg', frequency: 'Once daily before breakfast', status: 'new', confidence: 88 },
    ],
    labResults: [],
    doctorRecommendations: ['Quadriceps strengthening exercises', 'Avoid stair climbing'],
    followUpDate: '2026-08-15',
    aiConfidenceScore: 74,
    fieldConfidence: {
      doctorName: 71,
      doctorSpecialty: 82,
      hospital: 85,
      visitDate: 92,
      diagnoses: 68,
      reportType: 89,
    },
    needsReview: true,
    aiMode: 'simulator',
    caregiverSummary: 'Orthopedic consultation for knee pain. Dr. Seth prescribed Naproxen 500mg. Extraction flagged for review due to low OCR confidence on handwritten note.',
    changeHighlights: [
      { id: 'mc3', field: 'Naproxen Sodium', category: 'medicine', newValue: '500 mg twice daily', description: 'NSAID painkiller initiated for knee pain.', severity: 'critical' },
    ],
    doctorConflicts: [
      {
        id: 'conflict_nsaid_kidney',
        severity: 'critical',
        title: 'NSAID & Kidney Risk Contradiction',
        description: '⚠ Dr. Vikram Seth prescribed Naproxen 500 mg (NSAID). Dr. Thorne notes borderline renal insufficiency (Creatinine 1.1 mg/dL). NSAIDs can worsen renal function.',
        doctorNames: ['Dr. Vikram Seth (Orthopedics)', 'Dr. Aris Thorne (Endocrinology)'],
        reportIds: ['report_m2', 'report_m1'],
        recommendation: 'Verify with Dr. Thorne or Dr. Seth if a kidney-safe analgesic (like Acetaminophen) is preferred over Naproxen.',
      },
    ],
  },
  {
    id: 'report_m3',
    parentId: 'parent_mother',
    uploadDate: '2026-05-02T09:00:00Z',
    visitDate: '2026-05-02',
    doctorName: 'Dr. Aris Thorne',
    doctorSpecialty: 'Endocrinology',
    hospital: 'Apex Heart & Metabolic Institute',
    department: 'Outpatient Endocrinology',
    patientName: 'Lakshmi Devi',
    reportType: 'lab',
    fileUrl: makeSampleSvgBase64('Dr. Aris Thorne', 'Lakshmi Devi', 'May 02, 2026', 'Routine Diabetes & Renal Panel: HbA1c 7.4%, Creatinine 1.0 mg/dL, Fasting Glucose 140 mg/dL.'),
    diagnoses: ['Type 2 Diabetes Mellitus', 'Hypertension'],
    medicines: [
      { name: 'Metformin HCl', dosage: '500 mg', frequency: 'Twice daily', status: 'continued', confidence: 97 },
      { name: 'Ramipril', dosage: '2.5 mg', frequency: 'Once daily', status: 'continued', confidence: 96 },
    ],
    labResults: [
      { testName: 'HbA1c', value: 7.4, unit: '%', referenceRange: '4.0 - 5.6', status: 'abnormal_high', confidence: 99 },
      { testName: 'Fasting Blood Glucose', value: 140, unit: 'mg/dL', referenceRange: '70 - 99', status: 'abnormal_high', confidence: 98 },
      { testName: 'Serum Creatinine', value: 1.0, unit: 'mg/dL', referenceRange: '0.6 - 1.0', status: 'normal', confidence: 97 },
    ],
    doctorRecommendations: ['Continue current regimen', 'Monitor fasting glucose twice weekly'],
    followUpDate: '2026-07-18',
    aiConfidenceScore: 97,
    fieldConfidence: {
      doctorName: 99,
      doctorSpecialty: 98,
      hospital: 96,
      visitDate: 99,
      diagnoses: 95,
      reportType: 99,
    },
    needsReview: false,
    aiMode: 'simulator',
    caregiverSummary: 'Spring routine diabetic evaluation. HbA1c measured 7.4%. Metformin 500mg & Ramipril 2.5mg maintained. Renal function stable.',
    changeHighlights: [],
  },
  {
    id: 'report_m4',
    parentId: 'parent_mother',
    uploadDate: '2026-01-20T11:20:00Z',
    visitDate: '2026-01-20',
    doctorName: 'Dr. Aris Thorne',
    doctorSpecialty: 'Endocrinology',
    hospital: 'Apex Heart & Metabolic Institute',
    department: 'Outpatient Endocrinology',
    patientName: 'Lakshmi Devi',
    reportType: 'prescription',
    fileUrl: makeSampleSvgBase64('Dr. Aris Thorne', 'Lakshmi Devi', 'Jan 20, 2026', 'New Year Diabetes Checkup: Started Metformin 500mg twice daily.'),
    diagnoses: ['Type 2 Diabetes Mellitus (Newly Diagnosed)', 'Essential Hypertension'],
    medicines: [
      { name: 'Metformin HCl', dosage: '500 mg', frequency: 'Twice daily', status: 'new', confidence: 98 },
      { name: 'Ramipril', dosage: '2.5 mg', frequency: 'Once daily', status: 'new', confidence: 96 },
    ],
    labResults: [
      { testName: 'HbA1c', value: 8.9, unit: '%', referenceRange: '4.0 - 5.6', status: 'abnormal_high', confidence: 99 },
      { testName: 'Fasting Blood Glucose', value: 182, unit: 'mg/dL', referenceRange: '70 - 99', status: 'abnormal_high', confidence: 98 },
    ],
    doctorRecommendations: ['Diabetic education', 'Dietician referral'],
    followUpDate: '2026-05-02',
    aiConfidenceScore: 98,
    fieldConfidence: {
      doctorName: 99,
      doctorSpecialty: 99,
      hospital: 97,
      visitDate: 99,
      diagnoses: 98,
      reportType: 99,
    },
    needsReview: false,
    aiMode: 'simulator',
    caregiverSummary: 'Initial diagnosis of Type 2 Diabetes with baseline HbA1c of 8.9%. Metformin 500mg twice daily and Ramipril 2.5mg prescribed.',
    changeHighlights: [
      { id: 'mc4', field: 'Metformin', category: 'medicine', newValue: '500 mg twice daily', description: 'Initiated oral hypoglycemic therapy.', severity: 'info' },
    ],
  },
  {
    id: 'report_m5',
    parentId: 'parent_mother',
    uploadDate: '2025-10-10T16:00:00Z',
    visitDate: '2025-10-10',
    doctorName: 'Dr. Meera Nambiar',
    doctorSpecialty: 'Ophthalmology',
    hospital: 'Sight Care Eye Center',
    department: 'Retinal Services',
    patientName: 'Lakshmi Devi',
    reportType: 'consultation',
    fileUrl: makeSampleSvgBase64('Dr. Meera Nambiar', 'Lakshmi Devi', 'Oct 10, 2025', 'Annual Diabetic Retinopathy Screening: No active proliferative retinopathy seen. Mild background changes.'),
    diagnoses: ['Non-proliferative Diabetic Retinopathy (Mild)', 'Presbyopia'],
    medicines: [
      { name: 'Lubricating Eye Drops', dosage: '1 drop', frequency: '4 times daily', status: 'new', confidence: 95 },
    ],
    labResults: [],
    doctorRecommendations: ['Annual dilated eye examination in Oct 2026'],
    followUpDate: '2026-10-10',
    aiConfidenceScore: 96,
    fieldConfidence: {
      doctorName: 97,
      doctorSpecialty: 96,
      hospital: 95,
      visitDate: 98,
      diagnoses: 94,
      reportType: 96,
    },
    needsReview: false,
    aiMode: 'simulator',
    caregiverSummary: 'Annual diabetic eye screen. No severe diabetic retinopathy detected. Lubricating drops prescribed for dry eye symptoms.',
    changeHighlights: [],
  },
];

// 5 Distinct Reports for Father (Ramesh Devi)
export const FATHER_REPORTS: MedicalReport[] = [
  {
    id: 'report_f1',
    parentId: 'parent_father',
    uploadDate: '2026-06-25T11:00:00Z',
    visitDate: '2026-06-25',
    doctorName: 'Dr. Evelyn Vance',
    doctorSpecialty: 'Cardiology',
    hospital: 'St. Jude Cardiac Center',
    department: 'Outpatient Cardiology',
    patientName: 'Ramesh Devi',
    reportType: 'prescription',
    fileUrl: makeSampleSvgBase64('Dr. Evelyn Vance', 'Ramesh Devi', 'June 25, 2026', 'Cardiac Follow-up: Atorvastatin increased from 10mg to 20mg. Added Amlodipine 5mg for Systolic BP control.'),
    diagnoses: ['Essential Hypertension', 'Hypercholesterolemia'],
    medicines: [
      { name: 'Atorvastatin', dosage: '20 mg', frequency: 'Once daily at bedtime', status: 'changed', previousDosage: '10 mg', confidence: 96 },
      { name: 'Amlodipine', dosage: '5 mg', frequency: 'Once daily in morning', status: 'new', confidence: 95 },
      { name: 'Aspirin', dosage: '81 mg', frequency: 'Once daily', status: 'continued', confidence: 97 },
    ],
    labResults: [
      { testName: 'Total Cholesterol', value: 188, unit: 'mg/dL', referenceRange: '< 200', status: 'normal', confidence: 98 },
      { testName: 'LDL Cholesterol', value: 110, unit: 'mg/dL', referenceRange: '< 100', status: 'abnormal_high', confidence: 97 },
      { testName: 'Systolic BP', value: 138, unit: 'mmHg', referenceRange: '90 - 120', status: 'abnormal_high', confidence: 96 },
      { testName: 'Diastolic BP', value: 84, unit: 'mmHg', referenceRange: '60 - 80', status: 'abnormal_high', confidence: 96 },
    ],
    doctorRecommendations: ['Maintain low-fat diet', 'Monitor blood pressure 3x weekly'],
    followUpDate: '2026-09-25',
    aiConfidenceScore: 96,
    fieldConfidence: {
      doctorName: 98,
      doctorSpecialty: 97,
      hospital: 96,
      visitDate: 99,
      diagnoses: 95,
      reportType: 97,
    },
    needsReview: false,
    aiMode: 'simulator',
    caregiverSummary: "Father's total cholesterol improved to 188 mg/dL on statin therapy. Dr. Vance increased Atorvastatin to 20mg and added Amlodipine 5mg for blood pressure control.",
    changeHighlights: [
      { id: 'fc1', field: 'Atorvastatin', category: 'medicine', oldValue: '10 mg', newValue: '20 mg daily', description: 'Increased dosage to reach LDL target < 100.', severity: 'info' },
      { id: 'fc2', field: 'Amlodipine', category: 'medicine', newValue: '5 mg daily', description: 'New calcium channel blocker added for blood pressure control.', severity: 'info' },
    ],
  },
  {
    id: 'report_f2',
    parentId: 'parent_father',
    uploadDate: '2026-05-18T15:30:00Z',
    visitDate: '2026-05-18',
    doctorName: 'Dr. Neil Gupte',
    doctorSpecialty: 'Gastroenterology',
    hospital: 'City Digestive Health Center',
    department: 'Gastroenterology OPD',
    patientName: 'Ramesh Devi',
    reportType: 'consultation',
    fileUrl: makeSampleSvgBase64('Dr. Neil Gupte', 'Ramesh Devi', 'May 18, 2026', 'Gastroesophageal Reflux Disease (GERD): Omeprazole 20mg prescribed for acid reflux symptoms.'),
    diagnoses: ['Gastroesophageal Reflux Disease (GERD)', 'Mild Gastritis'],
    medicines: [
      { name: 'Omeprazole', dosage: '20 mg', frequency: 'Once daily before breakfast', status: 'new', confidence: 94 },
    ],
    labResults: [],
    doctorRecommendations: ['Avoid spicy foods and late-night meals', 'Elevate head of bed'],
    followUpDate: '2026-11-18',
    aiConfidenceScore: 94,
    fieldConfidence: {
      doctorName: 95,
      doctorSpecialty: 94,
      hospital: 92,
      visitDate: 98,
      diagnoses: 93,
      reportType: 95,
    },
    needsReview: false,
    aiMode: 'simulator',
    caregiverSummary: 'GI consultation for heartburn symptoms. Dr. Gupte diagnosed GERD and prescribed Omeprazole 20mg for 6 weeks.',
    changeHighlights: [],
  },
  {
    id: 'report_f3',
    parentId: 'parent_father',
    uploadDate: '2026-03-22T08:45:00Z',
    visitDate: '2026-03-22',
    doctorName: 'Dr. Evelyn Vance',
    doctorSpecialty: 'Cardiology',
    hospital: 'St. Jude Cardiac Center',
    department: 'Outpatient Cardiology',
    patientName: 'Ramesh Devi',
    reportType: 'lab',
    fileUrl: makeSampleSvgBase64('Dr. Evelyn Vance', 'Ramesh Devi', 'March 22, 2026', 'Spring Cardiac & Lipid Panel: Total Cholesterol 220 mg/dL, Creatinine 0.9 mg/dL.'),
    diagnoses: ['Essential Hypertension', 'Hypercholesterolemia'],
    medicines: [
      { name: 'Atorvastatin', dosage: '10 mg', frequency: 'Once daily', status: 'continued', confidence: 98 },
      { name: 'Aspirin', dosage: '81 mg', frequency: 'Once daily', status: 'continued', confidence: 98 },
    ],
    labResults: [
      { testName: 'Total Cholesterol', value: 220, unit: 'mg/dL', referenceRange: '< 200', status: 'abnormal_high', confidence: 96 },
      { testName: 'Serum Creatinine', value: 0.9, unit: 'mg/dL', referenceRange: '0.6 - 1.0', status: 'normal', confidence: 99 },
    ],
    doctorRecommendations: ['Maintain current medications', 'Repeat lipid panel in July'],
    followUpDate: '2026-06-25',
    aiConfidenceScore: 97,
    fieldConfidence: {
      doctorName: 99,
      doctorSpecialty: 98,
      hospital: 96,
      visitDate: 99,
      diagnoses: 96,
      reportType: 98,
    },
    needsReview: false,
    aiMode: 'simulator',
    caregiverSummary: 'Spring 2026 cardiac panel. Blood pressure measured 140/88. Cholesterol slightly elevated at 220 mg/dL. Renal markers normal.',
    changeHighlights: [],
  },
  {
    id: 'report_f4',
    parentId: 'parent_father',
    uploadDate: '2025-11-05T14:00:00Z',
    visitDate: '2025-11-05',
    doctorName: 'Dr. Harold Finch',
    doctorSpecialty: 'Urology',
    hospital: 'Metro Urology Care',
    department: 'Urology OPD',
    patientName: 'Ramesh Devi',
    reportType: 'scan',
    fileUrl: makeSampleSvgBase64('Dr. Harold Finch', 'Ramesh Devi', 'Nov 05, 2025', 'Prostate Checkup: PSA 1.8 ng/mL (Normal). Ultrasound shows mild BPH without obstruction.'),
    diagnoses: ['Mild Benign Prostatic Hyperplasia (BPH) Screening'],
    medicines: [
      { name: 'Tamsulosin (Flomax)', dosage: '0.4 mg', frequency: 'Once daily at bedtime', status: 'continued', confidence: 96 },
    ],
    labResults: [
      { testName: 'Serum PSA', value: 1.8, unit: 'ng/mL', referenceRange: '< 4.0', status: 'normal', confidence: 98 },
    ],
    doctorRecommendations: ['Annual PSA screening in Nov 2026'],
    followUpDate: '2026-11-05',
    aiConfidenceScore: 98,
    fieldConfidence: {
      doctorName: 99,
      doctorSpecialty: 98,
      hospital: 97,
      visitDate: 99,
      diagnoses: 98,
      reportType: 98,
    },
    needsReview: false,
    aiMode: 'simulator',
    caregiverSummary: 'Annual prostate screening by Dr. Finch. PSA level normal at 1.8 ng/mL. Tamsulosin 0.4mg maintained.',
    changeHighlights: [],
  },
  {
    id: 'report_f5',
    parentId: 'parent_father',
    uploadDate: '2025-08-14T10:00:00Z',
    visitDate: '2025-08-14',
    doctorName: 'Dr. Evelyn Vance',
    doctorSpecialty: 'Cardiology',
    hospital: 'St. Jude Cardiac Center',
    department: 'Outpatient Cardiology',
    patientName: 'Ramesh Devi',
    reportType: 'prescription',
    fileUrl: makeSampleSvgBase64('Dr. Evelyn Vance', 'Ramesh Devi', 'Aug 14, 2025', 'Baseline Cardiac Evaluation: Atorvastatin 10mg initiated for hypercholesterolemia.'),
    diagnoses: ['Hyperlipidemia', 'Hypertension Risk'],
    medicines: [
      { name: 'Atorvastatin', dosage: '10 mg', frequency: 'Once daily', status: 'new', confidence: 95 },
      { name: 'Aspirin', dosage: '81 mg', frequency: 'Once daily', status: 'new', confidence: 97 },
    ],
    labResults: [
      { testName: 'Total Cholesterol', value: 242, unit: 'mg/dL', referenceRange: '< 200', status: 'abnormal_high', confidence: 97 },
      { testName: 'Systolic BP', value: 135, unit: 'mmHg', referenceRange: '90 - 120', status: 'abnormal_high', confidence: 96 },
    ],
    doctorRecommendations: ['Initiated statin therapy'],
    followUpDate: '2026-03-22',
    aiConfidenceScore: 96,
    fieldConfidence: {
      doctorName: 98,
      doctorSpecialty: 97,
      hospital: 96,
      visitDate: 99,
      diagnoses: 95,
      reportType: 97,
    },
    needsReview: false,
    aiMode: 'simulator',
    caregiverSummary: 'Summer 2025 baseline evaluation. Atorvastatin 10mg started for elevated cholesterol (242 mg/dL).',
    changeHighlights: [],
  },
];

export const INITIAL_REPORTS: MedicalReport[] = [...MOTHER_REPORTS, ...FATHER_REPORTS];

export const INITIAL_FOLLOWUPS: FollowUpItem[] = [
  {
    id: 'fm1',
    parentId: 'parent_mother',
    doctorName: 'Dr. Aris Thorne',
    specialty: 'Endocrinology',
    hospital: 'Apex Heart & Metabolic Institute',
    date: '2026-10-18',
    reason: 'Repeat HbA1c, Fasting Blood Glucose & Kidney Panel',
    status: 'upcoming',
    reportId: 'report_m1',
    prediction: {
      lastConsultationDate: '2026-07-18',
      specialty: 'Endocrinology',
      typicalIntervalDays: 90,
      suggestedDate: '2026-10-18',
      reason: 'Standard 90-day diabetic review interval following Metformin dosage increase.',
    },
  },
  {
    id: 'fm2',
    parentId: 'parent_mother',
    doctorName: 'Dr. Vikram Seth',
    specialty: 'Orthopedics',
    hospital: 'City Spine & Joint Care',
    date: '2026-08-15',
    reason: 'Knee Osteoarthritis follow-up & pain response',
    status: 'due_soon',
    reportId: 'report_m2',
    prediction: {
      lastConsultationDate: '2026-06-12',
      specialty: 'Orthopedics',
      typicalIntervalDays: 60,
      suggestedDate: '2026-08-11',
      reason: '60-day review after initiating Naproxen NSAID therapy.',
    },
  },
  {
    id: 'ff1',
    parentId: 'parent_father',
    doctorName: 'Dr. Evelyn Vance',
    specialty: 'Cardiology',
    hospital: 'St. Jude Cardiac Center',
    date: '2026-09-25',
    reason: 'Lipid panel & blood pressure check (Amlodipine response)',
    status: 'upcoming',
    reportId: 'report_f1',
    prediction: {
      lastConsultationDate: '2026-06-25',
      specialty: 'Cardiology',
      typicalIntervalDays: 90,
      suggestedDate: '2026-09-23',
      reason: 'Quarterly cardiac review for Atorvastatin 20mg and BP monitoring.',
    },
  },
  {
    id: 'ff2',
    parentId: 'parent_father',
    doctorName: 'Dr. Neil Gupte',
    specialty: 'Gastroenterology',
    hospital: 'City Digestive Health Center',
    date: '2026-11-18',
    reason: 'GERD & Omeprazole response evaluation',
    status: 'upcoming',
    reportId: 'report_f2',
    prediction: {
      lastConsultationDate: '2026-05-18',
      specialty: 'Gastroenterology',
      typicalIntervalDays: 180,
      suggestedDate: '2026-11-14',
      reason: 'Semi-annual gastroenterology follow-up for reflux management.',
    },
  },
];

// Helper: AI Health Story Generator for Hero Section
export function generateAIHealthStory(profile: ParentProfile, reports: MedicalReport[]): string {
  if (!reports || reports.length === 0) {
    return `${profile.name} does not have any uploaded medical reports yet. Upload a prescription or lab scan to generate an AI continuous health story.`;
  }

  const parentReports = reports.filter((r) => r.parentId === profile.id);
  if (parentReports.length === 0) {
    return `No active medical history recorded for ${profile.name}. Upload your first report to build their health journey.`;
  }

  const sorted = [...parentReports].sort(
    (a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime()
  );

  const earliest = sorted[0];
  const latest = sorted[sorted.length - 1];

  if (profile.id === 'parent_mother') {
    return `${profile.name} was diagnosed with Type 2 Diabetes in early 2026. Blood sugar increased slightly in July (HbA1c 7.8%), after which Dr. Aris Thorne increased Metformin to 1000 mg twice daily. Serum Creatinine remains monitored at 1.1 mg/dL. Next diabetic follow-up is recommended within 10 weeks.`;
  } else {
    return `${profile.name} was diagnosed with Essential Hypertension and Hypercholesterolemia in 2025. Total cholesterol improved significantly from 242 mg/dL to 188 mg/dL after Atorvastatin was introduced. Blood pressure control was recently optimized with Amlodipine 5 mg. Next cardiac follow-up is scheduled for September.`;
  }
}

// Helper: Get Missing Health Records Alerts
export function getMissingRecordsForParent(profile: ParentProfile): MissingHealthRecordAlert[] {
  if (profile.id === 'parent_mother') {
    return [
      {
        id: 'mr_lipid',
        title: 'Lipid Profile Screen',
        category: 'Cardiovascular',
        lastRecordedDate: '2025-04-12',
        recommendation: 'Annual Fasting Lipid Panel (Total Cholesterol, Triglycerides, HDL, LDL)',
        reason: 'Recommended annually for diabetic patients to assess cardiovascular risk.',
      },
      {
        id: 'mr_eye',
        title: 'Annual Dilated Eye Examination',
        category: 'Ophthalmology',
        lastRecordedDate: '2025-10-10',
        recommendation: 'Dilated Retinal Screen with Ophthalmologist',
        reason: 'Due within 60 days to monitor for diabetic retinopathy progression.',
      },
      {
        id: 'mr_ecg',
        title: 'Annual Resting ECG',
        category: 'Cardiology',
        lastRecordedDate: undefined,
        recommendation: 'Baseline 12-lead ECG',
        reason: 'Recommended for seniors managing hypertension and diabetes.',
      },
    ];
  } else {
    return [
      {
        id: 'mr_hba1c_father',
        title: 'HbA1c Diabetes Screen',
        category: 'Metabolic',
        lastRecordedDate: undefined,
        recommendation: 'Baseline HbA1c Test',
        reason: 'Recommended annually for seniors over 60 with hypertension.',
      },
      {
        id: 'mr_renal',
        title: 'Renal Function Panel',
        category: 'Nephrology',
        lastRecordedDate: '2026-03-22',
        recommendation: 'Serum Electrolytes & eGFR Screen',
        reason: 'Recommended due to ongoing Amlodipine & statin therapy.',
      },
    ];
  }
}

// Helper: Get Parent Health Status Cards ("How are my parents today?")
export function getParentHealthStatusCards(profile: ParentProfile, reports: MedicalReport[]): ParentHealthStatusCard[] {
  const pReports = reports.filter((r) => r.parentId === profile.id);
  const unverified = pReports.filter((r) => r.needsReview);

  if (profile.id === 'parent_mother') {
    return [
      {
        id: 'card_1',
        type: 'improving',
        color: 'green',
        icon: 'TrendingUp',
        title: 'Blood Sugar Regimen Active',
        subtitle: 'Metformin 1000mg dosage updated by Dr. Thorne',
      },
      {
        id: 'card_2',
        type: 'due',
        color: 'yellow',
        icon: 'Calendar',
        title: 'Follow-up due in 15 days',
        subtitle: 'Orthopedics joint review with Dr. Vikram Seth',
      },
      {
        id: 'card_3',
        type: 'verification_required',
        color: unverified.length > 0 ? 'red' : 'green',
        icon: 'AlertTriangle',
        title: unverified.length > 0 ? '1 Report Requires Verification' : 'All Scans Confirmed',
        subtitle: unverified.length > 0 ? 'Low confidence extraction on Orthopedic prescription' : 'No pending reviews',
      },
      {
        id: 'card_4',
        type: 'doctor_added',
        color: 'yellow',
        icon: 'Stethoscope',
        title: 'New Specialist Consultation',
        subtitle: 'Dr. Vikram Seth (Orthopedics) added to care team',
      },
    ];
  } else {
    return [
      {
        id: 'card_f1',
        type: 'improving',
        color: 'green',
        icon: 'TrendingUp',
        title: 'Cholesterol Target Reached',
        subtitle: '188 mg/dL down from 242 mg/dL on Atorvastatin',
      },
      {
        id: 'card_f2',
        type: 'updated',
        color: 'green',
        icon: 'Pill',
        title: 'Medicines Updated',
        subtitle: 'Amlodipine 5mg added for systolic BP',
      },
      {
        id: 'card_f3',
        type: 'due',
        color: 'yellow',
        icon: 'Calendar',
        title: 'Cardiac Review Scheduled',
        subtitle: 'Sept 25 with Dr. Evelyn Vance',
      },
    ];
  }
}
