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
  Edit3,
  ArrowDown,
  FileText,
  ShieldCheck,
  Building2
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

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'prescription':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200 uppercase">Prescription</span>;
      case 'lab':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">Lab Report</span>;
      case 'scan':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200 uppercase">Scan</span>;
      case 'discharge':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 uppercase">Discharge Summary</span>;
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 uppercase">Consultation</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      
      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold mb-1">
            <Clock className="w-3.5 h-3.5 text-sky-600" /> Continuous Smart Health Journey
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {activeParentProfile.name}'s Medical Timeline
          </h1>
          <p className="text-xs text-slate-500">
            Unified multi-hospital medical history replacing disconnected paper prescriptions with AI change tracking.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 bg-white border border-slate-200 p-2 rounded-xl shadow-xs">
          <div className="flex items-center gap-1 text-xs text-slate-600 font-semibold px-2">
            <Filter className="w-3.5 h-3.5 text-sky-600" /> Filter:
          </div>

          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-500 font-medium"
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
            className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-500 font-medium"
          >
            <option value="all">All Report Categories</option>
            <option value="prescription">Prescription</option>
            <option value="lab">Lab Report</option>
            <option value="scan">Scan</option>
            <option value="discharge">Discharge Summary</option>
            <option value="consultation">Consultation</option>
          </select>
        </div>
      </div>

      {/* Empty State Check */}
      {filteredReports.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900">No medical history available yet</h3>
            <p className="text-xs text-slate-500">
              Upload a prescription, lab test, or consultation note to start building {activeParentProfile.name}'s connected medical timeline.
            </p>
          </div>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
          >
            Upload Medical Report
          </Link>
        </div>
      ) : (
        /* Vertical Connected Timeline Stream */
        <div className="relative border-l-2 border-sky-200 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-8">
          {filteredReports.map((report, idx) => {

          const isExpanded = expandedId === report.id;
          const hasConflicts = (report.doctorConflicts?.length || 0) > 0;
          const isNeedsReview = report.needsReview;

          const dateObj = new Date(report.visitDate);
          const yearStr = dateObj.getFullYear();
          const monthDayStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          return (
            <div key={report.id} className="relative space-y-3">
              
              {/* Timeline Node Dot */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-2 w-5 h-5 rounded-full border-2 flex items-center justify-center shadow-xs ${
                  hasConflicts
                    ? 'border-amber-500 bg-amber-100 text-amber-800'
                    : isNeedsReview
                    ? 'border-rose-500 bg-rose-100 text-rose-800'
                    : 'border-sky-600 bg-white text-sky-600'
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
                    <div className="text-center px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 shrink-0 shadow-2xs">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700 block leading-none">
                        {yearStr}
                      </span>
                      <span className="text-xs font-bold text-slate-900 leading-tight block mt-0.5">
                        {monthDayStr}
                      </span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-extrabold text-slate-900">
                          {report.diagnoses && report.diagnoses.length > 0
                            ? `Diagnosed: ${report.diagnoses[0]}`
                            : report.medicines && report.medicines.length > 0
                            ? `Prescription Event: ${report.medicines[0].name}`
                            : `${report.doctorSpecialty} Clinical Visit`}
                        </h3>
                        {getCategoryBadge(report.reportType)}
                        {hasConflicts && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                            Conflict Alert
                          </span>
                        )}
                        {isNeedsReview && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                            Needs Review (&lt;80%)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                        <span>Doctor: <strong className="text-slate-800">{report.doctorName}</strong> ({report.doctorSpecialty})</span>
                        <span>•</span>
                        <span>Hospital: <strong className="text-slate-800">{report.hospital}</strong></span>
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
                              : 'bg-sky-50 text-sky-800 border-sky-200'
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
                <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-xs text-slate-700 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                  <p className="line-clamp-2 leading-relaxed font-medium">{report.caregiverSummary}</p>
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
                      {/* Diagnoses Pills */}
                      {report.diagnoses.length > 0 && (
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                            Diagnoses Recorded
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {report.diagnoses.map((d, i) => (
                              <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800">
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Medications Table */}
                      {report.medicines.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                            <Pill className="w-3.5 h-3.5 text-sky-600" /> Prescribed Medications
                          </h4>
                          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
                            <table className="w-full text-left text-xs text-slate-800">
                              <thead className="bg-slate-100 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[10px]">
                                <tr>
                                  <th className="p-2.5">Medication</th>
                                  <th className="p-2.5">Dosage</th>
                                  <th className="p-2.5">Frequency</th>
                                  <th className="p-2.5">Confidence</th>
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
                                          <span className="text-sky-700 font-bold">{m.dosage}</span>
                                        </span>
                                      ) : (
                                        <span>{m.dosage}</span>
                                      )}
                                    </td>
                                    <td className="p-2.5 text-slate-500">{m.frequency}</td>
                                    <td className="p-2.5">
                                      <span className="text-[10px] font-bold text-slate-600">
                                        {m.confidence}%
                                      </span>
                                    </td>
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
                            <Activity className="w-3.5 h-3.5 text-emerald-600" /> Key Lab Test Results
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {report.labResults.map((l, i) => (
                              <div
                                key={i}
                                className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between shadow-2xs"
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
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-sky-600" /> Overall AI Confidence: <strong className="text-slate-800">{report.aiConfidenceScore}%</strong>
                        </span>

                        <div className="flex items-center space-x-2">
                          {report.fileUrl && (
                            <a
                              href={report.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg border border-slate-300 flex items-center gap-1.5 transition-all"
                            >
                              <FileText className="w-3.5 h-3.5 text-sky-600" /> View Original Document
                            </a>
                          )}

                          <Link
                            href={`/review/${report.id}`}
                            className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-1 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit / Verify
                          </Link>
                        </div>
                      </div>


                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* VISUAL FLOW CONNECTOR (↓) */}
              {idx < filteredReports.length - 1 && (
                <div className="flex items-center justify-center py-1">
                  <div className="w-7 h-7 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shadow-2xs">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};


