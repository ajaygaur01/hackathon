// src/app/api/review/route.ts
import { NextResponse } from 'next/server';
import { reviewCodeWithGemini } from '@/lib/gemini';

export async function POST(req: Request) {
  const body = await req.json();
  const codeText = body.code;

  if (!codeText) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  const review = await reviewCodeWithGemini(codeText);
  return NextResponse.json({ review });
}
