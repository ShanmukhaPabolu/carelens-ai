'use client';

import React from 'react';
import { User, Phone, Shield, Stethoscope, Pill, Heart, RefreshCw, Calendar, CheckCircle2 } from 'lucide-react';
import { useMedical } from '@/context/MedicalContext';

export default function ProfilePage() {
  const { parentProfile, reports, resetDemoData } = useMedical();

  // Extract unique active medications from all reports
  const activeMedicationsMap = new Map<string, { dosage: string; frequency: string; doctor: string }>();
  reports.forEach((r) => {
    r.medicines.forEach((m) => {
      if (m.status !== 'discontinued' && !activeMedicationsMap.has(m.name.toLowerCase())) {
        activeMedicationsMap.set(m.name.toLowerCase(), {
          dosage: m.dosage,
          frequency: m.frequency,
          doctor: r.doctorName,
        });
      }
    });
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 py-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-1">
            <User className="w-3.5 h-3.5" /> Care Recipient Health Record
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {parentProfile.name}'s Profile
          </h1>
          <p className="text-xs text-slate-400">
            Caregiver profile & baseline clinical parameters.
          </p>
        </div>

        <button
          onClick={resetDemoData}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset Demo Dataset
        </button>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center space-x-4 border-b border-slate-800 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-extrabold text-2xl">
            {parentProfile.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{parentProfile.name}</h2>
            <p className="text-xs text-slate-400">
              {parentProfile.relationship} • Age: {parentProfile.age} • Gender: {parentProfile.gender} • Blood Group: <strong className="text-rose-400">{parentProfile.bloodGroup}</strong>
            </p>
            <p className="text-xs text-blue-400 font-semibold mt-1">
              Primary Diagnosis: {parentProfile.primaryCondition}
            </p>
          </div>
        </div>

        {/* Chronic Conditions & Emergency Contact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400" /> Managed Chronic Conditions
            </h3>
            <ul className="space-y-1.5">
              {parentProfile.conditions.map((cond, i) => (
                <li key={i} className="text-xs font-semibold text-slate-200 bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {cond}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" /> Emergency Caregiver Contact
            </h3>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <p className="text-xs font-bold text-white">{parentProfile.emergencyContactName}</p>
              <p className="text-xs text-slate-400">{parentProfile.emergencyContactPhone}</p>
              <p className="text-[10px] text-blue-400 font-semibold uppercase">Primary Family Caregiver</p>
            </div>
          </div>

        </div>
      </div>

      {/* Active Medications Summary Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Pill className="w-4 h-4 text-indigo-400" /> Active Regimen Across All Doctors ({activeMedicationsMap.size} Drugs)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.from(activeMedicationsMap.entries()).map(([name, detail], idx) => (
            <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white capitalize">{name}</span>
                <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded">
                  {detail.dosage}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{detail.frequency}</p>
              <p className="text-[10px] text-slate-500">Prescribed by {detail.doctor}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
