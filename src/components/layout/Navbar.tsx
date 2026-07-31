'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Upload,
  Clock,
  LineChart,
  Search,
  User,
  Sparkles,
  Calendar,
  AlertTriangle,
  RefreshCw,
  ChevronDown,
  Shield,
  HeartHandshake
} from 'lucide-react';
import { useMedical } from '@/context/MedicalContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { parentProfile, reports, searchQuery, setSearchQuery, resetDemoData } = useMedical();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Check if any report needs review or has conflict
  const needsReviewCount = reports.filter((r) => r.needsReview).length;
  const conflictCount = reports.reduce((acc, r) => acc + (r.doctorConflicts?.length || 0), 0);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Activity },
    { href: '/timeline', label: 'Timeline', icon: Clock },
    { href: '/trends', label: 'Lab Trends', icon: LineChart },
    { href: '/follow-ups', label: 'Follow-ups', icon: Calendar },
    { href: '/search', label: 'Search', icon: Search },
  ];

  // Don't render full navbar on landing page or login if desired, or keep sticky
  if (pathname === '/' || pathname === '/login') {
    return (
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800 text-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-400 bg-clip-text text-transparent">
                CareLens
              </span>
              <span className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 inline" /> AI Health Timeline
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Demo Workspace
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <HeartHandshake className="w-4 h-4" /> Caregiver Portal
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-lg border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <Link href="/dashboard" className="flex items-center space-x-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                CareLens
                <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Caregiver AI
                </span>
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Parent Switcher & Actions */}
          <div className="flex items-center space-x-3 shrink-0">
            
            {/* Urgent Review & Conflict Indicators */}
            {conflictCount > 0 && (
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold animate-pulse"
                title={`${conflictCount} doctor conflict detected`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>{conflictCount} Conflict</span>
              </Link>
            )}

            {needsReviewCount > 0 && (
              <Link
                href="/timeline"
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold"
                title={`${needsReviewCount} report needs manual review`}
              >
                <Shield className="w-3.5 h-3.5 text-rose-400" />
                <span>{needsReviewCount} Review</span>
              </Link>
            )}

            {/* Quick Upload CTA */}
            <Link
              href="/upload"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Report</span>
            </Link>

            {/* Parent Profile Badge */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-medium transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-[10px] border border-indigo-500/40">
                  {parentProfile.name.charAt(0)}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-semibold leading-tight text-white">{parentProfile.name}</p>
                  <p className="text-[10px] text-slate-400 leading-none">{parentProfile.relationship} ({parentProfile.age}y)</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 text-slate-200">
                  <div className="pb-2 border-b border-slate-800 mb-2">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Care Recipient</p>
                    <p className="text-sm font-bold text-white mt-0.5">{parentProfile.name}</p>
                    <p className="text-xs text-slate-400">{parentProfile.primaryCondition}</p>
                  </div>
                  <div className="space-y-1">
                    <Link
                      href="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-blue-400" /> Parent Health Profile
                    </Link>
                    <button
                      onClick={() => {
                        resetDemoData();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Reset Demo Dataset
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
