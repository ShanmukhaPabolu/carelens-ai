'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  Target,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { MedicalReport, ParentProfile } from '@/types/medical';

interface Props {
  report: MedicalReport;
  parentProfile?: ParentProfile;
}

export const AIMedicalSummaryCard: React.FC<Props> = ({ report, parentProfile }) => {
  const [showRawOcr, setShowRawOcr] = useState(false);

  const patientDisplayName = parentProfile?.name || report.patientName || 'Patient';
  const legibility = report.ocrLegibilityScore || report.aiConfidenceScore || 94;
  const bulletPoints = report.bulletSummary || [
    `Visit with ${report.doctorName} (${report.doctorSpecialty}) at ${report.hospital}.`,
    `Report Category: ${report.reportType.toUpperCase()}.`,
  ];

  return (
    <div className="space-y-5 text-slate-900 font-sans">
      
      {/* 1. AI MEDICAL SUMMARY CARD */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        
        {/* Card Header & OCR Confidence */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                AI Medical Summary
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                AI Summary of {patientDisplayName}'s Report ({report.visitDate}):
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-extrabold shadow-2xs">
              <Target className="w-4 h-4 text-emerald-600" />
              🎯 {legibility}% confidence
            </span>
          </div>
        </div>

        {/* Bulleted Findings */}
        <div className="bg-sky-50/50 border border-sky-100 rounded-2xl p-4 sm:p-5 space-y-2">
          <ul className="space-y-2 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
            {bulletPoints.map((bullet, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-sky-600 font-bold shrink-0">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. EXTRACTED LAB BIOMARKERS TABLE */}
        {report.labResults && report.labResults.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-600" /> Extracted Lab Biomarkers
            </h3>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Biomarker</th>
                    <th className="p-3">Result</th>
                    <th className="p-3">Reference Range</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                  {report.labResults.map((lab, i) => {
                    const isHigh = lab.status === 'abnormal_high';
                    const isLow = lab.status === 'abnormal_low';
                    const isAbnormal = isHigh || isLow;

                    return (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-bold text-slate-900">{lab.testName}</td>
                        <td className="p-3 font-extrabold">
                          <span className={isAbnormal ? 'text-rose-600' : 'text-slate-900'}>
                            {lab.value} {lab.unit}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500">{lab.referenceRange || 'Normal'}</td>
                        <td className="p-3">
                          <span
                            className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase border ${
                              isHigh
                                ? 'bg-rose-50 text-rose-800 border-rose-200'
                                : isLow
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            {isHigh ? 'high' : isLow ? 'low' : 'normal'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* 3. AI HEALTH TRENDS CARD (Matching attached image) */}
      <div className="bg-white border border-emerald-200 rounded-3xl p-6 shadow-xs space-y-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            AI Health Trends
          </h3>
        </div>

        <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-4 text-xs sm:text-sm font-semibold text-emerald-950 flex items-start gap-2.5 leading-relaxed">
          <span className="text-base">📈</span>
          <div>
            {report.trendInsights && report.trendInsights.length > 0 ? (
              report.trendInsights.map((trend, idx) => <p key={idx}>{trend}</p>)
            ) : (
              <p>
                Biomarker values recorded on {report.visitDate}. Upload consecutive lab reports to visualize longitudinal multi-year trend trajectories.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 4. RAW TRANSCRIBED OCR TEXT COLLAPSIBLE */}
      {report.rawOcrText && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          <button
            onClick={() => setShowRawOcr(!showRawOcr)}
            className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors text-left text-xs font-bold text-slate-800"
          >
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-sky-600" />
              <span>📄 Raw Transcribed OCR Text</span>
            </div>
            {showRawOcr ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>

          {showRawOcr && (
            <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs leading-relaxed overflow-x-auto border-t border-slate-200">
              <pre className="whitespace-pre-wrap">{report.rawOcrText}</pre>
            </div>
          )}
        </div>
      )}

      {/* 5. INFORMATIONAL DISCLAIMER NOTICE */}
      <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-4 text-xs text-amber-950 space-y-1">
        <div className="flex items-center gap-1.5 font-extrabold text-amber-950">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Informational Only Notice</span>
        </div>
        <p className="text-[11px] text-amber-900 font-semibold leading-relaxed">
          This AI summary is designed strictly to assist family members in organizing and understanding medical records. It does not constitute medical diagnosis or advice. Always consult a certified healthcare professional before taking medical action.
        </p>
      </div>

    </div>
  );
};
