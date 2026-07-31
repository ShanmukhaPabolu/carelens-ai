import { ParentProfile, MedicalReport, FollowUpItem, CaregiverUser } from '../types/medical';
import { INITIAL_PARENT_PROFILES, INITIAL_REPORTS, INITIAL_FOLLOWUPS } from './demoData';

const STORAGE_KEYS = {
  PROFILES: 'carelens_parent_profiles',
  ACTIVE_PARENT: 'carelens_active_parent_id',
  REPORTS: 'carelens_medical_reports',
  FOLLOWUPS: 'carelens_followups',
  USER: 'carelens_caregiver_user',
};

const isBrowser = typeof window !== 'undefined';

export const getStoredProfiles = (): ParentProfile[] => {
  if (!isBrowser) return INITIAL_PARENT_PROFILES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(INITIAL_PARENT_PROFILES));
      return INITIAL_PARENT_PROFILES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PARENT_PROFILES;
  }
};

export const getStoredActiveParentId = (): string => {
  if (!isBrowser) return 'parent_mother';
  try {
    const id = localStorage.getItem(STORAGE_KEYS.ACTIVE_PARENT);
    return id || 'parent_mother';
  } catch {
    return 'parent_mother';
  }
};

export const saveStoredActiveParentId = (id: string): void => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PARENT, id);
    window.dispatchEvent(new Event('carelens_data_updated'));
  } catch (e) {
    console.error('Error saving active parent ID:', e);
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
  
  if (newReport.followUpDate) {
    const followUps = getStoredFollowUps();
    const newFollowUp: FollowUpItem = {
      id: `f_${Date.now()}`,
      parentId: newReport.parentId,
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

export const getStoredCaregiverUser = (): CaregiverUser | null => {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveStoredCaregiverUser = (user: CaregiverUser): void => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    window.dispatchEvent(new Event('carelens_data_updated'));
  } catch (e) {
    console.error('Error saving caregiver user:', e);
  }
};

export const resetAllDataToDemo = (): void => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(INITIAL_PARENT_PROFILES));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PARENT, 'parent_mother');
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
    localStorage.setItem(STORAGE_KEYS.FOLLOWUPS, JSON.stringify(INITIAL_FOLLOWUPS));
    window.dispatchEvent(new Event('carelens_data_updated'));
  } catch (e) {
    console.error('Error resetting demo data:', e);
  }
};
