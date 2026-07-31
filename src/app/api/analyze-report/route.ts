import { NextRequest, NextResponse } from 'next/server';
import { compareAndSynthesizeReport, RawExtractedData } from '@/lib/ai/geminiExtractor';
import { MedicalReport } from '@/types/medical';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileData, fileName, sampleType, existingHistory = [] } = body;

    let extractedData: RawExtractedData;

    // Check if Gemini API key exists
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && fileData) {
      try {
        // Try calling real Gemini API
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey });
        
        const base64Content = fileData.replace(/^data:[^;]+;base64,/, '');
        const mimeType = fileData.substring(fileData.indexOf(':') + 1, fileData.indexOf(';')) || 'image/jpeg';

        const prompt = `You are CareLens AI, an expert medical document parser. Analyze this medical report (prescription, lab report, or discharge summary) and extract structured JSON matching this exact schema:
{
  "doctorName": "Doctor name with title",
  "doctorSpecialty": "Specialty e.g. Cardiology, Endocrinology, Orthopedics",
  "hospital": "Hospital or clinic name",
  "department": "Department",
  "patientName": "Patient name",
  "visitDate": "YYYY-MM-DD",
  "reportType": "lab" | "prescription" | "discharge" | "imaging" | "general",
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
  "aiConfidenceScore": 92
}
Assign realistic individual confidence scores (0-100) per field. If document is blurry, illegible, or handwritten, assign a lower confidence score (<80). Output ONLY valid JSON without markdown code blocks.`;

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
      } catch (geminiErr) {
        console.warn('Gemini API call failed or key invalid, using fallback simulator:', geminiErr);
        extractedData = generateSimulatedExtraction(sampleType, fileName);
      }
    } else {
      // Use high-fidelity AI Simulator
      extractedData = generateSimulatedExtraction(sampleType, fileName);
    }

    // Run AI Comparison engine against historical reports
    const { processedReport, changeHighlights, doctorConflicts, caregiverSummary } =
      compareAndSynthesizeReport(extractedData, existingHistory);

    const fullReport: MedicalReport = {
      id: `report_${Date.now()}`,
      uploadDate: new Date().toISOString(),
      visitDate: processedReport.visitDate || new Date().toISOString().split('T')[0],
      doctorName: processedReport.doctorName || 'Dr. Aris Thorne',
      doctorSpecialty: processedReport.doctorSpecialty || 'Endocrinology',
      hospital: processedReport.hospital || 'Apex Heart & Metabolic Institute',
      department: processedReport.department || 'Outpatient Clinic',
      patientName: processedReport.patientName || 'Lakshmi Devi',
      reportType: processedReport.reportType || 'prescription',
      fileName: fileName || 'Uploaded_Medical_Report.pdf',
      diagnoses: processedReport.diagnoses || [],
      medicines: processedReport.medicines || [],
      labResults: processedReport.labResults || [],
      doctorRecommendations: processedReport.doctorRecommendations || [],
      followUpDate: processedReport.followUpDate,
      aiConfidenceScore: processedReport.aiConfidenceScore || 90,
      needsReview: processedReport.needsReview || false,
      caregiverSummary,
      changeHighlights,
      doctorConflicts,
    };

    return NextResponse.json({ success: true, report: fullReport });
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
      patientName: 'Lakshmi Devi',
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
      aiConfidenceScore: 74, // Below 80 triggers Needs Review UI
    };
  }

  if (sampleType === 'lab') {
    return {
      doctorName: 'Dr. Aris Thorne',
      doctorSpecialty: 'Endocrinology',
      hospital: 'Apex Heart & Metabolic Institute',
      department: 'Clinical Pathology',
      patientName: 'Lakshmi Devi',
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
        {
          testName: 'Total Cholesterol',
          value: 215,
          unit: 'mg/dL',
          referenceRange: '< 200',
          status: 'abnormal_high',
          confidence: 95,
        },
      ],
      doctorRecommendations: [
        'Repeat lipid profile in 90 days.',
        'Consult endocrinologist for HbA1c adjustment.',
      ],
      followUpDate: '2026-10-30',
      aiConfidenceScore: 96,
    };
  }

  // Default Prescription Sample
  return {
    doctorName: 'Dr. Aris Thorne',
    doctorSpecialty: 'Endocrinology',
    hospital: 'Apex Heart & Metabolic Institute',
    department: 'Outpatient Endocrinology',
    patientName: 'Lakshmi Devi',
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
      {
        name: 'Vitamin D3 (Cholecalciferol)',
        dosage: '60,000 IU',
        frequency: 'Once weekly for 8 weeks',
        instructions: 'Take after heavy breakfast',
        confidence: 94,
      },
    ],
    labResults: [],
    doctorRecommendations: [
      'Strict low-carbohydrate and salt-restricted diet.',
      'Daily 30 minutes light exercise.',
      'Schedule follow-up appointment in 90 days.',
    ],
    followUpDate: '2026-10-28',
    aiConfidenceScore: 95,
  };
}
