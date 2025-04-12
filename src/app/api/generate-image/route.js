// /app/api/generate-image/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }
    
    console.log("Processing image prompt:", prompt);
    
    // Since the Gemini API isn't working correctly for image generation,
    // we'll use a placeholder image service
    // This creates a blue placeholder with text from the prompt
    const encodedText = encodeURIComponent(prompt.substring(0, 40) + (prompt.length > 40 ? '...' : ''));
    const imageUrl = `https://via.placeholder.com/800x600/0066cc/ffffff?text=${encodedText}`;
    
    console.log("Generated image URL:", imageUrl);
    
    return NextResponse.json({ 
      imageUrl,
      caption: prompt
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}