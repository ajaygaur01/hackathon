// app/api/ai-assistant/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the theme from the request body
    const { theme } = await request.json();
    
    if (!theme || theme.trim() === '') {
      return NextResponse.json(
        { error: 'Theme is required' },
        { status: 400 }
      );
    }

    // Your API key should be in environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('Missing API key');
      return NextResponse.json(
        { error: 'Configuration error' },
        { status: 500 }
      );
    }

    const prompt = `Generate 3 innovative hackathon project ideas based on the theme: "${theme}". For each idea, provide a project name, a brief description (2-3 sentences), and key technologies needed. Format them clearly.`;
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch project ideas' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ response: data.candidates[0].content.parts[0].text });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}