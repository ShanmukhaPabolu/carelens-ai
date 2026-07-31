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
  Filter,
  Sparkles,
  Edit3
} from 'lucide-react';
import { useMedical } from '@/context/MedicalContext';

export const HealthTimeline: React.FC = () => {
  const { reports, activeParentProfile } = useMedical();

  const [expandedId, setExpandedId] = useState<string | null>(reports[0]?.id || null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

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
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      
      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold mb-1">
            <Clock className="w-3.5 h-3.5 text-blue-600" /> Chronological Health Stream
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {activeParentProfile.name}'s Medical Timeline
          </h1>
          <p className="text-xs text-slate-500">
            Continuously updated medical journey replacing paper files with AI change tracking.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 bg-white border border-slate-200 p-2 rounded-xl shadow-xs">
          <div className="flex items-center gap-1 text-xs text-slate-600 font-semibold px-2">
            <Filter className="w-3.5 h-3.5 text-blue-600" /> Filter:
          </div>

          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 font-medium"
          >
            <option value="all">All Specialties</option>
            <option value="Endocrinology">Endocrinology</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Ophthalmology">Ophthalmology</option>
            <option value="Gastroenterology">Gastroenterology</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 font-medium"
          >
            <option value="all">All Report Types</option>
            <option value="prescription">Prescription</option>
            <option value="lab">Lab Results</option>
            <option value="general">General Visit</option>
          </select>
        </div>
      </div>

      {/* Vertical Timeline Stream */}
      <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-6">
        
        {filteredReports.map((report) => {
          const isExpanded = expandedId === report.id;
          const hasConflicts = (report.doctorConflicts?.length || 0) > 0;
          const isNeedsReview = report.needsReview;

          const dateObj = new Date(report.visitDate);
          const yearStr = dateObj.getFullYear();
          const monthDayStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          return (
            <div key={report.id} className="relative">
              
              {/* Timeline Node Dot */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-2 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  hasConflicts
                    ? 'border-amber-500 bg-amber-100 text-amber-800'
                    : isNeedsReview
                    ? 'border-rose-500 bg-rose-100 text-rose-800'
                    : 'border-blue-600 bg-white text-blue-600'
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
              </div>

              {/* Timeline Card */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition-all">
                
                {/* Header Bar */}
                <div
                  onClick={() => toggleExpand(report.id)}
                  className="p-4 cursor-pointer flex flex-wrap items-center justify-between gap-4 bg-white hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-center px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block leading-none">
                        {yearStr}
                      </span>
                      <span className="text-xs font-bold text-slate-900 leading-tight block mt-0.5">
                        {monthDayStr}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{report.doctorSpecialty} Visit</h3>
                        {hasConflicts && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                            Conflict Alert
                          </span>
                        )}
                        {isNeedsReview && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                            Needs Review
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        {report.doctorName} • {report.hospital}
                      </p>
                    </div>
                  </div>

                  {/* Highlights Preview */}
                  <div className="flex items-center space-x-3">
                    <div className="hidden sm:flex items-center gap-2">
                      {report.changeHighlights.slice(0, 2).map((h) => (
                        <span
                          key={h.id}
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                            h.severity === 'critical'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : h.severity === 'warning'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-blue-50 text-blue-800 border-blue-200'
                          }`}
                        >
                          {h.field}: {h.newValue}
                        </span>
                      ))}
                    </div>

                    <button className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Summary Strip */}
                <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-xs text-slate-700 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="line-clamp-2">{report.caregiverSummary}</p>
                </div>

                {/* Expandable Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-200 p-5 space-y-5 bg-slate-50/50"
                    >
                      {/* Medications Table */}
                      {report.medicines.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                            <Pill className="w-3.5 h-3.5 text-blue-600" /> Prescribed Medications
                          </h4>
                          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                            <table className="w-full text-left text-xs text-slate-800">
                              <thead className="bg-slate-100 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[10px]">
                                <tr>
                                  <th className="p-2.5">Medication</th>
                                  <th className="p-2.5">Dosage</th>
                                  <th className="p-2.5">Frequency</th>
                                  <th className="p-2.5">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {report.medicines.map((m, i) => (
                                  <tr key={i}>
                                    <td className="p-2.5 font-bold text-slate-900">{m.name}</td>
                                    <td className="p-2.5">
                                      {m.previousDosage ? (
                                        <span>
                                          <span className="line-through text-slate-400 mr-1">{m.previousDosage}</span>
                                          <span className="text-blue-700 font-bold">{m.dosage}</span>
                                        </span>
                                      ) : (
                                        <span>{m.dosage}</span>
                                      )}
                                    </td>
                                    <td className="p-2.5 text-slate-500">{m.frequency}</td>
                                    <td className="p-2.5">
                                      <span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                          m.status === 'changed'
                                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                            : m.status === 'new'
                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                            : 'bg-slate-100 text-slate-600'
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

                      {/* Lab Results */}
                      {report.labResults.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-emerald-600" /> Lab Test Values
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {report.labResults.map((l, i) => (
                              <div
                                key={i}
                                className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between"
                              >
                                <div>
                                  <p className="text-xs font-bold text-slate-900">{l.testName}</p>
                                  <p className="text-[10px] text-slate-400">Ref: {l.referenceRange}</p>
                                </div>
                                <div className="text-right">
                                  <p
                                    className={`text-xs font-bold ${
                                      l.status !== 'normal' ? 'text-rose-600' : 'text-emerald-700'
                                    }`}
                                  >
                                    {l.value} {l.unit}
                                  </p>
                                  <span className="text-[9px] uppercase font-bold text-slate-500">{l.status}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                        <span className="text-[11px] text-slate-500">
                          AI Confidence: <strong className="text-slate-800">{report.aiConfidenceScore}%</strong> ({report.aiMode})
                        </span>

                        <Link
                          href={`/review/${report.id}`}
                          className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200"
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
