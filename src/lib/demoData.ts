import { ParentProfile, MedicalReport, FollowUpItem, ParentHealthStatusCard, MissingHealthRecordAlert } from '../types/medical';

export const INITIAL_PARENT_PROFILES: ParentProfile[] = [];


export const MOTHER_REPORTS: MedicalReport[] = [];
export const FATHER_REPORTS: MedicalReport[] = [];
export const INITIAL_REPORTS: MedicalReport[] = [];
export const INITIAL_FOLLOWUPS: FollowUpItem[] = [];

export function generateAIHealthStory(parentProfile: ParentProfile, reports: MedicalReport[]): string {
  if (!reports || reports.length === 0) {
    return 'Upload your first medical report to generate an AI Health Summary.';
  }

  const sorted = [...reports].sort(
    (a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime()
  );

  const firstVisit = sorted[0];
  const latestVisit = sorted[sorted.length - 1];

  const diagnosesSet = new Set<string>();
  sorted.forEach((r) => r.diagnoses.forEach((d) => diagnosesSet.add(d)));
  const allDiagnoses = Array.from(diagnosesSet);

  let story = `${parentProfile.name}'s medical journey comprises ${reports.length} uploaded visit record${reports.length > 1 ? 's' : ''} spanning from ${firstVisit.visitDate} to ${latestVisit.visitDate}. `;

  if (allDiagnoses.length > 0) {
    story += `Extracted diagnoses include ${allDiagnoses.join(', ')}. `;
  } else {
    story += `Active clinical evaluation is under ongoing observation with ${latestVisit.doctorName} (${latestVisit.doctorSpecialty}) at ${latestVisit.hospital}. `;
  }

  if (latestVisit.medicines.length > 0) {
    const medNames = latestVisit.medicines.map((m) => `${m.name} (${m.dosage})`).join(', ');
    story += `Current active prescription includes ${medNames}. `;
  }

  if (latestVisit.followUpDate) {
    story += `Next scheduled medical follow-up is set for ${latestVisit.followUpDate}.`;
  } else {
    story += `No immediate follow-up date noted on recent documentation.`;
  }

  return story;
}

export function getMissingRecordsForParent(
  parentProfile: ParentProfile,
  reports: MedicalReport[]
): MissingHealthRecordAlert[] {
  if (!reports || reports.length === 0) {
    return [
      {
        id: 'missing-initial',
        title: 'Initial Medical Upload Required',
        category: 'general',
        recommendation: `Upload ${parentProfile.name}'s recent prescription, lab test, or discharge summary to establish their baseline health record.`,
        reason: 'No medical documents uploaded yet. This is only a reminder, never medical advice.',
      },
    ];
  }

  const hasLab = reports.some((r) => r.reportType === 'lab');
  const alerts: MissingHealthRecordAlert[] = [];

  if (!hasLab) {
    alerts.push({
      id: 'missing-lab',
      title: 'Routine Metabolic & Blood Panel',
      category: 'lab',
      recommendation: `No recent lab test report found. Consider uploading annual blood test records for ${parentProfile.name}.`,
      reason: 'Biomarker tracking requires periodic lab report uploads. This is only a reminder, never medical advice.',
    });
  }

  return alerts;
}

export function getParentHealthStatusCards(
  parentProfile: ParentProfile,
  reports: MedicalReport[]
): ParentHealthStatusCard[] {
  if (!reports || reports.length === 0) {
    return [
      {
        id: 'card-empty',
        type: 'verification_required',
        color: 'yellow',
        icon: 'AlertTriangle',
        title: `${parentProfile.name}: Ready for First Upload`,
        subtitle: `No medical records uploaded yet. Click Upload Report to let Gemini AI analyze prescriptions or lab tests.`,
      },
    ];
  }

  const latest = reports[0];
  const needsReviewCount = reports.filter((r) => r.needsReview).length;
  const conflictCount = reports.reduce((acc, r) => acc + (r.doctorConflicts?.length || 0), 0);

  if (conflictCount > 0) {
    return [
      {
        id: 'card-conflict',
        type: 'verification_required',
        color: 'red',
        icon: 'AlertTriangle',
        title: `${parentProfile.name}: Multi-Doctor Alert Flagged`,
        subtitle: `${conflictCount} prescribing conflict detected across visits. Please verify with doctor.`,
      },
    ];
  }

  if (needsReviewCount > 0) {
    return [
      {
        id: 'card-review',
        type: 'verification_required',
        color: 'yellow',
        icon: 'AlertTriangle',
        title: `${parentProfile.name}: Human Verification Active`,
        subtitle: `${needsReviewCount} report has field confidence below 80%. Inspect document photo before saving.`,
      },
    ];
  }

  return [
    {
      id: 'card-stable',
      type: 'improving',
      color: 'green',
      icon: 'TrendingUp',
      title: `${parentProfile.name}: Medical Record Active`,
      subtitle: `${reports.length} report(s) extracted via Gemini AI. Latest visit with ${latest.doctorName} (${latest.visitDate}).`,
    },
  ];
}
