export const reviewCodeWithGemini = async (codeText: string) => {
  //  const apiKey = process.env.GEMINI_API_KEY;
  
    const res = await fetch(
        "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Review the following code and give me an output like: [Code Quality Score | Suggestions or Improvements]. Do NOT include the original code in the response. Here is the code:\n\n${codeText}`,
                  },
                ],
              },
            ],
          }),
        }
      );
  
    const data = await res.json();
    console.log('Gemini raw response:', JSON.stringify(data, null, 2)); // 👈 DEBUG LINE
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
  };
  