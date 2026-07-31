'use client';

import React from 'react';
import { TrendingUp, Calendar, AlertTriangle, Stethoscope, Pill, CheckCircle2 } from 'lucide-react';
import { ParentProfile, MedicalReport } from '@/types/medical';
import { getParentHealthStatusCards } from '@/lib/demoData';

import { useMedical } from '@/context/MedicalContext';

interface Props {
  parentProfile?: ParentProfile;
  reports?: MedicalReport[];
}

export const ParentHealthStatusGrid: React.FC<Props> = ({ parentProfile: propProfile, reports: propReports }) => {
  const { activeParentProfile, reports: contextReports } = useMedical();

  const parentProfile = propProfile || activeParentProfile;
  const reports = propReports || contextReports;

  const statusCards = getParentHealthStatusCards(parentProfile, reports);


  const getCardIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      case 'Calendar':
        return <Calendar className="w-5 h-5 text-amber-600" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      case 'Stethoscope':
        return <Stethoscope className="w-5 h-5 text-sky-600" />;
      case 'Pill':
        return <Pill className="w-5 h-5 text-emerald-600" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-sky-600" />;
    }
  };

  const getCardBg = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-emerald-50/70 border-emerald-200 text-emerald-950';
      case 'yellow':
        return 'bg-amber-50/70 border-amber-200 text-amber-950';
      case 'red':
        return 'bg-rose-50/70 border-rose-200 text-rose-950';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-900';
    }
  };

  const getIndicatorBadge = (color: string) => {
    switch (color) {
      case 'green':
        return <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 shrink-0" />;
      case 'yellow':
        return <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-100 shrink-0" />;
      case 'red':
        return <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-rose-100 shrink-0" />;
      default:
        return <span className="w-2.5 h-2.5 rounded-full bg-sky-500 ring-4 ring-sky-100 shrink-0" />;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            Family Status Overview
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            How is <strong className="text-slate-800">{parentProfile.name}</strong> doing today?
          </p>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
          Live AI Status
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {statusCards.map((card) => (
          <div
            key={card.id}
            className={`p-4 rounded-xl border ${getCardBg(card.color)} flex items-start space-x-3 transition-all shadow-2xs hover:shadow-xs`}
          >
            <div className="p-2 rounded-lg bg-white border border-slate-200/80 shrink-0 shadow-2xs">
              {getCardIcon(card.icon)}
            </div>
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {getIndicatorBadge(card.color)}
                <h3 className="text-xs font-bold truncate">{card.title}</h3>
              </div>
              <p className="text-[11px] opacity-80 leading-relaxed line-clamp-2">
                {card.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
