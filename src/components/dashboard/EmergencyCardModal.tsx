'use client';

import React from 'react';
import { X, ShieldAlert, Printer, Phone, Stethoscope, Heart, AlertCircle, Share2 } from 'lucide-react';
import { ParentProfile, MedicalReport } from '@/types/medical';

import { useMedical } from '@/context/MedicalContext';

interface Props {
  parentProfile?: ParentProfile;
  reports?: MedicalReport[];
  isOpen?: boolean;
  onClose: () => void;
}

export const EmergencyCardModal: React.FC<Props> = ({
  parentProfile: propProfile,
  reports: propReports,
  isOpen = true,
  onClose,
}) => {
  const { activeParentProfile, reports: contextReports } = useMedical();

  const parentProfile = propProfile || activeParentProfile;
  const reports = propReports || contextReports;

  if (!isOpen) return null;


  // Extract unique active medicines across reports
  const activeMeds = new Map<string, string>();
  reports.forEach((r) => {
    r.medicines.forEach((m) => {
      if (m.status !== 'discontinued' && !activeMeds.has(m.name.toLowerCase())) {
        activeMeds.set(m.name.toLowerCase(), `${m.name} (${m.dosage})`);
      }
    });
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight">EMERGENCY HEALTH CARD</h2>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/20 border border-white/30">
                  Critical Care Record
                </span>
              </div>
              <p className="text-xs text-rose-100 mt-0.5">
                Instant clinical baseline for ER first responders & hospitals
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-5 text-slate-800 max-h-[80vh] overflow-y-auto print:max-h-none print:p-0">
          
          {/* Patient Details Row */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">{parentProfile.name}</h3>
              <p className="text-xs text-slate-500">
                {parentProfile.relationship} • {parentProfile.age} Years Old • Gender: {parentProfile.gender}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-center px-3 py-1.5 rounded-xl bg-rose-100 border border-rose-200 text-rose-900">
                <span className="text-[10px] font-bold uppercase block text-rose-700">Blood Group</span>
                <span className="text-base font-extrabold">{parentProfile.bloodGroup}</span>
              </div>
            </div>
          </div>

          {/* Grid Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            {/* Chronic Diseases */}
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1.5">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-600" /> Chronic Medical Conditions
              </span>
              <ul className="space-y-1 font-semibold text-slate-800">
                {parentProfile.conditions.map((c, i) => (
                  <li key={i}>• {c}</li>
                ))}
              </ul>
            </div>

            {/* Known Allergies */}
            <div className="bg-rose-50/70 border border-rose-200 p-3.5 rounded-xl space-y-1.5">
              <span className="font-bold text-rose-800 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Known Drug Allergies
              </span>
              <p className="font-bold text-rose-900">
                {parentProfile.allergies && parentProfile.allergies.length > 0
                  ? parentProfile.allergies.join(', ')
                  : 'No known severe drug allergies recorded'}
              </p>
            </div>

            {/* Active Regimen */}
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1.5 sm:col-span-2">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-sky-600" /> Current Active Medication Regimen
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {Array.from(activeMeds.values()).map((med, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-bold text-slate-800 text-xs">
                    {med}
                  </span>
                ))}
              </div>
            </div>

            {/* Primary Doctor & Hospital */}
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                Primary Physician & Hospital
              </span>
              <p className="font-bold text-slate-900">{parentProfile.primaryDoctor}</p>
              <p className="text-slate-500">{parentProfile.hospital}</p>
              {parentProfile.hospitalPreference && (
                <p className="text-[10px] text-sky-700 font-semibold mt-1">
                  Pref: {parentProfile.hospitalPreference}
                </p>
              )}
            </div>

            {/* Emergency Contact */}
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-amber-600" /> Emergency Contact
              </span>
              <p className="font-bold text-slate-900">{parentProfile.emergencyContactName}</p>
              <p className="text-xs font-mono font-bold text-sky-700">{parentProfile.emergencyContactPhone}</p>
            </div>

          </div>

          {/* Card Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Verified by CareLens AI • Keep accessible in phone wallet
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print / Save PDF
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
