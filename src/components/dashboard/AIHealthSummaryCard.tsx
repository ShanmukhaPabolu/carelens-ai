'use client';

import React from 'react';
import { Sparkles, TrendingUp, Calendar, Pill, ChevronRight } from 'lucide-react';
import { MedicalReport, ParentProfile } from '@/types/medical';
import Link from 'next/link';

interface Props {
  parentProfile: ParentProfile;
  latestReport?: MedicalReport;
  reportsCount: number;
}

export const AIHealthSummaryCard: React.FC<Props> = ({
  parentProfile,
  latestReport,
  reportsCount,
}) => {
  if (!latestReport) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-slate-500 shadow-sm">
        <Sparkles className="w-6 h-6 text-blue-600 mx-auto mb-2" />
        <p className="text-sm font-bold text-slate-900">No Medical Reports Uploaded Yet</p>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Upload {parentProfile.name}'s medical reports or prescriptions to let AI build a continuous health timeline and change detection.
        </p>
        <Link
          href="/upload"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          Upload First Report
        </Link>
      </div>
    );
  }

  const medChanges = latestReport.changeHighlights.filter((c) => c.category === 'medicine');
  const labChanges = latestReport.changeHighlights.filter((c) => c.category === 'lab');

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">AI Caregiver Executive Summary</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                {reportsCount} Visits Analyzed
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Continuous medical journey breakdown for <strong className="text-slate-800">{parentProfile.name}</strong>
            </p>
          </div>
        </div>

        <Link
          href="/timeline"
          className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
        >
          Full Timeline <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Natural Language Summary Box */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-800 leading-relaxed">
        <p className="font-medium">{latestReport.caregiverSummary}</p>
      </div>

      {/* Grid of Key Detected Changes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Medication Changes */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
              <Pill className="w-3.5 h-3.5 text-blue-600" /> Medication Changes
            </span>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
              {medChanges.length} Updated
            </span>
          </div>
          {medChanges.length > 0 ? (
            <ul className="space-y-1 mt-1 text-xs">
              {medChanges.map((m) => (
                <li key={m.id} className="text-slate-700">
                  <strong className="text-slate-900">{m.field}:</strong> {m.oldValue ? `${m.oldValue} → ` : ''}
                  <span className="text-blue-700 font-semibold">{m.newValue}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[11px] text-slate-500">No medication changes recorded in recent visit.</p>
          )}
        </div>

        {/* Lab Trends */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" /> Lab Value Shifts
            </span>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
              {labChanges.length} Shifted
            </span>
          </div>
          {labChanges.length > 0 ? (
            <ul className="space-y-1 mt-1 text-xs">
              {labChanges.map((l) => (
                <li key={l.id} className="text-slate-700">
                  <strong className="text-slate-900">{l.field}:</strong> {l.oldValue} →{' '}
                  <span className="text-rose-700 font-bold">{l.newValue}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[11px] text-slate-500">All latest lab parameters within reference ranges.</p>
          )}
        </div>

        {/* Follow-up & Stability */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Next Follow-up
            </span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
              Scheduled
            </span>
          </div>
          {latestReport.followUpDate ? (
            <div>
              <p className="text-xs font-bold text-slate-900">{latestReport.followUpDate}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                With {latestReport.doctorName} ({latestReport.doctorSpecialty})
              </p>
            </div>
          ) : (
            <p className="text-[11px] text-slate-500">No follow-up date noted in current report.</p>
          )}
        </div>

      </div>
    </div>
  );
};
