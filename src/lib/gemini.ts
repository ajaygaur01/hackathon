// src/lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function reviewCodeWithGemini(code: string, language: string = 'unknown') {
  try {
    // Use the latest available model - gemini-1.5-pro is the newer version
    // If that fails, we can try gemini-1.0-pro or other available models
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    // Format the prompt to get better results
    const reviewPrompt = `
      You are an expert code reviewer specialized in ${language} programming.
      
      Please review the following code and provide:
      1. A code quality score from 1-10
      2. A list of specific suggestions and improvements
      
      Format the response as: 
      [Code Quality Score: X/10 | Suggestions or Improvements: 
      * First suggestion
      * Second suggestion
      * etc.
      ]
      
      The code to review is:
      
      \`\`\`
      ${code}
      \`\`\`
    `;
    
    const improvePrompt = `
      You are an expert ${language} developer. Improve the following code by applying best practices,
      fixing potential bugs, optimizing performance, and improving readability.
      
      Return ONLY the improved code without any explanations.
      
      \`\`\`
      ${code}
      \`\`\`
    `;
    
    try {
      // First try with parallel requests
      const [reviewResult, improveResult] = await Promise.all([
        model.generateContent(reviewPrompt),
        model.generateContent(improvePrompt)
      ]);
      
      const review = reviewResult.response.text();
      const improvedCode = improveResult.response.text();
      
      return { 
        review: review.trim(),
        improvedCode: improvedCode.trim()
      };
    } catch (error) {
      // If parallel requests fail, fall back to sequential requests with error handling
      console.warn("Parallel requests failed, trying sequential requests");
      
      // Try to get the review
      let review = "";
      try {
        const reviewResult = await model.generateContent(reviewPrompt);
        review = reviewResult.response.text().trim();
      } catch (reviewError) {
        console.error("Review request failed:", reviewError);
        review = "[Code Quality Score: N/A | Suggestions or Improvements: * Unable to generate review at this time.]";
      }
      
      // Try to get the improved code
      let improvedCode = "";
      try {
        const improveResult = await model.generateContent(improvePrompt);
        improvedCode = improveResult.response.text().trim();
      } catch (improveError) {
        console.error("Code improvement request failed:", improveError);
        improvedCode = "// Unable to generate improved code at this time.";
      }
      
      return { review, improvedCode };
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Provide a fallback response rather than throwing
    return {
      review: "[Code Quality Score: N/A | Suggestions or Improvements: * Unable to connect to code review service.]",
      improvedCode: "// Unable to connect to code improvement service."
    };
  }
}

// Helper function to list available models (can be used for debugging)
export async function listAvailableModels() {
  try {
    const result = await genAI.listModels();
    return result;
  } catch (error) {
    console.error('Error listing models:', error);
    return { error: 'Failed to list models' };
  }
}