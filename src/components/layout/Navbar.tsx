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
  Calendar,
  AlertTriangle,
  RefreshCw,
  ChevronDown,
  Users,
  Check
} from 'lucide-react';
import { useMedical } from '@/context/MedicalContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const {
    profiles,
    activeParentId,
    activeParentProfile,
    setActiveParentId,
    reports,
    caregiverUser,
    resetDemoData
  } = useMedical();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const needsReviewCount = reports.filter((r) => r.needsReview).length;
  const conflictCount = reports.reduce((acc, r) => acc + (r.doctorConflicts?.length || 0), 0);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Activity },
    { href: '/timeline', label: 'Timeline', icon: Clock },
    { href: '/trends', label: 'Lab Trends', icon: LineChart },
    { href: '/follow-ups', label: 'Follow-ups', icon: Calendar },
    { href: '/search', label: 'Search', icon: Search },
  ];

  // LANDING PAGE & LOGIN NAVBAR (Strict single CTA routing to /login)
  if (pathname === '/' || pathname === '/login') {
    return (
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 text-slate-900 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">CareLens</span>
          </Link>

          <div className="flex items-center">
            <Link
              href="/login"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1">
                CareLens
                <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded uppercase tracking-wider">
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-slate-100 text-blue-700 border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Parent Switcher Dropdown & Actions */}
          <div className="flex items-center space-x-3 shrink-0">
            
            {conflictCount > 0 && (
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>{conflictCount} Conflict</span>
              </Link>
            )}

            {needsReviewCount > 0 && (
              <Link
                href="/timeline"
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 border border-rose-300 text-xs font-bold"
              >
                <span>{needsReviewCount} Review Needed</span>
              </Link>
            )}

            {/* Quick Upload CTA */}
            <Link
              href="/upload"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Report</span>
            </Link>

            {/* PARENT PROFILE SWITCHER DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all"
              >
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <div className="text-left hidden lg:block">
                  <span className="font-bold block leading-tight">{activeParentProfile.name}</span>
                  <span className="text-[10px] text-slate-500 block leading-none">{activeParentProfile.relationship}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-xl p-3 z-50 text-slate-800 space-y-2">
                  <div className="pb-2 border-b border-slate-100">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Switch Parent Profile</p>
                    {caregiverUser && (
                      <p className="text-xs text-blue-600 font-semibold mt-0.5">Caregiver: {caregiverUser.fullName}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    {profiles.map((p) => {
                      const isSelected = p.id === activeParentId;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            setActiveParentId(p.id);
                            setShowProfileMenu(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors ${
                            isSelected
                              ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                              : 'text-slate-700 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <div className="text-left">
                            <p className="font-bold">{p.name} ({p.relationship})</p>
                            <p className="text-[10px] text-slate-500">{p.primaryCondition}</p>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <Link
                      href="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
                    >
                      <User className="w-3.5 h-3.5 text-blue-600" /> View {activeParentProfile.name}'s Profile
                    </Link>
                    <button
                      onClick={() => {
                        resetDemoData();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-700 hover:bg-rose-50 rounded-lg text-left font-medium"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Reset Demo Datasets
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
