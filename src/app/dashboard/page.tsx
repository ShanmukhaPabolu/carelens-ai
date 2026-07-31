'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Upload,
  Clock,
  LineChart,
  Calendar,
  Sparkles,
  TrendingUp,
  Activity,
  User,
  ChevronRight,
  Shield,
  Search,
  Plus,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';
import { useMedical } from '@/context/MedicalContext';
import { AIHealthSummaryCard } from '@/components/dashboard/AIHealthSummaryCard';
import { DoctorConflictAlert } from '@/components/dashboard/DoctorConflictAlert';
import { ParentHealthStatusGrid } from '@/components/dashboard/ParentHealthStatusGrid';
import { MissingRecordsCard } from '@/components/dashboard/MissingRecordsCard';
import { EmergencyCardModal } from '@/components/dashboard/EmergencyCardModal';
import { AddFamilyMemberModal } from '@/components/dashboard/AddFamilyMemberModal';
import { UserPlus } from 'lucide-react';

export default function DashboardPage() {
  const { profiles, activeParentProfile, reports, followUps, caregiverUser } = useMedical();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showAddFamilyModal, setShowAddFamilyModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);



  const latestReport = reports[0];
  const allConflicts = reports.flatMap((r) => r.doctorConflicts || []);

  const chronologicalReports = [...reports].sort(
    (a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime()
  );

  const hba1cHistory = chronologicalReports
    .map((r) => {
      const match = r.labResults.find((l) => l.testName.toLowerCase().includes('hba1c'));
      return match ? { date: r.visitDate, value: match.value } : null;
    })
    .filter(Boolean);

  const latestHbA1c = hba1cHistory[hba1cHistory.length - 1];
  const prevHbA1c = hba1cHistory[hba1cHistory.length - 2];
  let hba1cDeltaStr: string | null = null;
  if (latestHbA1c && prevHbA1c) {
    const diff = (latestHbA1c.value - prevHbA1c.value).toFixed(1);
    hba1cDeltaStr = `${diff > '0' ? '+' : ''}${diff}% from previous test`;
  }

  const bpHistory = chronologicalReports
    .map((r) => {
      const sys = r.labResults.find((l) => l.testName.toLowerCase().includes('systolic'));
      const dia = r.labResults.find((l) => l.testName.toLowerCase().includes('diastolic'));
      return sys && dia ? { sys: sys.value, dia: dia.value, date: r.visitDate } : null;
    })
    .filter(Boolean);

  const latestBP = bpHistory[bpHistory.length - 1];

  const creatinineHistory = chronologicalReports
    .map((r) => {
      const match = r.labResults.find((l) => l.testName.toLowerCase().includes('creatinine'));
      return match ? { date: r.visitDate, value: match.value, status: match.status } : null;
    })
    .filter(Boolean);

  const latestCreatinine = creatinineHistory[creatinineHistory.length - 1];

  const lipidHistory = chronologicalReports
    .map((r) => {
      const match = r.labResults.find((l) => l.testName.toLowerCase().includes('cholesterol'));
      return match ? { date: r.visitDate, value: match.value } : null;
    })
    .filter(Boolean);

  const latestCholesterol = lipidHistory[lipidHistory.length - 1];

  const upcomingFollowUps = followUps.filter((f) => f.status !== 'completed').slice(0, 3);

  if (mounted && profiles.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-6">
        <div className="bg-white border-2 border-dashed border-sky-300 rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-sky-100 border border-sky-200 text-sky-700 flex items-center justify-center mx-auto shadow-2xs">
            <UserPlus className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome to CareLens AI
            </h1>
            {caregiverUser && (
              <p className="text-xs font-semibold text-sky-700">
                Logged in as {caregiverUser.fullName} ({caregiverUser.email})
              </p>
            )}
            <p className="text-xs text-slate-500 leading-relaxed font-medium pt-1">
              You haven't added any family members to this account yet. Add your Mother, Father, Grandparent, Spouse, or In-law to start tracking their medical history.
            </p>
          </div>
          <button
            onClick={() => setShowAddFamilyModal(true)}
            className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> + Add First Family Member
          </button>
        </div>

        <AddFamilyMemberModal
          isOpen={showAddFamilyModal}
          onClose={() => setShowAddFamilyModal(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">

      
      {/* 1. PARENT HEALTH STATUS CARDS (Answers "How are my parents today?" via Status Cards) */}
      <ParentHealthStatusGrid />

      {/* Emergency Modal Trigger Bar & Profile Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-sky-100 border border-sky-200 text-sky-800 flex items-center justify-center font-bold text-lg">
            {activeParentProfile.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {activeParentProfile.name}
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {activeParentProfile.relationship} ({activeParentProfile.age} yo)
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-0.5">
              Primary Physician: <strong className="text-slate-800">{activeParentProfile.primaryDoctor}</strong> • {activeParentProfile.hospital}
            </p>

          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" /> Emergency Card
          </button>

          <Link
            href="/upload"
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> Upload New Report
          </Link>
        </div>
      </div>

      {/* Emergency Modal */}
      {showEmergencyModal && (
        <EmergencyCardModal onClose={() => setShowEmergencyModal(false)} />
      )}

      {/* 2. Doctor Conflicts Alert */}
      <DoctorConflictAlert conflicts={allConflicts} />

      {/* 3. AI Caregiver Health Executive Hero Story */}
      <AIHealthSummaryCard
        parentProfile={activeParentProfile}
        reports={reports}
        latestReport={latestReport}
        reportsCount={reports.length}
      />

      {/* 4. Missing Health Records Alert Card (Requirement 11) */}
      <MissingRecordsCard parentProfile={activeParentProfile} />

      {/* DYNAMIC BIOMARKER METRICS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Dynamic HbA1c Metric */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">

            HbA1c (Glycated)
            <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
          </span>
          <p className="text-xl font-bold text-slate-900">
            {latestHbA1c ? `${latestHbA1c.value}%` : 'No data yet'}
          </p>
          {hba1cDeltaStr ? (
            <span className="text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 inline-block font-semibold">
              {hba1cDeltaStr}
            </span>
          ) : (
            <span className="text-[10px] text-slate-400">Baseline recorded</span>
          )}
        </div>

        {/* Dynamic Blood Pressure Metric */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            Blood Pressure
            <Activity className="w-3.5 h-3.5 text-amber-600" />
          </span>
          <p className="text-xl font-bold text-slate-900">
            {latestBP ? `${latestBP.sys}/${latestBP.dia}` : 'No data yet'}
          </p>
          <span className="text-[10px] text-slate-500">
            {latestBP ? `Recorded ${latestBP.date}` : 'Awaiting BP scan'}
          </span>
        </div>

        {/* Dynamic Creatinine Metric */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            Serum Creatinine
            <Shield className="w-3.5 h-3.5 text-sky-600" />
          </span>
          <p className="text-xl font-bold text-slate-900">
            {latestCreatinine ? `${latestCreatinine.value} mg/dL` : 'No data yet'}
          </p>
          <span className="text-[10px] text-slate-500">
            {latestCreatinine ? `Range: 0.6 - 1.0` : 'Awaiting lab test'}
          </span>
        </div>

        {/* Dynamic Total Cholesterol Metric */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            Total Cholesterol
            <LineChart className="w-3.5 h-3.5 text-sky-600" />
          </span>
          <p className="text-xl font-bold text-slate-900">
            {latestCholesterol ? `${latestCholesterol.value} mg/dL` : 'No data yet'}
          </p>
          <span className="text-[10px] text-slate-500">
            {latestCholesterol ? `Target < 200` : 'Awaiting lipid panel'}
          </span>
        </div>

      </div>

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-600" /> Medical Reports Stream for {activeParentProfile.name}
            </h2>
            <Link
              href="/timeline"
              className="text-xs font-semibold text-sky-700 hover:underline flex items-center gap-1"
            >
              View All {reports.length} Reports <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {reports.slice(0, 4).map((report) => (
              <div
                key={report.id}
                className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-sky-800">
                      {report.visitDate.substring(5, 7)}/{report.visitDate.substring(2, 4)}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{report.doctorSpecialty} Visit</h3>
                      <p className="text-[11px] text-slate-500">
                        {report.doctorName} • {report.hospital}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {report.needsReview && (
                      <Link
                        href={`/review/${report.id}`}
                        className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300"
                      >
                        Needs Review
                      </Link>
                    )}
                    <Link
                      href={`/review/${report.id}`}
                      className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold border border-slate-200 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {report.caregiverSummary}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* Right 1 Col */}
        <div className="space-y-4">
          
          {/* Smart Follow-ups Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-sky-600" /> Upcoming Follow-ups
              </h2>
              <Link href="/follow-ups" className="text-xs font-semibold text-sky-700 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-2">
              {upcomingFollowUps.map((item) => (
                <div key={item.id} className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg space-y-0.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>{item.doctorName}</span>
                    <span className="text-sky-700">{item.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{item.specialty} • {item.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-xs">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Caregiver Shortcuts</h2>
            
            <Link
              href="/upload"
              className="w-full p-2.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 hover:bg-sky-100 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" /> Upload Report for {activeParentProfile.name}
            </Link>

            <Link
              href="/trends"
              className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <LineChart className="w-4 h-4 text-sky-600" /> Open Lab Trend Dashboard
            </Link>

            <Link
              href="/search"
              className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Search className="w-4 h-4 text-slate-600" /> Search Prescriptions & Notes
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
