'use client';

import React from 'react';
import {
  ShieldAlert,
  Printer,
  PhoneCall,
  Heart,
  Pill,
  AlertCircle,
  Stethoscope,
  Building,
  User,
  Sparkles,
  Info
} from 'lucide-react';
import { useMedical } from '@/context/MedicalContext';

export default function EmergencyCardPage() {
  const { activeParentProfile, reports } = useMedical();

  const latestReport = reports[0];
  const activeMeds = latestReport ? latestReport.medicines : [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-300 text-xs font-bold mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> Emergency Preparedness Module
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Emergency Health Card: {activeParentProfile.name}
          </h1>
          <p className="text-xs text-slate-500">
            Instant summary for ER admissions, paramedics, and medical consultations.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2"
        >
          <Printer className="w-4 h-4" /> Print / Export PDF
        </button>
      </div>

      {/* PRINTABLE EMERGENCY CARD */}
      <div className="bg-white border-2 border-rose-400 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
        
        {/* Banner Title */}
        <div className="bg-rose-700 text-white p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-wider uppercase">
                EMERGENCY MEDICAL CARD
              </h2>
              <p className="text-xs text-rose-100 font-medium">
                CareLens AI Verified Patient Data Summary
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-white text-rose-800 rounded-lg uppercase tracking-wider">
            Critical Admissions Copy
          </span>
        </div>

        {/* Patient Core Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Patient Name
            </span>
            <span className="text-sm font-extrabold text-slate-900">{activeParentProfile.name}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Age & Gender
            </span>
            <span className="text-sm font-bold text-slate-900">
              {activeParentProfile.age} Yrs • {activeParentProfile.gender}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Blood Group
            </span>
            <span className="text-sm font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block">
              {activeParentProfile.bloodGroup}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Primary City
            </span>
            <span className="text-sm font-bold text-slate-900">{activeParentProfile.city || 'Hyderabad'}</span>
          </div>
        </div>

        {/* Emergency Contact Number */}
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wider block">
                Primary Caregiver Contact (Son / Daughter)
              </span>
              <span className="text-base font-extrabold text-emerald-950">
                {activeParentProfile.emergencyContact?.name || activeParentProfile.emergencyContactName} ({activeParentProfile.emergencyContact?.relation || 'Caregiver'})
              </span>
            </div>
          </div>

          <a
            href={`tel:${activeParentProfile.emergencyContact?.phone || activeParentProfile.emergencyContactPhone}`}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs text-center"
          >
            Call {activeParentProfile.emergencyContact?.phone || activeParentProfile.emergencyContactPhone}
          </a>
        </div>

        {/* Chronic Conditions & Known Allergies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Chronic Conditions */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-600" /> Chronic Medical Conditions
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {activeParentProfile.conditions.map((cond, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 shadow-2xs"
                >
                  {cond}
                </span>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" /> Known Drug Allergies
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {(activeParentProfile.allergies || ['Sulfa Drugs (Mild rash)', 'Penicillin (Avoid high doses)']).map((alg, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-rose-100 border border-rose-300 rounded-xl text-xs font-bold text-rose-900 shadow-2xs"
                >
                  {alg}
                </span>
              ))}
            </div>
          </div>


        </div>

        {/* Active Medications List */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Pill className="w-4 h-4 text-sky-600" /> Current Active Prescriptions ({activeMeds.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeMeds.map((med, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between shadow-2xs"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">{med.name}</p>
                  <p className="text-[11px] text-slate-500">{med.frequency}</p>
                </div>
                <span className="text-xs font-extrabold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {med.dosage}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Attending Doctors */}
        {latestReport && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <Stethoscope className="w-4 h-4 text-sky-600" />
              <div>
                <span className="font-bold text-slate-900">{latestReport.doctorName}</span>{' '}
                <span className="text-slate-500">({latestReport.doctorSpecialty})</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-slate-600">
              <Building className="w-4 h-4 text-slate-400" />
              <span>{latestReport.hospital}</span>
            </div>
          </div>
        )}

        {/* Disclaimer Callout */}
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-[11px] text-amber-950 font-bold flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>⚠ This card is an emergency summary generated from uploaded medical records. Always verify details with hospital attending staff. This is never direct medical advice.</span>
        </div>

      </div>

    </div>
  );
}
