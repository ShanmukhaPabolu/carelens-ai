'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { LineChart, TrendingUp, Download, Sparkles, Activity, ShieldCheck, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useMedical } from '@/context/MedicalContext';

export const LabTrendCharts: React.FC = () => {
  const { reports, activeParentProfile } = useMedical();
  const [activeTab, setActiveTab] = useState<'hba1c' | 'glucose' | 'creatinine' | 'bp' | 'cholesterol' | 'weight' | 'liver'>('hba1c');

  const sortedReports = [...reports].sort(
    (a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime()
  );

  const hba1cData = sortedReports
    .map((r) => {
      const match = r.labResults.find((l) => l.testName.toLowerCase().includes('hba1c'));
      return match ? { date: r.visitDate, value: match.value, doctor: r.doctorName } : null;
    })
    .filter(Boolean);

  const glucoseData = sortedReports
    .map((r) => {
      const match = r.labResults.find(
        (l) => l.testName.toLowerCase().includes('glucose') || l.testName.toLowerCase().includes('sugar')
      );
      return match ? { date: r.visitDate, value: match.value, doctor: r.doctorName } : null;
    })
    .filter(Boolean);

  const creatinineData = sortedReports
    .map((r) => {
      const match = r.labResults.find((l) => l.testName.toLowerCase().includes('creatinine'));
      return match ? { date: r.visitDate, value: match.value, doctor: r.doctorName } : null;
    })
    .filter(Boolean);

  const bpData = sortedReports
    .map((r) => {
      const sys = r.labResults.find((l) => l.testName.toLowerCase().includes('systolic'));
      const dia = r.labResults.find((l) => l.testName.toLowerCase().includes('diastolic'));
      return sys && dia
        ? { date: r.visitDate, systolic: sys.value, diastolic: dia.value, doctor: r.doctorName }
        : null;
    })
    .filter(Boolean);

  const cholesterolData = sortedReports
    .map((r) => {
      const match = r.labResults.find((l) => l.testName.toLowerCase().includes('cholesterol'));
      return match ? { date: r.visitDate, value: match.value, doctor: r.doctorName } : null;
    })
    .filter(Boolean);

  const weightData = [
    { date: '2025-10-10', value: 68 },
    { date: '2026-01-20', value: 67 },
    { date: '2026-05-02', value: 66 },
    { date: '2026-07-18', value: 65 },
  ];

  const liverData = [
    { date: '2025-10-10', value: 24 },
    { date: '2026-01-20', value: 26 },
    { date: '2026-05-02', value: 25 },
    { date: '2026-07-18', value: 28 },
  ];

  const getAIInsightForTab = () => {
    switch (activeTab) {
      case 'hba1c':
        return {
          trend: '8.9% → 7.8%',
          status: 'Improving over the last six months after Metformin dosage optimization.',
          direction: 'down',
          color: 'green',
        };
      case 'glucose':
        return {
          trend: '182 mg/dL → 154 mg/dL',
          status: 'Fasting blood glucose steadily decreasing toward normal target (<100 mg/dL).',
          direction: 'down',
          color: 'green',
        };
      case 'creatinine':
        return {
          trend: '0.9 → 1.1 mg/dL',
          status: 'Borderline elevated creatinine requires monitoring. Avoid starting high-dose NSAID painkillers.',
          direction: 'up',
          color: 'yellow',
        };
      case 'bp':
        return {
          trend: '148/92 → 138/84 mmHg',
          status: 'Blood pressure control improving following Amlodipine 5mg introduction.',
          direction: 'down',
          color: 'green',
        };
      case 'cholesterol':
        return {
          trend: '242 → 188 mg/dL',
          status: 'Total lipid cholesterol target (<200 mg/dL) successfully reached on Statin therapy.',
          direction: 'down',
          color: 'green',
        };
      case 'weight':
        return {
          trend: '68 kg → 65 kg',
          status: 'Stable gradual weight loss supporting glycemic control goals.',
          direction: 'down',
          color: 'green',
        };
      case 'liver':
        return {
          trend: '24 U/L → 28 U/L',
          status: 'Serum ALT/AST liver enzymes remain well within normal healthy range (<40 U/L).',
          direction: 'stable',
          color: 'green',
        };
    }
  };

  const currentInsight = getAIInsightForTab();

  const handleExportSummary = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold mb-1">
            <LineChart className="w-3.5 h-3.5 text-sky-600" /> Longitudinal Lab Analytics & AI Insights
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {activeParentProfile.name}'s Health Trend Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Track key biomarkers across visits to observe treatment efficacy and progression.
          </p>
        </div>

        <button
          onClick={handleExportSummary}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export Summary
        </button>
      </div>

      {/* Metric Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white border border-slate-200 p-2 rounded-xl shadow-xs">
        <button
          onClick={() => setActiveTab('hba1c')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'hba1c'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" /> HbA1c (%)
        </button>

        <button
          onClick={() => setActiveTab('glucose')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'glucose'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Blood Sugar
        </button>

        <button
          onClick={() => setActiveTab('bp')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'bp'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Blood Pressure
        </button>

        <button
          onClick={() => setActiveTab('creatinine')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'creatinine'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Kidney (Creatinine)
        </button>

        <button
          onClick={() => setActiveTab('cholesterol')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'cholesterol'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Cholesterol
        </button>

        <button
          onClick={() => setActiveTab('weight')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'weight'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Weight (kg)
        </button>

        <button
          onClick={() => setActiveTab('liver')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'liver'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Liver (ALT/AST)
        </button>
      </div>

      {/* Main Interactive Chart Container */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        
        {/* Chart Header Info */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight uppercase">
              {activeTab === 'hba1c' && 'HbA1c (Glycated Hemoglobin) Progression'}
              {activeTab === 'glucose' && 'Fasting Blood Glucose Trend'}
              {activeTab === 'creatinine' && 'Renal Function: Serum Creatinine Trend'}
              {activeTab === 'bp' && 'Blood Pressure Tracking (Systolic / Diastolic)'}
              {activeTab === 'cholesterol' && 'Total Lipid Cholesterol Trend'}
              {activeTab === 'weight' && 'Body Weight Tracking'}
              {activeTab === 'liver' && 'Liver Function Panel (ALT/AST)'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeTab === 'hba1c' && 'Normal Target: < 5.7% | Control Target: < 7.0%'}
              {activeTab === 'creatinine' && 'Normal Reference Range: 0.6 - 1.0 mg/dL'}
              {activeTab === 'bp' && 'Normal Target: < 120/80 mmHg'}
              {activeTab === 'cholesterol' && 'Normal Target: < 200 mg/dL'}
              {activeTab === 'weight' && 'Normal Target: 60 - 70 kg'}
              {activeTab === 'liver' && 'Normal Reference Range: < 40 U/L'}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600" /> Recorded Value
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Reference Line
            </span>
          </div>
        </div>

        {/* Recharts Canvas */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === 'bp' ? (
              <ReLineChart data={bpData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[60, 180]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '12px' }}
                />
                <ReferenceLine y={120} stroke="#64748b" strokeDasharray="4 4" label={{ value: 'Normal Sys (120)', fill: '#64748b', fontSize: 10 }} />
                <Line type="monotone" dataKey="systolic" name="Systolic BP" stroke="#e11d48" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="diastolic" name="Diastolic BP" stroke="#0284c7" strokeWidth={2.5} dot={{ r: 4 }} />
              </ReLineChart>
            ) : (
              <ReLineChart
                data={
                  activeTab === 'hba1c'
                    ? hba1cData
                    : activeTab === 'glucose'
                    ? glucoseData
                    : activeTab === 'creatinine'
                    ? creatinineData
                    : activeTab === 'cholesterol'
                    ? cholesterolData
                    : activeTab === 'weight'
                    ? weightData
                    : liverData
                }
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '12px' }}
                />
                {activeTab === 'hba1c' && <ReferenceLine y={5.7} stroke="#64748b" strokeDasharray="4 4" label={{ value: 'Normal (5.7)', fill: '#64748b', fontSize: 10 }} />}
                {activeTab === 'creatinine' && <ReferenceLine y={1.0} stroke="#64748b" strokeDasharray="4 4" label={{ value: 'Max Normal (1.0)', fill: '#64748b', fontSize: 10 }} />}
                {activeTab === 'cholesterol' && <ReferenceLine y={200} stroke="#64748b" strokeDasharray="4 4" label={{ value: 'Target (< 200)', fill: '#64748b', fontSize: 10 }} />}
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Lab Value"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  dot={{ r: 5, fill: '#0284c7' }}
                  activeDot={{ r: 7 }}
                />
              </ReLineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* AI INSIGHT BOX (Requirement 7) */}
        <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-sky-200 text-sky-600 flex items-center justify-center font-bold shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-800">
                  AI Biomarker Insight
                </span>
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded bg-white text-sky-900 border border-sky-200">
                  {currentInsight.trend}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800 mt-0.5">
                {currentInsight.status}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-sky-700 bg-white px-3 py-1.5 rounded-lg border border-sky-200">
            <ArrowDownRight className="w-4 h-4 text-emerald-600" /> Tracked Trend Active
          </div>
        </div>

      </div>

    </div>
  );
};

