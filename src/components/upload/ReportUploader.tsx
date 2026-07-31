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
  AlertCircle,
  FileCheck,
  Zap,
  ArrowRight,
  Shield,
  Clock,
  RefreshCw,
  Eye
} from 'lucide-react';
import { useMedical } from '@/context/MedicalContext';
import { MedicalReport } from '@/types/medical';

export const ReportUploader: React.FC = () => {
  const router = useRouter();
  const { addReport, reports } = useMedical();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const aiSteps = [
    { title: 'Scanning Document & OCR Layout', desc: 'Parsing doctor handwriting, timestamps, and header seals...' },
    { title: 'Extracting Medical Entities', desc: 'Structuring Diagnoses, Medicines, Dosages, and Lab Parameters...' },
    { title: 'Cross-Referencing Historical Reports', desc: `Comparing with ${reports.length} previous visits in LocalStorage...` },
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

    // Animate AI steps sequentially
    for (let i = 0; i < aiSteps.length; i++) {
      setCurrentStep(i);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    try {
      const response = await fetch('/api/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData: filePreview || null,
          fileName: selectedFile?.name || 'Medical_Report.pdf',
          sampleType: sampleType || 'prescription',
          existingHistory: reports,
        }),
      });

      const data = await response.json();
      if (data.success && data.report) {
        const newReport: MedicalReport = data.report;
        addReport(newReport);
        setIsProcessing(false);
        // Redirect to review page for verification
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> AI Medical Vision Extractor
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Upload Parent's Medical Report
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Upload a prescription, blood test lab report, or hospital discharge summary. CareLens AI extracts structured data, detects changes, and alerts you to doctor conflicts.
        </p>
      </div>

      {/* Main Upload Box & AI Processing Modal */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        <AnimatePresence mode="wait">
          {!isProcessing ? (
            <motion.div
              key="upload-zone"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {/* Drag and Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
                  dragActive
                    ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
                    : 'border-slate-700 bg-slate-950/50 hover:border-slate-600 hover:bg-slate-950/80'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-4 shadow-lg shadow-blue-600/20">
                  <Upload className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <p className="text-base font-bold text-white">
                    {selectedFile ? selectedFile.name : 'Drag & drop medical report here'}
                  </p>
                  <p className="text-xs text-slate-400">
                    Supports high-res photos, scanned PDFs, PNG, JPG (prescriptions, labs, discharge summaries)
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/30 transition-all flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" /> Browse Files
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('Simulating mobile camera scan...');
                      handleStartAnalysis('prescription');
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-all flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4 text-indigo-400" /> Snap Photo (Camera)
                  </button>
                </div>
              </div>

              {/* Action trigger if file selected */}
              {selectedFile && (
                <div className="flex items-center justify-between bg-blue-950/40 border border-blue-500/30 rounded-2xl p-4">
                  <div className="flex items-center space-x-3">
                    <FileCheck className="w-6 h-6 text-blue-400" />
                    <div>
                      <p className="text-sm font-semibold text-white">{selectedFile.name}</p>
                      <p className="text-xs text-slate-400">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for AI extraction
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartAnalysis()}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all"
                  >
                    <Sparkles className="w-4 h-4" /> Analyze with AI
                  </button>
                </div>
              )}

              {/* Instant Preset Sample Reports for Fast Demoing */}
              <div className="border-t border-slate-800 pt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Quick Demo Presets (Test AI Vision)
                  </span>
                  <span className="text-[10px] text-slate-500">1-Click Instant Analysis</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleStartAnalysis('prescription')}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white group-hover:text-blue-400">Cardiology Prescription</span>
                      <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/20 px-1.5 py-0.5 rounded">95% Conf</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Dr. Thorne • Metformin 1000mg dosage update</p>
                  </button>

                  <button
                    onClick={() => handleStartAnalysis('lab')}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/50 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white group-hover:text-amber-400">Metabolic Lab Panel</span>
                      <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded">96% Conf</span>
                    </div>
                    <p className="text-[11px] text-slate-400">HbA1c 7.9% & Creatinine 1.1 mg/dL lab test</p>
                  </button>

                  <button
                    onClick={() => handleStartAnalysis('low_confidence')}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-800/50 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white group-hover:text-rose-400">Handwritten / Low Conf</span>
                      <span className="text-[10px] font-semibold text-rose-400 bg-rose-500/20 px-1.5 py-0.5 rounded">74% Review</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Triggers manual review mode & NSAID warning</p>
                  </button>
                </div>
              </div>

            </motion.div>
          ) : (
            /* Framer Motion AI Processing State */
            <motion.div
              key="processing-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-10 space-y-8 text-center"
            >
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
                <div className="absolute inset-2 rounded-full border-4 border-indigo-500/20 border-b-indigo-400 animate-spin-reverse" />
                <div className="absolute inset-0 flex items-center justify-center text-blue-400">
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">CareLens AI Processing Pipeline</h3>
                <p className="text-xs text-slate-400">Analyzing document structure, extracting entities, and comparing medical history...</p>
              </div>

              {/* Progress Steps List */}
              <div className="max-w-md mx-auto space-y-3 text-left bg-slate-950/80 border border-slate-800 p-5 rounded-2xl">
                {aiSteps.map((step, idx) => {
                  const isDone = idx < currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div
                      key={idx}
                      className={`flex items-start space-x-3 transition-all ${
                        isCurrent
                          ? 'text-blue-400 opacity-100 font-semibold'
                          : isDone
                          ? 'text-emerald-400 opacity-90'
                          : 'text-slate-600 opacity-50'
                      }`}
                    >
                      <div className="mt-0.5">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : isCurrent ? (
                          <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-700" />
                        )}
                      </div>
                      <div className="text-xs">
                        <p className={isCurrent ? 'text-white font-bold' : isDone ? 'text-slate-300' : 'text-slate-500'}>
                          {step.title}
                        </p>
                        {isCurrent && <p className="text-[11px] text-blue-300/80 mt-0.5">{step.desc}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
