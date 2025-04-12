// src/app/api/review/route.ts
import { NextResponse } from 'next/server';
import { reviewCodeWithGemini } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const codeText = body.code;
    const language = body.language || 'unknown';

    if (!codeText) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    const { review, improvedCode } = await reviewCodeWithGemini(codeText, language);
    
    return NextResponse.json({ 
      review,
      improvedCode
    });
  } catch (error) {
    console.error('Code review error:', error);
    return NextResponse.json(
      { error: 'Failed to process code review' }, 
      { status: 500 }
    );
  }
}