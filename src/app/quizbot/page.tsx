"use client"

import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle2, XCircle, Loader2, BookOpen, Code, Server, Database, Laptop, Download, Settings, RefreshCw } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
  explanation?: string;
}

interface QuizSettings {
  numQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard';
  includeExplanations: boolean;
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<QuizSettings>({
    numQuestions: 5,
    difficulty: 'medium',
    includeExplanations: true
  });
  const [retry, setRetry] = useState(false);

  // Update score when user answers change
  useEffect(() => {
    if (questions.length > 0) {
      const answeredQuestions = questions.filter(q => q.userAnswer !== undefined);
      if (answeredQuestions.length > 0) {
        const correctAnswers = answeredQuestions.filter(q => q.userAnswer === q.correctAnswer);
        setScore(correctAnswers.length);
      }
    }
  }, [questions]);

  // Enhanced parser with multiple strategies and fallbacks
  // Enhanced robust quiz parser function
const parseQuizText = (quizText: string): Question[] => {
  // Main container for parsed questions
  const parsedQuestions: Question[] = [];
  
  try {
    // Normalize line endings and trim whitespace
    const normalizedText = quizText.replace(/\r\n/g, '\n').trim();
    
    // Step 1: Try to break the text into question blocks
    // Look for different patterns of question numbering
    const questionBlocksRegex = /(?:^|\n)(?:\d+[\.\)]\s|Question\s+\d+[\.\:]\s)/i;
    const blocks = normalizedText.split(questionBlocksRegex).filter(block => block.trim().length > 0);
    
    // If no clear question blocks are found, try to split by double newlines
    const questionBlocks = blocks.length > 1 ? blocks : normalizedText.split(/\n\s*\n/).filter(Boolean);
    
    console.log(`Found ${questionBlocks.length} potential question blocks`);
    
    for (let i = 0; i < questionBlocks.length; i++) {
      const block = questionBlocks[i].trim();
      
      // Skip very short blocks that likely aren't questions
      if (block.length < 10) continue;
      
      // Try to extract question text - look for anything before options start
      const questionEndMarkers = [
        /\n\s*(?:Options|Choices|Answers)[\s\:]/i, // Look for Options: or Choices: markers
        /\n\s*[A-D][\.\)]\s/,                      // Look for A., B., C. format options
        /\n\s*\([A-D]\)\s/                         // Look for (A), (B), (C) format options
      ];
      
      let questionText = '';
      let optionsText = block;
      
      // Try each question-options separator pattern
      for (const marker of questionEndMarkers) {
        const parts = block.split(marker);
        if (parts.length > 1) {
          questionText = parts[0].trim();
          optionsText = marker.toString().charAt(0) + parts.slice(1).join(marker.toString().charAt(0));
          break;
        }
      }
      
      // If no clear separation was found, use the first line as the question
      if (!questionText) {
        const lines = block.split('\n');
        questionText = lines[0].trim();
        optionsText = lines.slice(1).join('\n');
      }
      
      // Clean up question text
      questionText = questionText.replace(/^(\d+[\.\)]|Question\s+\d+[\.\:])\s*/i, '').trim();
      
      // Extract options - using multiple patterns
      const options: string[] = [];
      
      // Pattern 1: Look for A), B), C), D) or A., B., C., D. options
      const optionMatches = optionsText.match(/[A-D][\.\)]\s*([^\n]+)/g);
      if (optionMatches && optionMatches.length >= 2) {
        optionMatches.forEach(opt => {
          const cleanOption = opt.replace(/^[A-D][\.\)]\s*/, '').trim();
          if (cleanOption) options.push(cleanOption);
        });
      } 
      // Pattern 2: Look for (A), (B), (C), (D) options
      else {
        const altOptionMatches = optionsText.match(/\([A-D]\)\s*([^\n]+)/g);
        if (altOptionMatches && altOptionMatches.length >= 2) {
          altOptionMatches.forEach(opt => {
            const cleanOption = opt.replace(/^\([A-D]\)\s*/, '').trim();
            if (cleanOption) options.push(cleanOption);
          });
        }
        // Pattern 3: Just look for lines that might be options
        else {
          const optionLines = optionsText.split('\n').filter(line => line.trim().length > 5);
          
          // Try to identify option lines by leading patterns
          for (let j = 0; j < optionLines.length; j++) {
            const line = optionLines[j].trim();
            // Check for option-like patterns and extract the actual option text
            const optionMatch = line.match(/^[A-D][\.\)]\s+(.+)$/) || 
                               line.match(/^\([A-D]\)\s+(.+)$/) ||
                               line.match(/^[A-D][:\s]\s+(.+)$/);
                               
            if (optionMatch) {
              options.push(optionMatch[1].trim());
            }
            // If line starts with common option letters, add it
            else if (/^[A-D]\s+\w+/.test(line)) {
              options.push(line.substring(1).trim());
            }
          }
        }
      }
      
      // Find correct answer
      let correctAnswer = '';
      
      // Pattern 1: Look for explicit "Answer: X" or "Correct Answer: X" markers
      const answerMatch = block.match(/(?:Answer|Correct Answer|Correct)[\s\:]\s*([A-D])/i);
      
      if (answerMatch) {
        const letterIndex = answerMatch[1].toUpperCase().charCodeAt(0) - 65; // A=0, B=1, etc.
        if (letterIndex >= 0 && letterIndex < options.length) {
          correctAnswer = options[letterIndex];
        }
      } 
      // Pattern 2: Check if there's a letter-option association in the block
      else {
        for (let j = 0; j < options.length; j++) {
          // The letter corresponding to this option (A, B, C, D)
          const optionLetter = String.fromCharCode(65 + j);
          
          // Check if this option has an indicator showing it's correct
          if (block.includes(`${optionLetter}) correct`) ||
              block.includes(`${optionLetter}. correct`) ||
              block.includes(`(${optionLetter}) correct`) ||
              block.includes(`correct: ${optionLetter}`) ||
              block.includes(`correct answer: ${optionLetter}`) ||
              block.includes(`answer: ${optionLetter}`)) {
            correctAnswer = options[j];
            break;
          }
        }
      }
      
      // If we still don't have a correct answer and this is the last question block,
      // we can check if there's any text after the question block that indicates the answer
      if (!correctAnswer && i === questionBlocks.length - 1) {
        // Get the portion of text after this question block
        const remainingText = normalizedText.substring(normalizedText.indexOf(block) + block.length);
        
        // Look for an answer key
        const answerKeyMatch = remainingText.match(/(\d+)[\.\)]\s*([A-D])/);
        if (answerKeyMatch) {
          const questionNumber = parseInt(answerKeyMatch[1]);
          const letterAnswer = answerKeyMatch[2];
          
          // If this is the right question number and we have enough options
          if (questionNumber === i + 1) {
            const letterIndex = letterAnswer.toUpperCase().charCodeAt(0) - 65;
            if (letterIndex >= 0 && letterIndex < options.length) {
              correctAnswer = options[letterIndex];
            }
          }
        }
      }
      
      // Last resort: if we still don't have a correct answer, use the first option
      if (!correctAnswer && options.length > 0) {
        correctAnswer = options[0];
        console.log('Warning: No correct answer found, using first option');
      }
      
      // Extract explanation if available
      let explanation = undefined;
      const explanationMatches = block.match(/(?:Explanation|Reason|Rationale)[\s\:]\s*(.+?)(?=\n\d+\.|\n*$)/is);
      if (explanationMatches && explanationMatches[1]) {
        explanation = explanationMatches[1].trim();
      }
      
      // Add to our collection if we have a valid question with options
      if (questionText && options.length >= 2 && correctAnswer) {
        parsedQuestions.push({
          question: questionText,
          options,
          correctAnswer,
          explanation
        });
      } else {
        console.log('Skipping invalid question:', { questionText, options, correctAnswer });
      }
    }
    
    // Try fallback method if we didn't get any questions
    if (parsedQuestions.length === 0) {
      // Advanced fallback - try to detect numbered questions and process each line
      const lines = normalizedText.split('\n').filter(line => line.trim().length > 0);
      let currentQuestion: Partial<Question> = {};
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Check if this line starts a new question
        const questionMatch = line.match(/^(\d+)[\.\)]\s+(.+)$/);
        if (questionMatch) {
          // If we have a previous question with sufficient data, add it
          if (currentQuestion.question && 
              currentQuestion.options && 
              currentQuestion.options.length >= 2 && 
              currentQuestion.correctAnswer) {
            parsedQuestions.push(currentQuestion as Question);
          }
          
          // Start new question
          currentQuestion = {
            question: questionMatch[2].trim(),
            options: []
          };
          continue;
        }
        
        // Skip if we haven't found a question yet
        if (!currentQuestion.question) continue;
        
        // Check if this line is an option
        const optionMatch = line.match(/^([A-D])[\.\)]\s+(.+)$/) || line.match(/^\(([A-D])\)\s+(.+)$/);
        if (optionMatch && currentQuestion.options) {
          currentQuestion.options.push(optionMatch[2].trim());
          continue;
        }
        
        // Check if this line indicates the correct answer
        const answerMatch = line.match(/(?:Answer|Correct)[\s\:]\s*([A-D])/i);
        if (answerMatch && currentQuestion.options) {
          const letterIndex = answerMatch[1].toUpperCase().charCodeAt(0) - 65;
          if (letterIndex >= 0 && letterIndex < currentQuestion.options.length) {
            currentQuestion.correctAnswer = currentQuestion.options[letterIndex];
          }
          continue;
        }
        
        // Check if this is an explanation
        const explanationMatch = line.match(/(?:Explanation|Reason)[\s\:]\s*(.+)/i);
        if (explanationMatch) {
          currentQuestion.explanation = explanationMatch[1].trim();
        }
      }
      
      // Add the last question if valid
      if (currentQuestion.question && 
          currentQuestion.options && 
          currentQuestion.options.length >= 2 && 
          currentQuestion.correctAnswer) {
        parsedQuestions.push(currentQuestion as Question);
      }
    }
    
    console.log(`Successfully parsed ${parsedQuestions.length} questions`);
    return parsedQuestions;
  } catch (err) {
    console.error("Fatal error in quiz parser:", err);
    return [];
  }
};
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');
    setQuestions([]);
    setScore(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add settings to the request
      formData.append('settings', JSON.stringify(settings));
      
      const res = await fetch('/api/quiz', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `Server error: ${res.status}`);
      }

      // Check if quiz text was returned
      if (!data.quiz) {
        throw new Error("No quiz data returned from server");
      }

      // Parse the quiz text into structured questions
      const parsedQuestions = parseQuizText(data.quiz);
      
      if (parsedQuestions.length === 0) {
        setRetry(true);
        throw new Error("Could not parse quiz questions from the response. The format may be unrecognized.");
      }
      
      setQuestions(parsedQuestions);
      setRetry(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, selectedAnswer: string) => {
    setQuestions(prev => prev.map((q, idx) => 
      idx === questionIndex 
        ? { ...q, userAnswer: selectedAnswer }
        : q
    ));
  };

  const resetQuiz = () => {
    setQuestions(questions.map(q => ({ ...q, userAnswer: undefined })));
    setScore(null);
  };

  const exportQuizAsPDF = () => {
    // This would normally connect to a PDF generation API or library
    alert("PDF export functionality would be implemented here!");
    // In a real implementation, you would:
    // 1. Format the quiz data
    // 2. Send to a PDF generation service or use a client-side library
    // 3. Trigger download of the generated PDF
  };

  const retryWithDifferentPrompt = async () => {
    if (!file) return;
    
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('retry', 'true');
      formData.append('settings', JSON.stringify(settings));
      
      const res = await fetch('/api/quiz', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `Server error: ${res.status}`);
      }

      const parsedQuestions = parseQuizText(data.quiz);
      
      if (parsedQuestions.length === 0) {
        throw new Error("Still unable to generate valid quiz questions. Please try a different file.");
      }
      
      setQuestions(parsedQuestions);
      setRetry(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Tech background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Circuit board pattern */}
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="circuitPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M10 10H90M10 50H90M10 90H90M50 10V90M10 10L50 50M90 10L50 50M10 90L50 50M90 90L50 50" stroke="white" strokeWidth="1" fill="none" />
              <circle cx="10" cy="10" r="3" fill="cyan" />
              <circle cx="50" cy="10" r="3" fill="cyan" />
              <circle cx="90" cy="10" r="3" fill="cyan" />
              <circle cx="10" cy="50" r="3" fill="cyan" />
              <circle cx="50" cy="50" r="5" fill="white" />
              <circle cx="90" cy="50" r="3" fill="cyan" />
              <circle cx="10" cy="90" r="3" fill="cyan" />
              <circle cx="50" cy="90" r="3" fill="cyan" />
              <circle cx="90" cy="90" r="3" fill="cyan" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#circuitPattern)" />
          </svg>
        </div>
      </div>

      {/* Animated tech particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-blue-500 rounded-full opacity-20"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-block mb-6">
            <div className="p-3 rounded-full bg-blue-900 bg-opacity-50 backdrop-blur-md border border-blue-700 shadow-lg shadow-blue-500/30">
              <Code className="h-12 w-12 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
            AI-Powered Quiz Generator
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Upload your notes or study materials and get instant MCQ questions using our Gemini-powered AI engine
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
          {/* Left Section - File Upload and Settings */}
          <div className="space-y-6">
            {/* Settings Panel */}
            <div className={`bg-slate-800 bg-opacity-60 backdrop-blur-xl rounded-2xl shadow-xl border border-blue-900 shadow-blue-500/20 p-6 transform transition-all duration-300 ${showSettings ? 'scale-100 opacity-100' : 'scale-95 opacity-0 h-0 p-0 overflow-hidden'}`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Settings className="h-6 w-6 text-cyan-400" />
                  <h2 className="text-2xl font-bold text-white">
                    Quiz Settings
                  </h2>
                </div>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="text-blue-300 hover:text-white"
                  aria-label="Close settings"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-blue-300 mb-2">Number of Questions</label>
                  <input
                    type="range"
                    min="3"
                    max="10"
                    value={settings.numQuestions}
                    onChange={(e) => setSettings({...settings, numQuestions: parseInt(e.target.value)})}
                    className="w-full accent-blue-500"
                  />
                  <div className="flex justify-between text-sm text-blue-400">
                    <span>3</span>
                    <span>{settings.numQuestions}</span>
                    <span>10</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-blue-300 mb-2">Difficulty Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['easy', 'medium', 'hard'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setSettings({...settings, difficulty: level})}
                        className={`py-2 px-4 rounded-lg border-2 transition-colors ${
                          settings.difficulty === level
                            ? 'border-blue-500 bg-blue-900 bg-opacity-50 text-blue-300'
                            : 'border-slate-700 hover:border-blue-700 text-slate-400'
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-blue-300">Include Explanations</label>
                  <div 
                    onClick={() => setSettings({...settings, includeExplanations: !settings.includeExplanations})}
                    className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${
                      settings.includeExplanations ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* File Upload Panel */}
            <div className="bg-slate-800 bg-opacity-60 backdrop-blur-xl rounded-2xl shadow-xl border border-blue-900 shadow-blue-500/20 p-6 transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Database className="h-7 w-7 text-cyan-400" />
                  <h2 className="text-2xl font-bold text-white">
                    Upload Your Study Material
                  </h2>
                </div>
                
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 rounded-lg bg-blue-900 bg-opacity-50 text-cyan-300 hover:bg-opacity-70 transition-colors"
                  aria-label="Quiz settings"
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>
              
              <div 
                className="border-3 border-dashed border-blue-700 rounded-xl p-8 text-center bg-gradient-to-b from-slate-800 to-blue-900 transition-all duration-300 hover:shadow-inner"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const droppedFile = e.dataTransfer.files[0];
                  if (droppedFile) setFile(droppedFile);
                }}
                role="button"
                aria-label="Drag and drop area for file upload"
              >
                <input
                  type="file"
                  accept="image/*, application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="h-16 w-16 text-blue-400 mb-4 animate-pulse" />
                  <span className="text-lg text-cyan-300 font-medium mb-2">
                    Drop your file here or click to upload
                  </span>
                  <span className="text-sm text-blue-300">
                    Supported formats: Images (JPG, PNG) and PDF files
                  </span>
                </label>
              </div>

              {file && (
                <div className="mt-6 p-4 bg-blue-900 bg-opacity-50 rounded-xl border border-blue-700">
                  <p className="text-cyan-300 font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Selected: {file.name}
                  </p>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={loading || !file}
                className={`w-full flex items-center justify-center px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] mt-6 ${
                  loading || !file
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl shadow-blue-500/30'
                }`}
                aria-label="Generate quiz"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-3 h-6 w-6" />
                    Generating Quiz...
                  </>
                ) : (
                  'Generate MCQ Quiz'
                )}
              </button>

              {error && (
                <div className="mt-6 p-4 bg-red-900 bg-opacity-30 text-red-300 rounded-xl border border-red-700 animate-pulse">
                  <p className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 flex-shrink-0" />
                    {error}
                  </p>
                  
                  {retry && (
                    <button
                      onClick={retryWithDifferentPrompt}
                      className="mt-3 w-full py-2 px-4 bg-red-900 bg-opacity-30 rounded-lg border border-red-700 text-red-300 hover:bg-opacity-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Retry with Different Approach
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Quiz Questions */}
          <div className="bg-slate-800 bg-opacity-60 backdrop-blur-xl rounded-2xl shadow-xl border border-blue-900 shadow-blue-500/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Laptop className="h-7 w-7 text-cyan-400" />
                Generated MCQ Quiz
              </h2>
              
              {questions.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={resetQuiz}
                    className="p-2 rounded-lg bg-blue-900 bg-opacity-50 text-cyan-300 hover:bg-opacity-70 transition-colors"
                    aria-label="Reset quiz"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={exportQuizAsPDF}
                    className="p-2 rounded-lg bg-blue-900 bg-opacity-50 text-cyan-300 hover:bg-opacity-70 transition-colors"
                    aria-label="Export quiz as PDF"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-900 rounded-full animate-spin border-t-cyan-400"></div>
                  <div className="w-16 h-16 border-4 border-purple-900 rounded-full animate-ping absolute top-0 opacity-30"></div>
                </div>
                <p className="text-lg text-blue-300 mt-6">Analyzing your document with AI...</p>
                <p className="text-blue-400 mt-2 text-sm">This might take a minute for larger documents</p>
              </div>
            ) : questions.length > 0 ? (
              <>
                {score !== null && (
                  <div className="mb-6 p-4 bg-blue-900 bg-opacity-40 rounded-xl border border-blue-700 flex items-center justify-between">
                    <p className="text-white text-lg font-medium">
                      Your Score: <span className="text-cyan-300">{score}</span>/<span className="text-cyan-300">{questions.filter(q => q.userAnswer !== undefined).length}</span>
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={resetQuiz}
                        className="py-1 px-3 rounded-lg bg-blue-800 bg-opacity-50 text-cyan-300 hover:bg-opacity-70 transition-colors text-sm"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-slate-800">
                  {questions.map((question, questionIdx) => (
                    <div 
                      key={questionIdx} 
                      className="border border-blue-800 rounded-xl p-6 shadow-md bg-slate-800 bg-opacity-50 backdrop-blur-md hover:shadow-lg hover:shadow-blue-500/10 transition-shadow duration-300"
                    >
                      <p className="text-lg font-medium text-white mb-4">
                        <span className="text-cyan-400">{questionIdx + 1}.</span> {question.question}
                      </p>
                      <div className="space-y-3">
                        {question.options.map((option, optionIdx) => {
                          const isSelected = question.userAnswer === option;
                          const isCorrect = option === question.correctAnswer;
                          const showResult = question.userAnswer !== undefined;
                          
                         // let buttonClasses = 'w-full p-4 rounded-xl flex items-center justify-between transition-all

                          let buttonClasses = 'w-full p-4 rounded-xl flex items-center justify-between transition-all duration-300 border-2 ';
                          
                          if (showResult && isSelected) {
                            buttonClasses += isCorrect 
                              ? 'border-green-500 bg-green-900 bg-opacity-30 text-green-300' 
                              : 'border-red-500 bg-red-900 bg-opacity-30 text-red-300';
                          } else if (showResult && isCorrect) {
                            buttonClasses += 'border-green-500 bg-green-900 bg-opacity-10 text-green-200';
                          } else {
                            buttonClasses += 'border-blue-700 hover:border-cyan-600 bg-slate-800 hover:bg-slate-700';
                          }

                          return (
                            <button
                              key={optionIdx}
                              onClick={() => handleAnswerSelect(questionIdx, option)}
                              className={buttonClasses}
                              disabled={showResult}
                              aria-pressed={isSelected}
                              aria-label={`Option ${String.fromCharCode(65 + optionIdx)}: ${option}`}
                            >
                              <span className="text-lg">
                                <span className="text-cyan-400 mr-2">{String.fromCharCode(65 + optionIdx)}.</span> 
                                {option}
                              </span>
                              {showResult && isSelected && (
                                isCorrect ? 
                                  <CheckCircle2 className="h-6 w-6 text-green-400" /> :
                                  <XCircle className="h-6 w-6 text-red-400" />
                              )}
                              {showResult && !isSelected && isCorrect && (
                                <CheckCircle2 className="h-6 w-6 text-green-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                      
                      {/* Display correct answer if user selected wrong answer */}
                      {question.userAnswer !== undefined && question.userAnswer !== question.correctAnswer && (
                        <div className="mt-3 p-3 bg-blue-900 bg-opacity-30 border border-blue-800 rounded-lg">
                          <p className="text-green-300 flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5" />
                            Correct answer: {question.correctAnswer}
                          </p>
                        </div>
                      )}

                      {/* Display explanation if available */}
                      {question.explanation && question.userAnswer !== undefined && (
                        <div className="mt-3 p-3 bg-slate-900 bg-opacity-50 border border-slate-700 rounded-lg">
                          <p className="text-blue-200 flex items-start gap-2">
                            <BookOpen className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <span>
                              <span className="font-medium text-cyan-300">Explanation:</span> {question.explanation}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16 border-2 border-dashed border-blue-800 rounded-xl bg-slate-900 bg-opacity-30">
                <Server className="h-16 w-16 text-blue-700 mx-auto mb-4" />
                <p className="text-blue-300 text-lg">
                  Upload a file to generate AI-powered questions
                </p>
                <div className="mt-4 text-xs text-blue-400 font-mono flex items-center justify-center space-x-1">
                  <span className="inline-block w-3 h-3 bg-cyan-400 rounded-full animate-ping"></span>
                  <span>Gemini API connected</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Keyboard accessibility hints */}
      <div className="sr-only">
        <p>Use Tab key to navigate through interactive elements.</p>
        <p>Use Enter or Space to select options in the quiz.</p>
      </div>

      {/* Add keyframes for floating particles animation */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-100px) translateX(100px);
          }
          50% {
            transform: translateY(-50px) translateX(200px);
          }
          75% {
            transform: translateY(-150px) translateX(100px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

export default App;