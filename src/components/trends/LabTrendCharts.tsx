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
import { LineChart, TrendingUp, Download, Calendar, Filter, AlertCircle, Sparkles } from 'lucide-react';
import { useMedical } from '@/context/MedicalContext';

export const LabTrendCharts: React.FC = () => {
  const { reports, parentProfile } = useMedical();
  const [activeTab, setActiveTab] = useState<'hba1c' | 'glucose' | 'creatinine' | 'bp' | 'cholesterol'>('hba1c');

  // Extract lab trend points from sorted reports
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

  const handleExportSummary = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-1">
            <LineChart className="w-3.5 h-3.5" /> Longitudinal Lab Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {parentProfile.name}'s Health Trend Dashboard
          </h1>
          <p className="text-xs text-slate-400">
            Track key biomarkers across multiple visits to observe treatment efficacy and progression.
          </p>
        </div>

        <button
          onClick={handleExportSummary}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export Caregiver Summary
        </button>
      </div>

      {/* Metric Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl">
        <button
          onClick={() => setActiveTab('hba1c')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'hba1c'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" /> HbA1c (%)
        </button>

        <button
          onClick={() => setActiveTab('glucose')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'glucose'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Blood Glucose (mg/dL)
        </button>

        <button
          onClick={() => setActiveTab('creatinine')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'creatinine'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Serum Creatinine (mg/dL)
        </button>

        <button
          onClick={() => setActiveTab('bp')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'bp'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Blood Pressure (mmHg)
        </button>

        <button
          onClick={() => setActiveTab('cholesterol')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'cholesterol'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Cholesterol (mg/dL)
        </button>
      </div>

      {/* Main Interactive Chart Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        
        {/* Chart Header Info */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight uppercase">
              {activeTab === 'hba1c' && 'HbA1c (Glycated Hemoglobin) Progression'}
              {activeTab === 'glucose' && 'Fasting Blood Glucose Trend'}
              {activeTab === 'creatinine' && 'Renal Function: Serum Creatinine Trend'}
              {activeTab === 'bp' && 'Blood Pressure Tracking (Systolic / Diastolic)'}
              {activeTab === 'cholesterol' && 'Total Lipid Cholesterol Trend'}
            </h2>
            <p className="text-xs text-slate-400">
              {activeTab === 'hba1c' && 'Normal Target: < 5.7% | Diabetes Control Target: < 7.0%'}
              {activeTab === 'creatinine' && 'Normal Reference Range: 0.6 - 1.0 mg/dL'}
              {activeTab === 'bp' && 'Normal Target: < 120/80 mmHg'}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Recorded Value
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Normal Threshold
            </span>
          </div>
        </div>

        {/* Recharts Canvas */}
        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === 'bp' ? (
              <ReLineChart data={bpData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[60, 180]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <ReferenceLine y={120} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Normal Sys (120)', fill: '#10b981', fontSize: 10 }} />
                <Line type="monotone" dataKey="systolic" name="Systolic BP" stroke="#f43f5e" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="diastolic" name="Diastolic BP" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} />
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
                    : cholesterolData
                }
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                {activeTab === 'hba1c' && <ReferenceLine y={5.7} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Normal (5.7)', fill: '#10b981', fontSize: 10 }} />}
                {activeTab === 'creatinine' && <ReferenceLine y={1.0} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Max Normal (1.0)', fill: '#10b981', fontSize: 10 }} />}
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Lab Value"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 6, fill: '#3b82f6' }}
                  activeDot={{ r: 8 }}
                />
              </ReLineChart>
            )}
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
};
