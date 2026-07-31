'use client';

import React from 'react';
import { AlertTriangle, ShieldAlert, ArrowRight, Stethoscope } from 'lucide-react';
import { DoctorConflict } from '@/types/medical';

interface Props {
  conflicts: DoctorConflict[];
}

export const DoctorConflictAlert: React.FC<Props> = ({ conflicts }) => {
  if (!conflicts || conflicts.length === 0) return null;

  return (
    <div className="space-y-4">
      {conflicts.map((conflict) => (
        <div
          key={conflict.id}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 border border-amber-500/40 p-5 shadow-lg shadow-amber-950/20"
        >
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5 animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-amber-200 tracking-tight">
                    AI Detected Multi-Doctor Treatment Conflict
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
                    {conflict.severity.toUpperCase()} ALERT
                  </span>
                </div>
              </div>

              <p className="text-xs font-semibold text-amber-100">{conflict.title}</p>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-amber-500/20">
                {conflict.description}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                  <Stethoscope className="w-3 h-3 text-amber-400" /> Conflicting Care Providers:
                </span>
                {conflict.doctorNames.map((doc, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-slate-800 text-slate-200 border border-slate-700 px-2 py-0.5 rounded-md font-medium"
                  >
                    {doc}
                  </span>
                ))}
              </div>

              <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-2.5 text-xs text-amber-200/90 font-medium flex items-start gap-2 mt-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-300 uppercase tracking-wider text-[10px] block mb-0.5">
                    Caregiver Advisory (AI Safety Rule)
                  </span>
                  <span>{conflict.recommendation}</span>
                  <span className="block text-[10px] text-amber-400/80 italic mt-1">
                    * CareLens identifies inconsistencies across reports but never modifies prescriptions or decides which physician is correct.
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
