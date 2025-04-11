import { NextResponse } from 'next/server';
import { extractTextFromImage } from '@/lib/tesseract';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import pdfParse from 'pdf-parse';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log('Processing file:', file.name, 'Type:', file.type);

    // Create temp directory if it doesn't exist
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${uuidv4()}-${file.name}`;
    const filePath = path.join(tempDir, fileName);
    
    // Write file to temporary location
    fs.writeFileSync(filePath, buffer);
    console.log('File saved to:', filePath);

    let extractedText = '';

    try {
      // Process based on file type
      if (file.type === 'application/pdf') {
        console.log('Processing PDF file');
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        extractedText = pdfData.text;
      } else if (file.type.startsWith('image/')) {
        console.log('Processing image file');
        extractedText = await extractTextFromImage(filePath);
      } else {
        throw new Error('Unsupported file type');
      }

      console.log('Extracted text length:', extractedText.length);
      // Log just the first 100 characters for debugging
      console.log('Text preview:', extractedText.substring(0, 100) + '...');
    } catch (err) {
      console.error('Error processing file:', err);
      // Clean up file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return NextResponse.json({ 
        error: `Failed to process ${file.type.startsWith('image/') ? 'image' : 'PDF'} file: ${err.message}` 
      }, { status: 500 });
    }

    // Clean up after processing
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Check if we actually extracted any text
    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json({ 
        error: 'No text could be extracted from the file' 
      }, { status: 400 });
    }

    console.log('Sending request to Gemini API');
    const prompt = `Generate 5 important quiz questions and answers based on these notes:\n\n${extractedText}`;

    // Make sure your API key is set in .env
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Missing GEMINI_API_KEY environment variable');
      return NextResponse.json({ 
        error: 'API configuration error' 
      }, { status: 500 });
    }

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );
    // Log the status and some response info
    console.log('Gemini API response status:', response.status);
    
    // Parse the response
    const result = await response.json();
    console.log('API response structure:', JSON.stringify(result, null, 2).substring(0, 300) + '...');

    // Try different ways to extract text from the response
    let quizText = 'No content returned';
    
    if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
      quizText = result.candidates[0].content.parts[0].text;
    } else if (result?.candidates?.[0]?.content?.text) {
      quizText = result.candidates[0].content.text;
    } else if (result?.text) {
      quizText = result.text;
    }

    // Only if we really couldn't find the content, show the structure for debugging
    if (quizText === 'No content returned') {
      console.error('Could not extract quiz text from API response:', JSON.stringify(result, null, 2));
    }

    return NextResponse.json({ quiz: quizText });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: `Internal server error: ${error.message || 'Unknown error'}` 
    }, { status: 500 });
  }
}