// app/api/generate-text/route.ts
import { NextResponse } from 'next/server';
// Import the correct version of the Gemini SDK
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { topic, platform, prompt } = await req.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set in environment variables");
      return NextResponse.json(
        { error: 'API key configuration error' },
        { status: 500 }
      );
    }

    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);

    // Construct a prompt based on the platform and user input
    let userPrompt = `Create an educational social media post about "${topic}" for ${platform}.`;

    // Add platform-specific guidance
    if (platform === 'linkedin') {
      userPrompt += `
      This is for LinkedIn, so:
      - Use a professional tone
      - Include relevant hashtags
      - Structure with clear paragraphs
      - Consider adding a call to action
      - Keep under 1,300 characters for optimal engagement`;
    } else if (platform === 'twitter') {
      userPrompt += `
      This is for Twitter, so:
      - Be concise but impactful
      - Use relevant hashtags
      - Include a call to action
      - Keep under 280 characters`;
    } else if (platform === 'facebook') {
      userPrompt += `
      This is for Facebook, so:
      - Use a conversational, friendly tone
      - Structure with clear paragraphs
      - Include relevant hashtags
      - Consider a question to encourage engagement
      - Keep under 2,000 characters for optimal engagement`;
    } else if (platform === 'instagram') {
      userPrompt += `
      This is for Instagram, so:
      - Use a visually descriptive language
      - Include relevant hashtags (separated at the bottom)
      - Structure with emojis and clear paragraphs
      - Include a call to action
      - Keep under 2,200 characters for optimal engagement`;
    }

    // Add any specific user instructions
    if (prompt && prompt.trim()) {
      userPrompt += `\n\nAdditional instructions: ${prompt}`;
    }

    console.log("Using prompt:", userPrompt);

    try {
      // Using gemini-1.0-pro instead of gemini-pro
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.0-pro",
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      });

      // Generate text content using Gemini
      const result = await model.generateContent(userPrompt);
      const text = result.response.text();
      
      console.log("Generation successful");
      return NextResponse.json({ text });
    } catch (modelError) {
      console.error("Gemini API error:", modelError);
      
      // If we couldn't generate content with the AI, provide a fallback
      if (modelError.message.includes("404 Not Found") || 
          modelError.message.includes("models/gemini")) {
        
        // Create a simple fallback response based on the topic and platform
        const fallbackText = generateFallbackText(topic, platform);
        console.log("Using fallback text generation");
        
        return NextResponse.json({ 
          text: fallbackText,
          note: "Generated using fallback method due to API issues"
        });
      }
      
      return NextResponse.json(
        { error: `Gemini API error: ${modelError.message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in generate-text API:', error);
    return NextResponse.json(
      { error: `Failed to generate text: ${error.message}` },
      { status: 500 }
    );
  }
}

// Fallback function to generate content if the API fails
function generateFallbackText(topic: string, platform: string): string {
  const hashtags = `#EdTech #Learning #Education #${topic.replace(/\s+/g, '')}`;
  
  if (platform === 'linkedin') {
    return `🚀 Exciting milestone reached: I've solved 100+ problems on LeetCode! 🎯

Through consistent practice and dedication, I've strengthened my problem-solving skills across algorithms, data structures, and optimization techniques. This journey has been challenging but incredibly rewarding.

The key lessons I've learned along the way:
• Breaking down complex problems into manageable steps
• Approaching challenges with multiple perspectives
• Optimizing solutions for better performance
• Building resilience through debugging and iteration

Are you on a similar coding journey? What platforms or resources have you found most helpful for your technical growth?

Let's connect and share our learning experiences! 💻

${hashtags}`;
  }
  
  if (platform === 'twitter') {
    return `Just hit 100+ solved problems on LeetCode! 🎉 
    
The journey taught me persistence, algorithmic thinking, and efficient coding practices.

What's your favorite coding challenge platform?

${hashtags}`;
  }
  
  if (platform === 'instagram') {
    return `💻 MILESTONE UNLOCKED: 100+ LEETCODE PROBLEMS SOLVED! 💯

The late nights. The debugging sessions. The "aha!" moments. It's all been worth it! 🚀

This journey has transformed my approach to problem-solving and code efficiency. Each challenge pushed me to think differently and expand my technical toolkit.

Double tap if you're on your own coding journey! What's been your biggest coding achievement lately?

.
.
.
${hashtags} #CodingJourney #TechSkills #ProblemSolving`;
  }
  
  // Default for Facebook or other platforms
  return `🎯 Achievement Unlocked: 100+ LeetCode Problems Solved! 🎯

I'm excited to share that I've reached a significant milestone in my programming journey - solving over 100 problems on LeetCode!

This achievement represents hours of focused problem-solving, learning new algorithms, and refining my approach to technical challenges. Each problem has taught me something valuable about efficient coding and analytical thinking.

What coding platforms have you found helpful in your learning journey? Have you set any coding goals for yourself?

${hashtags}`;
}