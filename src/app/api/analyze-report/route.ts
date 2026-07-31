import { NextRequest, NextResponse } from 'next/server';
import { compareAndSynthesizeReport, RawExtractedData } from '@/lib/ai/geminiExtractor';
import { MedicalReport } from '@/types/medical';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileData, fileName, parentId = 'parent_mother', existingHistory = [] } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    const isValidKey = apiKey && apiKey.trim() !== '' && !apiKey.includes('your_gemini_api_key_here');

    if (!isValidKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Gemini API key is not configured. Please add GEMINI_API_KEY to your .env.local file and restart the application.',
          code: 'MISSING_API_KEY',
        },
        { status: 400 }
      );
    }

    if (!fileData) {
      return NextResponse.json(
        {
          success: false,
          error: 'No report image or PDF file was provided for analysis.',
          code: 'MISSING_FILE',
        },
        { status: 400 }
      );
    }

    let extractedData: RawExtractedData;

    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });

      const base64Content = fileData.replace(/^data:[^;]+;base64,/, '');
      const mimeType =
        fileData.substring(fileData.indexOf(':') + 1, fileData.indexOf(';')) || 'image/jpeg';

      const prompt = `You are CareLens AI, an expert clinical document parser and medical report analyzer.
Analyze this uploaded medical document (prescription, lab test report, scan/radiology report, discharge summary, or doctor consultation note).

Extract structured JSON strictly following this schema:
{
  "doctorName": "Doctor name with title, or 'Not detected'",
  "doctorSpecialty": "Specialty e.g. Cardiology, Endocrinology, or 'Not detected'",
  "hospital": "Hospital or clinic name, or 'Not detected'",
  "department": "Department name, or 'Not detected'",
  "patientName": "Patient name, or 'Not detected'",
  "visitDate": "YYYY-MM-DD or 'Not detected'",
  "reportType": "prescription" | "lab" | "scan" | "discharge" | "consultation",
  "diagnoses": ["Extracted clinical diagnosis 1"],
  "bulletSummary": [
    "Fasting Blood Sugar is elevated at 142 mg/dL (Normal: 70-99 mg/dL).",
    "HbA1c is 6.8%, indicating diabetic control requires attention.",
    "Doctor's instruction noted: Repeat blood sugar test in 3 months."
  ],
  "ocrLegibilityScore": 94,
  "rawOcrText": "Transcribed raw OCR text from the image...",
  "trendInsights": [
    "Blood sugar level observed at 142 mg/dL (elevated)."
  ],
  "medicines": [
    {
      "name": "Medication Name",
      "dosage": "Dosage e.g. 500 mg",
      "frequency": "Frequency e.g. Twice daily",
      "instructions": "Instructions if available",
      "confidence": 90
    }
  ],
  "labResults": [
    {
      "testName": "Test Name e.g. Fasting Blood Sugar",
      "value": 142,
      "unit": "mg/dL",
      "referenceRange": "70-99",
      "status": "normal" | "abnormal_high" | "abnormal_low",
      "confidence": 94
    }
  ],
  "doctorRecommendations": ["Recommendation"],
  "followUpDate": "YYYY-MM-DD or null",
  "aiConfidenceScore": 92,
  "fieldConfidence": {
    "doctorName": 92,
    "doctorSpecialty": 90,
    "hospital": 88,
    "visitDate": 96,
    "diagnoses": 90,
    "reportType": 94
  }
}

Important Instructions:
1. Provide 3 to 5 concise bullet points in "bulletSummary" covering abnormal levels, key diagnoses, and doctor instructions.
2. Estimate OCR legibility confidence percentage (0-100) in "ocrLegibilityScore".
3. Transcribe visible raw text into "rawOcrText".
4. If any key string field cannot be identified, set its string value to "Not detected".
Return ONLY raw valid JSON. Do not include markdown code block backticks.`;

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

      try {
        extractedData = JSON.parse(cleanedText);
      } catch (parseErr) {
        console.error('Failed to parse Gemini response as JSON:', rawText);
        return NextResponse.json(
          {
            success: false,
            error: 'Unable to analyze this report. Gemini API returned an unreadable response layout. Please try uploading a clearer image or document.',
            code: 'PARSING_ERROR',
          },
          { status: 500 }
        );
      }

    } catch (geminiErr: any) {
      console.error('Gemini API execution error:', geminiErr);
      return NextResponse.json(
        {
          success: false,
          error: `Gemini API request failed: ${geminiErr.message || 'Unknown network error'}. Please verify your API key and network connection.`,
          code: 'GEMINI_API_ERROR',
        },
        { status: 500 }
      );
    }

    // Process synthesis against existing real history
    const { processedReport, changeHighlights, doctorConflicts, caregiverSummary } =
      compareAndSynthesizeReport(extractedData, existingHistory);

    const fullReport: MedicalReport = {
      id: `report_${Date.now()}`,
      parentId,
      uploadDate: new Date().toISOString(),
      visitDate: processedReport.visitDate || new Date().toISOString().split('T')[0],
      doctorName: processedReport.doctorName || 'Not detected',
      doctorSpecialty: processedReport.doctorSpecialty || 'Not detected',
      hospital: processedReport.hospital || 'Not detected',
      department: processedReport.department || 'Not detected',
      patientName: processedReport.patientName || 'Not detected',
      reportType: processedReport.reportType || 'prescription',
      fileUrl: fileData,
      fileName: fileName || 'Uploaded_Medical_Report.jpg',
      diagnoses: processedReport.diagnoses || [],
      medicines: processedReport.medicines || [],
      labResults: processedReport.labResults || [],
      doctorRecommendations: processedReport.doctorRecommendations || [],
      followUpDate: processedReport.followUpDate,
      aiConfidenceScore: extractedData.aiConfidenceScore || 90,
      ocrLegibilityScore: extractedData.ocrLegibilityScore || 94,
      bulletSummary: extractedData.bulletSummary || [
        `Extracted clinical report from ${processedReport.hospital || 'medical center'}.`,
        `Report Type: ${processedReport.reportType || 'Clinical Document'}.`,
      ],
      rawOcrText: extractedData.rawOcrText || 'Raw text transcribed by Gemini AI.',
      trendInsights: extractedData.trendInsights || [],
      fieldConfidence: processedReport.fieldConfidence || {
        doctorName: 90,
        doctorSpecialty: 88,
        hospital: 85,
        visitDate: 95,
        diagnoses: 85,
        reportType: 90,
      },
      needsReview: (extractedData.aiConfidenceScore || 90) < 80,
      aiMode: 'gemini',
      caregiverSummary: caregiverSummary || 'Medical report extracted via Gemini API.',
      changeHighlights: changeHighlights || [],
      doctorConflicts: doctorConflicts || [],
    };

    return NextResponse.json({
      success: true,
      report: fullReport,
      aiMode: 'gemini',
    });

  } catch (err: any) {
    console.error('API analyze-report unhandled exception:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Unable to analyze this report due to an internal server error. Please try again.',
      },
      { status: 500 }
    );
  }
}
