'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Stethoscope, ChevronRight, Sparkles } from 'lucide-react';
import { useMedical } from '@/context/MedicalContext';

export default function SearchPage() {
  const { reports, activeParentProfile } = useMedical();
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
    <div className="max-w-5xl mx-auto space-y-6 pb-16 py-4">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold mb-1">
          <Search className="w-3.5 h-3.5 text-blue-600" /> Search Engine
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Medical History Search
        </h1>
        <p className="text-xs text-slate-500">
          Instant search across diagnoses, medications, doctor notes, and lab tests for {activeParentProfile.name}.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by condition (e.g. Diabetes), medicine (e.g. Metformin), doctor, or lab test..."
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs font-medium"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-800"
          >
            Clear
          </button>
        )}
      </div>

      {/* Quick Search Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">Quick Searches:</span>
        {['Diabetes', 'Metformin', 'HbA1c', 'Creatinine', 'Atorvastatin', 'Amlodipine', 'Dr. Thorne', 'Dr. Vance'].map((chip) => (
          <button
            key={chip}
            onClick={() => setQuery(chip)}
            className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Search Results Stream */}
      <div className="space-y-3 pt-2">
        <p className="text-xs font-semibold text-slate-500">
          Found <strong className="text-slate-900">{filteredReports.length}</strong> matching report visits for {activeParentProfile.name}
        </p>

        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs hover:border-slate-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-xs">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{report.doctorSpecialty} Visit</h3>
                  <p className="text-[11px] text-slate-500">
                    {report.doctorName} • {report.hospital} • Date: {report.visitDate}
                  </p>
                </div>
              </div>

              <Link
                href={`/review/${report.id}`}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1"
              >
                View Details <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-xs text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 inline mr-1" />
              {report.caregiverSummary}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              {report.medicines.length > 0 && (
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                    Prescribed Medicines
                  </span>
                  <p className="text-slate-800 font-medium">
                    {report.medicines.map((m) => `${m.name} (${m.dosage})`).join(', ')}
                  </p>
                </div>
              )}

              {report.labResults.length > 0 && (
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                    Lab Results
                  </span>
                  <p className="text-slate-800 font-medium">
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
