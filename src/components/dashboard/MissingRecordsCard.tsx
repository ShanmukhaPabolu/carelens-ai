'use client';

import React from 'react';
import { AlertCircle, Calendar, Plus, Info } from 'lucide-react';
import { ParentProfile } from '@/types/medical';
import { getMissingRecordsForParent } from '@/lib/demoData';
import Link from 'next/link';

import { useMedical } from '@/context/MedicalContext';

interface Props {
  parentProfile: ParentProfile;
}

export const MissingRecordsCard: React.FC<Props> = ({ parentProfile }) => {
  const { reports } = useMedical();
  const missingAlerts = getMissingRecordsForParent(parentProfile, reports);


  if (missingAlerts.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Missing Health Records & Recommended Screenings
            </h2>
            <p className="text-xs text-slate-500">
              AI identified gaps in routine screenings for <strong className="text-slate-800">{parentProfile.name}</strong>
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
          {missingAlerts.length} Suggested Tests
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {missingAlerts.map((item) => (
          <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {item.category}
                </span>
                {item.lastRecordedDate && (
                  <span className="text-[10px] text-slate-400">Last: {item.lastRecordedDate}</span>
                )}
              </div>
              <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">{item.recommendation}</p>
              <p className="text-[10px] text-slate-400 leading-normal">{item.reason}</p>
            </div>

            <div className="pt-2">
              <Link
                href="/upload"
                className="w-full py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 text-sky-600" /> Upload Test Result
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Responsible AI Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-2 text-[11px] text-slate-500">
        <Info className="w-4 h-4 text-sky-600 shrink-0" />
        <p>
          <strong>Responsible AI Notice:</strong> Missing record suggestions are intended as caregiver reminders based on medical guidelines, not clinical diagnosis or medical advice.
        </p>
      </div>
    </div>
  );
};
