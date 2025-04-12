import { NextResponse } from 'next/server';
import { extractTextFromImage } from '@/lib/tesseract';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import pdfParse from 'pdf-parse';

const MAX_RETRIES = 2;
const API_TIMEOUT = 30000; // 30 seconds

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const retry = formData.get('retry') === 'true';

    let settings = {
      numQuestions: 5,
      difficulty: 'medium',
      includeExplanations: true,
    };

    try {
      const settingsData = formData.get('settings');
      if (settingsData && typeof settingsData === 'string') {
        const parsedSettings = JSON.parse(settingsData);
        settings = { ...settings, ...parsedSettings };
      }
    } catch (error) {
      console.warn('Failed to parse settings, using defaults:', error);
    }

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log('Processing file:', file.name, 'Type:', file.type);
    console.log('Quiz settings:', settings);

    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${uuidv4()}-${file.name}`;
    const filePath = path.join(tempDir, fileName);
    fs.writeFileSync(filePath, buffer);
    console.log('File saved to:', filePath);

    let extractedText = '';

    try {
      if (file.type === 'application/pdf') {
        console.log('Processing PDF file');
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        extractedText = pdfData.text;
      } else if (file.type.startsWith('image/')) {
        console.log('Processing image file');
        extractedText = await extractTextFromImage(filePath);
      } else {
        throw new Error('Unsupported file type. Please upload a PDF or image file.');
      }

      if (extractedText.length < 50) {
        throw new Error('Not enough text was extracted from the file. Please ensure the file contains readable text.');
      }

      console.log('Text preview:', extractedText.substring(0, 200) + '...');
    } catch (err) {
      console.error('Error processing file:', err);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return NextResponse.json({
        error: `Failed to process ${file.type.startsWith('image/') ? 'image' : 'PDF'} file: ${err.message}`
      }, { status: 500 });
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json({
        error: 'No text could be extracted from the file. Please ensure the file contains readable text.'
      }, { status: 400 });
    }

    let prompt = '';

    if (retry) {
      prompt = `You are an expert teacher creating multiple-choice quiz questions.

Generate ${settings.numQuestions} well-formatted multiple-choice questions based on the following content. Each question must have exactly 4 options (A, B, C, D) with only one correct answer.

Format each question like this:
1. [Question text]
Options:
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Answer: [Letter of correct answer]
${settings.includeExplanations ? 'Explanation: [Brief explanation of the correct answer]' : ''}

The content is:
${extractedText}`;
    } else {
      prompt = `Generate ${settings.numQuestions} important ${settings.difficulty} difficulty multiple-choice quiz questions based on these notes. Each question should have 4 options (labeled A, B, C, D) with exactly one correct answer.

${settings.includeExplanations ? 'Include a brief explanation for each correct answer.' : ''}

Make sure each question tests understanding of key concepts from the content.

The notes are:
${extractedText}`;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API configuration error. Please contact support.' }, { status: 500 });
    }

    let retryCount = 0;
    let quizText = '';
    let lastError = null;

    while (retryCount <= MAX_RETRIES) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: retry ? 0.2 : 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192,
              }
            }),
            signal: controller.signal
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const result = await response.json();
        if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
          quizText = result.candidates[0].content.parts[0].text;
          break;
        } else {
          throw new Error('Unexpected API response format');
        }
      } catch (err) {
        lastError = err;
        console.error(`API request failed (attempt ${retryCount + 1}/${MAX_RETRIES + 1}):`, err);
        if (retryCount === MAX_RETRIES) break;

        const backoffTime = Math.pow(2, retryCount) * 1000;
        console.log(`Retrying in ${backoffTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        retryCount++;
      }
    }

    if (!quizText || quizText.trim().length === 0) {
      return NextResponse.json({
        error: `Failed to generate quiz after ${MAX_RETRIES + 1} attempts. ${lastError?.message || ''}`
      }, { status: 500 });
    }

    return NextResponse.json({ quiz: quizText });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: `Internal server error: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}