'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle2, Building, Sparkles, Plus, Edit2, X, ShieldCheck } from 'lucide-react';
import { useMedical } from '@/context/MedicalContext';
import { SmartFollowUpPrediction } from '@/types/medical';

export const FollowUpTracker: React.FC = () => {
  const { followUps, markFollowUpComplete, activeParentProfile } = useMedical();

  // Smart AI Predictions when no explicit follow-up date is mentioned on report
  const [predictions, setPredictions] = useState<SmartFollowUpPrediction[]>([
    {
      id: 'pred-1',
      condition: 'Type 2 Diabetes Routine Review',
      typicalIntervalMonths: 3,
      predictedDate: '2026-08-15',
      reasoning: 'Routine HbA1c and glycemic control evaluation recommended every 3 months after starting Metformin.',
      accepted: false,
    },
    {
      id: 'pred-2',
      condition: 'Hypertension Regimen Check',
      typicalIntervalMonths: 1,
      predictedDate: '2026-06-10',
      reasoning: 'Follow-up recommended 1 month after modifying blood pressure dosage (Amlodipine 5mg).',
      accepted: false,
    },
    {
      id: 'pred-3',
      condition: 'Annual Geriatric Comprehensive Health Check',
      typicalIntervalMonths: 6,
      predictedDate: '2026-11-20',
      reasoning: 'Semi-annual lipid panel, renal function, and vision screening for active seniors.',
      accepted: false,
    },
  ]);

  const getDaysRemaining = (targetDateStr: string) => {
    const target = new Date(targetDateStr).getTime();
    const now = new Date().getTime();
    return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  };

  const handleAcceptPrediction = (id: string) => {
    setPredictions(predictions.map((p) => (p.id === id ? { ...p, accepted: true } : p)));
  };

  const handleDismissPrediction = (id: string) => {
    setPredictions(predictions.filter((p) => p.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold mb-1">
          <Calendar className="w-3.5 h-3.5 text-sky-600" /> Smart Follow-up & AI Prediction Engine
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Smart Follow-up Tracker for {activeParentProfile.name}
        </h1>
        <p className="text-xs text-slate-500">
          Automatically scheduled visits extracted from prescriptions + AI predictions for routine checkup intervals.
        </p>
      </div>

      {/* SECTION 1: AI SMART PREDICTED FOLLOW-UPS (Requirement 9) */}
      <div className="bg-gradient-to-br from-sky-50/60 via-white to-slate-50 border border-sky-200 rounded-2xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-sky-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-sky-900">
                AI Predicted Follow-up Intervals
              </h2>
              <p className="text-[11px] text-slate-500">
                Smart review predictions when no explicit date was written on prescription note.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
            3 Recommended
          </span>
        </div>

        <div className="space-y-3">
          {predictions.map((pred) => (
            <div
              key={pred.id}
              className={`bg-white border rounded-xl p-4 space-y-2.5 shadow-2xs transition-all ${
                pred.accepted ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-200 hover:border-sky-300'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{pred.condition}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                    Typical Interval: {pred.typicalIntervalMonths} Months
                  </span>
                </div>
                <span className="text-xs font-bold text-sky-800">
                  Target: {pred.predictedDate}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {pred.reasoning}
              </p>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> AI Guideline Recommendation
                </span>

                {pred.accepted ? (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Accepted & Scheduled!
                  </span>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDismissPrediction(pred.id || '')}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold border border-slate-200 transition-all flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Dismiss
                    </button>

                    <button
                      onClick={() => handleAcceptPrediction(pred.id || '')}
                      className="px-4 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-all flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Accept & Schedule
                    </button>

                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: SCHEDULED FOLLOW-UPS FROM PRESCRIPTIONS */}
      <div className="space-y-3 pt-2">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
          Extracted Prescription Follow-ups ({followUps.length})
        </h2>

        {followUps.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-slate-500 shadow-xs space-y-1">
            <p className="text-xs font-bold text-slate-900">No follow-up reminders yet.</p>
            <p className="text-[11px] text-slate-500">
              Upload prescription notes or consultation reports to extract return consultation dates.
            </p>
          </div>
        ) : (
          followUps.map((item) => {
            const daysLeft = getDaysRemaining(item.date);
            const isCompleted = item.status === 'completed';

            return (
              <div
                key={item.id}
                className={`bg-white border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-xs ${
                  isCompleted
                    ? 'border-slate-200 opacity-60'
                    : daysLeft <= 14
                    ? 'border-amber-300 bg-amber-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border ${
                      isCompleted
                        ? 'bg-slate-100 text-slate-400 border-slate-200'
                        : daysLeft <= 14
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-sky-50 text-sky-700 border-sky-200'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <div className="text-center leading-none">
                        <span className="text-sm font-extrabold block">{daysLeft}</span>
                        <span className="text-[9px] uppercase tracking-wider font-semibold block text-slate-500">
                          Days
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-slate-900">{item.doctorName}</h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {item.specialty}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" /> {item.hospital}
                    </p>

                    <p className="text-xs text-slate-700 font-medium pt-0.5">
                      <strong className="text-sky-700">Reason:</strong> {item.reason}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-bold text-slate-900 block">{item.date}</span>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">
                      Target Date
                    </span>
                  </div>

                  {!isCompleted && (
                    <button
                      onClick={() => markFollowUpComplete(item.id)}
                      className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Mark Complete
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};




