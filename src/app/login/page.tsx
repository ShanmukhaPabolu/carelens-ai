'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, User, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useMedical } from '@/context/MedicalContext';
import { CaregiverUser } from '@/types/medical';

export default function LoginPage() {
  const router = useRouter();
  const { setCaregiverUser, caregiverUser } = useMedical();

  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [fullName, setFullName] = useState(caregiverUser?.fullName || '');
  const [email, setEmail] = useState(caregiverUser?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailClean = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailClean || !emailRegex.test(emailClean)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // Get registered users list from localStorage
    const rawUsers = typeof window !== 'undefined' ? localStorage.getItem('carelens_registered_users') : null;
    const registeredUsers: CaregiverUser[] = rawUsers ? JSON.parse(rawUsers) : [];

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }

      // Check if email already registered
      const existing = registeredUsers.find((u) => u.email.toLowerCase() === emailClean);
      if (existing) {
        setError('An account with this email already exists. Please Sign In instead.');
        return;
      }

      const newUser: CaregiverUser = {
        fullName: fullName.trim(),
        email: emailClean,
        password,
        createdAt: new Date().toISOString(),
      };

      // Save to registered users list
      registeredUsers.push(newUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('carelens_registered_users', JSON.stringify(registeredUsers));
      }

      setCaregiverUser(newUser);
      router.push('/dashboard');
    } else {
      // SIGN IN MODE
      const match = registeredUsers.find((u) => u.email.toLowerCase() === emailClean);
      
      if (match) {
        if (match.password && match.password !== password) {
          setError('Incorrect password. Please check your credentials.');
          return;
        }
        setCaregiverUser(match);
      } else {
        // First time sign-in demo fallback
        const demoUser: CaregiverUser = {
          fullName: fullName.trim() || 'Caregiver User',
          email: emailClean,
          password,
          createdAt: new Date().toISOString(),
        };
        setCaregiverUser(demoUser);
      }

      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xs space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold mx-auto shadow-xs">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Caregiver Portal</h1>
            <p className="text-xs text-slate-500 mt-1">Manage parent medical history and change timelines</p>
          </div>
        </div>

        {/* Mode Switcher Tabs (Sign Up vs Sign In) */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-white text-sky-700 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white text-sky-700 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Full Name Field (Sign Up Only) */}
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rohan Devi"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-600 font-medium"
                />
              </div>
            </div>
          )}

          {/* Email Address Field */}
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rohan@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-600 font-medium"
              />
            </div>
          </div>

          {/* Password Field with Show/Hide Toggle */}
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-600 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {mode === 'signup' && (
              <p className="text-[10px] text-slate-400 mt-1">Minimum 6 characters</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <span>{mode === 'signup' ? 'Create Caregiver Account' : 'Sign In to Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
          <span>Local Storage prototype • Secure password validation</span>
        </div>

      </div>
    </div>
  );
}
