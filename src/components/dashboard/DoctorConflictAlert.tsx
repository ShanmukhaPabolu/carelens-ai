'use client';

import React from 'react';
import { AlertTriangle, ShieldAlert, Stethoscope, AlertCircle } from 'lucide-react';
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
          className="rounded-2xl bg-amber-50/90 border-2 border-amber-300 p-5 shadow-xs space-y-3 text-amber-950"
        >
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-200 border border-amber-400 flex items-center justify-center text-amber-900 shrink-0 mt-0.5 shadow-2xs">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" /> Multi-Doctor Prescribing Alert
                  </h3>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 uppercase tracking-wider">
                    {conflict.severity.toUpperCase()} CONFLICT
                  </span>
                </div>
              </div>

              <h4 className="text-xs font-bold text-amber-950">{conflict.title}</h4>

              {/* Specific Warning Callout Format */}
              <div className="text-xs text-amber-950 leading-relaxed bg-white/90 p-3.5 rounded-xl border border-amber-300 font-semibold space-y-1 shadow-2xs">
                <p>{conflict.description}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] text-amber-800 font-semibold flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5 text-amber-700" /> Prescribing Physicians:
                </span>
                {conflict.doctorNames.map((doc, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-amber-100 text-slate-800 border border-amber-300 px-2 py-0.5 rounded font-bold"
                  >
                    {doc}
                  </span>
                ))}
              </div>

              <div className="bg-amber-100/70 border border-amber-300 rounded-xl p-3 text-xs text-slate-800 font-medium flex items-start gap-2.5 shadow-2xs">
                <ShieldAlert className="w-4.5 h-4.5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-950 uppercase tracking-wider text-[10px] block mb-0.5">
                    Action Recommended
                  </span>
                  <span className="text-slate-800">{conflict.recommendation}</span>
                  <span className="block text-[11px] font-bold text-amber-900 mt-1">
                    ⚠ Please verify with your doctor before continuing. This is only an alert, never medical advice.
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

