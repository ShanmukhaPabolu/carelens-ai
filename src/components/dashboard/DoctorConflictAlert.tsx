'use client';

import React from 'react';
import { AlertTriangle, ShieldAlert, Stethoscope } from 'lucide-react';
import { DoctorConflict } from '@/types/medical';

interface Props {
  conflicts: DoctorConflict[];
}

export const DoctorConflictAlert: React.FC<Props> = ({ conflicts }) => {
  if (!conflicts || conflicts.length === 0) return null;

  return (
    <div className="space-y-3">
      {conflicts.map((conflict) => (
        <div
          key={conflict.id}
          className="rounded-2xl bg-amber-50 border border-amber-300 p-5 shadow-sm space-y-2.5 text-amber-950"
        >
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-200 border border-amber-400 flex items-center justify-center text-amber-900 shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>

            <div className="flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    AI Multi-Doctor Conflict Detection
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 uppercase tracking-wider">
                    {conflict.severity.toUpperCase()} ALERT
                  </span>
                </div>
              </div>

              <p className="text-xs font-bold text-amber-950">{conflict.title}</p>

              <p className="text-xs text-amber-900 leading-relaxed bg-amber-100/60 p-3 rounded-lg border border-amber-200 font-medium">
                {conflict.description}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] text-amber-800 font-semibold flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5 text-amber-700" /> Conflicting Physicians:
                </span>
                {conflict.doctorNames.map((doc, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-white text-slate-800 border border-amber-300 px-2 py-0.5 rounded font-bold"
                  >
                    {doc}
                  </span>
                ))}
              </div>

              <div className="bg-white border border-amber-300 rounded-lg p-2.5 text-xs text-slate-800 font-medium flex items-start gap-2 mt-2 shadow-xs">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-900 uppercase tracking-wider text-[10px] block mb-0.5">
                    Caregiver Safety Advisory
                  </span>
                  <span>{conflict.recommendation}</span>
                  <span className="block text-[10px] text-slate-500 italic mt-1">
                    * CareLens identifies medical inconsistencies across reports but never modifies prescriptions or decides which physician is correct.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
