export type Severity = 'info' | 'warning' | 'critical';

export type LabStatus = 'normal' | 'abnormal_high' | 'abnormal_low';

export type MedicationStatus = 'new' | 'changed' | 'continued' | 'discontinued';

export type ReportCategory = 'prescription' | 'lab' | 'scan' | 'discharge' | 'consultation';

export interface FieldConfidenceMap {
  doctorName: number;
  doctorSpecialty: number;
  hospital: number;
  visitDate: number;
  diagnoses: number;
  reportType: number;
}

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
  reportType: ReportCategory;
  fileUrl?: string; // base64 data URL of original uploaded report image
  fileName?: string;
  
  diagnoses: string[];
  medicines: Medication[];
  labResults: LabResult[];
  doctorRecommendations: string[];
  followUpDate?: string; // YYYY-MM-DD
  
  aiConfidenceScore: number; // overall 0-100
  fieldConfidence?: FieldConfidenceMap;
  needsReview: boolean;
  aiMode: 'gemini' | 'simulator';
  
  caregiverSummary: string;
  changeHighlights: ChangeHighlight[];
  doctorConflicts?: DoctorConflict[];
}

export interface SmartFollowUpPrediction {
  id?: string;
  condition?: string;
  specialty?: string;
  lastConsultationDate?: string;
  typicalIntervalDays?: number;
  typicalIntervalMonths?: number;
  suggestedDate?: string;
  predictedDate?: string;
  reason?: string;
  reasoning?: string;
  accepted?: boolean;
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
  prediction?: SmartFollowUpPrediction;
}

export interface ParentProfile {
  id: string;
  name: string;
  relationship: string;

  age: number;
  gender: string;
  bloodGroup: string;
  city?: string;
  allergies?: string[];
  primaryCondition: string;
  conditions: string[];
  primaryDoctor: string;
  hospital: string;
  hospitalPreference?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  photoUrl?: string;
}

export interface CaregiverUser {
  fullName: string;
  email: string;
  password?: string;
  createdAt: string;
}

export interface ParentHealthStatusCard {
  id: string;
  type: 'improving' | 'due' | 'updated' | 'verification_required' | 'doctor_added';
  color: 'green' | 'yellow' | 'red';
  icon: string;
  title: string;
  subtitle: string;
}

export interface MissingHealthRecordAlert {
  id: string;
  title: string;
  category: string;
  lastRecordedDate?: string;
  recommendation: string;
  reason: string;
}

