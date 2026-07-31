'use client';

import React, { useState, useEffect } from 'react';

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
  Check,
  LogOut,
  UserPlus
} from 'lucide-react';
import { useMedical } from '@/context/MedicalContext';
import { AddFamilyMemberModal } from '@/components/dashboard/AddFamilyMemberModal';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAddFamilyModal, setShowAddFamilyModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    profiles,
    activeParentId,
    activeParentProfile,
    setActiveParentId,
    reports,
    caregiverUser,
    logoutCaregiverUser,
  } = useMedical();

  const needsReviewCount = mounted ? reports.filter((r) => r.needsReview).length : 0;
  const conflictCount = mounted ? reports.reduce((acc, r) => acc + (r.doctorConflicts?.length || 0), 0) : 0;

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Activity },
    { href: '/timeline', label: 'Timeline', icon: Clock },
    { href: '/trends', label: 'Lab Trends', icon: LineChart },
    { href: '/follow-ups', label: 'Follow-ups', icon: Calendar },
    { href: '/search', label: 'Search', icon: Search },
  ];

  // Landing Page & Login Navbar
  if (pathname === '/' || pathname === '/login') {
    return (
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 text-slate-900 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">CareLens</span>
          </Link>

          <div className="flex items-center">
            <Link
              href="/login"
              className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 text-slate-900 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Brand Logo */}
            <Link href="/dashboard" className="flex items-center space-x-2.5 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold">
                <Activity className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  CareLens
                  <span className="text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200 px-1.5 py-0.5 rounded uppercase tracking-wider">
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
                        ? 'bg-slate-100 text-sky-800 border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
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

              {/* Emergency Health Card CTA */}
              <Link
                href="/emergency"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-lg text-xs font-bold transition-all"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Emergency Card</span>
              </Link>

              {/* Quick Upload CTA */}
              <Link
                href="/upload"
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Report</span>
              </Link>

              {/* FAMILY MEMBER SWITCHER DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all"
                >
                  <Users className="w-3.5 h-3.5 text-sky-600" />
                  <div className="text-left hidden lg:block">
                    <span className="font-bold block leading-tight">{activeParentProfile.name}</span>
                    <span className="text-[10px] text-slate-500 block leading-none">{activeParentProfile.relationship}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-xl p-3 z-50 text-slate-800 space-y-2">
                    <div className="pb-2 border-b border-slate-100">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Switch Family Member</p>
                      {caregiverUser && (
                        <p className="text-xs text-sky-700 font-semibold mt-0.5">Caregiver: {caregiverUser.fullName}</p>
                      )}
                    </div>

                    <div className="space-y-1 max-h-48 overflow-y-auto">
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
                                ? 'bg-sky-50 text-sky-900 font-bold border border-sky-200'
                                : 'text-slate-700 hover:bg-slate-50 font-medium'
                            }`}
                          >
                            <div className="text-left">
                              <p className="font-bold">{p.name} ({p.relationship})</p>
                              <p className="text-[10px] text-slate-500">{p.primaryCondition}</p>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-sky-600" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setShowAddFamilyModal(true);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg text-left font-bold"
                      >
                        <UserPlus className="w-3.5 h-3.5" /> + Add Family Member
                      </button>

                      <Link
                        href="/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
                      >
                        <User className="w-3.5 h-3.5 text-sky-600" /> View {activeParentProfile.name}'s Profile
                      </Link>

                      {/* Sign Out Button */}
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          logoutCaregiverUser();
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-700 hover:bg-rose-50 rounded-lg text-left font-bold"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Header Sign Out Button */}
              <button
                onClick={logoutCaregiverUser}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-lg text-xs font-bold border border-slate-200 transition-all"
                title="Sign Out of CareLens"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Sign Out</span>
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* Add Family Member Modal */}
      <AddFamilyMemberModal
        isOpen={showAddFamilyModal}
        onClose={() => setShowAddFamilyModal(false)}
      />
    </>
  );
};

