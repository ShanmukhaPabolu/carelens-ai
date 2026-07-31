'use client';

import React from 'react';
import { User, Phone, Stethoscope, Pill, Heart, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useMedical } from '@/context/MedicalContext';

export default function ProfilePage() {
  const { activeParentProfile, reports, resetDemoData } = useMedical();

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
    <div className="max-w-4xl mx-auto space-y-6 pb-16 py-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold mb-1">
            <User className="w-3.5 h-3.5 text-blue-600" /> Clinical Profile Record
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {activeParentProfile.name}'s Profile
          </h1>
          <p className="text-xs text-slate-500">
            Caregiver record & baseline medical parameters.
          </p>
        </div>

        <button
          onClick={resetDemoData}
          className="px-4 py-2 bg-white hover:bg-slate-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset Demo Datasets
        </button>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
        <div className="flex items-center space-x-4 border-b border-slate-100 pb-5">
          <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-xl">
            {activeParentProfile.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{activeParentProfile.name}</h2>
            <p className="text-xs text-slate-500">
              {activeParentProfile.relationship} • Age: {activeParentProfile.age} • Gender: {activeParentProfile.gender} • Blood Group: <strong className="text-rose-700">{activeParentProfile.bloodGroup}</strong>
            </p>
            <p className="text-xs text-blue-700 font-bold mt-0.5">
              Primary Diagnosis: {activeParentProfile.primaryCondition}
            </p>
          </div>
        </div>

        {/* Chronic Conditions & Emergency Contact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-600" /> Managed Chronic Conditions
            </h3>
            <ul className="space-y-1.5">
              {activeParentProfile.conditions.map((cond, i) => (
                <li key={i} className="text-xs font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {cond}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-600" /> Primary Emergency Contact
            </h3>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1">
              <p className="text-xs font-bold text-slate-900">{activeParentProfile.emergencyContactName}</p>
              <p className="text-xs text-slate-500">{activeParentProfile.emergencyContactPhone}</p>
              <p className="text-[10px] text-blue-700 font-bold uppercase mt-1">Designated Caregiver</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Medications Summary Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
          <Pill className="w-4 h-4 text-blue-600" /> Active Regimen Across All Doctors ({activeMedicationsMap.size} Prescriptions)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.from(activeMedicationsMap.entries()).map(([name, detail], idx) => (
            <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 capitalize">{name}</span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  {detail.dosage}
                </span>
              </div>
              <p className="text-[11px] text-slate-600">{detail.frequency}</p>
              <p className="text-[10px] text-slate-400">Prescribed by {detail.doctor}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
