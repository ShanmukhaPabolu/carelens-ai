'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ParentProfile, MedicalReport, FollowUpItem } from '../types/medical';
import {
  getStoredParentProfile,
  saveStoredParentProfile,
  getStoredReports,
  saveStoredReports,
  addReportToStore,
  updateReportInStore,
  deleteReportFromStore,
  getStoredFollowUps,
  saveStoredFollowUps,
  resetAllDataToDemo,
} from '../lib/storage';

interface MedicalContextType {
  parentProfile: ParentProfile;
  reports: MedicalReport[];
  followUps: FollowUpItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  updateProfile: (profile: ParentProfile) => void;
  addReport: (report: MedicalReport) => void;
  updateReport: (report: MedicalReport) => void;
  deleteReport: (id: string) => void;
  markFollowUpComplete: (id: string) => void;
  resetDemoData: () => void;
  getReportById: (id: string) => MedicalReport | undefined;
}

const MedicalContext = createContext<MedicalContextType | undefined>(undefined);

export const MedicalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [parentProfile, setParentProfile] = useState<ParentProfile>(getStoredParentProfile);
  const [reports, setReports] = useState<MedicalReport[]>(getStoredReports);
  const [followUps, setFollowUps] = useState<FollowUpItem[]>(getStoredFollowUps);
  const [searchQuery, setSearchQuery] = useState('');

  const refreshData = () => {
    setParentProfile(getStoredParentProfile());
    setReports(getStoredReports());
    setFollowUps(getStoredFollowUps());
  };

  useEffect(() => {
    refreshData();
    const handleUpdate = () => refreshData();
    window.addEventListener('carelens_data_updated', handleUpdate);
    return () => window.removeEventListener('carelens_data_updated', handleUpdate);
  }, []);

  const updateProfile = (newProfile: ParentProfile) => {
    saveStoredParentProfile(newProfile);
    setParentProfile(newProfile);
  };

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
    const updated = followUps.map((item) =>
      item.id === id ? { ...item, status: 'completed' as const } : item
    );
    saveStoredFollowUps(updated);
    setFollowUps(updated);
  };

  const handleResetDemoData = () => {
    resetAllDataToDemo();
    refreshData();
  };

  const getReportById = (id: string) => {
    return reports.find((r) => r.id === id);
  };

  return (
    <MedicalContext.Provider
      value={{
        parentProfile,
        reports,
        followUps,
        searchQuery,
        setSearchQuery,
        updateProfile,
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
