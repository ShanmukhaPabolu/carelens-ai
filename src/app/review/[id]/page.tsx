'use client';

import React, { use } from 'react';
import { notFound } from 'next/navigation';
import { useMedical } from '@/context/MedicalContext';
import { ExtractionReviewForm } from '@/components/extraction/ExtractionReviewForm';

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getReportById } = useMedical();

  const report = getReportById(id);

  if (!report) {
    return (
      <div className="max-w-md mx-auto text-center py-20 text-slate-400 space-y-4">
        <h2 className="text-xl font-bold text-white">Report Not Found</h2>
        <p className="text-xs text-slate-500">The requested medical report does not exist or was deleted.</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <ExtractionReviewForm report={report} />
    </div>
  );
}
