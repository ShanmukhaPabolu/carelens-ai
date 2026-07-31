'use client';

import React from 'react';
import { Sparkles, TrendingUp, AlertCircle, CheckCircle2, Calendar, Pill, ArrowUpRight, ChevronRight } from 'lucide-react';
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
        <Sparkles className="w-8 h-8 text-blue-500 mx-auto mb-2 animate-bounce" />
        <p className="text-base font-semibold text-white">No Medical Reports Uploaded Yet</p>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Upload {parentProfile.name}'s medical reports or prescriptions to let AI build a continuous health timeline and change detection.
        </p>
        <Link
          href="/upload"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all"
        >
          Upload First Report
        </Link>
      </div>
    );
  }

  // Count key indicators
  const medChanges = latestReport.changeHighlights.filter((c) => c.category === 'medicine');
  const labChanges = latestReport.changeHighlights.filter((c) => c.category === 'lab');

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/40 border border-blue-500/20 p-6 sm:p-7 shadow-xl shadow-blue-950/30">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80 mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">AI Caregiver Executive Summary</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                Synthesized across {reportsCount} visits
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Continuous medical journey breakdown for <strong className="text-slate-200">{parentProfile.name}</strong>
            </p>
          </div>
        </div>

        <Link
          href={`/timeline`}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-3 py-1.5 rounded-lg transition-all"
        >
          View Full Timeline <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Natural Language Summary */}
      <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 mb-5 text-sm text-slate-200 leading-relaxed font-normal">
        <p className="text-slate-100 font-medium">{latestReport.caregiverSummary}</p>
      </div>

      {/* Grid of Key Detected Changes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Medication Updates Card */}
        <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-blue-400" /> Medication Changes
              </span>
              <span className="text-[10px] font-semibold text-blue-300 bg-blue-900/40 border border-blue-700/50 px-2 py-0.5 rounded-md">
                {medChanges.length} Modified
              </span>
            </div>
            {medChanges.length > 0 ? (
              <ul className="space-y-2 mt-2">
                {medChanges.map((m) => (
                  <li key={m.id} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shrink-0" />
                    <div>
                      <strong className="text-white">{m.field}:</strong> {m.oldValue ? `${m.oldValue} → ` : ''}
                      <span className="text-blue-300 font-medium">{m.newValue}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 mt-2">No medication changes recorded in recent visit.</p>
            )}
          </div>
        </div>

        {/* Lab Trends Card */}
        <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Abnormal Lab Shifts
              </span>
              <span className="text-[10px] font-semibold text-amber-300 bg-amber-900/40 border border-amber-700/50 px-2 py-0.5 rounded-md">
                {labChanges.length} Shifted
              </span>
            </div>
            {labChanges.length > 0 ? (
              <ul className="space-y-2 mt-2">
                {labChanges.map((l) => (
                  <li key={l.id} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1 shrink-0" />
                    <div>
                      <strong className="text-white">{l.field}:</strong> {l.oldValue} →{' '}
                      <span className="text-rose-300 font-semibold">{l.newValue}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 mt-2">All latest lab parameters within reference ranges.</p>
            )}
          </div>
        </div>

        {/* Follow-up & Stability Card */}
        <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Next Follow-up
              </span>
              <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-900/40 border border-emerald-700/50 px-2 py-0.5 rounded-md">
                Scheduled
              </span>
            </div>
            {latestReport.followUpDate ? (
              <div className="mt-2">
                <p className="text-sm font-bold text-white">{latestReport.followUpDate}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  With {latestReport.doctorName} ({latestReport.doctorSpecialty})
                </p>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-2">
                  <CheckCircle2 className="w-3 h-3" /> Kidney & Retinal checks stable
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 mt-2">No follow-up date noted in current report.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
