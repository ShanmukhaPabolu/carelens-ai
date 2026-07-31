export type Severity = 'info' | 'warning' | 'critical';

export type LabStatus = 'normal' | 'abnormal_high' | 'abnormal_low';

export type MedicationStatus = 'new' | 'changed' | 'continued' | 'discontinued';

export interface LabResult {
  testName: string;
  value: number;
  unit: string;
  referenceRange: string;
  status: LabStatus;
  confidence: number; // 0-100
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  status: MedicationStatus;
  previousDosage?: string;
  instructions?: string;
  confidence: number; // 0-100
}

export interface ChangeHighlight {
  id: string;
  field: string;
  category: 'medicine' | 'lab' | 'diagnosis' | 'recommendation' | 'followup';
  oldValue?: string;
  newValue: string;
  description: string;
  severity: Severity;
}

export interface DoctorConflict {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  doctorNames: string[];
  reportIds: string[];
  recommendation: string;
}

export interface MedicalReport {
  id: string;
  parentId: string; // Belongs to Mother or Father profile
  uploadDate: string; // ISO String
  visitDate: string;  // YYYY-MM-DD
  doctorName: string;
  doctorSpecialty: string;
  hospital: string;
  department: string;
  patientName: string;
  reportType: 'lab' | 'prescription' | 'discharge' | 'imaging' | 'general';
  fileUrl?: string; // base64 data URL of original uploaded report image
  fileName?: string;
  
  diagnoses: string[];
  medicines: Medication[];
  labResults: LabResult[];
  doctorRecommendations: string[];
  followUpDate?: string; // YYYY-MM-DD
  
  aiConfidenceScore: number; // overall 0-100
  needsReview: boolean;
  aiMode: 'gemini' | 'simulator'; // Explicit indicator if real API or fallback simulator was used
  
  caregiverSummary: string;
  changeHighlights: ChangeHighlight[];
  doctorConflicts?: DoctorConflict[];
}

export interface FollowUpItem {
  id: string;
  parentId: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  date: string; // YYYY-MM-DD
  reason: string;
  status: 'upcoming' | 'due_soon' | 'completed' | 'missed';
  reportId?: string;
}

export interface ParentProfile {
  id: string;
  name: string;
  relationship: 'Mother' | 'Father' | 'Parent';
  age: number;
  gender: string;
  bloodGroup: string;
  primaryCondition: string;
  conditions: string[];
  primaryDoctor: string;
  hospital: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  photoUrl?: string;
}

export interface CaregiverUser {
  fullName: string;
  email: string;
  createdAt: string;
}
