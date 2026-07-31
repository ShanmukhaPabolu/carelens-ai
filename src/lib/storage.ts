import { ParentProfile, MedicalReport, FollowUpItem } from '../types/medical';
import { INITIAL_PARENT_PROFILE, INITIAL_REPORTS, INITIAL_FOLLOWUPS } from './demoData';

const STORAGE_KEYS = {
  PARENT: 'carelens_parent_profile',
  REPORTS: 'carelens_medical_reports',
  FOLLOWUPS: 'carelens_followups',
  THEME: 'carelens_user_theme',
};

// Helper to check browser environment
const isBrowser = typeof window !== 'undefined';

export const getStoredParentProfile = (): ParentProfile => {
  if (!isBrowser) return INITIAL_PARENT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PARENT);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PARENT, JSON.stringify(INITIAL_PARENT_PROFILE));
      return INITIAL_PARENT_PROFILE;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PARENT_PROFILE;
  }
};

export const saveStoredParentProfile = (profile: ParentProfile): void => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEYS.PARENT, JSON.stringify(profile));
    window.dispatchEvent(new Event('carelens_data_updated'));
  } catch (e) {
    console.error('Error saving parent profile:', e);
  }
};

export const getStoredReports = (): MedicalReport[] => {
  if (!isBrowser) return INITIAL_REPORTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
      return INITIAL_REPORTS;
    }
    const reports: MedicalReport[] = JSON.parse(raw);
    return reports.sort(
      (a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
    );
  } catch {
    return INITIAL_REPORTS;
  }
};

export const saveStoredReports = (reports: MedicalReport[]): void => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    window.dispatchEvent(new Event('carelens_data_updated'));
  } catch (e) {
    console.error('Error saving medical reports:', e);
  }
};

export const addReportToStore = (newReport: MedicalReport): void => {
  const existing = getStoredReports();
  const updated = [newReport, ...existing];
  saveStoredReports(updated);
  
  // If followUpDate is present, create follow-up item
  if (newReport.followUpDate) {
    const followUps = getStoredFollowUps();
    const newFollowUp: FollowUpItem = {
      id: `f_${Date.now()}`,
      doctorName: newReport.doctorName,
      specialty: newReport.doctorSpecialty,
      hospital: newReport.hospital,
      date: newReport.followUpDate,
      reason: `Follow-up after visit on ${newReport.visitDate}`,
      status: 'upcoming',
      reportId: newReport.id,
    };
    saveStoredFollowUps([newFollowUp, ...followUps]);
  }
};

export const updateReportInStore = (updatedReport: MedicalReport): void => {
  const existing = getStoredReports();
  const index = existing.findIndex((r) => r.id === updatedReport.id);
  if (index !== -1) {
    existing[index] = updatedReport;
    saveStoredReports(existing);
  }
};

export const deleteReportFromStore = (reportId: string): void => {
  const existing = getStoredReports();
  const updated = existing.filter((r) => r.id !== reportId);
  saveStoredReports(updated);
};

export const getStoredFollowUps = (): FollowUpItem[] => {
  if (!isBrowser) return INITIAL_FOLLOWUPS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FOLLOWUPS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FOLLOWUPS, JSON.stringify(INITIAL_FOLLOWUPS));
      return INITIAL_FOLLOWUPS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_FOLLOWUPS;
  }
};

export const saveStoredFollowUps = (followUps: FollowUpItem[]): void => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEYS.FOLLOWUPS, JSON.stringify(followUps));
    window.dispatchEvent(new Event('carelens_data_updated'));
  } catch (e) {
    console.error('Error saving follow-ups:', e);
  }
};

export const resetAllDataToDemo = (): void => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEYS.PARENT, JSON.stringify(INITIAL_PARENT_PROFILE));
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
    localStorage.setItem(STORAGE_KEYS.FOLLOWUPS, JSON.stringify(INITIAL_FOLLOWUPS));
    window.dispatchEvent(new Event('carelens_data_updated'));
  } catch (e) {
    console.error('Error resetting demo data:', e);
  }
};
