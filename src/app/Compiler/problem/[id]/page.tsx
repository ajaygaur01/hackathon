'use client'
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Editor from '@monaco-editor/react';
import { useRouter } from 'next/navigation';
import { problem as problemData } from '../../Components/problems';

export default function ProblemPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [editorState, setEditorState] = useState<EditorState>({
    language: 'javascript',
    code: '',
  });
  
  const [activeTab, setActiveTab] = useState<'description' | 'submissions' | 'testcases'>('description');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [customInput, setCustomInput] = useState('');
  const [console, setConsole] = useState<ConsoleEntry[]>([]);
  const [submissions, setSubmissions] = useState<{
    id: string;
    timestamp: number;
    status: 'success' | 'error';
    language: string;
  }[]>([]);
  const [showOutputPanel, setShowOutputPanel] = useState(true);
  const [outputPanelHeight, setOutputPanelHeight] = useState(300);
  const [consoleView, setConsoleView] = useState<'console' | 'result'>('console');

  useEffect(() => {
    if (!id) return;

    const fetchProblem = async () => {
      try {
        // Replace with actual API call in production
        // const response = await fetch(`/api/problems/${id}`);
        // const data = await response.json();
        const data = problemData && problemData.find((p) => p.id === id) || null;
        setProblem(data);
        setEditorState({
          language: 'python',
          code: data?.starterCode?.python || '',
        });
        
        // Add welcome message to console
        setConsole([{
          type: 'info',
          content: `Welcome to the coding environment! You're working on "${data?.name}". Run your code to see the output here.`,
          timestamp: Date.now()
        }]);
        
        // Mock fetch submissions (replace with actual API call)
        // const submissionsResponse = await fetch(`/api/submissions?problemId=${id}`);
        // const submissionsData = await submissionsResponse.json();
        // setSubmissions(submissionsData);
      } catch (error) {
        addToConsole('error', 'Failed to load problem data');
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleLanguageChange = (language: string) => {
    if (problem?.starterCode[language]) {
      setEditorState({
        language,
        code: problem.starterCode[language],
      });
      addToConsole('info', `Switched language to ${language}`);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditorState({ ...editorState, code: value });
    }
  };
  
  const addToConsole = (type: 'input' | 'output' | 'error' | 'info', content: string) => {
    setConsole(prev => [
      ...prev, 
      { 
        type,
        content,
        timestamp: Date.now()
      }
    ]);
  };

  // Helper function to validate test cases
  type TestCaseResult = {
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
    error: string | null;
  };

  // const validateTestCases = (output: string, examples: any[]): TestCaseResult[] => {
  //   return examples.map(example => {
  //     // Normalize outputs by trimming whitespace and converting to lowercase for case-insensitive comparison
  //     const normalizedOutput = output.trim();
  //     const normalizedExpected = example.output.trim();
      
  //     const passed = normalizedOutput === normalizedExpected;
      
  //     return {
  //       input: example.input,
  //       expectedOutput: example.output,
  //       actualOutput: output,
  //       passed,
  //       error: null
  //     };
  //   });
  // };

  const runCode = async (isSubmission = false) => {
    setIsSubmitting(true);
    setConsoleView(isSubmission ? 'result' : 'console');
    setResult(null);
  
    if (console.length > 50) {
      setConsole(prev => prev.slice(-30));
    }
  
    try {
      const inputToUse = isSubmission ? '' : customInput;
      const payload = {
        source_code: editorState.code,
        language_id: getLanguageId(editorState.language),
        stdin: inputToUse,
      };
  
      addToConsole('input', `Running ${editorState.language} code with ${isSubmission ? 'test cases' : 'custom input'}...`);
  
      const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': '3c71eba05cmsh4884e715d9844e7p1efd0ejsn086db59e1831',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const output = data.stdout || '';
        const error = data.stderr || data.compile_output || '';
        const status = data.status.id === 3 ? 'success' : 'error';
        
        // Add to console
        if (output) {
          addToConsole('output', output);
        }
        if (error) {
          addToConsole('error', error);
        }

        if (isSubmission && problem) {
          // For submission, run against all test cases
          // For each test case, we would normally send a separate API request
          // Here we'll simulate by checking against expected outputs

          // Run judge API for each test case
          const testCasesPromises = problem.examples.map(async (example) => {
            try {
              const testPayload = {
                source_code: editorState.code,
                language_id: getLanguageId(editorState.language),
                stdin: example.input,
              };
              
              const testResponse = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-RapidAPI-Key': '2195aada2cmsh9c3700ff279885cp1cf1f5jsn3c45763f080d',
                  'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                },
                body: JSON.stringify(testPayload),
              });
              
              const testData = await testResponse.json();
              
              const testOutput = testData.stdout || '';
              const testError = testData.stderr || testData.compile_output || '';
              
              // Normalize outputs and compare
              const normalizedOutput = output.trim();
              const normalizedExpected = example.output.trim();
              const passed = normalizedOutput === normalizedExpected;
              
              return {
                input: example.input,
                expectedOutput: example.output,
                actualOutput: output,
                passed,
                error: testError || null
              };
            } catch (error) {
              return {
                input: example.input,
                expectedOutput: example.output,
                actualOutput: '',
                passed: false,
                error: 'Failed to execute test case'
              };
            }
          });  
          const testCaseResults = await Promise.all(testCasesPromises);
          
          // Calculate if all test cases passed
          const allPassed = testCaseResults.every(tc => tc.passed);
          
          setResult({
            status: allPassed ? 'success' : 'error',
            output,
            error,
            executionTime: data.time,
            memory: data.memory,
            testCases: testCaseResults
          });
          
          // Record the submission
          const submissionId = Date.now().toString();
          const submission: { 
            id: string; 
            timestamp: number; 
            status: 'success' | 'error'; 
            language: string; 
          } = {
            id: submissionId,
            timestamp: Date.now(),
            status: allPassed ? 'success' : 'error',
            language: editorState.language
          };
          
          // Add to submissions
          setSubmissions(prev => [submission, ...prev]);
          
          // Set to result view
          setConsoleView('result');
          
          addToConsole('info', `Submission ${allPassed ? 'passed' : 'failed'} ${testCaseResults.filter(tc => tc.passed).length}/${testCaseResults.length} test cases`);
        } else {
          // For run code, just show the output
          setResult({
            status,
            output,
            error,
            executionTime: data.time,
            memory: data.memory
          });
        }
      } else {
        addToConsole('error', 'Failed to execute code.');
      }
  
    } catch (error) {
      // console.error(error);
      if (error instanceof Error) {
        addToConsole('error', error.message);
      } else {
        addToConsole('error', 'An unknown error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Helper function to get Judge0 language ID
  const getLanguageId = (language: string): number => {
    const languageMap: {[key: string]: number} = {
      'javascript': 63, // Node.js
      'python': 71,    // Python 3
      'java': 62,      // Java
      'cpp': 54,       // C++
      'c': 50,         // C
      'ruby': 72,      // Ruby
      'php': 68,       // PHP
      'typescript': 74, // TypeScript
      'go': 60,        // Go
      'rust': 73       // Rust
    };
    return languageMap[language] || 63; // Default to JavaScript
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString([], { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit'
    });
  };

  const renderDifficultyBadge = (difficulty: string) => {
    const colors = {
      'easy': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'hard': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[difficulty.toLowerCase() as 'easy' | 'medium' | 'hard']}`}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </span>
    );
  };

  const toggleOutputPanel = () => {
    setShowOutputPanel(!showOutputPanel);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Problem Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">The problem you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => router.push('/')}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Back to All Problems
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="h-16 bg-white dark:bg-gray-800 shadow-sm flex items-center px-6">
        <div className="flex-1">
          <button
            onClick={() => router.push('/')}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Problems
          </button>
        </div>
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{problem.name}</h1>
          <span className="ml-3">
            {problem.difficulty && renderDifficultyBadge(problem.difficulty)}
          </span>
        </div>
        <div className="flex-1 flex justify-end">
          <div className="relative">
            <select
              value={editorState.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="appearance-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-indigo-500"
            >
              {Object.keys(problem.starterCode).map((lang) => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)]">
        {/* Left Panel: Problem description & tabs */}
        <div className="w-full md:w-1/2 flex flex-col border-r border-gray-200 dark:border-gray-700">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-3 px-6 font-medium ${
                activeTab === 'description'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('testcases')}
              className={`py-3 px-6 font-medium ${
                activeTab === 'testcases'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Test Cases
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`py-3 px-6 font-medium ${
                activeTab === 'submissions'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Submissions
            </button>
          </div>

          <div className="flex-grow overflow-y-auto">
            {activeTab === 'description' && (
              <div className="py-6 px-6 prose dark:prose-invert max-w-none">
                <div className="whitespace-pre-line">{problem.description}</div>
                
                <h3 className="text-lg font-medium mt-8 mb-4">Examples</h3>
                <div className="space-y-6">
                  {problem.examples.map((example, idx) => (
                    <div key={idx} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                      <div className="mb-2">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Input:</span>
                        <pre className="mt-1 bg-gray-200 dark:bg-gray-700 p-2 rounded text-sm font-mono overflow-x-auto">
                          {example.input}
                        </pre>
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Output:</span>
                        <pre className="mt-1 bg-gray-200 dark:bg-gray-700 p-2 rounded text-sm font-mono overflow-x-auto">
                          {example.output}
                        </pre>
                      </div>
                      {example.explanation && (
                        <div>
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Explanation:</span>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">{example.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-medium mt-8 mb-4">Constraints</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {problem.constraints.map((constraint, idx) => (
                    <li key={idx} className="text-gray-700 dark:text-gray-300">
                      {constraint}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'testcases' && (
              <div className="py-6 px-6">
                <h3 className="text-lg font-medium mb-4">Test Cases</h3>
                
                <div className="space-y-6">
                  {problem.examples.map((example, idx) => (
                    <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex items-center justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Test Case {idx + 1}
                        </span>
                        <button 
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm"
                          onClick={() => setCustomInput(example.input)}
                        >
                          Use as Custom Input
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="mb-3">
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Input:</span>
                          <pre className="bg-gray-200 dark:bg-gray-700 p-2 rounded text-sm font-mono overflow-x-auto max-h-32">
                            {example.input}
                          </pre>
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expected Output:</span>
                          <pre className="bg-gray-200 dark:bg-gray-700 p-2 rounded text-sm font-mono overflow-x-auto max-h-32">
                            {example.output}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <h4 className="text-md font-medium text-blue-800 dark:text-blue-300 mb-2">Tips for Testing</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700 dark:text-blue-400">
                    <li>Ensure your code handles all edge cases</li>
                    <li>Test with minimum and maximum input sizes from constraints</li>
                    <li>Consider time and space complexity requirements</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'submissions' && (
              <div className="py-6 px-6">
                <h3 className="text-lg font-medium mb-4">Your Submission History</h3>
                
                {submissions.length === 0 ? (
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center">
                    <svg className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-600 dark:text-gray-400">
                      No submissions yet. Submit your solution to see your history here.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Language</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        {submissions.map((submission) => (
                          <tr key={submission.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {formatDate(submission.timestamp)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                submission.status === 'success'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                              }`}>
                                {submission.status === 'success' ? 'Accepted' : 'Failed'}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {submission.language.charAt(0).toUpperCase() + submission.language.slice(1)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Code editor and console */}
        <div className="w-full md:w-1/2 flex flex-col">
          {/* Code editor */}
          <div className="flex-grow">
            <Editor
              height="100%"
              language={editorState.language}
              value={editorState.code}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                tabSize: 2,
                automaticLayout: true,
                lineNumbers: "on",
                rulers: [80],
                bracketPairColorization: { enabled: true },
              }}
            />
          </div>

          {/* Resizable handle */}
          <div 
            className="h-1 cursor-ns-resize bg-gray-300 dark:bg-gray-700 hover:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
            onMouseDown={(e) => {
              const startY = e.clientY;
              const startHeight = outputPanelHeight;
              
                const handleMouseMove = (moveEvent: MouseEvent) => {
                const deltaY = startY - moveEvent.clientY;
                const newHeight = Math.min(Math.max(startHeight + deltaY, 150), window.innerHeight / 2);
                setOutputPanelHeight(newHeight);
                };
              
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          />

          {/* Output panel */}
          <div 
            className={`border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 transition-all duration-300 ease-in-out ${
              showOutputPanel ? 'flex flex-col' : 'h-10'
            }`}
            style={{ height: showOutputPanel ? outputPanelHeight : 40 }}
          >
            {/* Output panel header */}
            <div className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex-1 flex items-center space-x-4">
                <button
                  onClick={() => setConsoleView('console')}
                  className={`font-medium ${
                    consoleView === 'console'
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  Console
                </button>
                {result && (
                  <button
                  onClick={() => setConsoleView('result')}
                  className={`font-medium ${
                    consoleView === 'result'
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  Result
                </button>
              )}
            </div>
            <div className="flex items-center">
              <button
                onClick={toggleOutputPanel}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
              >
                {showOutputPanel ? (
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Output panel content */}
          {showOutputPanel && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {consoleView === 'console' && (
                <div className="flex flex-col h-full">
                  {/* Console output */}
                  <div className="flex-1 overflow-y-auto p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900">
                    {console.map((entry, idx) => (
                      <div key={idx} className="mb-2">
                        <span className="text-gray-500 dark:text-gray-400 text-xs">{formatTimestamp(entry.timestamp)} </span>
                        <span className={`${
                          entry.type === 'output' ? 'text-green-600 dark:text-green-400' :
                          entry.type === 'error' ? 'text-red-600 dark:text-red-400' :
                          entry.type === 'info' ? 'text-blue-600 dark:text-blue-400' :
                          'text-gray-700 dark:text-gray-300'
                        }`}>
                          {entry.content}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Custom input */}
                  <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-100 dark:bg-gray-800">
                    <div className="flex">
                      <textarea
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder="Enter custom input here..."
                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-600"
                        rows={2}
                      />
                      <div className="flex flex-col">
                        <button
                          onClick={() => runCode(false)}
                          disabled={isSubmitting}
                          className="flex-1 px-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-tr-md font-medium flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          {isSubmitting ? (
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : "Run"}
                        </button>
                        <button
                          onClick={() => runCode(true)}
                          disabled={isSubmitting}
                          className="flex-1 px-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-br-md font-medium flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          {isSubmitting ? (
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : "Submit"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {consoleView === 'result' && result && (
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="mb-4">
                    <div className="flex items-center">
                      <span className={`text-lg font-medium flex items-center ${
                        result.status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {result.status === 'success' ? (
                          <>
                            <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            All Test Cases Passed
                          </>
                        ) : (
                          <>
                            <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Some Test Cases Failed
                          </>
                        )}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>Runtime: {result.executionTime ? `${result.executionTime} ms` : 'N/A'}</span>
                      <span>Memory: {result.memory ? `${result.memory} KB` : 'N/A'}</span>
                    </div>
                  </div>
                  
                  {result.testCases && (
                    <div>
                      <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">Test Case Results</h4>
                      <div className="space-y-4">
                        {result.testCases.map((testCase, idx) => (
                          <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            <div className={`px-4 py-2 flex items-center justify-between ${
                              testCase.passed 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                            }`}>
                              <span className="font-medium flex items-center">
                                {testCase.passed ? (
                                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                )}
                                Test Case {idx + 1}
                              </span>
                              <button
                                className="text-xs hover:underline"
                                // onClick={() => console.log('View Details for Test Case', idx + 1)}
                              >
                                {testCase.passed ? 'Details' : 'Show Issue'}
                              </button>
                            </div>
                            <div className="p-3 bg-white dark:bg-gray-800">
                              <div className="mb-2">
                                <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Input:</span>
                                <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs font-mono overflow-x-auto max-h-20">
                                  {testCase.input}
                                </pre>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Expected Output:</span>
                                  <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs font-mono overflow-x-auto max-h-20">
                                    {testCase.expectedOutput}
                                  </pre>
                                </div>
                                <div>
                                  <span className={`block text-xs font-medium mb-1 ${
                                    testCase.passed
                                      ? 'text-gray-500 dark:text-gray-400'
                                      : 'text-red-600 dark:text-red-400'
                                  }`}>
                                    Your Output:
                                  </span>
                                  <pre className={`p-2 rounded text-xs font-mono overflow-x-auto max-h-20 ${
                                    testCase.passed
                                      ? 'bg-gray-100 dark:bg-gray-900'
                                      : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                                  }`}>
                                    {testCase.actualOutput || '(No output)'}
                                  </pre>
                                </div>
                              </div>
                              {testCase.error && (
                                <div className="mt-2">
                                  <span className="block text-xs font-medium text-red-600 dark:text-red-400 mb-1">Error:</span>
                                  <pre className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-2 rounded text-xs font-mono text-red-800 dark:text-red-300 overflow-x-auto max-h-20">
                                    {testCase.error}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
}