'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900">CareLens</span>
              <span className="text-slate-500 text-xs block">
                AI Medical Timeline & Change Detection for Family Caregivers
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-slate-600 font-semibold text-xs">
            <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
            <Link href="/timeline" className="hover:text-blue-600 transition-colors">Timeline</Link>
            <Link href="/trends" className="hover:text-blue-600 transition-colors">Lab Trends</Link>
            <Link href="/upload" className="hover:text-blue-600 transition-colors">Upload Report</Link>
            <Link href="/follow-ups" className="hover:text-blue-600 transition-colors">Follow-ups</Link>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>CareLens is an AI assistance prototype for caregivers. AI does not diagnose diseases or recommend treatments.</span>
          </div>
          <div className="flex items-center gap-1 text-slate-600">
            <span>Built for long-distance family caregivers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
