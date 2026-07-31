'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Save,
  Trash2,
  Stethoscope,
  Pill,
  Activity,
  FileCheck,
  Plus,
  X,
  Cpu,
  ZoomIn
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
  const [imageExpanded, setImageExpanded] = useState(false);

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 85) {
      return (
        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> {confidence}% Confidence
        </span>
      );
    }
    return (
      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> {confidence}% Needs Review
      </span>
    );
  };

  const handleSave = () => {
    const updated = {
      ...report,
      needsReview: false,
    };
    updateReport(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      router.push('/timeline');
    }, 1000);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to discard this report?')) {
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
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      
      {/* Top Warning Banner if Needs Review */}
      {report.needsReview && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-amber-900 shadow-xs">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">Extraction Flagged: "Needs Review"</p>
              <p className="text-[11px] text-amber-700">
                Overall AI confidence ({report.aiConfidenceScore}%) is below 80%. Please inspect the original document photo beside the extracted fields before approving.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 bg-amber-200 text-amber-900 border border-amber-300 rounded-lg">
            Manual Review Active
          </span>
        </div>
      )}

      {/* Doctor Conflicts Alert */}
      {report.doctorConflicts && report.doctorConflicts.length > 0 && (
        <DoctorConflictAlert conflicts={report.doctorConflicts} />
      )}

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900">AI Medical Extraction Review</h1>
            {getConfidenceBadge(report.aiConfidenceScore)}

            {/* AI Engine Indicator Badge */}
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-sky-600" />
              {report.aiMode === 'gemini' ? 'Gemini 2.5 Flash' : 'Simulator AI'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Visit Date: <strong className="text-slate-800">{report.visitDate}</strong> • Doctor:{' '}
            <strong className="text-slate-800">{report.doctorName}</strong> ({report.doctorSpecialty})
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDelete}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Discard Report
          </button>

          <button
            onClick={handleSave}
            disabled={savedSuccess}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" /> Approved & Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Approve & Update Timeline
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ORIGINAL DOCUMENT VIEWER - 5 Cols */}
        <div className="lg:col-span-5 space-y-3 sticky top-20">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-sky-600" /> Original Source Document
              </h2>
              <button
                onClick={() => setImageExpanded(!imageExpanded)}
                className="text-[11px] font-semibold text-sky-700 hover:underline flex items-center gap-1"
              >
                <ZoomIn className="w-3.5 h-3.5" /> {imageExpanded ? 'Normal View' : 'Zoom In'}
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden relative group max-h-[650px] overflow-y-auto flex items-center justify-center p-2">
              {report.fileUrl ? (
                <img
                  src={report.fileUrl}
                  alt="Original Medical Report Document"
                  className={`w-full h-auto object-contain rounded-lg transition-transform duration-200 ${
                    imageExpanded ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                  onClick={() => setImageExpanded(!imageExpanded)}
                />
              ) : (
                <div className="py-20 text-center text-slate-400 text-xs">
                  No source image preview available.
                </div>
              )}
            </div>
            <p className="text-[10px] text-slate-500 text-center">
              Inspect original doctor handwriting & lab printout directly against extracted fields.
            </p>
          </div>
        </div>

        {/* EDITABLE EXTRACTED FIELDS - 7 Cols */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Metadata Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Stethoscope className="w-4 h-4 text-sky-600" /> Doctor & Visit Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Patient Name</label>
                <input
                  type="text"
                  value={report.patientName}
                  onChange={(e) => setReport({ ...report, patientName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Doctor Name</label>
                <input
                  type="text"
                  value={report.doctorName}
                  onChange={(e) => setReport({ ...report, doctorName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Specialty</label>
                <input
                  type="text"
                  value={report.doctorSpecialty}
                  onChange={(e) => setReport({ ...report, doctorSpecialty: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Hospital / Clinic</label>
                <input
                  type="text"
                  value={report.hospital}
                  onChange={(e) => setReport({ ...report, hospital: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Visit Date</label>
                <input
                  type="date"
                  value={report.visitDate}
                  onChange={(e) => setReport({ ...report, visitDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Follow-up Date</label>
                <input
                  type="date"
                  value={report.followUpDate || ''}
                  onChange={(e) => setReport({ ...report, followUpDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Medicines Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Pill className="w-4 h-4 text-sky-600" /> Prescribed Medications
              </h2>
              <button
                onClick={addMedication}
                className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200"
              >
                <Plus className="w-3.5 h-3.5" /> Add Drug
              </button>
            </div>

            {report.medicines.map((med, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3 relative"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-800">Drug #{idx + 1}</span>
                  <div className="flex items-center space-x-2">
                    {getConfidenceBadge(med.confidence)}
                    <button
                      onClick={() => removeMedication(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Remove Medication"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 mb-0.5 block">Drug Name</label>
                    <input
                      type="text"
                      value={med.name}
                      onChange={(e) => updateMedication(idx, { name: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 mb-0.5 block">Dosage</label>
                    <input
                      type="text"
                      value={med.dosage}
                      onChange={(e) => updateMedication(idx, { dosage: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 mb-0.5 block">Frequency</label>
                    <input
                      type="text"
                      value={med.frequency}
                      onChange={(e) => updateMedication(idx, { frequency: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Lab Results Card */}
          {report.labResults.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                <Activity className="w-4 h-4 text-sky-600" /> Extracted Lab Parameters
              </h2>

              <div className="space-y-3">
                {report.labResults.map((lab, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{lab.testName}</span>
                      {getConfidenceBadge(lab.confidence)}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-500 block mb-0.5">Value</label>
                        <input
                          type="number"
                          step="0.1"
                          value={lab.value}
                          onChange={(e) => updateLabResult(idx, { value: parseFloat(e.target.value) })}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 block mb-0.5">Unit</label>
                        <input
                          type="text"
                          value={lab.unit}
                          onChange={(e) => updateLabResult(idx, { unit: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 block mb-0.5">Ref Range</label>
                        <input
                          type="text"
                          value={lab.referenceRange}
                          onChange={(e) => updateLabResult(idx, { referenceRange: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Caregiver Summary Textarea */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600" /> AI Caregiver Summary
            </h2>
            <textarea
              rows={4}
              value={report.caregiverSummary}
              onChange={(e) => setReport({ ...report, caregiverSummary: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 leading-relaxed focus:border-sky-600 focus:outline-none"
            />
          </div>

        </div>

      </div>
    </div>
  );
};
