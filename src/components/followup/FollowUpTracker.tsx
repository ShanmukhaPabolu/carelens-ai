'use client';

import React from 'react';
import { Calendar, CheckCircle2, Clock, Stethoscope, Building, AlertCircle } from 'lucide-react';
import { useMedical } from '@/context/MedicalContext';

export const FollowUpTracker: React.FC = () => {
  const { followUps, markFollowUpComplete, parentProfile } = useMedical();

  const getDaysRemaining = (targetDateStr: string) => {
    const target = new Date(targetDateStr).getTime();
    const now = new Date().getTime();
    const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-1">
          <Calendar className="w-3.5 h-3.5" /> AI Follow-up Extractor
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Smart Follow-up Tracker
        </h1>
        <p className="text-xs text-slate-400">
          Automatically scheduled medical follow-ups extracted from {parentProfile.name}'s doctor prescriptions.
        </p>
      </div>

      {/* Follow-ups List */}
      <div className="space-y-4">
        {followUps.map((item) => {
          const daysLeft = getDaysRemaining(item.date);
          const isCompleted = item.status === 'completed';

          return (
            <div
              key={item.id}
              className={`bg-slate-900 border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                isCompleted
                  ? 'border-slate-800 opacity-60'
                  : daysLeft <= 14
                  ? 'border-amber-500/40 bg-amber-950/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                    isCompleted
                      ? 'bg-slate-800 text-slate-500 border-slate-700'
                      : daysLeft <= 14
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <div className="text-center leading-none">
                      <span className="text-base font-extrabold block">{daysLeft}</span>
                      <span className="text-[9px] uppercase tracking-wider font-semibold block text-slate-400">
                        Days
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{item.doctorName}</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {item.specialty}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-500" /> {item.hospital}
                  </p>

                  <p className="text-xs text-slate-300 font-medium pt-1">
                    <strong className="text-blue-400">Reason:</strong> {item.reason}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-bold text-white block">{item.date}</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    Target Date
                  </span>
                </div>

                {!isCompleted && (
                  <button
                    onClick={() => markFollowUpComplete(item.id)}
                    className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark Completed
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
