'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  Upload,
  Clock,
  TrendingUp,
  AlertTriangle,
  FileText,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      
      {/* Quiet Clinical Hero Section */}
      <section className="py-16 sm:py-24 border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          {/* Muted Product Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold">
            <Activity className="w-3.5 h-3.5 text-blue-600" /> Caregiver AI Health Record Assistant
          </div>

          {/* Plain, Strong Single-Color Headline */}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto">
            Organize your parent's medical journey into a continuous AI timeline.
          </h1>

          {/* Readable Plain Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Convert scattered paper prescriptions, WhatsApp photos, and lab PDFs into clear medical change tracking. Understand what changed across visits without reading dozens of reports.
          </p>

          {/* Single Primary CTA Routing to /login */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/login"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#how-it-works"
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              <span>Learn how it works</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>

          {/* Quiet Restyled Promise Card */}
          <div className="pt-8 max-w-2xl mx-auto">
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-left space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                The CareLens Promise
              </span>
              <p className="text-xs text-slate-800 font-medium leading-relaxed">
                "The value is not storing medical reports — it is helping caregivers quickly understand what changed across multiple doctors and visits using AI."
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Explainer Section: How CareLens Works */}
      <section id="how-it-works" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-1.5">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Clinical Workflow</span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">How CareLens Works for Caregivers</h2>
            <p className="text-xs text-slate-500 max-w-lg mx-auto">
              Simple 4-step workflow that transforms messy paper files into actionable health clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="text-xs font-bold text-slate-900">Upload Report</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Snap a photo or upload PDFs of prescriptions, lab tests, or discharge summaries.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="text-xs font-bold text-slate-900">AI Vision Extraction</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Extracts doctor notes, medications, dosages, and lab parameters with confidence scores.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="text-xs font-bold text-slate-900">Automatic Change Detection</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Compares new values against history to highlight dosage shifts and lab trends.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <h3 className="text-xs font-bold text-slate-900">Conflict Alerts</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Flags potential drug contradictions between specialists (e.g. NSAIDs vs creatinine elevation).
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Features</span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Designed Specifically for Family Caregivers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900">Continuous Medical Stream</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                View your parent's entire treatment history in a single chronological stream sorted by visit date.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900">Lab Trend Dashboards</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Interactive longitudinal charts for HbA1c, Blood Sugar, Creatinine, BP, and Cholesterol over 2+ years.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="text-xs font-bold text-slate-900">Doctor Conflict Detector</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Identifies contradictory medication instructions between different treating doctors without altering prescriptions.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 text-center space-y-4 bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-900">Start managing your parent's health record</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Sign in with your name and email to access your caregiver workspace.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

    </div>
  );
}
