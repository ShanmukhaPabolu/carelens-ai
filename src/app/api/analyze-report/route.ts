import { NextRequest, NextResponse } from 'next/server';
import { compareAndSynthesizeReport, RawExtractedData } from '@/lib/ai/geminiExtractor';
import { MedicalReport } from '@/types/medical';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileData, fileName, sampleType, parentId = 'parent_mother', existingHistory = [] } = body;

    let extractedData: RawExtractedData;
    let aiMode: 'gemini' | 'simulator' = 'simulator';

    const apiKey = process.env.GEMINI_API_KEY;
    const isValidKey = apiKey && apiKey.trim() !== '' && !apiKey.includes('your_gemini_api_key_here');

    if (isValidKey && fileData) {
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey });
        
        const base64Content = fileData.replace(/^data:[^;]+;base64,/, '');
        const mimeType = fileData.substring(fileData.indexOf(':') + 1, fileData.indexOf(';')) || 'image/jpeg';

        const prompt = `You are CareLens AI, an expert medical document parser. Analyze this medical report (prescription, lab report, scan, discharge summary, or consultation) and extract structured JSON matching this exact schema:
{
  "doctorName": "Doctor name with title",
  "doctorSpecialty": "Specialty e.g. Cardiology, Endocrinology, Orthopedics",
  "hospital": "Hospital or clinic name",
  "department": "Department",
  "patientName": "Patient name",
  "visitDate": "YYYY-MM-DD",
  "reportType": "prescription" | "lab" | "scan" | "discharge" | "consultation",
  "diagnoses": ["Diagnosis 1", "Diagnosis 2"],
  "medicines": [
    {
      "name": "Medication Name",
      "dosage": "e.g. 500mg or 10mg",
      "frequency": "e.g. Twice daily",
      "instructions": "e.g. after meals",
      "confidence": 95
    }
  ],
  "labResults": [
    {
      "testName": "Test Name e.g. HbA1c",
      "value": 7.8,
      "unit": "%",
      "referenceRange": "4.0 - 5.6",
      "status": "normal" | "abnormal_high" | "abnormal_low",
      "confidence": 98
    }
  ],
  "doctorRecommendations": ["Recommendation 1", "Recommendation 2"],
  "followUpDate": "YYYY-MM-DD",
  "aiConfidenceScore": 92,
  "fieldConfidence": {
    "doctorName": 95,
    "doctorSpecialty": 94,
    "hospital": 90,
    "visitDate": 98,
    "diagnoses": 92,
    "reportType": 96
  }
}
Assign realistic confidence scores (0-100) per field. Output ONLY valid JSON without markdown code blocks.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                { inlineData: { data: base64Content, mimeType } },
                { text: prompt }
              ]
            }
          ]
        });

        const rawText = response.text || '';
        const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        extractedData = JSON.parse(cleanedText);
        aiMode = 'gemini';
      } catch (geminiErr) {
        console.warn('Gemini API call failed or key invalid, falling back to simulator:', geminiErr);
        extractedData = generateSimulatedExtraction(sampleType, fileName);
        aiMode = 'simulator';
      }
    } else {
      extractedData = generateSimulatedExtraction(sampleType, fileName);
      aiMode = 'simulator';
    }

    const { processedReport, changeHighlights, doctorConflicts, caregiverSummary } =
      compareAndSynthesizeReport(extractedData, existingHistory);

    const fullReport: MedicalReport = {
      id: `report_${Date.now()}`,
      parentId,
      uploadDate: new Date().toISOString(),
      visitDate: processedReport.visitDate || new Date().toISOString().split('T')[0],
      doctorName: processedReport.doctorName || 'Dr. Specialist',
      doctorSpecialty: processedReport.doctorSpecialty || 'General Medicine',
      hospital: processedReport.hospital || 'Medical Center',
      department: processedReport.department || 'Outpatient Clinic',
      patientName: processedReport.patientName || (parentId === 'parent_father' ? 'Ramesh Devi' : 'Lakshmi Devi'),
      reportType: processedReport.reportType || 'prescription',
      fileUrl: fileData || generateSampleBase64(sampleType),
      fileName: fileName || 'Uploaded_Medical_Report.jpg',
      diagnoses: processedReport.diagnoses || [],
      medicines: processedReport.medicines || [],
      labResults: processedReport.labResults || [],
      doctorRecommendations: processedReport.doctorRecommendations || [],
      followUpDate: processedReport.followUpDate,
      aiConfidenceScore: processedReport.aiConfidenceScore || 90,
      fieldConfidence: processedReport.fieldConfidence || {
        doctorName: 95,
        doctorSpecialty: 92,
        hospital: 90,
        visitDate: 98,
        diagnoses: 91,
        reportType: 95,
      },
      needsReview: processedReport.needsReview || false,
      aiMode,
      caregiverSummary,
      changeHighlights,
      doctorConflicts,
    };

    return NextResponse.json({ success: true, report: fullReport, aiMode });
  } catch (error) {
    console.error('Error analyzing report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze medical report.' },
      { status: 500 }
    );
  }
}

function generateSimulatedExtraction(sampleType?: string, fileName?: string): RawExtractedData {
  const today = new Date().toISOString().split('T')[0];

  if (sampleType === 'low_confidence' || (fileName && fileName.toLowerCase().includes('blurry'))) {
    return {
      doctorName: 'Dr. V. Seth (?)',
      doctorSpecialty: 'Orthopedics',
      hospital: 'City Joint Clinic',
      department: 'OPD',
      patientName: 'Parent',
      visitDate: today,
      reportType: 'prescription',
      diagnoses: ['Joint Pain / Osteoarthritis (?)'],
      medicines: [
        {
          name: 'Naproxen Sodium',
          dosage: '500 mg',
          frequency: 'Twice daily',
          instructions: 'Take after meals',
          confidence: 72,
        },
        {
          name: 'Pantoprazole',
          dosage: '40 mg',
          frequency: 'Once daily before breakfast',
          instructions: 'Gastric protection',
          confidence: 68,
        },
      ],
      labResults: [],
      doctorRecommendations: ['Avoid stair climbing', 'Knee x-ray requested'],
      followUpDate: '2026-09-01',
      aiConfidenceScore: 74,
      fieldConfidence: {
        doctorName: 71,
        doctorSpecialty: 82,
        hospital: 85,
        visitDate: 92,
        diagnoses: 68,
        reportType: 89,
      },
    };
  }

  if (sampleType === 'lab') {
    return {
      doctorName: 'Dr. Aris Thorne',
      doctorSpecialty: 'Endocrinology',
      hospital: 'Apex Heart & Metabolic Institute',
      department: 'Clinical Pathology',
      patientName: 'Parent',
      visitDate: today,
      reportType: 'lab',
      diagnoses: ['Type 2 Diabetes', 'Hyperlipidemia'],
      medicines: [],
      labResults: [
        {
          testName: 'HbA1c (Glycated Hemoglobin)',
          value: 7.9,
          unit: '%',
          referenceRange: '4.0 - 5.6',
          status: 'abnormal_high',
          confidence: 97,
        },
        {
          testName: 'Fasting Blood Glucose',
          value: 158,
          unit: 'mg/dL',
          referenceRange: '70 - 99',
          status: 'abnormal_high',
          confidence: 96,
        },
        {
          testName: 'Serum Creatinine',
          value: 1.1,
          unit: 'mg/dL',
          referenceRange: '0.6 - 1.0',
          status: 'abnormal_high',
          confidence: 98,
        },
      ],
      doctorRecommendations: ['Repeat lipid profile in 90 days.'],
      followUpDate: '2026-10-30',
      aiConfidenceScore: 96,
      fieldConfidence: {
        doctorName: 98,
        doctorSpecialty: 97,
        hospital: 96,
        visitDate: 99,
        diagnoses: 95,
        reportType: 97,
      },
    };
  }

  return {
    doctorName: 'Dr. Aris Thorne',
    doctorSpecialty: 'Endocrinology',
    hospital: 'Apex Heart & Metabolic Institute',
    department: 'Outpatient Endocrinology',
    patientName: 'Parent',
    visitDate: today,
    reportType: 'prescription',
    diagnoses: ['Type 2 Diabetes Mellitus', 'Essential Hypertension'],
    medicines: [
      {
        name: 'Metformin HCl',
        dosage: '1000 mg',
        frequency: 'Twice daily after meals',
        instructions: 'Take regular meal schedule',
        confidence: 98,
      },
      {
        name: 'Ramipril',
        dosage: '5 mg',
        frequency: 'Once daily at morning',
        instructions: 'Monitor blood pressure weekly',
        confidence: 95,
      },
    ],
    labResults: [],
    doctorRecommendations: ['Dietary restriction and 30-min daily walk.'],
    followUpDate: '2026-10-28',
    aiConfidenceScore: 95,
    fieldConfidence: {
      doctorName: 98,
      doctorSpecialty: 96,
      hospital: 95,
      visitDate: 99,
      diagnoses: 94,
      reportType: 98,
    },
  };
}

function generateSampleBase64(sampleType?: string): string {
  // SVG Data URL representation of a medical prescription scan
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" fill="#f8fafc">
    <rect width="600" height="800" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="40" y="40" width="520" height="90" fill="#f1f5f9" rx="8"/>
    <text x="60" y="80" font-family="Arial" font-size="22" font-weight="bold" fill="#0f172a">APEX HEART &amp; METABOLIC INSTITUTE</text>
    <text x="60" y="105" font-family="Arial" font-size="13" fill="#475569">Dr. Aris Thorne, MD — Senior Endocrinologist | Reg #884920</text>
    
    <line x1="40" y1="150" x2="560" y2="150" stroke="#cbd5e1" stroke-width="2"/>
    
    <text x="60" y="190" font-family="Arial" font-size="14" font-weight="bold" fill="#334155">Rx PRESCRIPTION &amp; CLINICAL FINDINGS</text>
    <text x="60" y="220" font-family="Arial" font-size="12" fill="#64748b">Patient Name: Lakshmi Devi | Age: 58y | Gender: Female</text>
    <text x="60" y="240" font-family="Arial" font-size="12" fill="#64748b">Date: July 18, 2026 | OPD Card #: APX-99482</text>

    <rect x="60" y="270" width="480" height="200" fill="#f8fafc" stroke="#e2e8f0" rx="6"/>
    <text x="80" y="300" font-family="Arial" font-size="14" font-weight="bold" fill="#2563eb">1. Metformin HCl (Glucophage) 1000 mg</text>
    <text x="100" y="325" font-family="Arial" font-size="12" fill="#475569">1 tablet twice daily after meals (Dosage increased from 500mg)</text>
    
    <text x="80" y="365" font-family="Arial" font-size="14" font-weight="bold" fill="#2563eb">2. Ramipril (Altace) 5 mg</text>
    <text x="100" y="390" font-family="Arial" font-size="12" fill="#475569">1 tablet once daily in morning</text>
    
    <text x="80" y="430" font-family="Arial" font-size="14" font-weight="bold" fill="#2563eb">3. Vitamin D3 (Cholecalciferol) 60,000 IU</text>
    <text x="100" y="455" font-family="Arial" font-size="12" fill="#475569">Once weekly for 8 weeks</text>

    <text x="60" y="520" font-family="Arial" font-size="14" font-weight="bold" fill="#334155">LAB TEST RESULTS (PANEL):</text>
    <text x="60" y="550" font-family="Arial" font-size="12" fill="#475569">• HbA1c: 7.8% (Target &lt; 7.0%) — Elevated</text>
    <text x="60" y="575" font-family="Arial" font-size="12" fill="#475569">• Fasting Blood Glucose: 154 mg/dL</text>
    <text x="60" y="600" font-family="Arial" font-size="12" fill="#475569">• Serum Creatinine: 1.1 mg/dL (Borderline High)</text>

    <line x1="40" y1="670" x2="560" y2="670" stroke="#cbd5e1" stroke-width="1"/>
    <text x="60" y="710" font-family="Arial" font-size="12" font-weight="bold" fill="#0f172a">Follow-up: 90 days (Oct 18, 2026)</text>
    <text x="400" y="740" font-family="Arial" font-size="14" font-style="italic" fill="#2563eb">Dr. Aris Thorne [Signed]</text>
  </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

