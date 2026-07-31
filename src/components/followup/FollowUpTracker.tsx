'use client';

import React from 'react';
import { Calendar, CheckCircle2, Building } from 'lucide-react';
import { useMedical } from '@/context/MedicalContext';

export const FollowUpTracker: React.FC = () => {
  const { followUps, markFollowUpComplete, activeParentProfile } = useMedical();

  const getDaysRemaining = (targetDateStr: string) => {
    const target = new Date(targetDateStr).getTime();
    const now = new Date().getTime();
    return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold mb-1">
          <Calendar className="w-3.5 h-3.5 text-blue-600" /> AI Follow-up Extractor
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Smart Follow-up Tracker
        </h1>
        <p className="text-xs text-slate-500">
          Automatically scheduled medical follow-ups extracted from {activeParentProfile.name}'s prescriptions.
        </p>
      </div>

      {/* Follow-ups List */}
      <div className="space-y-3">
        {followUps.map((item) => {
          const daysLeft = getDaysRemaining(item.date);
          const isCompleted = item.status === 'completed';

          return (
            <div
              key={item.id}
              className={`bg-white border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-xs ${
                isCompleted
                  ? 'border-slate-200 opacity-60'
                  : daysLeft <= 14
                  ? 'border-amber-300 bg-amber-50/50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border ${
                    isCompleted
                      ? 'bg-slate-100 text-slate-400 border-slate-200'
                      : daysLeft <= 14
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <div className="text-center leading-none">
                      <span className="text-sm font-extrabold block">{daysLeft}</span>
                      <span className="text-[9px] uppercase tracking-wider font-semibold block text-slate-500">
                        Days
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">{item.doctorName}</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {item.specialty}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" /> {item.hospital}
                  </p>

                  <p className="text-xs text-slate-700 font-medium pt-0.5">
                    <strong className="text-blue-700">Reason:</strong> {item.reason}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-bold text-slate-900 block">{item.date}</span>
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">
                    Target Date
                  </span>
                </div>

                {!isCompleted && (
                  <button
                    onClick={() => markFollowUpComplete(item.id)}
                    className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Mark Complete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
