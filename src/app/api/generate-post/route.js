// /app/api/generate-post/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { topic, type, platform } = await request.json();
    
    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }
    
    // Replace with your actual Gemini API key
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Create a prompt based on the post type
    let prompt = "";
    switch (type) {
      case "professional":
        prompt = `Create a professional LinkedIn post about ${topic}. The post should be formal yet engaging, include relevant hashtags, and maintain a professional tone suitable for a business audience.`;
        break;
      case "casual":
        prompt = `Write a casual, conversational LinkedIn post about ${topic}. Keep it friendly and relatable, include some personal touch, and add relevant hashtags.`;
        break;
      case "storytelling":
        prompt = `Craft a LinkedIn post about ${topic} using a storytelling approach. Start with a hook, include a personal or professional narrative, provide a lesson or insight, and end with a call to action. Include relevant hashtags.`;
        break;
      case "thoughtLeadership":
        prompt = `Generate a thought leadership LinkedIn post about ${topic}. Present innovative ideas, insights, or perspectives that position the author as an authority in their field. Include industry-specific hashtags.`;
        break;
      case "educational":
        prompt = `Create an educational LinkedIn post about ${topic}. Share valuable information, tips, or insights that would be helpful to other professionals. Format it in an easy-to-read way and include relevant hashtags.`;
        break;
      default:
        prompt = `Write an engaging LinkedIn post about ${topic}. Include appropriate hashtags and a call to action.`;
    }

    // Call the Gemini API with the correct endpoint and model name
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Gemini API error:", data);
      return NextResponse.json(
        { error: "Failed to generate post" },
        { status: 500 }
      );
    }

    // Extract the generated text from the response
    let generatedText = "";
    
    // Handle the response structure correctly
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const parts = data.candidates[0].content.parts;
      if (parts && parts.length > 0) {
        generatedText = parts[0].text;
      }
    }
    
    if (!generatedText) {
      return NextResponse.json(
        { error: "No content generated" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ post: generatedText });
  } catch (error) {
    console.error("Error generating post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}