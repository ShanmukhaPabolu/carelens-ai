import { ParentProfile, MedicalReport, FollowUpItem, CaregiverUser } from '../types/medical';
import { INITIAL_PARENT_PROFILES } from './demoData';

const STORAGE_KEYS = {
  PROFILES: 'carelens_parent_profiles',
  ACTIVE_PARENT: 'carelens_active_parent_id',
  REPORTS: 'carelens_medical_reports',
  FOLLOWUPS: 'carelens_followups',
  USER: 'carelens_caregiver_user',
};

const isBrowser = typeof window !== 'undefined';

// Helper to scope storage keys by logged-in caregiver user email
const getUserStorageKey = (baseKey: string): string => {
  if (!isBrowser) return baseKey;
  try {
    const rawUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (rawUser) {
      const user = JSON.parse(rawUser);
      if (user && user.email) {
        const cleanEmail = user.email.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
        return `${baseKey}_${cleanEmail}`;
      }
    }
  } catch {}
  return baseKey;
};

export const getStoredProfiles = (): ParentProfile[] => {
  if (!isBrowser) return [];
  try {
    const key = getUserStorageKey(STORAGE_KEYS.PROFILES);
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify([]));
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};


export const saveStoredProfiles = (profiles: ParentProfile[]): void => {
  if (!isBrowser) return;
  try {
    const key = getUserStorageKey(STORAGE_KEYS.PROFILES);
    localStorage.setItem(key, JSON.stringify(profiles));
    window.dispatchEvent(new Event('carelens_data_updated'));
  } catch (e) {
    console.error('Error saving parent profiles:', e);
  }
};

export const addProfileToStore = (newProfile: ParentProfile): void => {
  const existing = getStoredProfiles();
  const updated = [...existing, newProfile];
  saveStoredProfiles(updated);
};

export const getStoredActiveParentId = (): string => {
  if (!isBrowser) return 'parent_mother';
  try {
    const key = getUserStorageKey(STORAGE_KEYS.ACTIVE_PARENT);
    const id = localStorage.getItem(key);
    if (!id) {
      const profiles = getStoredProfiles();
      return profiles[0]?.id || 'parent_mother';
    }
    return id;
  } catch {
    return 'parent_mother';
  }
};

export const saveStoredActiveParentId = (id: string): void => {
  if (!isBrowser) return;
  try {
    const key = getUserStorageKey(STORAGE_KEYS.ACTIVE_PARENT);
    localStorage.setItem(key, id);
    window.dispatchEvent(new Event('carelens_data_updated'));
  } catch (e) {
    console.error('Error saving active parent ID:', e);
  }
};

export const getStoredReports = (): MedicalReport[] => {
  if (!isBrowser) return [];
  try {
    const key = getUserStorageKey(STORAGE_KEYS.REPORTS);
    const raw = localStorage.getItem(key);
    if (!raw) {
      return [];
    }
    const reports: MedicalReport[] = JSON.parse(raw);
    return reports.sort(
      (a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
    );
  } catch {
    return [];
  }
};

export const saveStoredReports = (reports: MedicalReport[]): void => {
  if (!isBrowser) return;
  try {
    const key = getUserStorageKey(STORAGE_KEYS.REPORTS);
    localStorage.setItem(key, JSON.stringify(reports));
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
  
  const followUps = getStoredFollowUps();
  const updatedFollowUps = followUps.filter((f) => f.reportId !== reportId);
  saveStoredFollowUps(updatedFollowUps);
};

export const getStoredFollowUps = (): FollowUpItem[] => {
  if (!isBrowser) return [];
  try {
    const key = getUserStorageKey(STORAGE_KEYS.FOLLOWUPS);
    const raw = localStorage.getItem(key);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveStoredFollowUps = (followUps: FollowUpItem[]): void => {
  if (!isBrowser) return;
  try {
    const key = getUserStorageKey(STORAGE_KEYS.FOLLOWUPS);
    localStorage.setItem(key, JSON.stringify(followUps));
    window.dispatchEvent(new Event('carelens_data_updated'));
  } catch (e) {
    console.error('Error saving follow-ups:', e);
  }
};

export const getStoredCaregiverUser = (): CaregiverUser => {
  if (!isBrowser) return { fullName: 'Adult Child (Caregiver)', email: 'caregiver@carelens.ai', createdAt: new Date().toISOString() };
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) {
      const defaultUser: CaregiverUser = {
        fullName: 'Adult Child (Caregiver)',
        email: 'caregiver@carelens.ai',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultUser));
      return defaultUser;
    }
    return JSON.parse(raw);
  } catch {
    return { fullName: 'Adult Child (Caregiver)', email: 'caregiver@carelens.ai', createdAt: new Date().toISOString() };
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

export const clearAllData = (): void => {
  if (!isBrowser) return;
  try {
    const profilesKey = getUserStorageKey(STORAGE_KEYS.PROFILES);
    const reportsKey = getUserStorageKey(STORAGE_KEYS.REPORTS);
    const followUpsKey = getUserStorageKey(STORAGE_KEYS.FOLLOWUPS);
    const activeKey = getUserStorageKey(STORAGE_KEYS.ACTIVE_PARENT);

    localStorage.removeItem(reportsKey);
    localStorage.removeItem(followUpsKey);
    localStorage.removeItem(profilesKey);
    localStorage.removeItem(activeKey);
    window.dispatchEvent(new Event('carelens_data_updated'));
  } catch (e) {
    console.error('Error clearing data:', e);
  }
};

export const resetAllDataToDemo = clearAllData;
