'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ParentProfile, MedicalReport, FollowUpItem, CaregiverUser } from '../types/medical';
import {
  getStoredProfiles,
  saveStoredProfiles,
  getStoredActiveParentId,
  saveStoredActiveParentId,
  getStoredReports,
  saveStoredReports,
  addReportToStore,
  updateReportInStore,
  deleteReportFromStore,
  getStoredFollowUps,
  saveStoredFollowUps,
  getStoredCaregiverUser,
  saveStoredCaregiverUser,
  resetAllDataToDemo,
} from '../lib/storage';


interface MedicalContextType {
  profiles: ParentProfile[];
  activeParentId: string;
  activeParentProfile: ParentProfile;
  setActiveParentId: (id: string) => void;
  addParentProfile: (profile: ParentProfile) => void;
  
  allReports: MedicalReport[];
  reports: MedicalReport[]; // Filtered by active parent
  
  allFollowUps: FollowUpItem[];
  followUps: FollowUpItem[]; // Filtered by active parent
  
  caregiverUser: CaregiverUser | null;
  setCaregiverUser: (user: CaregiverUser) => void;
  logoutCaregiverUser: () => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;
  
  addReport: (report: MedicalReport) => void;
  updateReport: (report: MedicalReport) => void;
  deleteReport: (id: string) => void;
  markFollowUpComplete: (id: string) => void;
  resetDemoData: () => void;
  getReportById: (id: string) => MedicalReport | undefined;
}


const MedicalContext = createContext<MedicalContextType | undefined>(undefined);

export const MedicalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<ParentProfile[]>(getStoredProfiles);
  const [activeParentId, setActiveParentIdState] = useState<string>(getStoredActiveParentId);
  const [allReports, setAllReports] = useState<MedicalReport[]>(getStoredReports);
  const [allFollowUps, setAllFollowUps] = useState<FollowUpItem[]>(getStoredFollowUps);
  const [caregiverUser, setCaregiverUserState] = useState<CaregiverUser | null>(getStoredCaregiverUser);
  const [searchQuery, setSearchQuery] = useState('');

  const refreshData = () => {
    setProfiles(getStoredProfiles());
    setActiveParentIdState(getStoredActiveParentId());
    setAllReports(getStoredReports());
    setAllFollowUps(getStoredFollowUps());
    setCaregiverUserState(getStoredCaregiverUser());
  };

  useEffect(() => {
    refreshData();
    const handleUpdate = () => refreshData();
    window.addEventListener('carelens_data_updated', handleUpdate);
    return () => window.removeEventListener('carelens_data_updated', handleUpdate);
  }, []);

  const setActiveParentId = (id: string) => {
    saveStoredActiveParentId(id);
    setActiveParentIdState(id);
  };

  const setCaregiverUser = (user: CaregiverUser) => {
    saveStoredCaregiverUser(user);
    setCaregiverUserState(user);
    refreshData();
  };


  // Filter reports & follow-ups by active parent ID
  const activeParentProfile =
    profiles.find((p) => p.id === activeParentId) || profiles[0];

  const filteredReports = allReports.filter((r) => r.parentId === activeParentId);
  const filteredFollowUps = allFollowUps.filter((f) => f.parentId === activeParentId);

  const handleAddReport = (report: MedicalReport) => {
    addReportToStore(report);
    refreshData();
  };

  const handleUpdateReport = (report: MedicalReport) => {
    updateReportInStore(report);
    refreshData();
  };

  const handleDeleteReport = (id: string) => {
    deleteReportFromStore(id);
    refreshData();
  };

  const markFollowUpComplete = (id: string) => {
    const updated = allFollowUps.map((item) =>
      item.id === id ? { ...item, status: 'completed' as const } : item
    );
    saveStoredFollowUps(updated);
    setAllFollowUps(updated);
  };

  const handleResetDemoData = () => {
    resetAllDataToDemo();
    refreshData();
  };

  const getReportById = (id: string) => {
    return allReports.find((r) => r.id === id);
  };

  const handleAddParentProfile = (newProfile: ParentProfile) => {
    const updated = [...profiles, newProfile];
    saveStoredProfiles(updated);
    setProfiles(updated);
    saveStoredActiveParentId(newProfile.id);
    setActiveParentIdState(newProfile.id);
  };

  const handleLogoutCaregiverUser = () => {
    setCaregiverUserState(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('carelens_caregiver_user');
      window.location.href = '/login';
    }
  };

  return (
    <MedicalContext.Provider
      value={{
        profiles,
        activeParentId,
        activeParentProfile,
        setActiveParentId,
        addParentProfile: handleAddParentProfile,
        allReports,
        reports: filteredReports,
        allFollowUps,
        followUps: filteredFollowUps,
        caregiverUser,
        setCaregiverUser,
        logoutCaregiverUser: handleLogoutCaregiverUser,
        searchQuery,
        setSearchQuery,
        addReport: handleAddReport,
        updateReport: handleUpdateReport,
        deleteReport: handleDeleteReport,
        markFollowUpComplete,
        resetDemoData: handleResetDemoData,
        getReportById,
      }}
    >
      {children}
    </MedicalContext.Provider>
  );

};

export const useMedical = () => {
  const context = useContext(MedicalContext);
  if (!context) {
    throw new Error('useMedical must be used within a MedicalProvider');
  }
  return context;
};
