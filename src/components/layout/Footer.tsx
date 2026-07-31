'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">CareLens</span>
              <span className="text-slate-500 text-xs block">
                AI Health Timeline & Medical Change Detection for Family Caregivers
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400 font-medium">
            <Link href="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
            <Link href="/timeline" className="hover:text-blue-400 transition-colors">Timeline</Link>
            <Link href="/trends" className="hover:text-blue-400 transition-colors">Lab Trends</Link>
            <Link href="/upload" className="hover:text-blue-400 transition-colors">Upload Report</Link>
            <Link href="/follow-ups" className="hover:text-blue-400 transition-colors">Follow-ups</Link>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>CareLens is an AI assistance prototype for caregivers. AI does not diagnose diseases or recommend treatments.</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for long-distance family caregivers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
