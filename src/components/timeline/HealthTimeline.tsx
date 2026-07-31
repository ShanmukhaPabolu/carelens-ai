'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  Pill,
  Activity,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Filter,
  Sparkles,
  Edit3,
  Search
} from 'lucide-react';
import { MedicalReport } from '@/types/medical';
import { useMedical } from '@/context/MedicalContext';

export const HealthTimeline: React.FC = () => {
  const { reports, parentProfile } = useMedical();

  const [expandedId, setExpandedId] = useState<string | null>(reports[0]?.id || null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Filter reports
  const filteredReports = reports.filter((report) => {
    if (selectedSpecialty !== 'all' && report.doctorSpecialty.toLowerCase() !== selectedSpecialty.toLowerCase()) {
      return false;
    }
    if (selectedType !== 'all' && report.reportType.toLowerCase() !== selectedType.toLowerCase()) {
      return false;
    }
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Page Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-1">
            <Clock className="w-3.5 h-3.5" /> Chronological Health History
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {parentProfile.name}'s Health Timeline
          </h1>
          <p className="text-xs text-slate-400">
            Continuously updated medical journey replacing static paper folders with AI change tracking.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-900 border border-slate-800 p-2.5 rounded-2xl">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold px-2">
            <Filter className="w-3.5 h-3.5 text-blue-400" /> Filter:
          </div>

          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Specialties</option>
            <option value="Endocrinology">Endocrinology</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Ophthalmology">Ophthalmology</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Report Types</option>
            <option value="prescription">Prescription</option>
            <option value="lab">Lab Results</option>
            <option value="general">General Visit</option>
          </select>
        </div>
      </div>

      {/* Vertical Timeline Stream */}
      <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-8">
        
        {filteredReports.map((report, idx) => {
          const isExpanded = expandedId === report.id;
          const hasConflicts = (report.doctorConflicts?.length || 0) > 0;
          const isNeedsReview = report.needsReview;

          // Format Visit Date e.g. "July 18, 2026"
          const dateObj = new Date(report.visitDate);
          const yearStr = dateObj.getFullYear();
          const monthDayStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          return (
            <div key={report.id} className="relative group">
              
              {/* Timeline Node Dot */}
              <div
                className={`absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full border-4 flex items-center justify-center transition-all ${
                  hasConflicts
                    ? 'border-amber-500 bg-amber-950 text-amber-400'
                    : isNeedsReview
                    ? 'border-rose-500 bg-rose-950 text-rose-400'
                    : 'border-blue-600 bg-slate-900 text-blue-400'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-current" />
              </div>

              {/* Timeline Main Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition-all">
                
                {/* Card Header Bar */}
                <div
                  onClick={() => toggleExpand(report.id)}
                  className="p-5 cursor-pointer flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-center px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block leading-none">
                        {yearStr}
                      </span>
                      <span className="text-sm font-extrabold text-white leading-tight block mt-0.5">
                        {monthDayStr}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white tracking-tight">{report.doctorSpecialty} Visit</h3>
                        {hasConflicts && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Conflict Alert
                          </span>
                        )}
                        {isNeedsReview && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            Needs Review
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        {report.doctorName} • {report.hospital}
                      </p>
                    </div>
                  </div>

                  {/* Highlight Badges Preview */}
                  <div className="flex items-center space-x-3">
                    <div className="hidden sm:flex items-center gap-2">
                      {report.changeHighlights.slice(0, 2).map((h) => (
                        <span
                          key={h.id}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${
                            h.severity === 'critical'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                              : h.severity === 'warning'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          }`}
                        >
                          {h.field}: {h.newValue}
                        </span>
                      ))}
                    </div>

                    <button className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Caregiver Summary Strip */}
                <div className="px-5 py-2.5 bg-slate-950/60 border-t border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <p className="line-clamp-2">{report.caregiverSummary}</p>
                </div>

                {/* Expandable Details Section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-800 p-5 space-y-6 bg-slate-950/40"
                    >
                      {/* Diagnoses List */}
                      {report.diagnoses.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                            <Stethoscope className="w-3.5 h-3.5 text-blue-400" /> Confirmed Diagnoses
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {report.diagnoses.map((d, i) => (
                              <span
                                key={i}
                                className="text-xs font-medium px-3 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700"
                              >
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Medications Table */}
                      {report.medicines.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                            <Pill className="w-3.5 h-3.5 text-indigo-400" /> Prescribed Medication History
                          </h4>
                          <div className="overflow-x-auto rounded-xl border border-slate-800">
                            <table className="w-full text-left text-xs text-slate-300">
                              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                                <tr>
                                  <th className="p-3">Medication Name</th>
                                  <th className="p-3">Dosage</th>
                                  <th className="p-3">Frequency</th>
                                  <th className="p-3">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                                {report.medicines.map((m, i) => (
                                  <tr key={i} className="hover:bg-slate-900/50">
                                    <td className="p-3 font-bold text-white">{m.name}</td>
                                    <td className="p-3">
                                      {m.previousDosage ? (
                                        <span>
                                          <span className="line-through text-slate-500 mr-1">{m.previousDosage}</span>
                                          <span className="text-blue-400 font-semibold">{m.dosage}</span>
                                        </span>
                                      ) : (
                                        <span>{m.dosage}</span>
                                      )}
                                    </td>
                                    <td className="p-3 text-slate-400">{m.frequency}</td>
                                    <td className="p-3">
                                      <span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                          m.status === 'changed'
                                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                            : m.status === 'new'
                                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                            : 'bg-slate-800 text-slate-400'
                                        }`}
                                      >
                                        {m.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Lab Results Section */}
                      {report.labResults.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-emerald-400" /> Lab Test Results
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {report.labResults.map((l, i) => (
                              <div
                                key={i}
                                className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between"
                              >
                                <div>
                                  <p className="text-xs font-bold text-white">{l.testName}</p>
                                  <p className="text-[10px] text-slate-500">Ref: {l.referenceRange}</p>
                                </div>
                                <div className="text-right">
                                  <p
                                    className={`text-sm font-extrabold ${
                                      l.status !== 'normal' ? 'text-rose-400' : 'text-emerald-400'
                                    }`}
                                  >
                                    {l.value} {l.unit}
                                  </p>
                                  <span className="text-[9px] uppercase font-bold text-slate-400">{l.status}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Doctor Recommendations */}
                      {report.doctorRecommendations.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                            Doctor Recommendations
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                            {report.doctorRecommendations.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                        <span className="text-[11px] text-slate-500">
                          Overall AI Confidence: <strong className="text-slate-300">{report.aiConfidenceScore}%</strong>
                        </span>

                        <Link
                          href={`/review/${report.id}`}
                          className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit / Review Extraction
                        </Link>
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
};
