import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  const isValid = Boolean(
    apiKey &&
    apiKey.trim() !== '' &&
    !apiKey.includes('your_gemini_api_key_here')
  );

  return NextResponse.json({
    hasApiKey: isValid,
    status: isValid ? 'configured' : 'missing_key',
    message: isValid
      ? 'Gemini API Key configured and active.'
      : 'GEMINI_API_KEY is not configured in .env.local file.',
  });
}
