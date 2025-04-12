// app/api/test-gemini/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("API Key available:", !!apiKey);
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not set in environment variables' },
        { status: 500 }
      );
    }

    try {
      // Initialize the Gemini API
      const genAI = new GoogleGenerativeAI(apiKey);
      
      // Get the model
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Simple test prompt
      const result = await model.generateContent("Write a single sentence about education.");
      const text = result.response.text();
      
      return NextResponse.json({ 
        success: true,
        text,
        message: "Gemini API working correctly"
      });
    } catch (modelError) {
      console.error("Gemini API error details:", modelError);
      return NextResponse.json({
        success: false,
        error: modelError.message,
        stack: modelError.stack
      }, { status: 500 });
    }
  } catch (error) {
    console.error("General error:", error);
    return NextResponse.json({
      success: false, 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}