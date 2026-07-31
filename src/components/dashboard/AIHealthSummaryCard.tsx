'use client';

import React from 'react';
import { Sparkles, TrendingUp, Calendar, Pill, ChevronRight, BookOpen, ShieldCheck } from 'lucide-react';
import { MedicalReport, ParentProfile } from '@/types/medical';
import { generateAIHealthStory } from '@/lib/demoData';
import Link from 'next/link';

interface Props {
  parentProfile: ParentProfile;
  reports: MedicalReport[];
  latestReport?: MedicalReport;
  reportsCount: number;
}

export const AIHealthSummaryCard: React.FC<Props> = ({
  parentProfile,
  reports,
  latestReport,
  reportsCount,
}) => {
  const storyNarrative = generateAIHealthStory(parentProfile, reports);

  if (!latestReport || reportsCount === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-slate-500 shadow-sm space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center mx-auto">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-md mx-auto">
          <h2 className="text-base font-bold text-slate-900">AI Health Summary</h2>
          <p className="text-xs text-slate-500 font-medium">
            Upload your first medical report to generate an AI Health Summary.
          </p>
        </div>
        <Link
          href="/upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
        >
          <Sparkles className="w-4 h-4" /> Upload First Medical Report
        </Link>
      </div>
    );
  }


  const medChanges = latestReport.changeHighlights.filter((c) => c.category === 'medicine');
  const labChanges = latestReport.changeHighlights.filter((c) => c.category === 'lab');

  return (
    <div className="rounded-3xl bg-gradient-to-br from-white via-sky-50/40 to-slate-50 border border-sky-100 p-6 sm:p-7 shadow-xs space-y-5 relative overflow-hidden">
      
      {/* Background Subtle Accent Pill */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-sky-600/[0.03] rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/80 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
                AI HEALTH STORY
              </h1>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-sky-600" /> Auto-Updated ({reportsCount} Reports Merged)
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Continuous longitudinal health narrative for <strong className="text-slate-800">{parentProfile.name}</strong>
            </p>
          </div>
        </div>

        <Link
          href="/timeline"
          className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs transition-all"
        >
          View Connected Timeline <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* HERO STORY NARRATIVE BOX */}
      <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-sky-200/80 shadow-xs space-y-2 relative z-10">
        <div className="flex items-center justify-between text-xs font-bold text-sky-800">
          <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" /> AI Synthesized Journey Summary
          </span>
          <span className="text-[10px] font-semibold text-slate-400">
            Updated {latestReport.visitDate}
          </span>
        </div>
        
        {/* Continuous AI Story Text */}
        <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed font-sans">
          "{storyNarrative}"
        </p>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Continuous history compiled across all hospital visits
          </span>
          <span className="text-sky-700 font-bold">
            Latest Doctor: {latestReport.doctorName} ({latestReport.doctorSpecialty})
          </span>
        </div>
      </div>

      {/* Grid of Key Detected Changes & Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        
        {/* Medication Changes */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
              <Pill className="w-3.5 h-3.5 text-sky-600" /> Recent Regimen Shifts
            </span>
            <span className="text-[10px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              {medChanges.length} Updated
            </span>
          </div>
          {medChanges.length > 0 ? (
            <ul className="space-y-1 mt-1 text-xs">
              {medChanges.map((m) => (
                <li key={m.id} className="text-slate-700 text-[11px]">
                  <strong className="text-slate-900">{m.field}:</strong> {m.oldValue ? `${m.oldValue} → ` : ''}
                  <span className="text-sky-800 font-semibold">{m.newValue}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[11px] text-slate-500">Regimen stable in recent consultation.</p>
          )}
        </div>

        {/* Lab Trends */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" /> Key Biomarker Shifts
            </span>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {labChanges.length} Tracked
            </span>
          </div>
          {labChanges.length > 0 ? (
            <ul className="space-y-1 mt-1 text-xs">
              {labChanges.map((l) => (
                <li key={l.id} className="text-slate-700 text-[11px]">
                  <strong className="text-slate-900">{l.field}:</strong> {l.oldValue} →{' '}
                  <span className="text-rose-700 font-bold">{l.newValue}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[11px] text-slate-500">Biomarker trends within expected limits.</p>
          )}
        </div>

        {/* Follow-up & Stability */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-sky-600" /> Next Follow-up
            </span>
            <span className="text-[10px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              Smart Predicted
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
            <p className="text-[11px] text-slate-500">No immediate follow-up date noted.</p>
          )}
        </div>

      </div>

    </div>
  );
};

