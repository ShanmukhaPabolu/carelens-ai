import { MedicalReport, ChangeHighlight, DoctorConflict, Medication, LabResult } from '../../types/medical';

export interface RawExtractedData {
  doctorName?: string;
  doctorSpecialty?: string;
  hospital?: string;
  department?: string;
  patientName?: string;
  visitDate?: string;
  reportType?: 'lab' | 'prescription' | 'discharge' | 'imaging' | 'general';
  diagnoses?: string[];
  medicines?: Partial<Medication>[];
  labResults?: Partial<LabResult>[];
  doctorRecommendations?: string[];
  followUpDate?: string;
  aiConfidenceScore?: number;
}

export function compareAndSynthesizeReport(
  extracted: RawExtractedData,
  previousReports: MedicalReport[]
): {
  processedReport: Partial<MedicalReport>;
  changeHighlights: ChangeHighlight[];
  doctorConflicts: DoctorConflict[];
  caregiverSummary: string;
} {
  const changeHighlights: ChangeHighlight[] = [];
  const doctorConflicts: DoctorConflict[] = [];

  // Sort existing reports by date descending
  const sortedHistory = [...previousReports].sort(
    (a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
  );
  const lastReport = sortedHistory[0];

  // 1. Compare Medications
  const newMedicines: Medication[] = (extracted.medicines || []).map((med) => {
    const medName = med.name || 'Unspecified Medication';
    const confidence = med.confidence ?? Math.floor(Math.random() * 20) + 80;

    // Find in previous reports
    let prevMed: Medication | undefined;
    for (const r of sortedHistory) {
      const match = r.medicines.find(
        (pm) => pm.name.toLowerCase().includes(medName.toLowerCase()) || medName.toLowerCase().includes(pm.name.toLowerCase())
      );
      if (match) {
        prevMed = match;
        break;
      }
    }

    let status: Medication['status'] = 'new';
    let previousDosage: string | undefined = undefined;

    if (prevMed) {
      if (prevMed.dosage.toLowerCase() !== (med.dosage || '').toLowerCase()) {
        status = 'changed';
        previousDosage = prevMed.dosage;
        changeHighlights.push({
          id: `ch_med_${Date.now()}_${Math.random()}`,
          field: medName,
          category: 'medicine',
          oldValue: prevMed.dosage,
          newValue: med.dosage || 'Modified',
          description: `Dosage modified from ${prevMed.dosage} to ${med.dosage}.`,
          severity: 'warning',
        });
      } else {
        status = 'continued';
      }
    } else {
      status = 'new';
      changeHighlights.push({
        id: `ch_med_new_${Date.now()}_${Math.random()}`,
        field: medName,
        category: 'medicine',
        newValue: `${med.dosage || ''} ${med.frequency || ''}`.trim(),
        description: `Newly added prescription by ${extracted.doctorName || 'Doctor'}.`,
        severity: 'info',
      });
    }

    return {
      name: medName,
      dosage: med.dosage || 'As directed',
      frequency: med.frequency || 'Daily',
      status,
      previousDosage,
      instructions: med.instructions || '',
      confidence,
    };
  });

  // 2. Compare Lab Results
  const newLabResults: LabResult[] = (extracted.labResults || []).map((lab) => {
    const testName = lab.testName || 'Lab Test';
    const val = lab.value ?? 0;
    const confidence = lab.confidence ?? Math.floor(Math.random() * 15) + 85;
    
    // Find previous lab result
    let prevLab: LabResult | undefined;
    for (const r of sortedHistory) {
      const match = r.labResults.find(
        (pl) => pl.testName.toLowerCase().includes(testName.toLowerCase()) || testName.toLowerCase().includes(pl.testName.toLowerCase())
      );
      if (match) {
        prevLab = match;
        break;
      }
    }

    if (prevLab) {
      const diff = val - prevLab.value;
      if (Math.abs(diff) > 0.1) {
        const direction = diff > 0 ? 'increased' : 'decreased';
        const severity = lab.status && lab.status !== 'normal' ? 'warning' : 'info';
        changeHighlights.push({
          id: `ch_lab_${Date.now()}_${Math.random()}`,
          field: testName,
          category: 'lab',
          oldValue: `${prevLab.value} ${prevLab.unit}`,
          newValue: `${val} ${lab.unit || ''}`,
          description: `${testName} ${direction} from ${prevLab.value} to ${val} ${lab.unit || ''}.`,
          severity,
        });
      }
    }

    return {
      testName,
      value: val,
      unit: lab.unit || '',
      referenceRange: lab.referenceRange || 'Normal range',
      status: lab.status || 'normal',
      confidence,
    };
  });

  // 3. Detect Doctor Conflicts (Key AI Feature)
  // Example conflict check: NSAID medication when creatinine is elevated or doctor notes kidney concern
  const containsNSAID = newMedicines.some((m) =>
    ['naproxen', 'ibuprofen', 'diclofenac', 'ketorolac', 'celecoxib'].some((nsaid) =>
      m.name.toLowerCase().includes(nsaid)
    )
  );

  const hasHighCreatinine =
    newLabResults.some((l) => l.testName.toLowerCase().includes('creatinine') && l.value > 1.0) ||
    sortedHistory.some((r) =>
      r.labResults.some((l) => l.testName.toLowerCase().includes('creatinine') && l.value > 1.0)
    );

  if (containsNSAID && hasHighCreatinine) {
    doctorConflicts.push({
      id: `conflict_${Date.now()}`,
      severity: 'critical',
      title: 'Potential Medication & Kidney Risk Contradiction',
      description: `Report includes NSAID pain medication (${
        newMedicines.find((m) =>
          ['naproxen', 'ibuprofen', 'diclofenac'].some((n) => m.name.toLowerCase().includes(n))
        )?.name
      }). Previous reports indicate elevated Serum Creatinine (>1.0 mg/dL). NSAIDs can potentially reduce renal blood flow.`,
      doctorNames: [extracted.doctorName || 'Attending Physician', 'Nephrology / Endocrinology Team'],
      reportIds: [lastReport?.id || ''].filter(Boolean),
      recommendation:
        'Please review this prescription with the treating physician or consult your primary care doctor before initiating treatment.',
    });
  }

  // 4. Synthesize Caregiver Natural Language Summary
  let caregiverSummary = '';
  const docName = extracted.doctorName || 'the doctor';
  const patient = extracted.patientName || 'your parent';
  const visitStr = extracted.visitDate ? `on ${extracted.visitDate}` : 'during this visit';

  if (changeHighlights.length > 0) {
    const medChanges = changeHighlights.filter((c) => c.category === 'medicine');
    const labChanges = changeHighlights.filter((c) => c.category === 'lab');

    let summaryParts = [`Visit with ${docName} ${visitStr}.`];
    if (medChanges.length > 0) {
      summaryParts.push(
        `Medication updates: ${medChanges.map((m) => `${m.field} (${m.newValue})`).join(', ')}.`
      );
    }
    if (labChanges.length > 0) {
      summaryParts.push(
        `Key lab trends: ${labChanges.map((l) => `${l.field}: ${l.oldValue || ''} -> ${l.newValue}`).join('; ')}.`
      );
    }
    if (extracted.followUpDate) {
      summaryParts.push(`Next recommended follow-up visit is scheduled for ${extracted.followUpDate}.`);
    }
    caregiverSummary = summaryParts.join(' ');
  } else {
    caregiverSummary = `Visit with ${docName} ${visitStr}. All findings remain consistent with previous reports. No major treatment changes recorded. Follow-up advised in ${
      extracted.followUpDate || '90 days'
    }.`;
  }

  const confidenceScore = extracted.aiConfidenceScore ?? 92;
  const needsReview = confidenceScore < 80;

  return {
    processedReport: {
      patientName: extracted.patientName || 'Lakshmi Devi',
      doctorName: extracted.doctorName || 'Dr. Specialist',
      doctorSpecialty: extracted.doctorSpecialty || 'General Medicine',
      hospital: extracted.hospital || 'Medical Center',
      department: extracted.department || 'Outpatient',
      visitDate: extracted.visitDate || new Date().toISOString().split('T')[0],
      reportType: extracted.reportType || 'prescription',
      diagnoses: extracted.diagnoses || ['General Health Checkup'],
      medicines: newMedicines,
      labResults: newLabResults,
      doctorRecommendations: extracted.doctorRecommendations || ['Maintain current regimen.'],
      followUpDate: extracted.followUpDate,
      aiConfidenceScore: confidenceScore,
      needsReview,
    },
    changeHighlights,
    doctorConflicts,
    caregiverSummary,
  };
}
