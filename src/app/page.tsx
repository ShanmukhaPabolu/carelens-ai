'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  Sparkles,
  Upload,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Shield,
  Search,
  Zap,
  Users,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden border-b border-slate-900">
        
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wide uppercase shadow-inner">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Caregiver AI Health Timeline Prototype
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Stop opening scattered medical files.{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              Understand what changed instantly.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            CareLens converts paper prescriptions, WhatsApp photos, and lab PDFs into a continuously updated health timeline with AI change detection, dosage tracking, and doctor conflict alerts.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="px-7 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2.5 group"
            >
              <span>Explore Demo Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/login"
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm rounded-xl border border-slate-800 transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-blue-400" /> Continue as Caregiver
            </Link>
          </div>

          {/* Core Product Thesis Banner */}
          <div className="pt-10 max-w-3xl mx-auto">
            <div className="bg-slate-900/80 backdrop-blur-md border border-blue-500/30 p-5 rounded-2xl shadow-2xl text-left flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-1">
                <Zap className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-400">The Core CareLens Promise</p>
                <p className="text-sm font-semibold text-slate-100">
                  "The value is NOT storing medical reports—it is helping caregivers quickly understand what changed across multiple doctors and visits using AI."
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Before vs After Comparison */}
      <section className="py-20 bg-slate-950 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Scattered Reports vs. CareLens Clarity</h2>
            <p className="text-xs text-slate-400">Why traditional cloud storage fails long-distance family caregivers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional Chaos */}
            <div className="bg-slate-900/50 border border-rose-500/30 rounded-3xl p-7 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">✕</div>
                <h3 className="text-lg font-bold text-rose-300">The Old Way (Drive folders & WhatsApp)</h3>
              </div>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span> Prescriptions buried in WhatsApp attachments & paper folders.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span> Spending 45 minutes opening PDFs one-by-one to see if Metformin dose changed.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span> Missing conflicting advice between Cardiologist and Nephrologist.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span> Zero visibility into 2-year lab trends during emergency room visits.
                </li>
              </ul>
            </div>

            {/* CareLens Solution */}
            <div className="bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-7 space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</div>
                <h3 className="text-lg font-bold text-emerald-300">The CareLens AI Way</h3>
              </div>
              <ul className="space-y-3 text-xs text-slate-200">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <strong>1-Click AI Upload:</strong> Vision model parses doctor handwriting, dosages, and labs automatically.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <strong>Instant Change Detection:</strong> Highlights "Metformin 500mg → 1000mg" & "HbA1c +0.4%".
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <strong>Doctor Conflict Detector:</strong> Flags NSAIDs prescribed when kidney creatinine is elevated.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <strong>Caregiver Executive Summary:</strong> Plain-English 3-bullet summary ready for family phone calls.
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Built for Caregivers</span>
            <h2 className="text-3xl font-extrabold text-white">Powerful AI Workflow Features</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <Upload className="w-8 h-8 text-blue-400" />
              <h3 className="text-base font-bold text-white">AI Medical Vision OCR</h3>
              <p className="text-xs text-slate-400">
                Drag and drop camera photos, PDFs, or prescriptions. Vision model extracts structured doctor notes.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <Clock className="w-8 h-8 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Continuous Health Timeline</h3>
              <p className="text-xs text-slate-400">
                Chronological stream organized by visit date, doctor specialty, and medication modifications.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <AlertTriangle className="w-8 h-8 text-amber-400" />
              <h3 className="text-base font-bold text-white">Doctor Conflict Detector</h3>
              <p className="text-xs text-slate-400">
                AI flags contradictory drug instructions across different specialists without altering prescriptions.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <TrendingUp className="w-8 h-8 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Lab Trend Analytics</h3>
              <p className="text-xs text-slate-400">
                Interactive charts for HbA1c, Blood Sugar, Creatinine, BP, and Cholesterol over 2+ years.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <Shield className="w-8 h-8 text-rose-400" />
              <h3 className="text-base font-bold text-white">Confidence & Manual Review</h3>
              <p className="text-xs text-slate-400">
                Fields with confidence below 80% are flagged "Needs Review" so you verify before saving.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <Search className="w-8 h-8 text-sky-400" />
              <h3 className="text-base font-bold text-white">Medical History Search</h3>
              <p className="text-xs text-slate-400">
                Instant search across all uploaded reports for specific diagnoses, medicines, doctors, or lab tests.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Ready to test CareLens?</h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Preloaded with demo dataset for Lakshmi Devi (8 reports, lab trends, doctor conflict warning, low-confidence review demo).
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-blue-600/30 transition-all"
        >
          Launch CareLens Prototype <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

    </div>
  );
}
