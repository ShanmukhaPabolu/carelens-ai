'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  Upload,
  Sparkles,
  Clock,
  ArrowRight,
  ChevronDown,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-emerald-600 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 border-b border-slate-200/80 bg-[#F8FAFC] overflow-hidden">
        
        {/* Soft, blurred radial shape for subtle background depth (5-8% opacity) */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-emerald-600/[0.05] rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7 relative z-10">
          
          {/* Muted Product Pill */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-slate-700 border border-slate-200/90 text-xs font-semibold shadow-xs">
            <Activity className="w-3.5 h-3.5 text-emerald-600" /> Caregiver AI Health Record Assistant
          </div>

          {/* Headline Hierarchy: Key Phrase in Nordic Emerald */}
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug max-w-3xl mx-auto">
            Organize your parent's medical journey into a{' '}
            <span className="text-emerald-700 font-extrabold">continuous AI timeline</span>.
          </h1>

          {/* Plain Readable Body Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Convert scattered paper prescriptions, WhatsApp photos, and lab PDFs into clear medical change tracking. Understand what changed across visits without reading dozens of reports.
          </p>

          {/* Button Refinement: Solid Primary + Outline Ghost Secondary */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <Link
              href="/login"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#how-it-works"
              className="px-5 py-3 bg-transparent hover:bg-slate-100/60 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5"
            >
              <span>Learn how it works</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>

          {/* THREE-STEP VISUAL (Horizontal on desktop, stacked on mobile) */}
          <div id="how-it-works" className="pt-10 max-w-4xl mx-auto scroll-mt-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              
              {/* Step 1 */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-2 hover:border-slate-300 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Photograph the report</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                    Upload paper prescriptions, lab scans, or hospital summaries.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-2 hover:border-slate-300 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">AI extracts & flags what changed</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                    Automatically parses doctor notes, dosages, and lab trends.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-2 hover:border-slate-300 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">One continuous timeline, always current</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                    All past visits organized chronologically for easy review.
                  </p>
                </div>

              </div>

            </div>
          </div>

          {/* THREE SHORT STAT / VALUE COLUMNS CONTAINER */}
          <div className="pt-6 max-w-4xl mx-auto">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-slate-100">
                
                <div className="space-y-1 md:pr-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Unified History</span>
                  <p className="text-xs font-bold text-slate-900">
                    "One place, not five WhatsApp threads"
                  </p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Keep all prescriptions & doctor notes in one continuous family timeline.
                  </p>
                </div>

                <div className="space-y-1 pt-4 md:pt-0 md:px-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Change Detection</span>
                  <p className="text-xs font-bold text-slate-900">
                    "Every dosage change flagged automatically"
                  </p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Instantly spot medication dosage increases and abnormal lab shifts.
                  </p>
                </div>

                <div className="space-y-1 pt-4 md:pt-0 md:pl-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Trust & Verification</span>
                  <p className="text-xs font-bold text-slate-900">
                    "Built to admit when it's not sure"
                  </p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Low-confidence scans trigger manual review before updating history.
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Value Grid */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-1.5">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Features</span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Built Specifically for Family Caregivers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-5 space-y-2">
              <Clock className="w-5 h-5 text-emerald-700" />
              <h3 className="text-xs font-bold text-slate-900">Continuous Medical Stream</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                View your parent's entire treatment history in a single chronological stream sorted by visit date.
              </p>
            </div>

            <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-5 space-y-2">
              <TrendingUp className="w-5 h-5 text-emerald-700" />
              <h3 className="text-xs font-bold text-slate-900">Lab Trend Analytics</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Interactive longitudinal charts for HbA1c, Blood Sugar, Creatinine, BP, and Cholesterol over time.
              </p>
            </div>

            <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-5 space-y-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="text-xs font-bold text-slate-900">Doctor Conflict Detector</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Identifies contradictory medication instructions between treating doctors without altering prescriptions.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 text-center space-y-4 bg-[#F8FAFC]">
        <h2 className="text-2xl font-bold text-slate-900">Start managing your parent's health record</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Sign in with your name and email to access your caregiver workspace.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

    </div>
  );
}
