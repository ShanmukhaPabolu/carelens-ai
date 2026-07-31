'use client';

import React from 'react';
import Link from 'next/link';
import {
  Upload,
  Clock,
  LineChart,
  Calendar,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Activity,
  User,
  Heart,
  ChevronRight,
  Shield,
  Search,
  Plus
} from 'lucide-react';
import { useMedical } from '@/context/MedicalContext';
import { AIHealthSummaryCard } from '@/components/dashboard/AIHealthSummaryCard';
import { DoctorConflictAlert } from '@/components/dashboard/DoctorConflictAlert';

export default function DashboardPage() {
  const { parentProfile, reports, followUps } = useMedical();

  const latestReport = reports[0];
  const needsReviewReports = reports.filter((r) => r.needsReview);

  // Extract all conflicts across reports
  const allConflicts = reports.flatMap((r) => r.doctorConflicts || []);

  // Calculate Key Biomarkers from latest lab tests
  const latestHbA1c = reports
    .flatMap((r) => r.labResults)
    .find((l) => l.testName.toLowerCase().includes('hba1c'));

  const latestBP = reports
    .flatMap((r) => r.labResults)
    .find((l) => l.testName.toLowerCase().includes('systolic'));

  const latestCreatinine = reports
    .flatMap((r) => r.labResults)
    .find((l) => l.testName.toLowerCase().includes('creatinine'));

  const upcomingFollowUps = followUps.filter((f) => f.status !== 'completed').slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      
      {/* Parent Profile Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-extrabold text-xl shadow-lg">
            {parentProfile.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {parentProfile.name}
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {parentProfile.relationship} ({parentProfile.age} yo)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Primary Physician: <strong className="text-slate-200">{parentProfile.primaryDoctor}</strong> • {parentProfile.hospital}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {parentProfile.conditions.map((cond, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700"
                >
                  {cond}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/upload"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> Upload New Report
          </Link>
          <Link
            href="/profile"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <User className="w-4 h-4 text-blue-400" /> Full Profile
          </Link>
        </div>
      </div>

      {/* Doctor Conflicts Notification (If Any Detected) */}
      <DoctorConflictAlert conflicts={allConflicts} />

      {/* AI Caregiver Health Executive Summary */}
      <AIHealthSummaryCard
        parentProfile={parentProfile}
        latestReport={latestReport}
        reportsCount={reports.length}
      />

      {/* Key Biomarker Quick Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* HbA1c */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1 hover:border-slate-700 transition-colors">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            HbA1c (Glycated)
            <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
          </span>
          <p className="text-xl font-extrabold text-rose-400">
            {latestHbA1c ? `${latestHbA1c.value}%` : '7.8%'}
          </p>
          <span className="text-[10px] text-rose-300/80 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 inline-block font-semibold">
            +0.4% from May
          </span>
        </div>

        {/* Blood Pressure */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1 hover:border-slate-700 transition-colors">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            Blood Pressure
            <Activity className="w-3.5 h-3.5 text-amber-400" />
          </span>
          <p className="text-xl font-extrabold text-amber-400">142/88</p>
          <span className="text-[10px] text-amber-300/80 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 inline-block font-semibold">
            Stage 1 Elevated
          </span>
        </div>

        {/* Creatinine */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1 hover:border-slate-700 transition-colors">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            Serum Creatinine
            <Shield className="w-3.5 h-3.5 text-blue-400" />
          </span>
          <p className="text-xl font-extrabold text-white">
            {latestCreatinine ? `${latestCreatinine.value} mg/dL` : '1.1 mg/dL'}
          </p>
          <span className="text-[10px] text-blue-300/80 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 inline-block font-semibold">
            Borderline High
          </span>
        </div>

        {/* Total Visits */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1 hover:border-slate-700 transition-colors">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            Parsed History
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
          </span>
          <p className="text-xl font-extrabold text-indigo-400">{reports.length} Reports</p>
          <span className="text-[10px] text-indigo-300/80 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20 inline-block font-semibold">
            2024 - 2026 Timeline
          </span>
        </div>

      </div>

      {/* Main 2-Column Split (Recent Uploads & Timeline Preview vs. Smart Follow-ups) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Timeline & Recent Uploads */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" /> Recent Medical Reports Timeline
            </h2>
            <Link
              href="/timeline"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              View All {reports.length} Reports <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {reports.slice(0, 4).map((report) => (
              <div
                key={report.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-extrabold text-xs text-blue-400">
                      {report.visitDate.substring(5, 7)}/{report.visitDate.substring(2, 4)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{report.doctorSpecialty} Visit</h3>
                      <p className="text-xs text-slate-400">
                        {report.doctorName} • {report.hospital}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {report.needsReview && (
                      <Link
                        href={`/review/${report.id}`}
                        className="text-[10px] font-bold px-2 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 animate-pulse"
                      >
                        <AlertTriangle className="w-3 h-3 text-amber-400" /> Needs Review
                      </Link>
                    )}
                    <Link
                      href={`/review/${report.id}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
                    >
                      View Extraction
                    </Link>
                  </div>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  {report.caregiverSummary}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* Right 1 Col: Follow-up & Quick Tools */}
        <div className="space-y-6">
          
          {/* Smart Follow-ups Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" /> Upcoming Follow-ups
              </h2>
              <Link href="/follow-ups" className="text-xs text-blue-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingFollowUps.map((item) => (
                <div key={item.id} className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{item.doctorName}</span>
                    <span className="text-blue-400 font-semibold">{item.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{item.specialty} • {item.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Shortcuts Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-bold text-white">Quick Caregiver Actions</h2>
            <div className="space-y-2">
              <Link
                href="/upload"
                className="w-full p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600/20 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Medical Report
              </Link>

              <Link
                href="/trends"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <LineChart className="w-4 h-4 text-emerald-400" /> Open Lab Trend Charts
              </Link>

              <Link
                href="/search"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <Search className="w-4 h-4 text-sky-400" /> Search Doctor Prescriptions
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
