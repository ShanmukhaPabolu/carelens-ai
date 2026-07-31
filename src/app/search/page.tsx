'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Stethoscope, Pill, Activity, ChevronRight, FileText, Sparkles } from 'lucide-react';
import { useMedical } from '@/context/MedicalContext';

export default function SearchPage() {
  const { reports, parentProfile } = useMedical();
  const [query, setQuery] = useState('');

  const filteredReports = reports.filter((r) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    
    const inDoctor = r.doctorName.toLowerCase().includes(q) || r.doctorSpecialty.toLowerCase().includes(q);
    const inHospital = r.hospital.toLowerCase().includes(q);
    const inDiagnosis = r.diagnoses.some((d) => d.toLowerCase().includes(q));
    const inMedicine = r.medicines.some((m) => m.name.toLowerCase().includes(q));
    const inLab = r.labResults.some((l) => l.testName.toLowerCase().includes(q));
    const inSummary = r.caregiverSummary.toLowerCase().includes(q);

    return inDoctor || inHospital || inDiagnosis || inMedicine || inLab || inSummary;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 py-6">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-1">
          <Search className="w-3.5 h-3.5" /> Comprehensive Search Engine
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Medical History Search
        </h1>
        <p className="text-xs text-slate-400">
          Instant search across diagnoses, medications, doctor notes, and lab tests for {parentProfile.name}.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by condition (e.g. Diabetes), medicine (e.g. Metformin), doctor, or lab test..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-blue-500 shadow-xl"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Quick Search Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400">Quick Searches:</span>
        {['Diabetes', 'Metformin', 'HbA1c', 'Creatinine', 'Ramipril', 'Naproxen', 'Dr. Thorne'].map((chip) => (
          <button
            key={chip}
            onClick={() => setQuery(chip)}
            className="text-xs font-medium px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Search Results Stream */}
      <div className="space-y-4 pt-2">
        <p className="text-xs font-semibold text-slate-400">
          Found <strong className="text-white">{filteredReports.length}</strong> matching report visits
        </p>

        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{report.doctorSpecialty} Visit</h3>
                  <p className="text-xs text-slate-400">
                    {report.doctorName} • {report.hospital} • Date: {report.visitDate}
                  </p>
                </div>
              </div>

              <Link
                href={`/review/${report.id}`}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1"
              >
                View Extraction <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* AI Summary excerpt */}
            <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl text-xs text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 inline mr-1.5" />
              {report.caregiverSummary}
            </div>

            {/* Matching Pills / Diagnostics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              {report.medicines.length > 0 && (
                <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Prescribed Medicines
                  </span>
                  <p className="text-slate-200 font-medium">
                    {report.medicines.map((m) => `${m.name} (${m.dosage})`).join(', ')}
                  </p>
                </div>
              )}

              {report.labResults.length > 0 && (
                <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Lab Results
                  </span>
                  <p className="text-slate-200 font-medium">
                    {report.labResults.map((l) => `${l.testName}: ${l.value} ${l.unit}`).join(', ')}
                  </p>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
