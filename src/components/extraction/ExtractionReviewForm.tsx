'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Save,
  Trash2,
  RefreshCw,
  Edit3,
  Calendar,
  User,
  Stethoscope,
  Building,
  Pill,
  Activity,
  FileCheck,
  Plus,
  X,
  ShieldAlert
} from 'lucide-react';
import { MedicalReport, Medication, LabResult } from '@/types/medical';
import { useMedical } from '@/context/MedicalContext';
import { DoctorConflictAlert } from '../dashboard/DoctorConflictAlert';

interface Props {
  report: MedicalReport;
}

export const ExtractionReviewForm: React.FC<Props> = ({ report: initialReport }) => {
  const router = useRouter();
  const { updateReport, deleteReport } = useMedical();

  const [report, setReport] = useState<MedicalReport>(initialReport);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Confidence Helper Pill
  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 85) {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> {confidence}% Confidence
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 animate-pulse">
        <AlertTriangle className="w-3 h-3 text-amber-400" /> {confidence}% Needs Review
      </span>
    );
  };

  const handleSave = () => {
    // If overall confidence is manually approved, set needsReview to false
    const updated = {
      ...report,
      needsReview: false,
    };
    updateReport(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      router.push('/timeline');
    }, 1200);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this report?')) {
      deleteReport(report.id);
      router.push('/timeline');
    }
  };

  const updateMedication = (index: number, updatedMed: Partial<Medication>) => {
    const meds = [...report.medicines];
    meds[index] = { ...meds[index], ...updatedMed };
    setReport({ ...report, medicines: meds });
  };

  const addMedication = () => {
    const newMed: Medication = {
      name: 'New Medication',
      dosage: '500 mg',
      frequency: 'Once daily',
      status: 'new',
      confidence: 100,
    };
    setReport({ ...report, medicines: [...report.medicines, newMed] });
  };

  const removeMedication = (index: number) => {
    const meds = report.medicines.filter((_, i) => i !== index);
    setReport({ ...report, medicines: meds });
  };

  const updateLabResult = (index: number, updatedLab: Partial<LabResult>) => {
    const labs = [...report.labResults];
    labs[index] = { ...labs[index], ...updatedLab };
    setReport({ ...report, labResults: labs });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      
      {/* Top Banner Alert if Needs Review */}
      {report.needsReview && (
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-amber-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <p className="text-sm font-bold">AI Extraction Marked as "Needs Review"</p>
              <p className="text-xs text-amber-300/80">
                Overall AI confidence score ({report.aiConfidenceScore}%) is below 80% due to handwriting or low-contrast document scan. Please verify inputs before saving to timeline.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg">
            Manual Verification Active
          </span>
        </div>
      )}

      {/* Doctor Conflicts Alert (If Detected) */}
      {report.doctorConflicts && report.doctorConflicts.length > 0 && (
        <DoctorConflictAlert conflicts={report.doctorConflicts} />
      )}

      {/* Header Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">AI Medical Extraction Review</h1>
            {getConfidenceBadge(report.aiConfidenceScore)}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Visit Date: <strong className="text-slate-200">{report.visitDate}</strong> • Doctor:{' '}
            <strong className="text-slate-200">{report.doctorName}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDelete}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Discard Report
          </button>

          <button
            onClick={handleSave}
            disabled={savedSuccess}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Approved & Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Approve & Update Timeline
              </>
            )}
          </button>
        </div>
      </div>

      {/* Form Fields & Side Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Editable Form Fields (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Metadata Card (Doctor, Hospital, Patient) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Stethoscope className="w-4 h-4 text-blue-400" /> Visit & Provider Metadata
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Patient Name</label>
                <input
                  type="text"
                  value={report.patientName}
                  onChange={(e) => setReport({ ...report, patientName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Doctor Name</label>
                <input
                  type="text"
                  value={report.doctorName}
                  onChange={(e) => setReport({ ...report, doctorName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Specialty</label>
                <input
                  type="text"
                  value={report.doctorSpecialty}
                  onChange={(e) => setReport({ ...report, doctorSpecialty: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Hospital / Clinic</label>
                <input
                  type="text"
                  value={report.hospital}
                  onChange={(e) => setReport({ ...report, hospital: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Visit Date</label>
                <input
                  type="date"
                  value={report.visitDate}
                  onChange={(e) => setReport({ ...report, visitDate: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Follow-up Date</label>
                <input
                  type="date"
                  value={report.followUpDate || ''}
                  onChange={(e) => setReport({ ...report, followUpDate: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Medicines Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Pill className="w-4 h-4 text-indigo-400" /> Prescribed Medications
              </h2>
              <button
                onClick={addMedication}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20"
              >
                <Plus className="w-3.5 h-3.5" /> Add Medicine
              </button>
            </div>

            {report.medicines.map((med, idx) => (
              <div
                key={idx}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-3 relative group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-300">Medication #{idx + 1}</span>
                  <div className="flex items-center space-x-2">
                    {getConfidenceBadge(med.confidence)}
                    <button
                      onClick={() => removeMedication(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Remove Medication"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 mb-0.5 block">Drug Name</label>
                    <input
                      type="text"
                      value={med.name}
                      onChange={(e) => updateMedication(idx, { name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 mb-0.5 block">Dosage</label>
                    <input
                      type="text"
                      value={med.dosage}
                      onChange={(e) => updateMedication(idx, { dosage: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 mb-0.5 block">Frequency</label>
                    <input
                      type="text"
                      value={med.frequency}
                      onChange={(e) => updateMedication(idx, { frequency: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Lab Results Card (If present) */}
          {report.labResults.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Activity className="w-4 h-4 text-emerald-400" /> Extracted Lab Test Parameters
              </h2>

              <div className="space-y-3">
                {report.labResults.map((lab, idx) => (
                  <div key={idx} className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{lab.testName}</span>
                      {getConfidenceBadge(lab.confidence)}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-0.5">Value</label>
                        <input
                          type="number"
                          step="0.1"
                          value={lab.value}
                          onChange={(e) => updateLabResult(idx, { value: parseFloat(e.target.value) })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-0.5">Unit</label>
                        <input
                          type="text"
                          value={lab.unit}
                          onChange={(e) => updateLabResult(idx, { unit: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-0.5">Ref Range</label>
                        <input
                          type="text"
                          value={lab.referenceRange}
                          onChange={(e) => updateLabResult(idx, { referenceRange: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: AI Caregiver Summary & Document View (1 Col) */}
        <div className="space-y-6">
          
          {/* AI Caregiver Summary Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" /> AI Caregiver Summary
            </h2>
            <textarea
              rows={5}
              value={report.caregiverSummary}
              onChange={(e) => setReport({ ...report, caregiverSummary: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 leading-relaxed focus:border-blue-500 focus:outline-none"
            />
            <p className="text-[10px] text-slate-500">
              * Editable plain-English summary that will be stored in your parent's continuous health timeline.
            </p>
          </div>

          {/* Document Attachment Preview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-indigo-400" /> Source Medical Document
            </h2>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">
              <FileCheck className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-300">{report.fileName || 'Uploaded_Medical_Scan.pdf'}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">High Resolution Scan Attached</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
