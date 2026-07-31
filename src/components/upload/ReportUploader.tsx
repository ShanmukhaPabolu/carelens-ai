'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  Camera,
  Sparkles,
  CheckCircle2,
  FileCheck,
  Zap,
  Cpu,
  Copy,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useMedical } from '@/context/MedicalContext';
import { MedicalReport } from '@/types/medical';

export const ReportUploader: React.FC = () => {
  const router = useRouter();
  const { addReport, updateReport, reports, activeParentProfile } = useMedical();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [lastAiMode, setLastAiMode] = useState<'gemini' | 'simulator' | null>(null);

  // Duplicate detection state
  const [duplicateMatch, setDuplicateMatch] = useState<{
    existingReport: MedicalReport;
    newReport: MedicalReport;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const aiSteps = [
    { title: 'Scanning Document & OCR Layout', desc: 'Parsing doctor handwriting, timestamps, and header seals...' },
    { title: 'Extracting Medical Entities', desc: 'Structuring Diagnoses, Medicines, Dosages, and Lab Parameters...' },
    { title: 'Cross-Referencing Historical Reports', desc: `Comparing with previous visits for ${activeParentProfile.name}...` },
    { title: 'Calculating Confidence & Conflict Detection', desc: 'Validating field confidence scores and multi-doctor interactions...' },
    { title: 'Synthesizing Caregiver Summary', desc: 'Generating plain-English change explanation and trend highlights...' },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFileSelection(e.target.files[0]);
    }
  };

  const processFileSelection = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleStartAnalysis = async (sampleType?: string) => {
    setIsProcessing(true);
    setCurrentStep(0);

    for (let i = 0; i < aiSteps.length; i++) {
      setCurrentStep(i);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    try {
      const parentReports = reports.filter((r) => r.parentId === activeParentProfile.id);
      const response = await fetch('/api/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData: filePreview || null,
          fileName: selectedFile?.name || 'Medical_Report.jpg',
          sampleType: sampleType || 'prescription',
          parentId: activeParentProfile.id,
          existingHistory: parentReports,
        }),
      });

      const data = await response.json();
      if (data.success && data.report) {
        const newReport: MedicalReport = data.report;
        setLastAiMode(data.aiMode);

        // Check for duplicate reports (Requirement 10: Duplicate Report Detection)
        const duplicate = parentReports.find(
          (r) =>
            r.doctorName.toLowerCase() === newReport.doctorName.toLowerCase() &&
            r.visitDate === newReport.visitDate
        );

        if (duplicate) {
          setIsProcessing(false);
          setDuplicateMatch({ existingReport: duplicate, newReport });
          return;
        }

        addReport(newReport);
        setIsProcessing(false);
        router.push(`/review/${newReport.id}`);
      } else {
        throw new Error(data.error || 'Failed to process report');
      }
    } catch (err) {
      console.error('Error analyzing report:', err);
      setIsProcessing(false);
      alert('Error analyzing report. Please try again.');
    }
  };

  const handleDuplicateAction = (action: 'replace' | 'keep' | 'cancel') => {
    if (!duplicateMatch) return;

    if (action === 'replace') {
      const updatedReport = {
        ...duplicateMatch.newReport,
        id: duplicateMatch.existingReport.id,
      };
      updateReport(updatedReport);
      setDuplicateMatch(null);
      router.push(`/review/${updatedReport.id}`);
    } else if (action === 'keep') {
      addReport(duplicateMatch.newReport);
      setDuplicateMatch(null);
      router.push(`/review/${duplicateMatch.newReport.id}`);
    } else {
      setDuplicateMatch(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header with explicit AI Mode status badge */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-700 border border-slate-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" /> AI Medical Vision Engine
          </span>

          {lastAiMode && (
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                lastAiMode === 'gemini'
                  ? 'bg-sky-100 text-sky-800 border-sky-300'
                  : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              {lastAiMode === 'gemini' ? 'Gemini 2.5 Flash API Active' : 'Fallback Simulator AI'}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Upload Report for {activeParentProfile.name}
        </h1>
        <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
          Upload prescriptions, lab reports, scans, discharge summaries, or consultation notes. AI automatically extracts parameters, detects duplicate records, and flags doctor conflicts.
        </p>
      </div>

      {/* DUPLICATE REPORT MODAL (Requirement 10) */}
      <AnimatePresence>
        {duplicateMatch && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 shadow-lg space-y-4"
          >
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                <Copy className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-amber-950">
                  Duplicate Report Detected
                </h3>
                <p className="text-xs text-amber-900 leading-relaxed font-semibold">
                  "This report appears to have already been uploaded."
                </p>
                <p className="text-[11px] text-amber-800">
                  Existing report recorded on <strong className="text-amber-950">{duplicateMatch.existingReport.visitDate}</strong> with{' '}
                  <strong className="text-amber-950">{duplicateMatch.existingReport.doctorName}</strong> ({duplicateMatch.existingReport.doctorSpecialty}).
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-amber-200">
              <button
                onClick={() => handleDuplicateAction('cancel')}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-all"
              >
                Cancel
              </button>

              <button
                onClick={() => handleDuplicateAction('keep')}
                className="px-4 py-2 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded-xl text-xs font-bold border border-amber-400 transition-all"
              >
                Keep Both
              </button>

              <button
                onClick={() => handleDuplicateAction('replace')}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
              >
                Replace Existing
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Upload Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!isProcessing ? (
            <motion.div
              key="upload-zone"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Drag and Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive
                    ? 'border-sky-500 bg-sky-50/50 scale-[1.01]'
                    : 'border-slate-300 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="w-14 h-14 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 mx-auto mb-3">
                  <Upload className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">
                    {selectedFile ? selectedFile.name : 'Drag & drop medical report here'}
                  </p>
                  <p className="text-xs text-slate-500">
                    Supports high-resolution photos, prescriptions, lab PDFs, imaging scans (PNG, JPG, PDF)
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" /> Browse Files
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      cameraInputRef.current?.click();
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 transition-all flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4 text-sky-700" /> Device Camera Scan
                  </button>
                </div>
              </div>

              {selectedFile && (
                <div className="flex items-center justify-between bg-sky-50 border border-sky-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <FileCheck className="w-6 h-6 text-sky-700" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{selectedFile.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for AI categorization
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartAnalysis()}
                    className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-2 transition-all"
                  >
                    <Sparkles className="w-4 h-4" /> Extract & Categorize
                  </button>
                </div>
              )}

              {/* Demo Preset Scans */}
              <div className="border-t border-slate-200 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-600" /> Instant Demo Scans
                  </span>
                  <span className="text-[10px] text-slate-400">1-Click Automated Processing</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleStartAnalysis('prescription')}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-sky-500 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-sky-700">Prescription Scan</span>
                      <span className="text-[10px] font-semibold text-sky-800 bg-sky-100 px-1.5 py-0.5 rounded">95% Conf</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Dr. Thorne • Metformin 1000mg dosage change</p>
                  </button>

                  <button
                    onClick={() => handleStartAnalysis('lab')}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-amber-700">Lab Panel Scan</span>
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">96% Conf</span>
                    </div>
                    <p className="text-[11px] text-slate-500">HbA1c 7.9% & Creatinine 1.1 mg/dL</p>
                  </button>

                  <button
                    onClick={() => handleStartAnalysis('low_confidence')}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-rose-400 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-rose-700">Handwritten / Low Conf</span>
                      <span className="text-[10px] font-semibold text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded">74% Review</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Triggers manual review mode & NSAID warning</p>
                  </button>
                </div>
              </div>

            </motion.div>
          ) : (
            <motion.div
              key="processing-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 space-y-6 text-center"
            >
              <div className="w-12 h-12 rounded-full border-3 border-sky-600 border-t-transparent animate-spin mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Processing Medical Report</h3>
                <p className="text-xs text-slate-500">Extracting clinical parameters and cross-referencing parent history...</p>
              </div>

              <div className="max-w-md mx-auto space-y-2.5 text-left bg-slate-50 border border-slate-200 p-4 rounded-xl">
                {aiSteps.map((step, idx) => {
                  const isDone = idx < currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div key={idx} className="flex items-center space-x-3 text-xs">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                      ) : isCurrent ? (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-sky-600 border-t-transparent animate-spin shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                      )}
                      <span className={isCurrent ? 'font-bold text-sky-800' : isDone ? 'text-slate-700' : 'text-slate-400'}>
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RESPONSIBLE AI DISCLOSURE NOTICE */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1 text-xs text-slate-600">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <Info className="w-4 h-4 text-sky-600" /> Responsible AI Disclaimers & Limitations
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          CareLens AI parses handwriting and digital scans but requires human verification for low-confidence outputs (&lt;80%). AI predictions do not constitute medical advice or replace professional healthcare consultation.
        </p>
      </div>

    </div>
  );
};

